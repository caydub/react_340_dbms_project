/* Citations:
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Created delete button for Customers entity
   Summary: Implemented delete functionality with confirmation dialog, backend API call to /Customers/delete,
            error handling for foreign key constraints (sales, ratings), and table refresh on successful deletion.
   AI Source URL: https://claude.ai/
*/

const CustomerDeleteButton = ({ customerID, backendURL, refreshCustomers }) => {

    const handleDelete = async (e) => {
        e.preventDefault();

        // Confirm deletion with user
        if (!window.confirm(`Are you sure you want to delete customer ID ${customerID}?`)) {
            return;
        }

        try {
            // Send DELETE request to backend
            const response = await fetch(backendURL + '/Customers/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerID: customerID
                })
            });

            const result = await response.json();

            if (result.success) {
                // Show success message
                alert('Customer deleted successfully!');
                // Refresh the table data
                refreshCustomers();
            } else {
                // Show error message from backend
                alert(`Error: ${result.message}`);
            }

        } catch (error) {
            console.error('Error deleting customer:', error);
            alert('An error occurred while deleting the customer.');
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

export default CustomerDeleteButton;