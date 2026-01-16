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
  link.setAttribute('download', `aura-${new Date().toISOString().split('T')[0]}.csv`);
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
  link.setAttribute('download', `aura-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 마크다운 내보내기
export const exportToMarkdown = (todos) => {
  if (todos.length === 0) {
    alert('내보낼 할일이 없습니다.');
    return;
  }

  const today = new Date().toISOString().split('T')[0];
  let mdContent = `# AURA Todo List (${today})\n\n`;

  // 카테고리별 그룹화
  const categories = {
    work: '💼 업무 (Work)',
    personal: '💪 개인 (Personal)',
    study: '📚 학습 (Study)'
  };

  Object.entries(categories).forEach(([key, label]) => {
    const categoryTodos = todos.filter(t => t.category === key);
    if (categoryTodos.length > 0) {
      mdContent += `## ${label}\n`;
      categoryTodos.forEach(todo => {
        const check = todo.completed ? 'x' : ' ';
        const priority = todo.priority === 'high' ? '🔥' : todo.priority === 'low' ? '☕️' : '';
        const due = todo.dueDate ? ` (마감: ${todo.dueDate})` : '';
        mdContent += `- [${check}] ${priority} ${todo.text}${due}\n`;
        if (todo.description) {
          mdContent += `  > ${todo.description}\n`;
        }
      });
      mdContent += '\n';
    }
  });

  // 기타 카테고리 (혹시 모를 예외)
  const otherTodos = todos.filter(t => !categories[t.category]);
  if (otherTodos.length > 0) {
    mdContent += `## 📂 기타\n`;
    otherTodos.forEach(todo => {
      const check = todo.completed ? 'x' : ' ';
      mdContent += `- [${check}] ${todo.text}\n`;
    });
  }

  const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `aura-${today}.md`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 텍스트/마크다운 파싱 헬퍼
const parseTextToTodos = (text) => {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      // 마크다운 체크박스 (- [ ] ) 제거
      const cleanedText = line.replace(/^-\s*\[.*?\]\s*/, '').replace(/^-\s*/, '').replace(/^\d+\.\s*/, '');
      return {
        id: Date.now() + Math.random(), // 임시 ID
        text: cleanedText,
        completed: false,
        priority: 'medium',
        category: 'personal',
        createdAt: new Date().toISOString(),
      };
    });
};

// 통합 파일 임포트 (JSON, TXT, MD)
export const importFromFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;

      try {
        // 1. JSON 시도
        if (file.name.endsWith('.json')) {
          const data = JSON.parse(content);
          if (Array.isArray(data)) {
            resolve(data);
          } else {
            resolve(data.todos || []);
          }
          return;
        }

        // 2. 텍스트/마크다운 처리
        if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
          const todos = parseTextToTodos(content);
          resolve(todos);
          return;
        }

        reject(new Error('지원하지 않는 파일 형식입니다. (.json, .txt, .md)'));
      } catch (error) {
        // JSON 파싱 실패 시 텍스트로 처리 시도 (옵션)
        try {
          const todos = parseTextToTodos(content);
          resolve(todos);
        } catch (err) {
          reject(new Error('파일 읽기 실패'));
        }
      }
    };

    reader.onerror = () => reject(new Error('파일 시스템 오류'));
    reader.readAsText(file);
  });
};

// 텍스트 직접 임포트 (붙여넣기용)
export const importFromText = (text) => {
  return Promise.resolve(parseTextToTodos(text));
};
