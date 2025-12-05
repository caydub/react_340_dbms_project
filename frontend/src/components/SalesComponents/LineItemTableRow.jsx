/* Citations:
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Created line item table row with inline editing
   Summary: Implemented custom table row for line items with inline editing.
            lineItemID not editable. Album name dropdown, price, and quantity are editable.
            Includes update and delete functionality.
   AI Source URL: https://claude.ai/
*/

import { useState, useEffect } from "react";
import LineItemDeleteButton from "./LineItemDeleteButton";
import LineItemUpdateButton from "./LineItemUpdateButton";

const LineItemTableRow = ({ lineItem, backendURL, refreshLineItems }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [albums, setAlbums] = useState([]);
    const [editedValues, setEditedValues] = useState(lineItem);

    // Fetch albums for dropdown when editing
    useEffect(() => {
        if (isEditing) {
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
        }
    }, [isEditing, backendURL]);

    const handleInputChange = (key, value) => {
        setEditedValues(prev => ({
            ...prev,
            [key]: value
        }));

        // Update lineItemTotal when price or quantity changes
        if (key === 'albumPrice' || key === 'quantity') {
            const price = key === 'albumPrice' ? parseFloat(value) : parseFloat(editedValues.albumPrice);
            const qty = key === 'quantity' ? parseInt(value) : parseInt(editedValues.quantity);
            setEditedValues(prev => ({
                ...prev,
                lineItemTotal: (price * qty).toFixed(2)
            }));
        }
    };

    return (
        <tr>
            {/* lineItemID - not editable */}
            <td>{lineItem.lineItemID}</td>

            {/* albumName - editable with dropdown */}
            <td>
                {isEditing ? (
                    <select
                        value={editedValues.albumName}
                        onChange={(e) => handleInputChange("albumName", e.target.value)}
                        style={{ width: '100%' }}
                    >
                        {albums.map(album => (
                            <option key={album.albumID} value={album.albumName}>
                                {album.albumName}
                            </option>
                        ))}
                    </select>
                ) : (
                    lineItem.albumName
                )}
            </td>

            {/* albumPrice - editable */}
            <td>
                {isEditing ? (
                    <input
                        type="number"
                        step="0.01"
                        value={editedValues.albumPrice}
                        onChange={(e) => handleInputChange("albumPrice", e.target.value)}
                        style={{ width: '80px' }}
                    />
                ) : (
                    `$${parseFloat(lineItem.albumPrice).toFixed(2)}`
                )}
            </td>

            {/* quantity - editable */}
            <td>
                {isEditing ? (
                    <input
                        type="number"
                        min="1"
                        value={editedValues.quantity}
                        onChange={(e) => handleInputChange("quantity", e.target.value)}
                        style={{ width: '60px' }}
                    />
                ) : (
                    lineItem.quantity
                )}
            </td>

            {/* lineItemTotal - calculated, not directly editable */}
            <td>
                ${isEditing ? editedValues.lineItemTotal : parseFloat(lineItem.lineItemTotal).toFixed(2)}
            </td>

            <LineItemDeleteButton
                lineItemID={lineItem.lineItemID}
                backendURL={backendURL}
                refreshLineItems={refreshLineItems}
            />
            <LineItemUpdateButton
                lineItemID={lineItem.lineItemID}
                editedValues={editedValues}
                backendURL={backendURL}
                refreshLineItems={refreshLineItems}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                setEditedValues={setEditedValues}
                originalLineItem={lineItem}
            />
        </tr>
    );
};

export default LineItemTableRow;