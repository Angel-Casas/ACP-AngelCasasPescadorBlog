const UserSchema = require("../models/userSchema");
const PostSchema = require("../models/postSchema");
const faker = require("faker");
const path = require("path");
const fs = require("fs-extra");

const users = [
  {
    name: "Ángel",
    email: "a.casas.lp@gmail.com",
    password: "123456789",
    role: "admin"
  },
  {
    name: faker.name.firstName(),
    email: "user@test.com",
    password: "test1234"
  }
];

exports.users = async () => {
  await UserSchema.deleteMany({});
  await new UserSchema(users[0]).save();
  await new UserSchema(users[1]).save();
};

exports.posts = async () => {
  await PostSchema.deleteMany({});
  const file = await fs.readFile(
    path.join(__dirname, "seed_data.json"),
    "utf8"
  );
  const posts = JSON.parse(file);
  return PostSchema.insertMany(posts);
};
