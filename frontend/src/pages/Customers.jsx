/* Citations:
   
   Source: CS340 Modules/Explorations
   Date: November 2025
   Purpose: Page structure and data fetching patterns
   Summary: Base page structure adapted from CS340 starter code.
   Source URL: https://canvas.oregonstate.edu/courses/2017561
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Updated Customers page to use custom table row component
   Summary: Implemented Customers page with CustomerTableRow for inline editing,
            supporting full CRUD operations.
   AI Source URL: https://claude.ai/
*/

import { useState, useEffect } from 'react';
import CustomerTableRow from '../components/CustomersComponents/CustomerTableRow.jsx';
import CreateCustomersForm from '../components/CustomersComponents/CreateCustomersForm';

function Customers({ backendURL }) {

    // Set up a state variable `customers` to store and display the backend response
    const [customers, setCustomers] = useState([]);

    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/Customers');

            // Convert the response into JSON format
            const { customers } = await response.json();

            // Update the customers state with the response data
            setCustomers(customers);

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
            <h1>Customers</h1>

            <table>
                <thead>
                    <tr>
                        {customers.length > 0 && Object.keys(customers[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {customers.map((customer, index) => (
                        <CustomerTableRow
                            key={index}
                            customer={customer}
                            backendURL={backendURL}
                            refreshCustomers={getData}
                        />
                    ))}

                </tbody>
            </table>

            <CreateCustomersForm backendURL={backendURL} refreshCustomers={getData} />
        </>
    );

}

export default Customers;