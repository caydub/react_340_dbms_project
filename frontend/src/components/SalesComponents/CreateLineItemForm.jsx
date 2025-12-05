/* Citations:
   
   Source: CS340 Modules/Explorations
   Date: November 2025
   Purpose: Form structure and state management patterns
   Summary: Base form structure adapted from CS340 starter code.
   Source URL: https://canvas.oregonstate.edu/courses/2017561
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Created form for adding line items to a specific sale
   Summary: Implemented inline form with album dropdown, price, and quantity fields.
            Calls /LineItems/create endpoint for the specified salesID.
   AI Source URL: https://claude.ai/
*/

import { useState, useEffect } from 'react';

const CreateLineItemForm = ({ salesID, backendURL, refreshLineItems }) => {
    const [albums, setAlbums] = useState([]);
    const [formData, setFormData] = useState({
        albumName: '',
        albumPrice: '',
        quantity: 1
    });

    // Fetch albums for dropdown
    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await fetch(`${backendURL}/Albums`);
                const data = await response.json();
                setAlbums(data.albums || []);
            } catch (error) {
                console.error("Error fetching albums:", error);
            }
        };
        fetchAlbums();
    }, [backendURL]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto-populate price when album is selected
        if (name === 'albumName') {
            const selectedAlbum = albums.find(a => a.albumName === value);
            if (selectedAlbum) {
                setFormData(prev => ({
                    ...prev,
                    albumPrice: selectedAlbum.albumPrice
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.albumName || !formData.albumPrice || !formData.quantity) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const response = await fetch(`${backendURL}/LineItems/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    salesID: salesID,
                    albumName: formData.albumName,
                    albumPrice: parseFloat(formData.albumPrice),
                    quantity: parseInt(formData.quantity)
                })
            });

            const result = await response.json();

            if (result.success) {
                alert('Line item added successfully!');
                refreshLineItems();
                // Reset form
                setFormData({
                    albumName: '',
                    albumPrice: '',
                    quantity: 1
                });
            } else {
                alert(`Error: ${result.message}`);
            }

        } catch (error) {
            console.error("Error creating line item:", error);
            alert("An error occurred while adding the line item");
        }
    };

    return (
        <tr style={{ backgroundColor: '#2a2a2a' }}>
            <td colSpan="6">
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px' }}>
                    <strong>Add Item:</strong>

                    <select
                        name="albumName"
                        value={formData.albumName}
                        onChange={handleInputChange}
                        required
                        style={{ flex: 1 }}
                    >
                        <option value="">Select Album</option>
                        {albums.map(album => (
                            <option key={album.albumID} value={album.albumName}>
                                {album.albumName}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        name="albumPrice"
                        value={formData.albumPrice}
                        onChange={handleInputChange}
                        placeholder="Price"
                        step="0.01"
                        required
                        style={{ width: '80px' }}
                    />

                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        placeholder="Qty"
                        min="1"
                        required
                        style={{ width: '60px' }}
                    />

                    <button type="submit">Add</button>
                </form>
            </td>
        </tr>
    );
};

export default CreateLineItemForm;