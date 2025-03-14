import React, { useState } from 'react';
import { Project } from "../utils/models";
import { createArtist } from "../api/ArtistApi";

const CreateArtist: React.FC = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [instagramUrl, setInstagramUrl] = useState("");
    const [image, setImage] = useState<{ id: string; mimetype: string; data: string }>({ id: "", mimetype: "", data: "" });
    const [pName, setPName] = useState("");
    const [pImage, setPImage] = useState<{ id: string; mimetype: string; data: string }>({ id: "", mimetype: "", data: "" });
    const [location, setLocation] = useState<{ id: string; name: string; map_address: string }>({ id: "", name: "", map_address: "" });
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [projects, setProjects] = useState<Project[]>([
        {
            id: "",
            name: pName,
            location: location,
            image: pImage,
            youtube_url: youtubeUrl,
            artists: null,
        },
    ]);
    // const [isProjectExisting, setIsProjectExisting] = useState<boolean[]>([
    //     false,
    // ]);
    const [isProjectExisting] = useState<boolean[]>([
        false,
    ]);

    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        setImageFn: (img: { id: string; mimetype: string; data: string }) => void
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                const type = result.split(";")[0].split(":")[1]; // Get the image type
                const base64Data = result.split(",")[1]; // Remove "data:image/jpeg;base64,"
                setImageFn({ id: "", mimetype: type, data: base64Data });
            };
            reader.readAsDataURL(file);
        }
    };


    const handleProjectChange = (index: number, field: string, value: string) => {
        const updatedProjects = [...projects];
        if (field === "name") {
            updatedProjects[index].name = value;
            setPName(updatedProjects[index].name);
        }
        else if (field === "location.name") {
            updatedProjects[index].location.name = value;
            setLocation(updatedProjects[index].location);
        } else if (field === "location.map_address") {
            updatedProjects[index].location.map_address = value;
            setLocation(updatedProjects[index].location);
        }
        else if (field === "youtube_url") {
            updatedProjects[index].youtube_url = value;
            setYoutubeUrl(updatedProjects[index].youtube_url);
        }
        setProjects(updatedProjects);
    };

    const handleProjectImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        handleImageUpload(e, (img) => {
            const updatedProjects = [...projects];
            updatedProjects[index].image = img;
            setPImage(updatedProjects[index].image);
            setProjects(updatedProjects);
        });
    };

    const generateJSON = () => {
        const output = {
            name,
            image,
            description,
            instagram_url: instagramUrl,
            projects,
            is_project_existing: isProjectExisting,
        };
        console.log(JSON.stringify(output, null, 2));
    };

    const sendRequest = async () => {
        generateJSON();
        const payload = {
            name,
            image,
            description,
            instagram_url: instagramUrl,
            projects,
            is_project_existing: isProjectExisting,
        };

        try {
            const response = await createArtist(payload);
            console.log("Request successful:", response.data);
        } catch (error) {
            console.error("Error sending request:", error);
        }
    };

    return (
        <div className="p-4 border rounded-lg max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Add Artist</h2>
            <label>Name:</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded mb-2"
            />

            <label>Profile Image:</label>
            <input type="file" onChange={(e) => handleImageUpload(e, setImage)} />

            <label>Description:</label>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded mb-2"
            />

            <label>Instagram URL:</label>
            <input
                type="text"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="w-full p-2 border rounded mb-2"
            />

            <h3 className="text-lg font-bold mt-4">Projects</h3>
            {projects.map((project, index) => (
                <div key={index} className="border p-2 rounded mb-2">
                    <label>Project Name:</label>
                    <input
                        type="text"
                        value={project.name}
                        onChange={(e) => handleProjectChange(index, "name", e.target.value)}
                        className="w-full p-2 border rounded"
                    />

                    <label>Location Name:</label>
                    <input
                        type="text"
                        value={project.location.name}
                        onChange={(e) =>
                            handleProjectChange(index, "location.name", e.target.value)
                        }
                        className="w-full p-2 border rounded"
                    />

                    <label>Map Address:</label>
                    <input
                        type="text"
                        value={project.location.map_address}
                        onChange={(e) =>
                            handleProjectChange(index, "location.map_address", e.target.value)
                        }
                        className="w-full p-2 border rounded"
                    />

                    <label>Project Image:</label>
                    <input
                        type="file"
                        onChange={(e) => handleProjectImageUpload(e, index)}
                    />

                    <label>YouTube URL:</label>
                    <input
                        type="text"
                        value={project.youtube_url}
                        onChange={(e) =>
                            handleProjectChange(index, "youtube_url", e.target.value)
                        }
                        className="w-full p-2 border rounded"
                    />
                </div>
            ))}

            <button
                onClick={sendRequest}
                className="mt-4 p-2 bg-blue-500 text-white rounded"
            >
                Create Artist
            </button>
        </div>
    );
};

export default CreateArtist;