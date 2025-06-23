import React from "react";
import axios from "axios";

export const Api = () => {
    const [results, setResults] = React.useState([]);

    const fetchData = (key) => {
        axios
            .get(`https://wttr.in/${key}?format=j1`)
            .then(response => {
                console.log(response.data);
                setResults(response.data.current_condition);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    React.useEffect(() => {
        if (!results.length) {
            fetchData('Hyderabad');
        }
    }, []);

    return (
        <>
            <h1>API</h1>
            <p>Feels like C: {results?.[0]?.FeelsLikeC}</p>
            <p>Feels like F: {results?.[0]?.FeelsLikeF}</p>
            <p>Time: {results?.[0]?.localObsDateTime}</p>
        </>
    )
}