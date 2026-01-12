// CSV 내보내기
export const exportToCSV = (todos) => {
  if (todos.length === 0) {
    alert('내보낼 할일이 없습니다.');
    return;
  }

  const headers = ['제목', '완료 여부', '우선순위', '카테고리', '마감일', '메모', '생성일'];

  const rows = todos.map((todo) => [
    `"${todo.text}"`,
    todo.completed ? '완료' : '미완료',
    todo.priority === 'high' ? '높음' : todo.priority === 'low' ? '낮음' : '중간',
    todo.category === 'work' ? '업무' : todo.category === 'study' ? '학습' : '개인',
    todo.dueDate || '-',
    `"${todo.description || ''}"`,
    new Date(todo.createdAt).toLocaleDateString('ko-KR'),
  ]);

  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `vibe-todos-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// JSON 내보내기
export const exportToJSON = (todos) => {
  if (todos.length === 0) {
    alert('내보낼 할일이 없습니다.');
    return;
  }

  const data = {
    exportDate: new Date().toISOString(),
    totalCount: todos.length,
    completedCount: todos.filter((t) => t.completed).length,
    todos: todos.map((todo) => ({
      id: todo.id,
      text: todo.text,
      completed: todo.completed,
      priority: todo.priority,
      category: todo.category,
      dueDate: todo.dueDate,
      description: todo.description,
      recurring: todo.recurring,
      reminderEnabled: todo.reminderEnabled,
      createdAt: todo.createdAt,
    })),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `vibe-todos-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// JSON 임포트
export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data.todos || []);
      } catch (error) {
        reject(new Error('유효하지 않은 JSON 파일입니다.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('파일 읽기 실패'));
    };

    reader.readAsText(file);
  });
};
