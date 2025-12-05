/* Citations:
   
   Source: CS340 Modules/Explorations
   Date: November 2025
   Purpose: Update button pattern for inline editing
   Summary: Base update button structure adapted from CS340 starter code.
   Source URL: https://canvas.oregonstate.edu/courses/2017561
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Created update button for Artists entity with inline editing
   Summary: Implemented update functionality with save/cancel buttons, backend API call to /Artists/update,
            and error handling. Only updates description field (artistID is PK and not editable).
   AI Source URL: https://claude.ai/
*/

const ArtistUpdateButton = ({
    artistID,
    backendURL,
    refreshArtists,
    editedValues,
    setEditedValues,
    isEditing,
    setIsEditing,
    originalArtist
}) => {
    const handleSave = async () => {
        try {
            const response = await fetch(`${backendURL}/Artists/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    artistID: artistID,
                    description: editedValues.description
                }),
            });

            const result = await response.json();

            if (result.success) {
                alert('Artist updated successfully!');
                refreshArtists();
                setIsEditing(false);
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error("Error updating artist:", error);
            alert("An error occurred while updating the artist.");
        }
    };

    const handleCancel = () => {
        setEditedValues(originalArtist); // reset edits to original values
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

export default ArtistUpdateButton;