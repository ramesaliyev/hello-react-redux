// http://jsbin.com/fikuguyuru/4/edit?js,output

const { combineReducers, createStore } = Redux;
const { Component } = React;
const { connect, Provider } = ReactRedux;

// ACTION CREATORS

let nextTodoId = 2;
const addTodo = (text) => ({
  type: 'ADD_TODO',
  id: nextTodoId++,
  text: text
});

const setVisibilityFilter = (filter) => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
});

const toggleTodo = (id) => ({
  type: 'TOGGLE_TODO',
  id
});

// REDUCERS
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

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed);
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed);
  }
};

const todoApp = combineReducers({
  todos,
  visibilityFilter
});

// PRESENTATIONAL + CONTAINER COMPONENTS

let AddTodo = ({ dispatch }) => {
  let input;
  
  return (
    <div>
      <input ref={node => {
        input = node;
      }} />
      <button
        onClick={() => {
          dispatch(addTodo(input.value))
          input.value = '';
        }}
      >Add Todo</button>
    </div>
  )
}
AddTodo = connect()(AddTodo);

const Todo = ({
  onClick,
  completed,
  text
}) => (
  <li
    onClick={onClick}
    style={{
      textDecoration: completed ? 'line-through' : 'none'
    }}
  >
    {text}
  </li>
);

const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
    {todos.map((todo) => 
      <Todo
        onClick={() => onTodoClick(todo.id)}
        key={todo.id}
        {...todo}
      />
    )}
  </ul>
)
const mapStateToTodoListProps = (
  state
) => ({
  todos: getVisibleTodos(
    state.todos,
    state.visibilityFilter
  )
});
const mapDispatchToTodoListProps = (
  dispatch
) => ({
  onTodoClick(id) {
    dispatch(toggleTodo(id));
  }
});
const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList);

const Link = ({ children, onClick, active }) => {
  if (active) {
    return <span>{children}</span>
  }
  
  return (
    <a href='#'
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  )
}
const mapStateToLinkProps = (state, ownProps) => ({
  active: ownProps.filter === state.visibilityFilter
});
const mapDispatchToLinkProps = (dispatch, ownProps) => ({
    onClick() {
      dispatch(setVisibilityFilter(ownProps.filter));
    }
});
const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link);

const Footer = () => (
  <p>
    Show:
    
    {' '}
    
    <FilterLink
      filter='SHOW_ALL'
    >All</FilterLink>
    
    {' '}
    
    <FilterLink
      filter='SHOW_ACTIVE'
    >Active</FilterLink>
  
    {' '}
  
    <FilterLink
      filter='SHOW_COMPLETED'
    >Completed</FilterLink>
  </p>
)

const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
);

const persistedState = {
  todos: [
    {
      id: 0,
      text: "Learn Redux",
      completed: true
    },
    {
      id: 1,
      text: "Learn React",
      completed: false
    }
  ]
};

const store = createStore(
  todoApp,
  persistedState
)

ReactDOM.render(
  <Provider store={store}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
);













