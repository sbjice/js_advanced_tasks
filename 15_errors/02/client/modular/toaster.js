export function createToaster(){
  const toaster = document.createElement('ul');
  toaster.classList.add('toaster', 'mb-0', 'w-50',
                        'd-flex', 'flex-column',
                        'justify-content-center',
                        'align-items-center');
  return {
    toaster,
    addToast: function(toastText = 'Text') {
      const toast = document.createElement('li');
      toast.classList.add('toast', 'rounded', 'bg-info',
                          'p-3','mb-1',
                          'w-100',
                          'd-inline-flex', 'justify-content-center',
                          'align-items-center');
      Math.random() > 0.5 ?
        toast.textContent = toastText + ' ' + (Math.random()) :
        toast.textContent = toastText + ' ' + this.toaster.children.length;

      this.toaster.append(toast);
      setTimeout(() => {
        toast.remove();
      },3000);
    },
  }
}

// const toaster = createToaster();
// document.body.append(toaster.toaster);

// actor.addEventListener(
//   'click',
//   function(e) {
//     toaster.addToast();
//   }
// )
