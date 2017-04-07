export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    
    if (serializedState !== null) {
      return JSON.parse(serializedState);
    }
  } catch (e) {}

  return undefined;
};

export const saveState = (state) => {
  try {
    localStorage.setItem('state', JSON.stringify(state));
  } catch (e) {

  }
};
