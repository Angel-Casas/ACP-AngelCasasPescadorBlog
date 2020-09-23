// Extra functionality for the Blog

// LANGUAGE BUTTON AND SAVING TO LOCALSTORAGE
window.addEventListener('load', function() {
  try {
    var langInputValue = window.location.href.indexOf('/EN') > -1 ? false : true;
    var lang_input = document.querySelector('#language-input');

    console.log('LangInput: ' + langInputValue);

    if (langInputValue) {
      lang_input.checked = true;
    }

    lang_input.addEventListener('change', function() {
      langInputValue = this.checked;
      localStorage.setItem('lang', JSON.stringify(langInputValue));
      console.log('Lang saved: ' + langInputValue);
      if (window.location.href.indexOf("/EN") > -1 && this.checked) {
        console.log('EN href');
        window.location = window.location.href.replace('EN', 'ES');
      } else if (window.location.href.indexOf("/ES") > -1 && !this.checked) {
        console.log('ES href');
        window.location = window.location.href.replace('ES', 'EN');
      }
    });
  } catch(err) {
    console.log('No language input');
  }
});

// For IE only
if (window.attachEvent) {
  window.attachEvent('onload', function() {
    // Get input and value of language input
    try {
      var langInputValue = JSON.parse(localStorage.getItem('lang')) || false;
      var lang_input = document.querySelector('#language-input');

      lang_input.attachEvent('change', function() {
        langInputValue = this.checked;
        localStorage.setItem('lang', JSON.stringify(langInputValue));
        console.log('Lang saved: ' + langInputValue);
        if (window.location.href.indexOf("/EN") > -1 && this.checked) {
          console.log('EN href');
          window.location = window.location.href.replace('EN', 'ES');
        } else if (window.location.href.indexOf("/ES") > -1 && !this.checked) {
          console.log('ES href');
          window.location = window.location.href.replace('ES', 'EN');
        }
      });
      if (langInputValue) {
        lang_input.checked = true;
      }
    } catch(err) {
      console.log('No language input');
    }
  })
}

// SCROLL TO TOP FUNCTION
window.onscroll = function() { scrollFunction() };

function scrollFunction() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    document.querySelector('#top-arrow').className = 'show';
  } else {
    document.querySelector('#top-arrow').className = 'hidden';
  }
};
