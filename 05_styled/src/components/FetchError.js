import React from 'react';
import styles from '../styles/todo.css';

const FetchError = ({
    message,
    onRetry
}) => (
    <div styleName='styles.error'>
        <p>Could not fetch todos. {message}</p>
        <button onClick={onRetry}>Retry</button>
    </div>
);

export default FetchError;
