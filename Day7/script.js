async function fetchData() {
    try {
        // const response = await fetch('https://wttr.in/Vizag?format=j1');
        const response = await fetch('https://asdasdasdasd.in/Vizag?format=j1');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // const data = await response.json(); // Parse JSON data
        const data = await response.json(); // Parse JSON data
        console.log("Data fetched successfully:", data);
        return data;
    }
    catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return [];
    }
}

debugger
console.log("Fetching data...");
console.log(fetchData());