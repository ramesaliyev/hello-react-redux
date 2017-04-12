import { createStore, applyMiddleware } from 'redux';
import todoApp from './reducers';
import { loadState, saveState } from './localStorage';
import debounce from 'lodash/debounce';
//import promise from 'redux-promise';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

/**
# our logger implementation 

const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.log('%c before: ', 'color:gray', store.getState());
  console.log('%c action: ', 'color:blue', action);
  
  const returnValue = next(action);
  
  console.log('%c after: ', 'color:green', store.getState());
  console.groupEnd(action.type);
  
  return returnValue;
};

# our promise implementation

const promise = (store) => (next) => (action) => {
  if (typeof action.then === 'function') {
    return action.then(next);
  }  

  return next(action);
};


# our middleware wrapper implementation

const wrapDispatchWithMiddlewares = (store, middlewares) => {
  middlewares.slice().reverse().forEach(middleware =>
    store.dispatch = middleware(store)(store.dispatch)
  )
};

# our thunk implementation

const thunk = (store) => (next) => (action) =>
  typeof action === 'function' ? 
    action(store.dispatch, store.getState) : 
    next(action);

*/

const configureStore = () => {
  /*
  we disabled using persisted state from local storage
  const persistedState = loadState()

  const store = createStore(
    todoApp,
    persistedState
  );

  we disabled persisting to localStorage

  store.subscribe(debounce(
    () => saveState({
      todos: store.getState().todos
    }), 200
  ));
  */

  // we replaced promise middleware with thunk middleware
  const middlewares = [thunk];

  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger());
  }

  return createStore(
    todoApp,
    applyMiddleware(...middlewares) // enhancer
  );
}

export default configureStore;
