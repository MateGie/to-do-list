// To-Do List Application
class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.STORAGE_KEY = 'todos';
        
        // DOM elements
        this.todoList = document.getElementById('todo-list');
        this.newTaskInput = document.getElementById('new-task-input');
        this.addTaskBtn = document.getElementById('add-task-btn');
        this.taskCount = document.getElementById('task-count');
        this.emptyState = document.getElementById('empty-state');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        
        this.init();
    }
    
    init() {
        // Load tasks from localStorage on page load
        this.loadTasks();
        
        // Event listeners
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.newTaskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });
        
        // Initial render
        this.renderTasks();
        this.updateTaskCount();
    }
    
    // Filter method
    setFilter(filter) {
        this.currentFilter = filter;
      
        // Update active filter button
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
      
      // Re-render tasks with new filter
        this.renderTasks();
        this.updateTaskCount();
    }

    // Load tasks from localStorage
    loadTasks() {
        try {
            const storedTasks = localStorage.getItem(this.STORAGE_KEY);
            if (storedTasks) {
                this.todos = JSON.parse(storedTasks);
            } else {
                // Start with empty array - no initial tasks
                this.todos = [];
            }
        } catch (error) {
            console.error('Error loading tasks from localStorage:', error);
            this.todos = [];
        }
    }
    
    // Save tasks to localStorage
    saveTasks() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.todos));
        } catch (error) {
            console.error('Error saving tasks to localStorage:', error);
        }
    }
    
    // Add a new task
    addTask() {
        const taskText = this.newTaskInput.value.trim();
        
        // Input validation
        if (!taskText) {
            this.newTaskInput.focus();
            return;
        }
        
        // Create new task object
        const newTask = {
            id: Date.now(), // Simple ID generation
            text: taskText,
            completed: false
        };
        
        // Add to todos array
        this.todos.push(newTask);
        
        // Save to localStorage immediately
        this.saveTasks();
        
        // Clear input
        this.newTaskInput.value = '';
        
        // Re-render and update count
        this.renderTasks();
        this.updateTaskCount();
        
        // Focus back on input for easy multiple additions
        this.newTaskInput.focus();
    }
    
    // Toggle task completion
    toggleTask(taskId) {
        const task = this.todos.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            
            // Save to localStorage immediately
            this.saveTasks();
            
            // Re-render and update count
            this.renderTasks();
            this.updateTaskCount();
        }
    }
    
    // Delete a task
    deleteTask(taskId) {
        // Remove from todos array
        this.todos = this.todos.filter(t => t.id !== taskId);
        
        // Save to localStorage immediately
        this.saveTasks();
        
        // Re-render and update count
        this.renderTasks();
        this.updateTaskCount();
    }
    
    // Render all tasks
    renderTasks() {
        // Clear existing tasks
        this.todoList.innerHTML = '';
        const filteredTasks = this.getFilteredTasks();
        
        // Show/hide empty state
        if (this.todos.length === 0) {
            this.emptyState.style.display = 'block';
            this.todoList.style.display = 'none';

            // Update empty state message based on filter
            const emptyMessage = this.getEmptyStateMessage();
            this.emptyState.querySelector('p').textContent = emptyMessage;
        } else {
            this.emptyState.style.display = 'none';
            this.todoList.style.display = 'block';
        }
        
        // Render filtered tasks
        filteredTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
                this.todoList.appendChild(taskElement);
        });
    }

     // Add method to get filtered tasks
  getFilteredTasks() {
    switch (this.currentFilter) {
      case 'active':
        return this.todos.filter(task => !task.completed);
      case 'completed':
        return this.todos.filter(task => task.completed);
      default:
        return this.todos;
    }
  }

  // Add method to get appropriate empty state message
  getEmptyStateMessage() {
    switch (this.currentFilter) {
      case 'active':
        return 'No active tasks. Great job!';
      case 'completed':
        return 'No completed tasks yet.';
      default:
        return 'No tasks yet. Add one above to get started!';
    }
  }
    
    // Create a task element
    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', task.id);
        
        li.innerHTML = `
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${task.completed ? 'checked' : ''}
            >
            <span class="todo-text ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.text)}</span>
            <div class="todo-actions">
                <button class="delete-btn" title="Delete task">Delete</button>
            </div>
        `;
        
        // Add event listeners
        const checkbox = li.querySelector('.todo-checkbox');
        const deleteBtn = li.querySelector('.delete-btn');
        
        checkbox.addEventListener('change', () => {
            this.toggleTask(task.id);
        });
        
        deleteBtn.addEventListener('click', () => {
            // Add removing animation
            li.classList.add('removing');
            setTimeout(() => {
                this.deleteTask(task.id);
            }, 300);
        });
        
        return li;
    }
    
    // Update task counter
    updateTaskCount() {
    const filteredTasks = this.getFilteredTasks();
    const activeCount = this.todos.filter(task => !task.completed).length;
    
    let countText;
    if (this.currentFilter === 'all') {
      countText = `${this.todos.length} total task${this.todos.length !== 1 ? 's' : ''} (${activeCount} active)`;
    } else if (this.currentFilter === 'active') {
      countText = `${activeCount} active task${activeCount !== 1 ? 's' : ''}`;
    } else {
      const completedCount = this.todos.filter(task => task.completed).length;
      countText = `${completedCount} completed task${completedCount !== 1 ? 's' : ''}`;
    }
    
    this.taskCount.textContent = countText;
  }
    
    // Utility function to escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    getCurrentFilter() {
        return this.currentFilter;
    }
}

// Theme Toggle JavaScript (updated to work with your CSS)
class ThemeManager {
  constructor() {
    this.init();
  }

  init() {
    this.loadTheme();
    this.setupToggleButton();
    this.respectSystemPreference();
  }

  // Load saved theme or detect system preference
  loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(systemPrefersDark ? 'dark' : 'light');
    }
  }

  // Set theme and update UI
  setTheme(theme) {
    document.documentElement.setAttribute('data-color-scheme', theme);
    localStorage.setItem('theme', theme);
    this.updateToggleButton(theme);
  }

  // Update toggle button appearance and accessibility
  updateToggleButton(theme) {
    const button = document.getElementById('theme-toggle');
    if (button) {
      const isLight = theme === 'light';
      button.setAttribute('aria-label', 
        isLight ? 'Switch to dark mode' : 'Switch to light mode'
      );
      
      // Add animation class for smooth icon transition
      const icon = button.querySelector('.toggle-icon');
      if (icon) {
        icon.style.animation = 'iconSpin 0.3s ease-in-out';
        setTimeout(() => {
          icon.style.animation = '';
        }, 300);
      }
    }
  }

  // Setup toggle button event listener
  setupToggleButton() {
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', () => {
        this.toggleTheme();
      });

      // Keyboard support
      toggleButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleTheme();
        }
      });
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-color-scheme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  // Listen for system theme changes
  respectSystemPreference() {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
  }

  // Get current theme
  getCurrentTheme() {
    return document.documentElement.getAttribute('data-color-scheme') || 'light';
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new TodoApp();
});

module.exports = TodoApp;
