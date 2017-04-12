import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../actions';
import TodoList from './TodoList';
import { getVisibleTodos, getIsFetching, getErrorMessage } from '../reducers'
import FetchError from './FetchError'

class VisibleTodoList extends Component {
  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.filter !== prevProps.filter) {
      this.fetchData();
    }
  }

  fetchData() {
    const { fetchTodos, filter } = this.props;

    fetchTodos(filter);  
  }

  render() {
    const {
      errorMessage,
      toggleTodo,
      todos,
      isFetching
    } = this.props;
    
    if (!todos.length) {
      if (isFetching) {
        return <p> Loading... </p>
      }

      if (errorMessage) {
        return (
          <FetchError
            message={errorMessage}
            onRetry={() => this.fetchData()}
          />
        );
      }  
    }
    return <TodoList
      onTodoClick={toggleTodo}
      todos={todos}
    />
  }
};

const mapStateToProps = (state, ownProps) => {
  const filter = ownProps.match.params.filter || 'all'; 
  
  return {
    todos: getVisibleTodos(state, filter),
    errorMessage: getErrorMessage(state, filter),
    isFetching: getIsFetching(state, filter),
    filter,
  }
};

/*
const mapDispatchToProps = (dispatch) => ({
  onTodoClick(id) {
    dispatch(toggleTodo(id));
  },
});

Yukarıdakiyle aşağıdaki aynı şey

{ onTodoClick: toggleTodo }

*/

// wrapper component router'dan paramsları props olarak alsın diye
VisibleTodoList = withRouter(connect(
  mapStateToProps,
  actions
)(VisibleTodoList));

export default VisibleTodoList;
