import { useState, useEffect } from "react";
import { Artist } from "../../models";
import { createProject } from "../../api/ProjectApi";
import { getArtists, getArtist } from "../../api/ArtistApi";
import { useNavigate } from "react-router-dom";

const CreateProject: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [location, setLocation] = useState<{ name: string, map_address: string }>({ name: "", map_address: "" });
    const [image, setImage] = useState<{ mimetype: string; data: string }>({ mimetype: "", data: "" });
    const [artists, setArtist] = useState<Artist>({
        id: "",
        name: "",
        image: { id: "", mimetype: "", data: "" },
        description: "",
        instagram_url: "",
        projects: null
    });
    const [, setIsArtistExisting] = useState<boolean>();
    const [artistOptions, setArtistOptions] = useState<Artist[]>([]);
    const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

    useEffect(() => {
        getArtists()
            .then((response) => {
                setArtistOptions(response.data);
            })
            .catch((error) => console.error("Error fetching artists:", error));
    }, []);

    useEffect(() => {
        if (selectedArtistId) {
            getArtist(selectedArtistId)
                .then((response) => {
                    setSelectedArtist(response.data as Artist);
                    setIsArtistExisting(true);
                })
                .catch((error) => console.error("Error fetching artist details:", error));
        } else {
            setSelectedArtist(null);
            setArtist({
                id: "",
                name: "",
                image: { id: "", mimetype: "", data: "" },
                description: "",
                instagram_url: "",
                projects: null
            });
        }
    }, [selectedArtistId]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setImageFn: (img: { mimetype: string; data: string }) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                const type = result.split(";")[0].split(":")[1];
                const base64Data = result.split(",")[1];
                setImageFn({ mimetype: type, data: base64Data });
            };
            reader.readAsDataURL(file);
        }
    };

    const sendRequest = async () => {
        let finalArtists: Artist;
        let finalIsArtistExisting: boolean;

        if (selectedArtistId) {
            try {
                const response = await getArtist(selectedArtistId);
                finalArtists = response.data as Artist;
                finalIsArtistExisting = true;
            } catch (error) {
                console.log("Error fetching artist details:", error);
                return;
            }
        } else {
            finalArtists = artists;
            finalIsArtistExisting = false;
        }

        const payload = {
            name,
            location,
            image,
            youtube_url: youtubeUrl,
            artist: finalArtists,
            is_artist_existing: finalIsArtistExisting
        };

        try {
            await createProject(payload);
            console.log("Project created successfully!");
            navigate("/archive");
        } catch (error) {
            if (error instanceof Error) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                console.error("Error sending request:", (error as any)?.response?.data || error.message);
            } else {
                console.error("An unknown error occurred:", error);
            }
        }
    };

    return (
        <div className="p-4 border rounded-lg max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Add Project</h2>

            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded mb-2" />

            <label>Location Name:</label>
            <input type="text" value={location.name} onChange={(e) => setLocation({ ...location, name: e.target.value })} className="w-full p-2 border rounded mb-2" />

            <label>Map Address:</label>
            <input type="text" value={location.map_address} onChange={(e) => setLocation({ ...location, map_address: e.target.value })} className="w-full p-2 border rounded mb-2" />

            <label>Project Image:</label>
            <input type="file" onChange={(e) => handleImageUpload(e, setImage)} />

            <label>YouTube URL:</label>
            <input type="text" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} className="w-full p-2 border rounded mb-2" />

            <h3 className="text-lg font-bold mt-4">Artists</h3>

            <label>Select an Artist (Optional):</label>
            <select title="dropdown" onChange={(e) => setSelectedArtistId(e.target.value || null)} className="w-full p-2 border rounded mb-4">
                <option value="">-- Add New Artist --</option>
                {artistOptions.map((artist) => (
                    <option key={artist.id} value={artist.id}>
                        {artist.name}
                    </option>
                ))}
            </select>

            {!selectedArtist && (
                <>
                    <label>Artist Name:</label>
                    <input
                        type="text"
                        onChange={(e) => setArtist({ ...artists, name: e.target.value })}
                        className="w-full p-2 border rounded mb-2"
                    />

                    <label>Artist Image:</label>
                    <input type="file" onChange={(e) => handleImageUpload(e, (img) => setArtist({ ...artists, image: { ...img, id: "" } }))} />

                    <label>Artist Description:</label>
                    <textarea
                        onChange={(e) => setArtist({ ...artists, description: e.target.value })}
                        className="w-full p-2 border rounded mb-2"
                    />

                    <label>Instagram URL:</label>
                    <input
                        type="text"
                        onChange={(e) => setArtist({ ...artists, instagram_url: e.target.value })}
                        className="w-full p-2 border rounded mb-2"
                    />
                </>
            )}

            <button onClick={sendRequest} className="mt-4 p-2 bg-blue-500 text-white rounded w-full">
                {selectedArtistId ? "Submit Existing Artist" : "Create New Artist"}
            </button>
        </div>
    );
};

export default CreateProject;
