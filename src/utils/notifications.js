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

// Check if notification was already sent (using localStorage)
const wasNotificationSent = (todoId, type) => {
  const key = `notification-sent-${todoId}-${type}`;
  const lastSent = localStorage.getItem(key);
  if (!lastSent) return false;

  const lastSentTime = new Date(lastSent);
  const now = new Date();
  // Reset notification flag after 24 hours
  return now - lastSentTime < 24 * 60 * 60 * 1000;
};

const markNotificationSent = (todoId, type) => {
  const key = `notification-sent-${todoId}-${type}`;
  localStorage.setItem(key, new Date().toISOString());
};

// 1-hour advance notification
export const checkOneHourAdvance = (todos) => {
  const now = new Date();

  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  const urgentTodos = todos.filter((todo) => {
    if (!todo.dueDate || todo.completed || !todo.reminderEnabled) return false;
    if (wasNotificationSent(todo.id, 'one-hour')) return false;

    const dueDate = new Date(todo.dueDate);

    // Check if due time is within the next hour
    const timeDiff = dueDate - now;
    const isWithinOneHour = timeDiff > 0 && timeDiff <= 60 * 60 * 1000;

    return isWithinOneHour;
  });

  urgentTodos.forEach((todo) => {
    const dueDate = new Date(todo.dueDate);
    const minutesLeft = Math.floor((dueDate - now) / (60 * 1000));

    sendNotification('Vibe Todo - 1시간 전 알림', {
      body: `"${todo.text}" 마감까지 ${minutesLeft}분 남았습니다!`,
      tag: `todo-${todo.id}-onehour`,
      requireInteraction: true,
    });

    markNotificationSent(todo.id, 'one-hour');
  });

  return urgentTodos.length;
};

// 마감일이 다가온 작업 알림 (Enhanced)
export const checkUpcomingDeadlines = (todos) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const upcomingTodos = todos.filter((todo) => {
    if (!todo.dueDate || todo.completed || !todo.reminderEnabled) return false;
    if (wasNotificationSent(todo.id, 'upcoming')) return false;

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
      requireInteraction: isToday,
    });

    markNotificationSent(todo.id, 'upcoming');
  });

  return upcomingTodos.length;
};

// 기한 초과 작업 알림 (Enhanced)
export const checkOverdueTodos = (todos) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const overdueTodos = todos.filter((todo) => {
    if (!todo.dueDate || todo.completed || !todo.reminderEnabled) return false;

    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < now;
  });

  if (overdueTodos.length > 0 && !wasNotificationSent('overdue-batch', 'overdue')) {
    sendNotification('Vibe Todo - 기한 초과', {
      body: `${overdueTodos.length}개의 작업이 기한을 초과했습니다.`,
      tag: 'overdue-batch',
      requireInteraction: true,
    });

    markNotificationSent('overdue-batch', 'overdue');
  }

  return overdueTodos.length;
};

// Clear old notification flags (call this on app startup)
export const cleanupOldNotificationFlags = () => {
  const now = new Date();
  const keys = Object.keys(localStorage);

  keys.forEach(key => {
    if (key.startsWith('notification-sent-')) {
      const lastSent = localStorage.getItem(key);
      if (lastSent) {
        const lastSentTime = new Date(lastSent);
        // Remove flags older than 7 days
        if (now - lastSentTime > 7 * 24 * 60 * 60 * 1000) {
          localStorage.removeItem(key);
        }
      }
    }
  });
};
