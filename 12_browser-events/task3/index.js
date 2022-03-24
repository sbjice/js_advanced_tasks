document.addEventListener(
  'DOMContentLoaded',
  () => {

    document.querySelector('.js-block').style.display = 'none';

    window.addEventListener(
      'scroll',
      function() {
        if (window.pageYOffset > 100) {
          document.querySelector('.js-block').style.display = 'block';
        } else {
          document.querySelector('.js-block').style.display = 'none';
        }
      },
      { passive: true }
    );

    document.querySelector('.js-submit-button').addEventListener(
      'click',
      function() {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    )



  });
