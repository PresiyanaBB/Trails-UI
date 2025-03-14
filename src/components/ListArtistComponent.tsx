import React, { useState } from 'react';
import { getArtists } from '../api/ArtistApi';

function ListArtistComponent() {
    const [artists, setArtists] = useState<{ id: string; name: string; description: string; instagram_url: string }[]>([]);

    React.useEffect(() => {
        getArtists().then((response) => {
            setArtists(response.data);
        }).catch((error) => {
            console.error(error);
        });
    }, []);

    return (
        <div className='container'>
            <h1>List Artist</h1>
            <table className='table table-striped table-bordered'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Instagram</th>
                    </tr>
                </thead>
                <tbody>
                    {artists.map((artist) => (
                        <tr key={artist.name}>
                            <td>{artist.name}</td>
                            <td>{artist.description}</td>
                            <td>{artist.instagram_url}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListArtistComponent;
