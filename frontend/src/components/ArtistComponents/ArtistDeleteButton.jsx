/* Citations:
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Created delete button for Artists entity
   Summary: Implemented delete functionality with confirmation dialog, backend API call to /Artists/delete,
            error handling for foreign key constraints (albums), and table refresh on successful deletion.
   AI Source URL: https://claude.ai/
*/

const ArtistDeleteButton = ({ artistID, backendURL, refreshArtists }) => {

    const handleDelete = async (e) => {
        e.preventDefault();

        // Confirm deletion with user
        if (!window.confirm(`Are you sure you want to delete artist "${artistID}"?`)) {
            return;
        }

        try {
            // Send DELETE request to backend
            const response = await fetch(backendURL + '/Artists/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    artistID: artistID
                })
            });

            const result = await response.json();

            if (result.success) {
                // Show success message
                alert('Artist deleted successfully!');
                // Refresh the table data
                refreshArtists();
            } else {
                // Show error message from backend
                alert(`Error: ${result.message}`);
            }

        } catch (error) {
            console.error('Error deleting artist:', error);
            alert('An error occurred while deleting the artist.');
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

export default ArtistDeleteButton;