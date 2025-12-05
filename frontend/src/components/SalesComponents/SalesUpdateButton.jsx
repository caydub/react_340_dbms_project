/* Citations:
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Created update button for Sales entity with inline editing
   Summary: Implemented update functionality with save/cancel buttons, backend API call to /Sales/update,
            and error handling. Updates customer (parsed from full name - can be empty or '<customer deleted>'), 
            totalCost, and purchaseDate. Allows NULL customer.
   AI Source URL: https://claude.ai/
*/

const SalesUpdateButton = ({
    salesID,
    backendURL,
    refreshSales,
    editedValues,
    setEditedValues,
    isEditing,
    setIsEditing,
    originalSale
}) => {
    const handleSave = async () => {
        // Validate required fields (customer can be empty/NULL)
        if (!editedValues.totalCost || !editedValues.purchaseDate) {
            alert("Total cost and purchase date are required");
            return;
        }

        try {
            const response = await fetch(`${backendURL}/Sales/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    salesID: salesID,
                    customerFullName: editedValues.customer || null,
                    totalCost: parseFloat(editedValues.totalCost),
                    purchaseDate: editedValues.purchaseDate
                }),
            });

            const result = await response.json();

            if (result.success) {
                setIsEditing(false); // Close edit mode first
                alert('Sale updated successfully!');
                try {
                    await refreshSales(); // Refresh the table
                } catch (refreshError) {
                    console.error('Error refreshing sales:', refreshError);
                    // Don't show another alert, update was successful
                }
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error("Error updating sale:", error);
            alert("An error occurred while updating the sale.");
        }
    };

    const handleCancel = () => {
        setEditedValues(originalSale); // reset edits to original values
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

export default SalesUpdateButton;