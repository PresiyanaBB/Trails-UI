import { useState, useEffect } from 'react';
import { getArtists } from '../api/ArtistApi';
import { Artist } from '../utils/models';

function ArtistComponent() {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        getArtists().then((response) => {
            setArtists(response.data);
        }).catch((error) => {
            console.error(error);
        });
    }, []);

    useEffect(() => {
        artists.forEach((artist) => {
            fetchImage(artist.name, artist.image);
        });
    }, [artists]);

    const fetchImage = async (artistName: string, image: { mimetype: string; data: string }) => {
        try {
            // Convert to Base64 URL
            const base64Url = `data:${image.mimetype};base64,${image.data}`;

            setImageUrls((prev) => ({ ...prev, [artistName]: base64Url }));
        } catch (error) {
            console.error("Error fetching image:", error);
        }
    };

    return (
        <div className="container">
            <h1>List Artist</h1>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Instagram</th>
                        <th>Image</th>
                        <th>Projects</th>
                    </tr>
                </thead>
                <tbody>
                    {artists.map((artist) => (
                        <tr key={artist.name}>
                            <td>{artist.name}</td>
                            <td>{artist.description}</td>
                            <td>{artist.instagram_url}</td>
                            <td>
                                {imageUrls[artist.name] ? (
                                    <img className='artist-image'
                                        src={imageUrls[artist.name]}
                                        alt={artist.name}
                                    />
                                ) : (
                                    <span>Loading...</span>
                                )}
                            </td>
                            <td>
                                {artist.projects
                                    ? artist.projects.map((project) => project.name).join(", ")
                                    : "No projects available"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ArtistComponent;
