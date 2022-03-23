document.addEventListener(
  'DOMContentLoaded',
  () => {
    document.querySelector('.js-open-modal').addEventListener(
      'click',
      function(event) {
        document.querySelector('#modal').style.display = 'block';
      }
    );

    document.querySelector('#modal').addEventListener(
      'click',
      function(event) {
        if (event.target === document.querySelector('#modal') &&
        document.querySelector('#modal').style.display === 'block') {
          document.querySelector('#modal').style.display = 'none';
        }
      }
    )

  });
