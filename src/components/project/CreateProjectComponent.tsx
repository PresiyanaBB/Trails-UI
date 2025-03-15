import { useState, useEffect } from "react";
import { Artist } from "../../models";
import { createProject } from "../../api/ProjectApi";
import { getArtists, findArtistByName } from "../../api/ArtistApi";
import { useNavigate } from "react-router-dom";

const CreateProject: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [location, setLocation] = useState({ name: "", map_address: "" });
    const [image, setImage] = useState<{ mimetype: string; data: string }>({ mimetype: "", data: "" });
    const [artists, setArtists] = useState<Artist[]>([]);
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
            findArtistByName(selectedArtistId)
                .then((response) => {
                    setSelectedArtist(response.data as Artist);
                })
                .catch((error) => console.error("Error fetching artist details:", error));
        } else {
            setSelectedArtist(null);
            setArtists([]);
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
        let finalArtists: Artist[] = [];
        let finalIsArtistExisting: boolean[] = [];

        if (selectedArtistId) {
            try {
                const response = await findArtistByName(selectedArtistId);
                finalArtists = [response.data as Artist];
                finalIsArtistExisting = [true];
            } catch (error) {
                console.log("Error fetching artist details:", error);
                return;
            }
        } else {
            finalArtists = artists;
            finalIsArtistExisting = artists.map(() => false);
        }

        const payload = {
            name,
            description,
            location,
            image,
            youtube_url: youtubeUrl,
            artists: finalArtists[0],
            is_artist_existing: finalIsArtistExisting
        };

        console.log(JSON.stringify(payload, null, 2));

        try {
            await createProject(payload);
            console.log("Project created successfully!");
            navigate("/gallery");
        } catch (error) {
            console.error("Error creating project:", error);
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

            <label>Description:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded mb-2" />

            <label>YouTube URL:</label>
            <input type="text" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} className="w-full p-2 border rounded mb-2" />

            <h3 className="text-lg font-bold mt-4">Artists</h3>

            <label>Select an Artist (Optional):</label>
            <select title="dropdown" onChange={(e) => setSelectedArtistId(e.target.value || null)} className="w-full p-2 border rounded mb-4">
                <option value="">-- Add New Artist --</option>
                {artistOptions.map((artist) => (
                    <option key={artist.id} value={artist.name}>
                        {artist.name}
                    </option>
                ))}
            </select>

            {!selectedArtist && (
                <>
                    <label>Artist Name:</label>
                    <input
                        type="text"
                        onChange={(e) => setArtists([...artists, { id: "", name: e.target.value, image: { id: "", mimetype: "", data: "" }, description: "", instagram_url: "", projects: [] }])}
                        className="w-full p-2 border rounded mb-2"
                    />

                    <label>Artist Image:</label>
                    <input type="file" onChange={(e) => handleImageUpload(e, (img) => setArtists([{ ...artists[0], image: { ...img, id: "" } }]))} />

                    <label>Artist Description:</label>
                    <textarea
                        onChange={(e) => setArtists([{ ...artists[0], description: e.target.value }])}
                        className="w-full p-2 border rounded mb-2"
                    />

                    <label>Instagram URL:</label>
                    <input
                        type="text"
                        onChange={(e) => setArtists([{ ...artists[0], instagram_url: e.target.value }])}
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
