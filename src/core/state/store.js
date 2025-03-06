/**
 * State Store
 * A simple functional state management system
 */

/**
 * Creates a new store with the given initial state
 * @param {Object} initialState - The initial state of the store
 * @returns {Object} - Store methods: getState, setState, subscribe
 */
const createStore = (initialState = {}) => {
  let state = {...initialState};
  const listeners = [];
  
  const getState = () => ({...state});
  
  const setState = (newState) => {
    state = {...state, ...newState};
    listeners.forEach(listener => listener(state));
  };
  
  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  };
  
  return { getState, setState, subscribe };
};

export default createStore;

// For browser environments
if (typeof window !== 'undefined') {
  window.createStore = createStore;
}

// For module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = createStore;
} else if (typeof exports !== 'undefined') {
  exports.default = createStore;
} else if (typeof define === 'function' && define.amd) {
  define([], () => createStore);
} 