import { useState, useEffect } from 'react';
import { getArtists } from '../../api/ArtistApi';
import { Artist } from '../../models';
import '../../styles/artist.css'

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
            const base64Url = `data:${image.mimetype};base64,${image.data}`;

            setImageUrls((prev) => ({ ...prev, [artistName]: base64Url }));
        } catch (error) {
            console.error("Error fetching image:", error);
        }
    };

    return (
        <div className="artist-container">
            <h1 className="artist-title">Our Artists</h1>
            <table className="artist-table">
                <thead>
                    <tr>
                        <th>Artist</th>
                        <th>About</th>
                        <th>Social</th>
                        <th>Portfolio</th>
                        <th>Projects</th>
                    </tr>
                </thead>
                <tbody>
                    {artists.map((artist) => (
                        <tr key={artist.name}>
                            <td>
                                <div className="artist-name">{artist.name}</div>
                            </td>
                            <td>
                                <div className="artist-description">{artist.description}</div>
                            </td>
                            <td>
                                <a
                                    href={artist.instagram_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="artist-instagram"
                                >
                                    @{artist.instagram_url.split('/').pop()}
                                </a>
                            </td>
                            <td>
                                {imageUrls[artist.name] ? (
                                    <img
                                        className="artist-image"
                                        src={imageUrls[artist.name]}
                                        alt={`${artist.name}'s portfolio`}
                                    />
                                ) : (
                                    <span className="loading-text">Loading...</span>
                                )}
                            </td>
                            <td>
                                <div className="artist-projects">
                                    {artist.projects
                                        ? artist.projects.map((project) => project.name).join(", ")
                                        : "No projects available"}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ArtistComponent;
