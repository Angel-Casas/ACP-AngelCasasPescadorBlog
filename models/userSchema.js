const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "{VALUE} is not a valid email"
      }
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      trim: true
    },
    token: {
      type: String
    },
    role: {
      type: String,
      enum: [ "admin", "user" ],
      default: "user"
    }
  }, {
    toJSON: {
      transform: (doc, { _id, name, email, role }) => ({ _id, name, email, role })
    }
  }
);

UserSchema.methods.generateAuthToken = async function () {
  // We dont use arrow function because we want access to "this" context object
  if (this.token) {
    return this.token;
  }
  const token = jwt.sign(
    // Payload
    { _id: this._id.toHexString() },
    // Salt
    process.env.JWT_SECRET
  ).toString();
  this.token = token;
  await this.save();
  return token;
};

UserSchema.methods.removeToken = function (token) {
  const user = this;
  user.token = null;
  return user.save();
};

UserSchema.statics.findByToken = async function (token) {
  try {
    // Deconstructed payload
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    // Find if a user with _id and token found in JWT.
    return this.findOne({ _id, token });
  } catch (err) {
    throw err;
  }
};

UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    // This complex error objects are very useful for client-side validation.
    throw {
      errors: {
        email: {
          message: "User not found."
        }
      }
    };
  } else {
    if (await bcrypt.compare(password, user.password)) {
      return user;
    } else {
      throw {
        errors: {
          password: {
            message: "Incorrect password."
          }
        }
      };
    }
  }
};

// Pre and Post are called any time the document function is called.
// First argument is to what model it must be applied.
// Next function must be called or process never completes.
UserSchema.pre("save", async function (next) {
  // Only execute if the password is modified.
  if (this.isModified("password")) {
    try {
      // The longer the salt argument the more secure the password.
      this.password = await bcrypt.hash(this.password, 8);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

// Forbid to save more than one user with "admin" role.
UserSchema.pre("save", async function (next) {
  if (this.isModified("role") && this.role === "admin") {
    const users = this.constructor.find({ role: "admin" });
    if (users.length >= 1) {
      next (new Error("Only one admin user can be added."));
    } else {
      next();
    }
  } else {
    next();
  }
});


//Export model
module.exports = mongoose.model("User", UserSchema);
