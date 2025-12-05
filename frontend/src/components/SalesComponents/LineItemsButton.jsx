// Citation for use of AI Tools:
// AI Model: Claude 3.5 Sonnet
// Date: 12/04/2025
// Purpose: Updated button to toggle line items expansion
// Summary: Converted placeholder button into functional toggle for inline expansion.
// AI Source URL: https://claude.ai/

const LineItemsButton = ({ isExpanded, onToggle }) => {
    return (
        <td>
            <button onClick={onToggle} type='button'>
                {isExpanded ? 'Hide Line Items' : 'Show Line Items'}
            </button>
        </td>
    );
};

export default LineItemsButton;