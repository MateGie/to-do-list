// Todo List Application
class TodoApp {
    constructor() {
        this.tasks = [];
        this.taskIdCounter = 1;
        this.init();
    }

    init() {
        this.bindElements();
        this.bindEvents();
        this.loadInitialTasks();
        this.updateTaskCounter();
        this.updateEmptyState();
    }

    bindElements() {
        this.taskInput = document.getElementById('taskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.taskList = document.getElementById('taskList');
        this.taskCounter = document.getElementById('taskCounter');
        this.emptyState = document.getElementById('emptyState');
    }

    bindEvents() {
        // Add task button click
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        
        // Enter key in input field
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });
        
        // ESC key to clear input
        this.taskInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearInput();
            }
        });
        
        // Input validation
        this.taskInput.addEventListener('input', () => {
            this.validateInput();
        });
    }

    loadInitialTasks() {
        // Load sample tasks from the provided data
        const sampleTasks = [
            {
                id: "1",
                text: "Learn JavaScript",
                completed: false
            },
            {
                id: "2", 
                text: "Build a todo app",
                completed: true
            }
        ];
        
        // Add sample tasks to demonstrate functionality
        sampleTasks.forEach(task => {
            this.tasks.push({
                id: task.id,
                text: task.text,
                completed: task.completed
            });
            this.taskIdCounter = Math.max(this.taskIdCounter, parseInt(task.id) + 1);
        });
        
        this.renderTasks();
    }

    addTask() {
        const taskText = this.taskInput.value.trim();
        
        if (!this.isValidTask(taskText)) {
            this.showInputError();
            return;
        }

        const newTask = {
            id: this.taskIdCounter.toString(),
            text: taskText,
            completed: false
        };

        this.tasks.push(newTask);
        this.taskIdCounter++;
        
        this.renderTasks();
        this.clearInput();
        this.updateTaskCounter();
        this.updateEmptyState();
        
        // Focus back to input for better UX
        this.taskInput.focus();
    }

    isValidTask(text) {
        return text.length > 0 && text.length <= 100;
    }

    showInputError() {
        this.taskInput.style.borderColor = 'var(--color-error)';
        this.taskInput.focus();
        
        setTimeout(() => {
            this.taskInput.style.borderColor = '';
        }, 2000);
    }

    validateInput() {
        const text = this.taskInput.value.trim();
        if (text.length > 100) {
            this.taskInput.style.borderColor = 'var(--color-warning)';
        } else {
            this.taskInput.style.borderColor = '';
        }
    }

    clearInput() {
        this.taskInput.value = '';
        this.taskInput.style.borderColor = '';
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.renderTasks();
            this.updateTaskCounter();
        }
    }

    deleteTask(taskId) {
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        
        if (taskElement) {
            taskElement.classList.add('removing');
            
            setTimeout(() => {
                this.tasks = this.tasks.filter(t => t.id !== taskId);
                this.renderTasks();
                this.updateTaskCounter();
                this.updateEmptyState();
            }, 250);
        }
    }

    renderTasks() {
        this.taskList.innerHTML = '';
        
        this.tasks.forEach((task, index) => {
            const taskElement = this.createTaskElement(task, index);
            this.taskList.appendChild(taskElement);
        });
    }

    createTaskElement(task, index) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.setAttribute('data-task-id', task.id);
        li.setAttribute('role', 'listitem');
        
        // Add staggered animation delay
        li.style.animationDelay = `${index * 50}ms`;
        
        li.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}"
            >
            <span class="task-text ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.text)}</span>
            <button 
                class="delete-btn" 
                aria-label="Delete task: ${this.escapeHtml(task.text)}"
                title="Delete task"
            >
                Delete
            </button>
        `;

        // Bind events
        const checkbox = li.querySelector('.task-checkbox');
        const deleteBtn = li.querySelector('.delete-btn');
        
        checkbox.addEventListener('change', () => {
            this.toggleTask(task.id);
        });
        
        deleteBtn.addEventListener('click', () => {
            this.deleteTask(task.id);
        });

        return li;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateTaskCounter() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(t => t.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        
        let counterText = '';
        if (totalTasks === 0) {
            counterText = '0 tasks';
        } else if (totalTasks === 1) {
            counterText = `1 task${completedTasks === 1 ? ' (completed)' : ''}`;
        } else {
            counterText = `${totalTasks} tasks`;
            if (completedTasks > 0) {
                counterText += ` (${completedTasks} completed)`;
            }
        }
        
        this.taskCounter.textContent = counterText;
    }

    updateEmptyState() {
        if (this.tasks.length === 0) {
            this.emptyState.classList.remove('hidden');
            this.taskList.style.display = 'none';
        } else {
            this.emptyState.classList.add('hidden');
            this.taskList.style.display = 'block';
        }
    }

    // Public method to get current tasks (for debugging)
    getTasks() {
        return this.tasks;
    }

    // Public method to clear all tasks
    clearAllTasks() {
        this.tasks = [];
        this.renderTasks();
        this.updateTaskCounter();
        this.updateEmptyState();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Focus input when user starts typing (if not already focused)
        if (e.key.length === 1 && 
            document.activeElement !== window.todoApp.taskInput && 
            !document.activeElement.matches('input, textarea, button')) {
            window.todoApp.taskInput.focus();
        }
    });
});

// Make sure the app works even if there are errors
window.addEventListener('error', (e) => {
    console.error('Todo App Error:', e.error);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Refresh task counter when page becomes visible
        if (window.todoApp) {
            window.todoApp.updateTaskCounter();
        }
    }
});