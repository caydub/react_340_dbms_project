/* Citations:
   
   Source: CS340 Modules/Explorations
   Date: November 2025
   Purpose: Form structure and state management patterns
   Summary: Base form structure adapted from CS340 starter code.
   Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Created functional AlbumRatings form with dropdowns for M:N relationship
   Summary: Implemented create form with Albums dropdown, Customers dropdown, and rating selection.
            Handles fetching data for dropdowns and submitting to backend.
   AI Source URL: https://claude.ai/
*/

import { useState, useEffect } from 'react';

const CreateAlbumRatingsForm = ({ backendURL, refreshAlbumRatings }) => {
    const [albums, setAlbums] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({
        albumName: '',
        firstName: '',
        lastName: '',
        albumRating: ''
    });

    // Fetch albums for dropdown
    useEffect(() => {
        async function fetchAlbums() {
            try {
                const response = await fetch(`${backendURL}/Albums`);
                const data = await response.json();
                setAlbums(data.albums || []);
            } catch (error) {
                console.error("Failed to fetch Albums", error);
            }
        }
        fetchAlbums();
    }, [backendURL]);

    // Fetch customers for dropdown
    useEffect(() => {
        async function fetchCustomers() {
            try {
                const response = await fetch(`${backendURL}/Customers`);
                const data = await response.json();
                setCustomers(data.customers || []);
            } catch (error) {
                console.error("Failed to fetch Customers", error);
            }
        }
        fetchCustomers();
    }, [backendURL]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCustomerChange = (e) => {
        const selectedCustomer = e.target.value;
        if (selectedCustomer) {
            const [firstName, lastName] = selectedCustomer.split('|');
            setFormData(prev => ({
                ...prev,
                firstName: firstName,
                lastName: lastName
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                firstName: '',
                lastName: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.albumName || !formData.firstName || !formData.lastName || !formData.albumRating) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const response = await fetch(`${backendURL}/AlbumRatings/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    albumName: formData.albumName,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    albumRating: parseFloat(formData.albumRating)
                })
            });

            const result = await response.json();

            if (result.success) {
                alert(`Album rating created successfully! ID: ${result.new_albumRatingID}`);
                refreshAlbumRatings(); // Refresh the table
                // Reset form
                setFormData({
                    albumName: '',
                    firstName: '',
                    lastName: '',
                    albumRating: ''
                });
            } else {
                alert(`Error: ${result.message}`);
            }

        } catch (error) {
            console.error("Error creating album rating:", error);
            alert("An error occurred while creating the album rating");
        }
    };

    return (
        <>
            <h2>Create an Album Rating</h2>

            <form className='cuForm' onSubmit={handleSubmit}>
                <label htmlFor="albumName">Album: </label>
                <select
                    name="albumName"
                    id="albumName"
                    value={formData.albumName}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select an Album</option>
                    {albums.map((album) => (
                        <option key={album.albumID} value={album.albumName}>
                            {album.albumName}
                        </option>
                    ))}
                </select>

                <label htmlFor="customer">Customer: </label>
                <select
                    name="customer"
                    id="customer"
                    value={formData.firstName && formData.lastName ? `${formData.firstName}|${formData.lastName}` : ''}
                    onChange={handleCustomerChange}
                    required
                >
                    <option value="">Select a Customer</option>
                    {customers.map((customer) => (
                        <option
                            key={customer.customerID}
                            value={`${customer.firstName}|${customer.lastName}`}
                        >
                            {customer.customer}
                        </option>
                    ))}
                </select>

                <label htmlFor="albumRating">Rating: </label>
                <select
                    name="albumRating"
                    id="albumRating"
                    value={formData.albumRating}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select a Rating</option>
                    <option value="0.0">0.0</option>
                    <option value="0.5">0.5</option>
                    <option value="1.0">1.0</option>
                    <option value="1.5">1.5</option>
                    <option value="2.0">2.0</option>
                    <option value="2.5">2.5</option>
                    <option value="3.0">3.0</option>
                    <option value="3.5">3.5</option>
                    <option value="4.0">4.0</option>
                    <option value="4.5">4.5</option>
                    <option value="5.0">5.0</option>
                </select>

                <input type="submit" value="Create Album Rating" />
            </form>
        </>
    );
};

export default CreateAlbumRatingsForm;