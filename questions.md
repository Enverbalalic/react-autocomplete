### 1. What is the difference between Component and PureComponent? give an example where it might break my app.
The main difference is that a PureComponent implements shouldComponentUpdate as a shallow comparison of props and state, a regular component does not implement shouldComponentUpdate at all. A regular component will re-render on every prop and state change, where a PureComponent will only re-render if they change.

Since a PureComponent only does a shallow comparison of props, passing for example a nested object as a prop, and updating a value deep in that object will not trigger a re-render.

### 2. Context + ShouldComponentUpdate might be dangerous. Can think of why is that?
ShouldComponentUpdate uses props and state to determine whether a component should re-render. When using Context, it's possible for context to get updated without triggering a re-render because shouldComponentUpdate doesn't check the context. Usually when using context it's best to use Context.Consumer directly in the render function for when we want to use the context since that will make sure that the component re-renders every time a context value change happens

### 3. Describe 3 ways to pass information from a component to its PARENT.
You can pass a callback function to the child component as a prop, the child component can call that function with new data that it wants to pass to the parent.

You can use React.Context.

You can use a global state management solution like Redux.
### 4. Give 2 ways to prevent components from re-rendering.
You can implement a shouldComponentUpdate function or use a PureComponent. You can use the React.memo HOC to memoize the component and only re-render if props change.
### 5. What is a fragment and why do we need it? Give an example where it might break my app.
A React component can only return one element, a fragment is a way for a component to return multiple elements without wrapping them in an element.

I can't think of a reason why using fragments would break an app. If the component doesn't require a wrapper element for any reason such as event handlers or CSS styling, a fragment shouldn't cause a problem. You might consider it a problem if for example you use a fragment to return a vertical list, but use the component in an element that has `flex-direction: row` set in it's CSS, so it turns into a horizontal list. I guess having the style of the component that uses fragments be somewhat dependent on where it's used might be consdiered breaking ?

### 6. Give 3 examples of the HOC pattern.

We can write a hoc to show a loading spinner when we're fetching data:

```jsx
function withLoading(Component) {
    return function WithLoadingComponent({loading, ...props}) {
        return loading ? <Spinner /> : <Component {...props} />
    }
}

```

or a HOC to block access to components if the user is not authenticated:

```jsx
function withAuth(Component) {
    class AuthCheckerComponent extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                authenticated: null,
            };
        }

        componentDidMount() {
            const token = localStorage.getItem('token');

            // check token, if it's a JWT, decode it and check expiration
            // or ping the server to make sure it's valid

            const isValid = checkToken(token);
            this.setState({ authenticated: isValid });

            //or 
            
            checkToken(token).then((isValid) => {
                this.setState({ authenticated: isValid });    
            });
        }

        render() {
            if (this.state.authenticated === null) {
                return <Loader />
            }
            
            if (this.state.authenticated === false) {
                return (
                    <Redirect to="/login"/>
                )
            }
            
            return <Component {...this.props} />
        }
    }
    
    return AuthCheckerComponent;
}

```

One more example of HOC's in React is the Redux connect function. It is implemented as a HOC that maps state and dispatch functions and injects them into our component's props 

### 7. what's the difference in handling exceptions in promises, callbacks and async...await.

In promises we use the .catch() function for handling exceptions.

In callbacks we usually dedicate one argument for error/exception propagation usually the first one like NodeJS does.

In async/await we use regular try catch blocks for exception handling.

### 8. How many arguments does setState take and why is it async.
setState takes 1 required and 1 optional parameter. The first parameter can be an object representing the state to update, or a function that will get the previous state and the props as an argument. It needs to return the state to update. The second optional argument is a callback to is called when the state update is completed and the component is re-rendered.

setState itself isn't an async function, it does not return a promise. But we can think of setState as async because React batches state updates. A setState call isn't guaranteed to update the state immediately, and thus issuing a setState call, and using that state immediately after will not represent the state that we previously set.
### 9. List the steps needed to migrate a Class to Function Component.
It would be preferable to have a unit test ready, or first write a test for that component so we can verify it works the same before and after.

We would first replace the class .. extends React.Componente with a function that takes the props as it's first argument. We would remove the render method entirely and replace it with a return that returns the content. We would replace any state variables in this.state with useState hooks, and any setState calls to calls to the set functions of those useState hooks. We would replace lifecycle methods like componentDidMount, componentWillUnmount, etc with useEffect. We should use useCallback hooks for any callback functions. Wrap expensive computations in an useMemo hook with required parameters in the dependency array of useMemo to ensure we only do the computation when dependencies change. We should replace this.refs usages with the useRef hook.

Unit test the new function, fix anything we missed and that's it.

### 10. List a few ways styles can be used with components.
You can use the style prop on elements (inline CSS), normal CSS that you import into the component or include in the index.html, styled components, CSS-in-JS, etc.
### 11. How to render an HTML string coming from the server
You can use the dangerouslySetInnerHTML prop on any element, but it's not advisable since it's vunerable to XSS.
