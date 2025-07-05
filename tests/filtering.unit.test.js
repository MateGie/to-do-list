const TodoApp = require('../js/app.js');

let app;

beforeEach(() => {
  document.body.innerHTML = `
    <ul id="todo-list"></ul>
    <input id="new-task-input" />
    <button id="add-task-btn"></button>
    <span id="task-count"></span>
    <div id="empty-state"><p></p></div>
  `;
  app = new TodoApp();
});



describe('Filter State Management', () => {
  test('should initialize with "all" filter by default', () => {
    expect(app.getCurrentFilter()).toBe('all');
  });

  test('should set filter to "active" when setFilter is called', () => {
    app.setFilter('active');
    expect(app.getCurrentFilter()).toBe('active');
  });

});
describe('getFilteredTasks() Method', () => {
  beforeEach(() => {
    app.todos = [
      { id: 1, text: 'Active task 1', completed: false },
      { id: 2, text: 'Completed task 1', completed: true },
      { id: 3, text: 'Active task 2', completed: false }
    ];
  });

  test('should return only active tasks when filter is "active"', () => {
    app.setFilter('active');
    const filtered = app.getFilteredTasks();
    expect(filtered).toHaveLength(2);
    expect(filtered.every(task => !task.completed)).toBe(true);
  });

  test('should return only completed tasks when filter is "completed"', () => {
    app.setFilter('completed');
    const filtered = app.getFilteredTasks();
    expect(filtered).toHaveLength(1);
    expect(filtered.every(task => task.completed)).toBe(true);
  });
});
