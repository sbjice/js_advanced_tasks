document.addEventListener(
  'DOMContentLoaded',
  () => {
    document.querySelector('.js-block').style.display = 'none';
    document.querySelector('.js-block').style.position = 'fixed';
    document.querySelector('.js-block').style.top = '0';
    document.querySelector('.js-block').style.left = '0';
    document.querySelector('.js-block').style.right = '0';

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
