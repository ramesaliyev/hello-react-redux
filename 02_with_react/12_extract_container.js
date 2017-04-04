// http://jsbin.com/wepamacotu/5/edit?js,output

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
const store = createStore(todoApp);
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
const AddTodo = ({
  onAddClick
}) => {
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
    this.unsubscribe = store.subscribe(() => {
      // store update olduğunda zorla update et
      this.forceUpdate();
    });
  }
  
  componentWillUnmount() {
    this.unsubscribe();
  }
  
  render() {
    const props = this.props;
    // burada sıkıntı var çünkü parent'i update olmazsa bunun render 
    // methoduna kadar gelmeyecek iş, gelmediği için de eski veri ekranda kalacak
    
    // şuanda her store update olduğunda alayını re-render ediyoruz ama
    // normalde bu yaklaşımı kullanmayacağız performans için
    
    // o yüzden bu adamın kendisi store'a subscribe olmalı
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
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    });
  }
  
  componentWillUnmount() {
    this.unsubscribe();
  }
  
  render() {
    const props = this.props;
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

// artık buradaki component'lerin hiçbirine state'i buradan vermemize gerek yok.
const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
);

// render metodunu ve store'a subscribe olmayı buradan sildik
// ayrıca TodoApp'e buradan props ile store'u da göndermiyoruz artık
// ihtiyacı olan container componentler store'a subscribe olmuş durumdalar
ReactDOM.render(
  <TodoApp />,
  document.getElementById('root')
);













