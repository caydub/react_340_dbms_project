/* Citations:
   
   Source: CS340 Modules/Explorations
   Date: November 2025
   Purpose: Update button pattern for inline editing
   Summary: Base update button structure adapted from CS340 starter code.
   Source URL: https://canvas.oregonstate.edu/courses/2017561
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Created update button for AlbumRatings M:N relationship with inline editing
   Summary: Implemented update functionality with save/cancel buttons, backend API call to /AlbumRatings/update,
            proper data formatting for stored procedure, and error handling.
   AI Source URL: https://claude.ai/
*/

const AlbumRatingUpdateButton = ({
    albumRatingID,
    backendURL,
    refreshAlbumRatings,
    editedValues,
    setEditedValues,
    isEditing,
    setIsEditing,
    originalRating
}) => {
    const handleSave = async () => {
        try {
            const response = await fetch(`${backendURL}/AlbumRatings/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    albumRatingID: albumRatingID,
                    albumName: editedValues.albumName,
                    customerFullName: editedValues.customer, // Full name from dropdown
                    albumRating: parseFloat(editedValues.albumRating)
                }),
            });

            const result = await response.json();

            if (result.success) {
                alert('Album rating updated successfully!');
                refreshAlbumRatings();
                setIsEditing(false);
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error("Error updating album rating:", error);
            alert("An error occurred while updating the album rating.");
        }
    };

    const handleCancel = () => {
        setEditedValues(originalRating); // reset edits to original values
        setIsEditing(false);
    };

    return (
        <td>
            {isEditing ? (
                <>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel} style={{ marginLeft: "5px" }}>Cancel</button>
                </>
            ) : (
                <button onClick={() => setIsEditing(true)}>Update</button>
            )}
        </td>
    );
};

export default AlbumRatingUpdateButton;