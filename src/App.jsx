import Layout from './components/Layout';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import TodoEditModal from './components/TodoEditModal';
import TodoStats from './components/TodoStats';
import ActionBar from './components/ActionBar';
import NotificationBanner from './components/NotificationBanner';
import { useTodos } from './hooks/useTodos';
import { useNotifications } from './hooks/useNotifications';
import { exportToCSV, exportToJSON, exportToMarkdown, importFromFile, importFromText } from './utils/export';
import './App.css';

function App() {
  const {
    todos,
    filteredTodos,
    filters,
    editingTodo,
    selected,
    setFilters,
    setEditingTodo,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    toggleSelection,
    selectAll,
    clearSelection,
    bulkDelete,
    bulkToggle,
    bulkUpdateCategory,
    bulkUpdatePriority,
    importTodos,
  } = useTodos();

  useNotifications(todos);

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
      importTodos(importedTodos);
      alert(`${importedTodos.length}개의 할일이 임포트되었습니다.`);
    } catch (error) {
      alert(`임포트 실패: ${error.message}`);
    }
  };

  const handleImportText = async (text) => {
    try {
      const importedTodos = await importFromText(text);
      importTodos(importedTodos);
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
