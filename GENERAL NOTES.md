# store
- single source of truth
- holds application state objects
- lets you dispatch actions
- and when you create it you have to specify reducers that tells how to state is created
- has 3 important methods
  - getState()
  - dispatch(action);
  - subscribe(fn)

# action
- you cant modify state tree directly, you have to emit an action
- action HAS TO HAVE 'type' property

# reducers
- takes previous state and action, and returns next state
- new state has to be new object, but inside that object we can keep old references
- they have to be testable
- they should specify initial state when called with undefined as state
- write test for reducers
- reducers can and should call each other
- reducers will call everytime an action dispatched (we'll use reselect for memoization)

# subscribers
- subscribe for the changes of the state (NOT TO THE ACTIONS)

# middlewares
- use middleware for action subscribing
