import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import TodoEditModal from './components/TodoEditModal';
import TodoStats from './components/TodoStats';
import ActionBar from './components/ActionBar';
import NotificationBanner from './components/NotificationBanner';
import { exportToCSV, exportToJSON, exportToMarkdown, importFromFile, importFromText } from './utils/export';
import { requestNotificationPermission, checkUpcomingDeadlines, checkOverdueTodos, checkOneHourAdvance, cleanupOldNotificationFlags } from './utils/notifications';
import './App.css';

/**
 * Calculate the next due date based on recurring type
 * @param {string} currentDueDate - Current due date (ISO string or YYYY-MM-DD)
 * @param {string} recurringType - 'daily', 'weekly', or 'monthly'
 * @returns {string} - Next due date in YYYY-MM-DD format
 */
const calculateNextDueDate = (currentDueDate, recurringType) => {
  const baseDate = currentDueDate ? new Date(currentDueDate) : new Date();

  switch (recurringType) {
    case 'daily':
      baseDate.setDate(baseDate.getDate() + 1);
      break;
    case 'weekly':
      baseDate.setDate(baseDate.getDate() + 7);
      break;
    case 'monthly':
      baseDate.setMonth(baseDate.getMonth() + 1);
      break;
    default:
      break;
  }

  return baseDate.toISOString().split('T')[0];
};

function App() {
  const [todos, setTodos] = useState(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('vibe-todos');
    return saved ? JSON.parse(saved) : [];
  });

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

  // Save to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('vibe-todos', JSON.stringify(todos));
  }, [todos]);

  // Request notification permission and set up reminder checks
  useEffect(() => {
    requestNotificationPermission();
    cleanupOldNotificationFlags();

    // Check reminders every minute
    const interval = setInterval(() => {
      checkOneHourAdvance(todos);
      checkUpcomingDeadlines(todos);
      checkOverdueTodos(todos);
    }, 60000); // 1분마다 체크

    return () => clearInterval(interval);
  }, [todos]);

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

  // Export functions
  const handleExportCSV = () => {
    exportToCSV(todos);
  };

  const handleExportJSON = () => {
    exportToJSON(todos);
  };

  const handleExportMD = () => {
    exportToMarkdown(todos);
  };

  const handleImportFile = async (file) => {
    try {
      const importedTodos = await importFromFile(file);
      setTodos((prevTodos) => [...prevTodos, ...importedTodos]);
      alert(`${importedTodos.length}개의 할일이 임포트되었습니다.`);
    } catch (error) {
      alert(`임포트 실패: ${error.message}`);
    }
  };

  const handleImportText = async (text) => {
    try {
      const importedTodos = await importFromText(text);
      setTodos((prevTodos) => [...prevTodos, ...importedTodos]);
      alert(`${importedTodos.length}개의 할일이 추가되었습니다.`);
    } catch (error) {
      alert(`추가 실패: ${error.message}`);
    }
  };

  return (
    <Layout>
      <NotificationBanner />
      <TodoInput onAdd={addTodo} />
      <ActionBar
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
        onExportMD={handleExportMD}
        onImportFile={handleImportFile}
        onImportText={handleImportText}
      />
      <TodoStats todos={todos} />
      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onUpdate={updateTodo}
        onEdit={setEditingTodo}
        filters={filters}
        onFilterChange={setFilters}
        selected={selected}
        onToggleSelection={toggleSelection}
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
        onBulkDelete={bulkDelete}
        onBulkToggle={bulkToggle}
        onBulkUpdateCategory={bulkUpdateCategory}
        onBulkUpdatePriority={bulkUpdatePriority}
      />
      {editingTodo && (
        <TodoEditModal
          todo={editingTodo}
          onSave={updateTodo}
          onClose={() => setEditingTodo(null)}
        />
      )}
    </Layout>
  );
}

export default App;
