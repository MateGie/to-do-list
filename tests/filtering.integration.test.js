const { fireEvent, screen } = require('@testing-library/dom');
require('@testing-library/jest-dom');
const TodoApp = require('../js/app.js');

let app;

beforeEach(() => {
  document.body.innerHTML = `
    <button class="filter-btn" data-filter="all">All</button>
    <button class="filter-btn" data-filter="active">Active</button>
    <button class="filter-btn" data-filter="completed">Completed</button>
    <ul id="todo-list"></ul>
    <div id="empty-state"><p></p></div>
    <span id="task-count"></span>
    <input id="new-task-input" />
    <button id="add-task-btn"></button>
  `;
  app = new TodoApp();
});


describe('Filter Button Interactions', () => {
  test('should update task count when switching filters', () => {
    app.todos = [
      { id: 1, text: 'Active task', completed: false },
      { id: 2, text: 'Completed task', completed: true }
    ];

    const taskCount = document.getElementById('task-count');
    const activeBtn = screen.getByRole('button', { name: /active/i });

    fireEvent.click(activeBtn);
    expect(taskCount.textContent).toBe('1 active task');
  });
});
describe('Task List Filtering Display', () => {
  test('should display only active tasks when "active" filter is active', () => {
    app.todos = [
      { id: 1, text: 'Buy groceriesss', completed: false },
      { id: 2, text: 'Walk the dog', completed: true }
    ];

    const activeBtn = screen.getByRole('button', { name: /active/i });
    fireEvent.click(activeBtn);
    
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.queryByText('Walk the dog')).not.toBeInTheDocument();
  });
});
