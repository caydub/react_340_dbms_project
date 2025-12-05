/* Citations:
   
   Source: CS340 Modules/Explorations
   Date: November 2025
   Purpose: Page structure and data fetching patterns
   Summary: Base page structure adapted from CS340 starter code.
   Source URL: https://canvas.oregonstate.edu/courses/2017561
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Updated AlbumRatings page to use custom table row component
   Summary: Implemented AlbumRatings page with AlbumRatingTableRow for inline editing with dropdowns,
            supporting full CRUD operations for M:N relationship.
   AI Source URL: https://claude.ai/
*/

import { useState, useEffect } from 'react';
import AlbumRatingTableRow from "../components/AlbumRatingsComponents/AlbumRatingTableRow.jsx";
import CreateAlbumRatingsForm from "../components/AlbumRatingsComponents/CreateAlbumRatingsForm.jsx";

function AlbumRatings({ backendURL }) {

    // Set up a state variable to store and display the backend response
    const [albumRatings, setAlbumRatings] = useState([]);

    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/AlbumRatings');

            // Convert the response into JSON format
            const { albumRatings } = await response.json();

            // Update the state with the response data
            setAlbumRatings(albumRatings);

        } catch (error) {
            // If the API call fails, print the error to the console
            console.log(error);
        }

    };

    // Load table on page load
    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <h1>Album Ratings</h1>

            <table>
                <thead>
                    <tr>
                        {albumRatings.length > 0 && Object.keys(albumRatings[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {albumRatings.map((rating, index) => (
                        <AlbumRatingTableRow
                            key={index}
                            rating={rating}
                            backendURL={backendURL}
                            refreshAlbumRatings={getData}
                        />
                    ))}

                </tbody>
            </table>

            <CreateAlbumRatingsForm backendURL={backendURL} refreshAlbumRatings={getData} />
        </>
    );

}

export default AlbumRatings;