// helpers do zapisu i odczytu cookies
function setCookie(name, value, days = 30) {
  const d = new Date();
  d.setTime(d.getTime() + days * 864e5);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/`;
}
function getCookie(name) {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1];
}

// inicjalizacja listy z ciasteczka lub pustej tablicy
let tasks = JSON.parse(getCookie('tasks') || '[]');

const ul = document.getElementById('task-list');
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');

// render listy
function render() {
  ul.innerHTML = '';
  tasks.forEach((t, i) => {
    const li = document.createElement('li');
    li.className = t.done ? 'done' : '';
    li.textContent = t.text;
    li.onclick = () => {
      tasks[i].done = !tasks[i].done;
      setCookie('tasks', JSON.stringify(tasks));
      render();
    };
    ul.appendChild(li);
  });
}
render();

// obsługa formularza
form.onsubmit = e => {
  e.preventDefault();
  tasks.push({ text: input.value, done: false });
  setCookie('tasks', JSON.stringify(tasks));
  input.value = '';
  render();
};
