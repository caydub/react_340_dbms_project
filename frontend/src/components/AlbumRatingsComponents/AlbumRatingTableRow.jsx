/* Citations:
   
   Source: CS340 Modules/Explorations
   Date: November 2025
   Purpose: Table row component with inline editing pattern
   Summary: Base table row structure adapted from CS340 starter code.
   Source URL: https://canvas.oregonstate.edu/courses/2017561
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Created AlbumRatingTableRow with inline editing and dropdowns for M:N relationship
   Summary: Implemented custom table row with inline editing that includes dropdowns for Albums and Customers,
            and rating selector for the M:N AlbumRatings entity.
   AI Source URL: https://claude.ai/
*/

import { useState, useEffect } from "react";
import AlbumRatingDeleteButton from "./AlbumRatingDeleteButton";
import AlbumRatingUpdateButton from "./AlbumRatingUpdateButton";

const AlbumRatingTableRow = ({ rating, backendURL, refreshAlbumRatings }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedValues, setEditedValues] = useState(rating);
    const [albums, setAlbums] = useState([]);
    const [customers, setCustomers] = useState([]);

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

    const handleInputChange = (key, value) => {
        setEditedValues(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <tr>
            {/* albumRatingID - not editable */}
            <td>{rating.albumRatingID}</td>

            {/* albumRating - rating dropdown 0.0-5.0 */}
            <td>
                {isEditing ? (
                    <select
                        name="albumRating"
                        value={editedValues.albumRating}
                        onChange={(e) => handleInputChange("albumRating", e.target.value)}
                    >
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
                ) : (
                    rating.albumRating
                )}
            </td>

            {/* albumName - dropdown when editing */}
            <td>
                {isEditing ? (
                    <select
                        name="albumName"
                        value={editedValues.albumName}
                        onChange={(e) => handleInputChange("albumName", e.target.value)}
                    >
                        <option value="">Select Album</option>
                        {albums.map((album) => (
                            <option key={album.albumID} value={album.albumName}>
                                {album.albumName}
                            </option>
                        ))}
                    </select>
                ) : (
                    rating.albumName
                )}
            </td>

            {/* customer - dropdown when editing */}
            <td>
                {isEditing ? (
                    <select
                        name="customer"
                        value={editedValues.customer}
                        onChange={(e) => handleInputChange("customer", e.target.value)}
                    >
                        <option value="">Select Customer</option>
                        {customers.map((cust) => (
                            <option key={cust.customerID} value={cust.customer}>
                                {cust.customer}
                            </option>
                        ))}
                    </select>
                ) : (
                    rating.customer
                )}
            </td>

            <AlbumRatingDeleteButton
                albumRatingID={rating.albumRatingID}
                backendURL={backendURL}
                refreshAlbumRatings={refreshAlbumRatings}
            />
            <AlbumRatingUpdateButton
                albumRatingID={rating.albumRatingID}
                editedValues={editedValues}
                backendURL={backendURL}
                refreshAlbumRatings={refreshAlbumRatings}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                setEditedValues={setEditedValues}
                originalRating={rating}
            />
        </tr>
    );
};

export default AlbumRatingTableRow;