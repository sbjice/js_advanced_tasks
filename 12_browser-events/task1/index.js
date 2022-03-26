document.addEventListener(
  'DOMContentLoaded',
  () => {
    document.querySelector('.js-open-modal').addEventListener(
      'click',
      function(event) {
        document.querySelector('#modal').style.display = 'block';
      }
    );

    document.querySelector('#modal').querySelector('.modal-dialog').addEventListener(
      'click',
      function(event) {
        event._isClickWithinModal = true;
      }
    )

    document.querySelector('#modal').addEventListener(
      'click',
      function(event) {
        if (event._isClickWithinModal) return;
        document.querySelector('#modal').style.display = 'none';
      }
    )

  });
