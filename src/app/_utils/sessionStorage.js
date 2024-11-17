export const getFromStorage = (key) => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem(key);
  }
  return null;
};

export const setInStorage = (key, value) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(key, value);
  }
};

export const clearStorage = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.clear();
  }
}; 