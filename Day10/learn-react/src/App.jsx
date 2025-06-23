import Child from "./Child";
import { useState } from 'react';
import UseEffectExample from "./UseEffectExample";
import UseCallbackExample from "./UseCallbackExample";


function App() {
  const name = "React";
  const [value, setValue] = useState("Hello World");

  return (
    <>
      {/* <p>We can write html here.</p>
      <h3>{name}</h3> */}
      {/* <Child
        value={value}
        name={'FirstChild'}
        age={20}
        hobbies={["painting", "singing"]}
        handleCallBack={(data) => {
          console.log("Callback function called", data);
          setValue("New Value from Parent");
        }}
      /> */}
      {/* <Child/>
      <Child/>
      <Child/>
      <Child/> */}
      {/* <h1>Parent</h1> */}
      {/* <UseEffectExample data={value}/>
      <button onClick={() => setValue(Date.now())}>Click</button> */}
      <UseCallbackExample />
    </>
  )
}

export default App
