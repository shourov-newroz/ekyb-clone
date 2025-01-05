/**
 * Utility functions for interacting with localStorage
 */
export const localStorageUtil = {
  /**
   * Save data to localStorage
   * @param key - The key under which the data will be stored
   * @param value - The value to be stored
   */
  setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error saving to localStorage (key: ${key}):`, error);
    }
  },

  /**
   * Retrieve data from localStorage
   * @param key - The key of the data to retrieve
   * @returns The parsed value or null if not found
   */
  getItem<T>(key: string): T | null {
    try {
      const serializedValue = localStorage.getItem(key);
      return serializedValue ? JSON.parse(serializedValue) : null;
    } catch (error) {
      console.error(`Error reading from localStorage (key: ${key}):`, error);
      return null;
    }
  },

  /**
   * Remove data from localStorage
   * @param key - The key of the data to remove
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (key: ${key}):`, error);
    }
  },

  /**
   * Clear all data from localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};
