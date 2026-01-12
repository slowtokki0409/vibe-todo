// 알림 권한 요청
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('이 브라우저는 알림을 지원하지 않습니다.');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// 알림 전송
export const sendNotification = (title, options = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      icon: '✨',
      badge: '✨',
      ...options,
    });
  }
};

// 마감일이 다가온 작업 알림
export const checkUpcomingDeadlines = (todos) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const upcomingTodos = todos.filter((todo) => {
    if (!todo.dueDate || todo.completed || !todo.reminderEnabled) return false;

    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    // 오늘 또는 내일이 마감일인 작업
    return (
      dueDate.toDateString() === now.toDateString() ||
      dueDate.toDateString() === tomorrow.toDateString()
    );
  });

  upcomingTodos.forEach((todo) => {
    const dueDate = new Date(todo.dueDate);
    const isToday = dueDate.toDateString() === now.toDateString();

    sendNotification(`Vibe Todo - ${isToday ? '오늘' : '내일'} 마감`, {
      body: todo.text,
      tag: `todo-${todo.id}`,
    });
  });

  return upcomingTodos.length;
};

// 기한 초과 작업 알림
export const checkOverdueTodos = (todos) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const overdueTodos = todos.filter((todo) => {
    if (!todo.dueDate || todo.completed || !todo.reminderEnabled) return false;

    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < now;
  });

  if (overdueTodos.length > 0) {
    sendNotification('Vibe Todo - 기한 초과', {
      body: `${overdueTodos.length}개의 작업이 기한을 초과했습니다.`,
    });
  }

  return overdueTodos.length;
};
