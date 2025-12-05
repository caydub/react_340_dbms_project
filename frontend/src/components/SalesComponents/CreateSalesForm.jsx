/* Citations:
   
   Source: CS340 Modules/Explorations
   Date: November 2025
   Purpose: Form structure and state management patterns
   Summary: Base form structure adapted from CS340 starter code.
   Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Created dynamic form for Sales with line items
   Summary: Implemented form with dynamic line item rows (add/remove), album dropdown fetching,
            and submission to transactional stored procedure.
   AI Source URL: https://claude.ai/
*/

import React, { useEffect, useState } from 'react';

const CreateSalesForm = ({ backendURL, refreshSales }) => {
    // Customer info state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        purchaseDate: ''
    });

    // Line items state - start with one empty line item
    const [lineItems, setLineItems] = useState([
        { albumName: '', albumPrice: '', quantity: 1 }
    ]);

    // Albums for dropdown
    const [albums, setAlbums] = useState([]);

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

    // Handle customer info changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle line item changes
    const handleLineItemChange = (index, field, value) => {
        const updatedLineItems = [...lineItems];
        updatedLineItems[index][field] = value;

        // If album is selected, auto-fill the price
        if (field === 'albumName') {
            const selectedAlbum = albums.find(album => album.albumName === value);
            if (selectedAlbum) {
                updatedLineItems[index].albumPrice = selectedAlbum.albumPrice;
            }
        }

        setLineItems(updatedLineItems);
    };

    // Add new line item
    const addLineItem = () => {
        setLineItems([...lineItems, { albumName: '', albumPrice: '', quantity: 1 }]);
    };

    // Remove line item
    const removeLineItem = (index) => {
        if (lineItems.length > 1) {
            const updatedLineItems = lineItems.filter((_, i) => i !== index);
            setLineItems(updatedLineItems);
        } else {
            alert("At least one line item is required");
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate line items
        for (let i = 0; i < lineItems.length; i++) {
            if (!lineItems[i].albumName || !lineItems[i].albumPrice || !lineItems[i].quantity) {
                alert(`Please complete all fields for line item ${i + 1}`);
                return;
            }
        }

        try {
            const response = await fetch(`${backendURL}/Sales/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    purchaseDate: formData.purchaseDate,
                    lineItems: lineItems.map(item => ({
                        albumName: item.albumName,
                        albumPrice: parseFloat(item.albumPrice),
                        quantity: parseInt(item.quantity)
                    }))
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                console.log("Sale created successfully:", result.new_salesID);
                alert(`Sale created successfully! Sale ID: ${result.new_salesID}`);
                refreshSales();
                // Reset form
                setFormData({ firstName: '', lastName: '', purchaseDate: '' });
                setLineItems([{ albumName: '', albumPrice: '', quantity: 1 }]);
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error during sale creation:', error);
            alert('An error occurred while creating the sale.');
        }
    };

    return (
        <>
            <h2>Create a Sale</h2>

            <form className='cuForm' onSubmit={handleSubmit}>
                <label htmlFor="firstName">Customer First Name: </label>
                <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="lastName">Customer Last Name: </label>
                <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="purchaseDate">Sale Date: </label>
                <input
                    type="date"
                    name="purchaseDate"
                    id="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    required
                />

                <div style={{ width: '100%', marginTop: '20px' }}>
                    <h3>Line Items</h3>
                    {lineItems.map((item, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                            marginBottom: '10px',
                            padding: '10px',
                            backgroundColor: 'rgba(255, 0, 255, 0.1)',
                            borderRadius: '4px'
                        }}>
                            <label>Album:</label>
                            <select
                                value={item.albumName}
                                onChange={(e) => handleLineItemChange(index, 'albumName', e.target.value)}
                                required
                            >
                                <option value="">Select Album</option>
                                {albums.map((album) => (
                                    <option key={album.albumID} value={album.albumName}>
                                        {album.albumName}
                                    </option>
                                ))}
                            </select>

                            <label>Price:</label>
                            <input
                                type="number"
                                step="0.01"
                                value={item.albumPrice}
                                onChange={(e) => handleLineItemChange(index, 'albumPrice', e.target.value)}
                                required
                                style={{ width: '80px' }}
                            />

                            <label>Quantity:</label>
                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                                required
                                style={{ width: '60px' }}
                            />

                            {lineItems.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeLineItem(index)}
                                    style={{ marginLeft: '10px' }}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addLineItem}
                        style={{ marginTop: '10px' }}
                    >
                        + Add Line Item
                    </button>
                </div>

                <input type="submit" value="Create Sale" style={{ marginTop: '20px' }} />
            </form>
        </>
    );
};

export default CreateSalesForm;