document.addEventListener(
  'DOMContentLoaded',
  () => {
    function filterInputChars(event) {
      event.target.value = event.target.value.split('').filter(char => {
        return (char.charCodeAt(0)>1039 && char.charCodeAt(0)<1104) ||
        char.charCodeAt(0) === 45 ||
        char.charCodeAt(0) === 32;
      }).join('');
    }

    function clearinputValue(event) {
      filterInputChars(event);
      event.target.value = event.target.value.trim();
      event.target.value = event.target.value.split('').filter((char, index, array) => {
        if(index>0) {
          return !((char==='-' && array[index-1]==='-') || (char===' ' && array[index-1]===' '));
        }
        return true;
      }).join('');
      if (event.target.value.substr(0,1) === '-') {
        event.target.value = event.target.value.substr(1);
      };
      if (event.target.value.substr(event.target.value.length-1) === '-') {
        event.target.value = event.target.value.substr(0, event.target.value.length-2);
      };
      event.target.value = event.target.value.substr(0,1).toUpperCase() + event.target.value.substr(1).toLowerCase();
    }

    document.querySelector('.js-input-name').addEventListener(
      'input',
      filterInputChars
    );
    document.querySelector('.js-input-name').addEventListener(
      'blur',
      clearinputValue
    );

    document.querySelector('.js-input-surname').addEventListener(
      'input',
      filterInputChars
    );
    document.querySelector('.js-input-surname').addEventListener(
      'blur',
      clearinputValue
    );

    document.querySelector('.js-input-lastname').addEventListener(
      'input',
      filterInputChars
    );
    document.querySelector('.js-input-lastname').addEventListener(
      'blur',
      clearinputValue
    );

    document.querySelector('.js-submit-button').addEventListener(
      'click',
      function(event) {
        if (
          document.querySelector('.js-input-name').value !== '' &&
          document.querySelector('.js-input-surname').value !== '' &&
          document.querySelector('.js-input-lastname').value !== ''
        ){
          event.preventDefault();
          document.querySelector('.js-input-name').value = '';
          document.querySelector('.js-input-surname').value = '';
          document.querySelector('.js-input-lastname').value = '';
          const li = document.createElement('li');
          li.textContent = `${document.querySelector('.js-input-name').value} ${document.querySelector('.js-input-surname').value} ${document.querySelector('.js-input-lastname').value}`;
          li.classList.add('list-group-item', 'bg-success', 'w-100');
          document.querySelector('.js-list').append(li);
        }
      }
    )



  });
