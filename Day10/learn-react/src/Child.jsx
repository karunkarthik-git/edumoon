import { useState } from 'react';

// const Child = (props) => {
//     console.log("Props in Child:", props);
//     return (
//         <div>
//             <h3>Child</h3>
//             <h4>Name: {props.name}</h4>
//         </div>
//     )
// }

// const Child = ({ name, age, hobbies}) => {
//     console.log("Props in Child:", name, age, hobbies);
//     return (
//         <div>
//             <h3>Child</h3>
//             <h4>Name: {name}</h4>
//             <h4>Age: {age}</h4>
//         </div>
//     )
// }

const Child = (props) => {
    // const [ text, setText ] = useState("ABCD"); 
    const { name, age, handleCallBack } = props;
    console.log("Props in Child:", name, age);

    // const handleClick = () => {
    //     console.log("Button clicked in Child");
    //     const isAdult = age >= 18;
    //     handleCallBack({ isAdult, data: { name, age } });
    // }

    const handleClick = () => {
        setText("Some new text");
    }


    return (
        <div>
            {/* <h3>Child</h3>
            <h4>Name: {name}</h4>
            <h4>Age: {age}</h4>
             */}
            {/* <h3>{text}</h3> */}
            {/* <button onClick={handleClick}>Click</button> */}
            <h2 onClick={() => {
                handleCallBack();
            }}>{props.value}</h2>
        </div>
    )
}

export default Child;