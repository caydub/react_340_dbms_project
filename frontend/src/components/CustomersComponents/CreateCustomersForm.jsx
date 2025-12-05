/* Citations:
   
   Source: CS340 Modules/Explorations
   Date: November 2025
   Purpose: Form structure and state management patterns
   Summary: Base form structure adapted from CS340 starter code.
   Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Made CreateCustomersForm functional with state management and backend integration
   Summary: Implemented state management, form validation, and submit handler that calls /Customers/create endpoint.
            Phone and email are optional fields.
   AI Source URL: https://claude.ai/
*/

import { useState } from 'react';

const CreateCustomersForm = ({ backendURL, refreshCustomers }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields (firstName and lastName are required)
        if (!formData.firstName || !formData.lastName) {
            alert("Please fill in first name and last name");
            return;
        }

        try {
            const response = await fetch(`${backendURL}/Customers/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phoneNumber: formData.phoneNumber || null,
                    email: formData.email || null
                })
            });

            const result = await response.json();

            if (result.success) {
                alert(`Customer created successfully! ID: ${result.new_customerID}`);
                refreshCustomers(); // Refresh the table
                // Reset form
                setFormData({
                    firstName: '',
                    lastName: '',
                    phoneNumber: '',
                    email: ''
                });
            } else {
                alert(`Error: ${result.message}`);
            }

        } catch (error) {
            console.error("Error creating customer:", error);
            alert("An error occurred while creating the customer");
        }
    };

    return (
        <>
            <h2>Create a Customer</h2>

            <form className='cuForm' onSubmit={handleSubmit}>
                <label htmlFor="firstName">First Name: </label>
                <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                />

                <label htmlFor="lastName">Last Name: </label>
                <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                />

                <label htmlFor="phoneNumber">Phone Number: </label>
                <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Optional"
                />

                <label htmlFor="email">Email: </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Optional"
                />

                <input type="submit" value="Create Customer" />
            </form>
        </>
    );
};

export default CreateCustomersForm;