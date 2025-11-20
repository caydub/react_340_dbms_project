// Citation for use of AI Tools:
// AI Model: Claude 3.5 Sonnet
// Date: 11/20/2024
// Used to create delete functionality for albums. Generated AlbumDeleteButton.jsx
// component from GenericDeleteButton with fetch request to backend /Albums/delete
// route, confirmation dialog,
// error handling, and table refresh on successful deletion.
// AI Source URL: https://claude.ai/

const AlbumDeleteButton = ({ rowObject, backendURL, refreshRows }) => {

    const handleDelete = async (e) => {
        e.preventDefault();

        // Confirm deletion with user
        const albumName = rowObject.albumName || 'this album';
        if (!window.confirm(`Are you sure you want to delete ${albumName}?`)) {
            return;
        }

        try {
            // Send DELETE request to backend
            const response = await fetch(backendURL + '/Albums/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    albumID: rowObject.albumID,
                    albumName: rowObject.albumName
                })
            });

            const result = await response.json();

            if (result.success) {
                // Show success message
                alert('Album deleted successfully!');
                // Refresh the table data
                refreshRows();
            } else {
                // Show error message from backend
                alert(`Error: ${result.message}`);
            }

        } catch (error) {
            console.error('Error deleting album:', error);
            alert('An error occurred while deleting the album.');
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

export default AlbumDeleteButton;