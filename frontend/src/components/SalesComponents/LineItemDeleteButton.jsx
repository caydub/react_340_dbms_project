/* Citations:
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Created delete button for LineItems entity
   Summary: Implemented delete functionality with confirmation dialog, backend API call to /LineItems/delete,
            and table refresh on successful deletion.
   AI Source URL: https://claude.ai/
*/

const LineItemDeleteButton = ({ lineItemID, backendURL, refreshLineItems }) => {

    const handleDelete = async (e) => {
        e.preventDefault();

        // Confirm deletion with user
        if (!window.confirm(`Are you sure you want to delete line item ID ${lineItemID}?`)) {
            return;
        }

        try {
            // Send DELETE request to backend
            const response = await fetch(backendURL + '/LineItems/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lineItemID: lineItemID
                })
            });

            const result = await response.json();

            if (result.success) {
                // Show success message
                alert('Line item deleted successfully!');
                // Refresh the line items
                refreshLineItems();
            } else {
                // Show error message from backend
                alert(`Error: ${result.message}`);
            }

        } catch (error) {
            console.error('Error deleting line item:', error);
            alert('An error occurred while deleting the line item.');
        }
    };

    return (
        <td>
            <form onSubmit={handleDelete}>
                <button type='submit'>
                    Delete
                </button>
            </form>
        </td>
    );
};

export default LineItemDeleteButton;