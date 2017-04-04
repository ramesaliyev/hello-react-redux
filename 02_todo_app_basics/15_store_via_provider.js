// http://jsbin.com/qolisigobo/4/edit?js,output

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

const { combineReducers, createStore } = Redux;

const todoApp = combineReducers({
  todos,
  visibilityFilter
});
const { Component } = React;

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

let nextTodoId = 0;
// presentational + container component
const AddTodo = (props, { store }) => {
  let input;
  
  return (
    <div>
      <input ref={node => {
        input = node;
      }} />
      <button
        onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            id: nextTodoId++,
            text: input.value
          })
          
          input.value = '';
        }}
      >Add Todo</button>
    </div>
  )
}
// context we want to receive
AddTodo.contextTypes = {
  store: React.PropTypes.object
};

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

// container component
class FilterLink extends Component {
  componentDidMount() {
    const {store} = this.context;
    
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    });
  }
  
  componentWillUnmount() {
    this.unsubscribe();
  }
  
  render() {
    const props = this.props;
    const {store} = this.context;
    const state = store.getState();
    
    return (
      <Link
        active={props.filter === state.visibilityFilter}
        onClick={() => {
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter
          });
        }}
      >
        {props.children}
      </Link>
    );
  }
}
// context we want to receive
FilterLink.contextTypes = {
  store: React.PropTypes.object
};

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

// container component
class VisibleTodoList extends Component {
  componentDidMount() {
    const {store} = this.context;
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    });
  }
  
  componentWillUnmount() {
    this.unsubscribe();
  }
  
  render() {
    const props = this.props;
    const {store} = this.context;
    const state = store.getState();
    
    return (
      <TodoList
        todos={getVisibleTodos(
          state.todos,
          state.visibilityFilter
        )}
        onTodoClick={id => {
          store.dispatch({
            type: 'TOGGLE_TODO',
            id
          });
        }}
      />
    );
  }
}

// context we want to receive
VisibleTodoList.contextTypes = {
  store: React.PropTypes.object
};

// We add react-redux library and we dont have to write Provider ourself
const { Provider } = ReactRedux;

/*
class Provider extends Component {
  // for any of children and grand children
  getChildContext() {
    return {
      store: this.props.store
    };
  }
  
  render() {
    return this.props.children;
  }
}

Provider.childContextTypes = {
  store: React.PropTypes.object
};
*/

const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
);

/* store'u global scope'tan almanın sorunları
    - test etmeyi engelliyor, mock store sokamıyoruz
    - server rendering olmuyor çünkü orada her request'te başka store vereceğiz
    - vs..
*/
ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
);














