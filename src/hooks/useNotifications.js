import { useEffect } from 'react';
import {
  requestNotificationPermission,
  checkUpcomingDeadlines,
  checkOverdueTodos,
  checkOneHourAdvance,
  cleanupOldNotificationFlags,
} from '../utils/notifications';

/**
 * Custom hook for managing notification permissions and periodic deadline checks
 * @param {Array} todos - Array of todo objects to check for notifications
 */
export const useNotifications = (todos) => {
  useEffect(() => {
    requestNotificationPermission();
    cleanupOldNotificationFlags();

    const interval = setInterval(() => {
      checkOneHourAdvance(todos);
      checkUpcomingDeadlines(todos);
      checkOverdueTodos(todos);
    }, 60000);

    return () => clearInterval(interval);
  }, [todos]);
};
