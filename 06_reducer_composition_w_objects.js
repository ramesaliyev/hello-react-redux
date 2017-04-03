// http://jsbin.com/xoganemojo/11/edit?js,console

const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }

      return {
        ...state,
        completed: !state.completed
      };
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map((t) => todo(t, action));
    default:
      return state;
  }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

/** TESTS ARE REMOVED, COPY PASTE AND TEST! **/

// To change our state from array to object, we dont have to
// remove our previous reducers, we just going to create
// wrapper reducer for our app.

// And we going to use it when we are creating store (instead of todos, we'll use todoApp)

// We'll do it with reselect in future.
const todoApp = (state = {}, action) => {
  return {
    todos: todos(
      state.todos,
      action
    ),
    visibilityFilter: visibilityFilter(
      state.visibilityFilter,
      action
    )
  }
}

const { createStore } = Redux;
const store = createStore(todoApp);

console.log('initialState: ', store.getState());

store.dispatch({
  type: 'ADD_TODO',
  id: 0,
  text: 'Learn Redux'
});

console.log(store.getState());

store.dispatch({
  type: 'ADD_TODO',
  id: 1,
  text: 'Go Shopping'
});

console.log(store.getState());

store.dispatch({
  type: 'TOGGLE_TODO',
  id: 1
});

console.log(store.getState());

store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED'
});

console.log(store.getState());
