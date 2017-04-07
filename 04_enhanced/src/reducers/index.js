import { combineReducers } from 'redux';
import byId, * as fromById from './byId';
import createList, * as fromCreateList from './createList';  

const listByFilter = combineReducers({
  all: createList('all'),
  active: createList('active'),
  completed: createList('completed')
});

const todos = combineReducers({
  byId,
  listByFilter
});

export default todos;

// selector
// current state'ten bir şey select ediyor.
export const getVisibleTodos = (state, filter) => {
  const ids = fromCreateList.getIds(state.listByFilter[filter]);

  return ids.map(id => fromById.getTodo(state.byId, id));
};

// selector
export const getIsFetching = (state, filter) => 
  fromCreateList.getIsFetching(state.listByFilter[filter])

// selector
export const getErrorMessage = (state, filter) => 
  fromCreateList.getErrorMessage(state.listByFilter[filter])
