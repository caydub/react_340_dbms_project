/* Citations:
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Created update button for LineItems entity with inline editing
   Summary: Implemented update functionality with save/cancel buttons, backend API call to /LineItems/update,
            and error handling. Updates albumName, albumPrice, and quantity.
   AI Source URL: https://claude.ai/
*/

const LineItemUpdateButton = ({
    lineItemID,
    backendURL,
    refreshLineItems,
    editedValues,
    setEditedValues,
    isEditing,
    setIsEditing,
    originalLineItem
}) => {
    const handleSave = async () => {
        // Validate required fields
        if (!editedValues.albumName || !editedValues.albumPrice || !editedValues.quantity) {
            alert("All fields are required");
            return;
        }

        try {
            const response = await fetch(`${backendURL}/LineItems/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    lineItemID: lineItemID,
                    albumName: editedValues.albumName,
                    albumPrice: parseFloat(editedValues.albumPrice),
                    quantity: parseInt(editedValues.quantity)
                }),
            });

            const result = await response.json();

            if (result.success) {
                alert('Line item updated successfully!');
                refreshLineItems();
                setIsEditing(false);
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error("Error updating line item:", error);
            alert("An error occurred while updating the line item.");
        }
    };

    const handleCancel = () => {
        setEditedValues(originalLineItem); // reset edits to original values
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

export default LineItemUpdateButton;