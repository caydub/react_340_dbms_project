/* Citations:
   
   Source: CS340 Modules/Explorations
   Date: November 2025
   Purpose: Page structure and data fetching patterns
   Summary: Base page structure adapted from CS340 starter code.
   Source URL: https://canvas.oregonstate.edu/courses/2017561
   
   AI Model: Claude 3.5 Sonnet
   Date: 12/04/2025
   Purpose: Updated Albums page to use custom table row component and fetch average ratings
   Summary: Implemented Albums page with AlbumTableRow for inline editing,
            supporting full CRUD operations. Added avgRating calculation from AlbumRatings table.
   AI Source URL: https://claude.ai/
*/

import { useState, useEffect } from 'react';
import AlbumTableRow from '../components/AlbumComponents/AlbumTableRow';
import CreateAlbumForm from '../components/AlbumComponents/CreateAlbumForm';

function Albums({ backendURL }) {
    const [albums, setAlbums] = useState([]);
    const [genres, setGenres] = useState([]);

    const getData = async function () {
        try {
            const response = await fetch(`${backendURL}/Albums`);
            const { albums, genres } = await response.json();

            setAlbums(albums);
            setGenres(genres);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <h1>Albums</h1>

            <table>
                <thead>
                    <tr>
                        {albums.length > 0 && Object.keys(albums[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {albums.map((album, index) => (
                        <AlbumTableRow
                            key={index}
                            album={album}
                            backendURL={backendURL}
                            refreshRows={getData}
                            genres={genres}
                        />
                    ))}
                </tbody>
            </table>

            <CreateAlbumForm
                genres={genres}
                backendURL={backendURL}
                refreshAlbums={getData}
            />
        </>
    );
}

export default Albums;