/**
 * Date utility functions for Vibe Todo
 * Handles date comparisons, D-Day calculations, and urgency states
 */

/**
 * Check if a date is overdue (past today, excluding today)
 * @param {string} dueDate - ISO date string
 * @returns {boolean}
 */
export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

/**
 * Check if a date is today
 * @param {string} dueDate - ISO date string
 * @returns {boolean}
 */
export const isToday = (dueDate) => {
  if (!dueDate) return false;
  const today = new Date();
  const due = new Date(dueDate);
  return (
    due.getFullYear() === today.getFullYear() &&
    due.getMonth() === today.getMonth() &&
    due.getDate() === today.getDate()
  );
};

/**
 * Check if a date is upcoming (within next 7 days, excluding today)
 * @param {string} dueDate - ISO date string
 * @returns {boolean}
 */
export const isUpcoming = (dueDate) => {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 7);
  return due > today && due <= sevenDaysFromNow;
};

/**
 * Check if a date is urgent (within next 3 days, including today)
 * @param {string} dueDate - ISO date string
 * @returns {boolean}
 */
export const isUrgent = (dueDate) => {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const threeDaysFromNow = new Date(today);
  threeDaysFromNow.setDate(today.getDate() + 3);
  return due >= today && due <= threeDaysFromNow;
};

/**
 * Calculate D-Day (days until/since due date)
 * @param {string} dueDate - ISO date string
 * @returns {number} - Negative for overdue, 0 for today, positive for future
 */
export const calculateDDay = (dueDate) => {
  if (!dueDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Format D-Day as Korean string (D-3, D-Day, D+2, etc.)
 * @param {string} dueDate - ISO date string
 * @returns {string} - Formatted D-Day string
 */
export const formatDDay = (dueDate) => {
  const dDay = calculateDDay(dueDate);
  if (dDay === null) return null;

  if (dDay === 0) return 'D-Day';
  if (dDay > 0) return `D-${dDay}`;
  return `D+${Math.abs(dDay)}`;
};

/**
 * Format date for display (한국어)
 * @param {string} dueDate - ISO date string
 * @returns {string} - Formatted date string (e.g., "1월 15일")
 */
export const formatDate = (dueDate) => {
  if (!dueDate) return null;
  const date = new Date(dueDate);
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
};

/**
 * Format date with D-Day (한국어)
 * @param {string} dueDate - ISO date string
 * @returns {string} - Formatted date with D-Day (e.g., "1월 15일 (D-3)")
 */
export const formatDateWithDDay = (dueDate) => {
  if (!dueDate) return null;
  const dateStr = formatDate(dueDate);
  const dDayStr = formatDDay(dueDate);
  return `${dateStr} (${dDayStr})`;
};

/**
 * Get date badge color based on urgency
 * @param {string} dueDate - ISO date string
 * @returns {string} - Tailwind CSS classes for badge styling
 */
export const getDateBadgeColor = (dueDate) => {
  if (!dueDate) return 'bg-gray-500/20 text-gray-400';

  if (isOverdue(dueDate)) {
    return 'bg-red-500/20 text-red-400 border border-red-500/50';
  }
  if (isToday(dueDate)) {
    return 'bg-orange-500/20 text-orange-400 border border-orange-500/50';
  }
  if (isUrgent(dueDate)) {
    return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 animate-pulse';
  }
  if (isUpcoming(dueDate)) {
    return 'bg-blue-500/20 text-blue-400';
  }
  return 'bg-gray-500/20 text-gray-400';
};

/**
 * Get date state label (한국어)
 * @param {string} dueDate - ISO date string
 * @returns {string} - State label ("기한 초과", "오늘", "임박", "예정", etc.)
 */
export const getDateStateLabel = (dueDate) => {
  if (!dueDate) return null;

  if (isOverdue(dueDate)) return '기한 초과';
  if (isToday(dueDate)) return '오늘';
  if (isUrgent(dueDate)) return '임박';
  if (isUpcoming(dueDate)) return '예정';
  return '미래';
};

export const calculateNextDueDate = (currentDueDate, recurringType) => {
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
