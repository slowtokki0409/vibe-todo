import { useState, useEffect } from 'react';

/**
 * Custom hook for managing state with localStorage persistence
 * @param {string} key - The localStorage key
 * @param {*} initialValue - The initial value if localStorage is empty
 * @returns {[*, Function]} - [value, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return initialValue;
    }
  });

  // Update localStorage whenever the state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};
