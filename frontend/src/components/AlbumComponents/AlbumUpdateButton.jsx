/* Citations:
   
   Source: CS340 Modules/Explorations
   Date: November 2025
   Purpose: Update button pattern for inline editing
   Summary: Base update button structure adapted from CS340 starter code.
   Source URL: https://canvas.oregonstate.edu/courses/2017561
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Created update button for Albums entity with inline editing
   Summary: Implemented update functionality with save/cancel buttons, backend API call to /Albums/update,
            and error handling. Updates albumName, albumPrice, amountInStock, artistID, and genreID.
   AI Source URL: https://claude.ai/
*/

const AlbumUpdateButton = ({ album, backendURL, refreshRows, editedValues, setEditedValues, isEditing, setIsEditing, genres }) => {
    const handleSave = async () => {
        try {
            const response = await fetch(`${backendURL}/Albums/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    albumID: editedValues.albumID,
                    albumName: editedValues.albumName,
                    albumPrice: parseFloat(editedValues.albumPrice),
                    amountInStock: parseInt(editedValues.amountInStock),
                    artistID: editedValues.artistID,
                    genreID: editedValues.genreID
                }),
            });

            if (response.ok) {
                console.log(`Album updated successfully.`);
                refreshRows();
                setIsEditing(false);
            } else {
                alert(`Error updating album`);
            }
        } catch (error) {
            console.error("Error updating album:", error);
            alert("An error occurred while updating the album.");
        }
    };

    const handleCancel = () => {
        setEditedValues(album); // reset edits
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

export default AlbumUpdateButton;