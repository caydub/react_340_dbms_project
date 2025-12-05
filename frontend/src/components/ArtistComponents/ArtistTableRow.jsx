/* Citations:
   
   Source: CS340 Modules/Explorations
   Date: November 2025
   Purpose: Table row component with inline editing pattern
   Summary: Base table row structure adapted from CS340 starter code.
   Source URL: https://canvas.oregonstate.edu/courses/2017561
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Created ArtistTableRow with inline editing for Artists entity
   Summary: Implemented custom table row with inline editing for description field (artistID not editable as it's the PK).
   AI Source URL: https://claude.ai/
*/

import { useState } from "react";
import ArtistDeleteButton from "./ArtistDeleteButton";
import ArtistUpdateButton from "./ArtistUpdateButton";

const ArtistTableRow = ({ artist, backendURL, refreshArtists }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedValues, setEditedValues] = useState(artist);

    const handleInputChange = (key, value) => {
        setEditedValues(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <tr>
            {/* artistID - not editable (primary key) */}
            <td>{artist.artistID}</td>

            {/* description - editable */}
            <td>
                {isEditing ? (
                    <input
                        type="text"
                        value={editedValues.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        style={{ width: '100%' }}
                    />
                ) : (
                    artist.description
                )}
            </td>

            <ArtistDeleteButton
                artistID={artist.artistID}
                backendURL={backendURL}
                refreshArtists={refreshArtists}
            />
            <ArtistUpdateButton
                artistID={artist.artistID}
                editedValues={editedValues}
                backendURL={backendURL}
                refreshArtists={refreshArtists}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                setEditedValues={setEditedValues}
                originalArtist={artist}
            />
        </tr>
    );
};

export default ArtistTableRow;