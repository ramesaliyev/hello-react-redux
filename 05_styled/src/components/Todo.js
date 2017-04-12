import React, { PropTypes } from 'react';
import styles from '../styles/todo.css'
import c from 'classnames';

const Todo = ({ onClick, completed, text }) => {
  
  var className = c(
    'styles.todo-list-item',
    { 'styles.todo-list-item-completed': completed }
  );

  return (
    <li
      onClick={onClick}
      styleName={className}
    >
      {text}
    </li>
  )
};

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
};

export default Todo;
