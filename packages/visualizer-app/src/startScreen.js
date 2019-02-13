export const init = ({onStartClick}) => {
  const startElem = document.getElementById('start');
  const startScreenElem = document.getElementById('startScreen');
  const visTypeElem = document.getElementById('visType');
  const inputTypeElem = document.getElementById('inputType');

  visTypeElem.value = localStorage.getItem('visType') || 'music';
  inputTypeElem.value = localStorage.getItem('inputType') || 'mic';

  startElem.addEventListener('click', () => {
    const visType = visTypeElem.value;
    const inputType = inputTypeElem.value;
    localStorage.setItem('visType', visType);
    localStorage.setItem('inputType', inputType);
    startScreenElem.outerHTML = '';
    return onStartClick({visType, inputType});
  });
};
