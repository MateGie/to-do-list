require('@testing-library/jest-dom');
require('jest-localstorage-mock');


afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  document.body.innerHTML = '';
});
