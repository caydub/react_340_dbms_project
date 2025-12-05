/* Citations:
   
   Source: CS340 Modules/Explorations and Previous AI Assistance
   Date: November 2025
   Purpose: Table row component with inline editing for Albums
   Summary: Base table row structure adapted from CS340 starter code and AI assistance.
   AI Citations: Claude 3, 11/13/2025
   AI Source URL: https://claude.ai/share/5669c902-16cc-44ae-9829-9b2f824b14c0
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Updated to prevent avgRating from being editable
   Summary: Made avgRating non-editable since it's a calculated field from AlbumRatings table.
   AI Source URL: https://claude.ai/
*/

import { useState } from "react";
import AlbumDeleteButton from "./AlbumDeleteButton";
import AlbumUpdateButton from "./AlbumUpdateButton";

const AlbumTableRow = ({ album, backendURL, refreshRows, genres }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedValues, setEditedValues] = useState(album);

    const handleInputChange = (key, value) => {
        setEditedValues(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <tr>
            {Object.entries(album).map(([key, value]) => (
                <td key={key}>
                    {isEditing && key !== "albumID" && key !== "avgRating" ? (
                        key === "genreID" ? (
                            <select
                                name="genreID"
                                value={editedValues.genreID}
                                onChange={(e) => handleInputChange("genreID", e.target.value)}
                                style={{ width: "100%" }}
                            >
                                <option value="">Select a Genre</option>
                                {genres.map((genre) => (
                                    <option value={genre.genreID} key={genre.genreID}>
                                        {genre.genreID}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={
                                    key.toLowerCase().includes("price") || key.toLowerCase().includes("amount")
                                        ? "number"
                                        : "text"
                                }
                                name={key}
                                value={editedValues[key]}
                                onChange={(e) => handleInputChange(key, e.target.value)}
                                style={{ width: "100%" }}
                            />
                        )
                    ) : (
                        value
                    )}
                </td>
            ))}

            {/* Delete button */}
            <AlbumDeleteButton
                rowObject={album}
                backendURL={backendURL}
                refreshRows={refreshRows}
            />

            {/* Update button */}
            <AlbumUpdateButton
                album={album}
                backendURL={backendURL}
                refreshRows={refreshRows}
                editedValues={editedValues}
                setEditedValues={setEditedValues}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                genres={genres}
            />
        </tr>
    );
};

export default AlbumTableRow;