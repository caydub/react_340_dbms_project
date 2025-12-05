/* Citations:
   
   Source: CS340 Modules/Explorations
   Date: November 2025
   Purpose: Form structure and state management patterns
   Summary: Base form structure adapted from CS340 starter code.
   Source URL: https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Made CreateAlbumForm functional with state management and backend integration
   Summary: Implemented state management, form validation, genre dropdown, and submit handler that calls /Albums/create endpoint.
   AI Source URL: https://claude.ai/
*/

import React, { useEffect, useState } from 'react';

const CreateAlbumForm = ({ backendURL, refreshAlbums }) => {
    const [formData, setFormData] = useState({
        albumName: '',
        albumPrice: '',
        amountInStock: '',
        artistID: '',
        genreID: ''
    });

    const [genres, setGenres] = useState([]);

    useEffect(() => {
        async function fetchGenres() {
            try {
                const response = await fetch(`${backendURL}/Genres`);
                const data = await response.json();
                setGenres(data.genres || []);
            } catch (error) {
                console.error("Failed to fetch Genres", error);
            }
        }
        fetchGenres();
    }, [backendURL]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            const response = await fetch(`${backendURL}/Albums/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    albumName: formData.albumName,
                    albumPrice: parseFloat(formData.albumPrice),
                    amountInStock: parseInt(formData.amountInStock),
                    artistID: formData.artistID,
                    genreID: formData.genreID
                }),
            });

            if (response.ok) {
                console.log("Album created successfully.");
                refreshAlbums();
                // Reset form
                setFormData({
                    albumName: '',
                    albumPrice: '',
                    amountInStock: '',
                    artistID: '',
                    genreID: ''
                });
            } else {
                console.error("Error creating album.");
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    return (
        <>
            <h2>Create an Album</h2>

            <form className='cuForm' onSubmit={handleSubmit}>
                <label htmlFor="albumName">Album Name: </label>
                <input
                    type="text"
                    name="albumName"
                    id="albumName"
                    value={formData.albumName}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="albumPrice">Price: </label>
                <input
                    type="number"
                    step="0.01"
                    name="albumPrice"
                    id="albumPrice"
                    value={formData.albumPrice}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="amountInStock">Amount in Stock: </label>
                <input
                    type="number"
                    name="amountInStock"
                    id="amountInStock"
                    value={formData.amountInStock}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="artistID">Artist: </label>
                <input
                    type="text"
                    name="artistID"
                    id="artistID"
                    value={formData.artistID}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="genreID">Genre: </label>
                <select
                    name="genreID"
                    id="genreID"
                    value={formData.genreID}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a Genre</option>
                    {genres.map((genre) => (
                        <option value={genre.genreID} key={genre.genreID}>
                            {genre.genreID}
                        </option>
                    ))}
                </select>

                <input type="submit" value="Create Album" />
            </form>
        </>
    );
};

export default CreateAlbumForm;