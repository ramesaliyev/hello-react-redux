import React from 'react';
import Footer from './Footer';
import AddTodo from './AddTodo';
import VisibleTodoList from './VisibleTodoList';
import styles from '../styles/todo.css'

const App = () => {
    return (
      <div styleName="styles.wrapper">
        <AddTodo />
        <VisibleTodoList />
        <Footer />
      </div>
    )
};

export default App;
