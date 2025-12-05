/* Citations:
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Created delete button for AlbumRatings M:N relationship
   Summary: Implemented delete functionality with confirmation dialog, backend API call to /AlbumRatings/delete,
            error handling, and table refresh on successful deletion.
   AI Source URL: https://claude.ai/
*/

const AlbumRatingDeleteButton = ({ albumRatingID, backendURL, refreshAlbumRatings }) => {

    const handleDelete = async (e) => {
        e.preventDefault();

        // Confirm deletion with user
        if (!window.confirm(`Are you sure you want to delete this album rating?`)) {
            return;
        }

        try {
            // Send DELETE request to backend
            const response = await fetch(backendURL + '/AlbumRatings/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    albumRatingID: albumRatingID
                })
            });

            const result = await response.json();

            if (result.success) {
                // Show success message
                alert('Album rating deleted successfully!');
                // Refresh the table data
                refreshAlbumRatings();
            } else {
                // Show error message from backend
                alert(`Error: ${result.message}`);
            }

        } catch (error) {
            console.error('Error deleting album rating:', error);
            alert('An error occurred while deleting the album rating.');
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

export default AlbumRatingDeleteButton;