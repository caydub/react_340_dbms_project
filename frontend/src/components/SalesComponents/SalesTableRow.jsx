/* Citations:
   
   Source: CS340 Modules/Explorations
   Date: November 2025
   Purpose: Inline expansion pattern for nested data and inline editing pattern
   Summary: Base expansion and editing structures adapted from CS340 starter code.
   Source URL: https://canvas.oregonstate.edu/courses/2017561
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Implements inline expansion with full CRUD for line items AND inline editing for sale record
   Summary: Added state management for both sale editing and line items CRUD.
            Sales can be edited inline (customer, totalCost, purchaseDate).
            Line items can be managed (CREATE, UPDATE, DELETE) within the expanded sale view.
            Added useEffect to sync editedSale with rowObject updates after refresh.
   AI Source URL: https://claude.ai/
*/

import { useState, useEffect } from 'react';
import LineItemsButton from './LineItemsButton';
import LineItemTableRow from './LineItemTableRow';
import CreateLineItemForm from './CreateLineItemForm';
import SalesUpdateButton from './SalesUpdateButton';

const SalesTableRow = ({ rowObject, backendURL, refreshRows }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [lineItems, setLineItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // State for editing the sale record itself
    const [isEditingSale, setIsEditingSale] = useState(false);
    const [editedSale, setEditedSale] = useState(rowObject);

    // Sync editedSale with rowObject when it changes (after refresh)
    useEffect(() => {
        setEditedSale(rowObject);
    }, [rowObject]);

    const fetchLineItems = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${backendURL}/Sales/${rowObject.salesID}/lineitems`);
            const data = await response.json();
            setLineItems(data.lineItems || []);
        } catch (error) {
            console.error('Error fetching line items:', error);
            alert('Failed to load line items. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggle = async () => {
        if (!isExpanded) {
            // Fetch line items when expanding
            await fetchLineItems();
        }
        setIsExpanded(!isExpanded);
    };

    const handleInputChange = (key, value) => {
        setEditedSale(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <>
            <tr>
                {/* salesID - not editable */}
                <td>{rowObject.salesID}</td>

                {/* customer - editable text input (full name) */}
                <td>
                    {isEditingSale ? (
                        <input
                            type="text"
                            value={editedSale.customer || ''}
                            onChange={(e) => handleInputChange("customer", e.target.value)}
                            placeholder="First Last"
                            style={{ width: '100%' }}
                        />
                    ) : (
                        rowObject.customer
                    )}
                </td>

                {/* totalCost - editable */}
                <td>
                    {isEditingSale ? (
                        <input
                            type="number"
                            step="0.01"
                            value={editedSale.totalCost}
                            onChange={(e) => handleInputChange("totalCost", e.target.value)}
                            style={{ width: '100px' }}
                        />
                    ) : (
                        `$${parseFloat(rowObject.totalCost).toFixed(2)}`
                    )}
                </td>

                {/* purchaseDate - editable */}
                <td>
                    {isEditingSale ? (
                        <input
                            type="date"
                            value={editedSale.purchaseDate}
                            onChange={(e) => handleInputChange("purchaseDate", e.target.value)}
                            style={{ width: '150px' }}
                        />
                    ) : (
                        rowObject.purchaseDate
                    )}
                </td>

                <LineItemsButton isExpanded={isExpanded} onToggle={handleToggle} />

                <SalesUpdateButton
                    salesID={rowObject.salesID}
                    editedValues={editedSale}
                    backendURL={backendURL}
                    refreshSales={refreshRows}
                    isEditing={isEditingSale}
                    setIsEditing={setIsEditingSale}
                    setEditedValues={setEditedSale}
                    originalSale={rowObject}
                />
            </tr>

            {isExpanded && (
                <tr>
                    <td colSpan={Object.keys(rowObject).length + 2} style={{ padding: '0' }}>
                        <div className="expanded-line-items">
                            {isLoading ? (
                                <p>Loading line items...</p>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>lineItemID</th>
                                            <th>albumName</th>
                                            <th>albumPrice</th>
                                            <th>quantity</th>
                                            <th>lineItemTotal</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lineItems.length > 0 ? (
                                            lineItems.map((item) => (
                                                <LineItemTableRow
                                                    key={item.lineItemID}
                                                    lineItem={item}
                                                    backendURL={backendURL}
                                                    refreshLineItems={fetchLineItems}
                                                />
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" style={{ textAlign: 'center', padding: '10px' }}>
                                                    No line items found for this sale.
                                                </td>
                                            </tr>
                                        )}
                                        <CreateLineItemForm
                                            salesID={rowObject.salesID}
                                            backendURL={backendURL}
                                            refreshLineItems={fetchLineItems}
                                        />
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

export default SalesTableRow;