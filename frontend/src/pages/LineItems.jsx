/* Citations:
   
   Source: CS340 Modules/Explorations
   Date: November 2025
   Purpose: Page structure and data fetching patterns
   Summary: Base page structure adapted from CS340 starter code.
   Source URL: https://canvas.oregonstate.edu/courses/2017561
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Created READ-only LineItems page
   Summary: Displays all line items from the database without CRUD operations (READ only).
   AI Source URL: https://claude.ai/
*/

import { useState, useEffect } from 'react';
import NakedTableRow from '../components/NakedTableRow';

function LineItems({ backendURL }) {

    // Set up a state variable to store and display the backend response
    const [lineItems, setLineItems] = useState([]);

    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/LineItems');

            // Convert the response into JSON format
            const { lineItems } = await response.json();

            // Update the state with the response data
            setLineItems(lineItems);

        } catch (error) {
            // If the API call fails, print the error to the console
            console.log(error);
        }

    };

    // Load table on page load
    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <h1>All Line Items</h1>

            <table>
                <thead>
                    <tr>
                        {lineItems.length > 0 && Object.keys(lineItems[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {lineItems.map((lineItem, index) => (
                        <NakedTableRow key={index} rowObject={lineItem} />
                    ))}
                </tbody>
            </table>
        </>
    );

}

export default LineItems;