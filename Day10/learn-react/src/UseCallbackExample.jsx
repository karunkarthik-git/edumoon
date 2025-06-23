import React from "react";

const UseCallbackExample = () => {
    const [count, setCount] = React.useState(0);
    const [text, setText] = React.useState('');
    
    const UserInfo = React.useCallback(() => {
        return (
            <div>
                <h2>User Info</h2>
                <p>Count: {count}</p>
                <p>Text: {text}</p>
            </div>
        )
    }, [text, count]); // This will only re-render UserInfo when 'text' or 'count' changes

    // React.useEffect(() => {
    //     console.log("Initial render or count/text changed");
    // }, []);
    
    return (
        <div>
        <UserInfo />
        <button onClick={() => setCount(prevCount => prevCount + 5)}>Increment</button>
        <input type="text" value={text} onChange={(e) => {
            setText(e.target.value);
        }} />
        </div>
    );
}

export default UseCallbackExample;