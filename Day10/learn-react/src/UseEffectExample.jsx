import React from 'react';

const UseEffectExample = ({data}) => {
    // let variableName = 10;
    // variableName = 20;
    // console.log(variableName); // This will log 20, as variableName is reassigned

    const [count, setCount] = React.useState(0);
    const [name, setName] = React.useState('');
    const [value, setValue] = React.useState({
        name: 'John',
        age: 30
    });

    const increase = () => {
        // setCount(count + 1);
        setCount(value => value + 1);
    }
    
    // React.useEffect(() => {
    //     console.log('useEffect called');
    // }, [name, count]); // This effect will run when 'name' changes, not 'count'
    // depencency list can take prop or state 

    React.useEffect(() => {
        console.log('useEffect called');
    }, [data]);
    
    return (
        <div>
        <h1>Count: {count}</h1>
        <button onClick={() => increase()}>Increment</button>
        <button onClick={() => {
            increase();
            increase();
            increase();
            increase();
        }}>Increment 4x</button>
        <input
            type="text"
            value={name}
            className='input-area'
            onChange={(e) => {
                debugger
                setName(e.target.value)
                setCount(100);
            }}
            placeholder="Enter your name"
        />
        <p>Your name is: {name}</p>
        <h2>{value.name} is {value.age} years old.</h2>
        <button onClick={() => {
            setValue({
                name: 'Jane',
                age: 25
            });
        }}>Change Value</button>
        <button onClick={() => {
            setValue(prevValue => ({
                ...prevValue,
                age: prevValue.age + 1
            }));
        }}>Increase Age</button>

        <h2>Data from Parent: {data}</h2>
        </div>
    );
}


export default UseEffectExample;