import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { calculateNextDueDate } from '../utils/dateUtils';

/**
 * Custom hook for managing todos with filtering, sorting, and bulk operations
 * @returns {Object} - Todo state and methods
 */
export const useTodos = () => {
  // Persistent todos state
  const [todos, setTodos] = useLocalStorage('vibe-todos', []);

  // Filter and sort state
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    priority: 'all',
    status: 'all', // 'all', 'active', 'completed'
    sortBy: 'priority', // 'priority', 'dueDate', 'created'
  });

  // Edit modal state
  const [editingTodo, setEditingTodo] = useState(null);

  // Multiple selection state
  const [selected, setSelected] = useState(new Set());

  // Filtered and sorted todos
  const filteredTodos = todos
    .filter((todo) => {
      if (filters.search && !todo.text.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.category !== 'all' && todo.category !== filters.category) {
        return false;
      }
      if (filters.priority !== 'all' && todo.priority !== filters.priority) {
        return false;
      }
      if (filters.status === 'active' && todo.completed) {
        return false;
      }
      if (filters.status === 'completed' && !todo.completed) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (filters.sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  // CRUD operations
  const addTodo = (text, priority = 'medium', category = 'personal', dueDate = null, description = '', recurring = null, reminderEnabled = false) => {
    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      priority,
      category,
      dueDate,
      description,
      recurring, // { type: 'daily'|'weekly'|'monthly', enabled: boolean }
      reminderEnabled,
      createdAt: new Date().toISOString(),
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id) => {
    const todoToToggle = todos.find((t) => t.id === id);
    if (!todoToToggle) return;

    // If marking as completed and is recurring
    if (!todoToToggle.completed && todoToToggle.recurring?.enabled) {
      const nextDueDate = calculateNextDueDate(
        todoToToggle.dueDate,
        todoToToggle.recurring.type
      );

      const newRecurringTodo = {
        ...todoToToggle,
        id: Date.now(),
        completed: false,
        dueDate: nextDueDate,
        createdAt: new Date().toISOString(),
        // Keep other properties safely
      };

      setTodos((prev) => {
        const updatedPrevious = prev.map((t) =>
          t.id === id ? { ...t, completed: true } : t
        );
        return [newRecurringTodo, ...updatedPrevious];
      });
    } else {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id, updates) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, ...updates } : todo
      )
    );
  };

  // Multiple selection functions
  const toggleSelection = (id) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const selectAll = () => {
    setSelected(new Set(filteredTodos.map((t) => t.id)));
  };

  const clearSelection = () => {
    setSelected(new Set());
  };

  const bulkDelete = () => {
    setTodos(todos.filter((t) => !selected.has(t.id)));
    clearSelection();
  };

  const bulkToggle = () => {
    setTodos(
      todos.map((todo) =>
        selected.has(todo.id) ? { ...todo, completed: !todo.completed } : todo
      )
    );
    clearSelection();
  };

  const bulkUpdateCategory = (category) => {
    setTodos(
      todos.map((todo) =>
        selected.has(todo.id) ? { ...todo, category } : todo
      )
    );
    clearSelection();
  };

  const bulkUpdatePriority = (priority) => {
    setTodos(
      todos.map((todo) =>
        selected.has(todo.id) ? { ...todo, priority } : todo
      )
    );
    clearSelection();
  };

  // Import functions
  const importTodos = (importedTodos) => {
    setTodos((prevTodos) => [...prevTodos, ...importedTodos]);
  };

  return {
    // State
    todos,
    filteredTodos,
    filters,
    editingTodo,
    selected,
    
    // State setters
    setFilters,
    setEditingTodo,
    setTodos,
    
    // CRUD operations
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    
    // Selection operations
    toggleSelection,
    selectAll,
    clearSelection,
    
    // Bulk operations
    bulkDelete,
    bulkToggle,
    bulkUpdateCategory,
    bulkUpdatePriority,
    
    // Import
    importTodos,
  };
};
