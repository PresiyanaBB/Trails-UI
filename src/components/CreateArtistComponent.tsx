import { useState, useEffect } from "react";
import { Project } from "../models";
import { createArtist } from "../api/ArtistApi";
import { getProjects, findProjectByName } from "../api/ProjectApi";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const CreateArtist: React.FC = () => {
    const navigate = useNavigate(); // Initialize navigate function
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [instagramUrl, setInstagramUrl] = useState("");
    const [image, setImage] = useState<{ mimetype: string; data: string }>({ mimetype: "", data: "" });
    const [projects, setProjects] = useState<Project[]>([]);
    const [, setIsProjectExisting] = useState<boolean[]>([]);
    const [projectOptions, setProjectOptions] = useState<Project[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Fetch available projects
    useEffect(() => {
        getProjects()
            .then((response) => {
                setProjectOptions(response.data);
            })
            .catch((error) => console.error("Error fetching projects:", error));
    }, []);

    // Fetch selected project details
    useEffect(() => {
        if (selectedProjectId) {
            findProjectByName(selectedProjectId)
                .then((response) => {
                    const projectData = response.data as Project;
                    setSelectedProject(projectData);  // Store the selected project
                    setIsProjectExisting([true]); // Mark as existing project
                })
                .catch((error) => console.error("Error fetching project details:", error));
        } else {
            setSelectedProject(null);
            setProjects([]);
            setIsProjectExisting([]); // Reset when no project is selected
        }
    }, [selectedProjectId]);

    // Handle image upload
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
        let finalProjects: Project[] = [];
        let finalIsProjectExisting: boolean[] = [];

        if (selectedProjectId) {
            // ✅ If an existing project is selected, fetch full project details
            try {
                const response = await findProjectByName(selectedProjectId);
                const projectData = response.data as Project;
                finalProjects = [projectData]; // Add the full project data (without wrapping it in another array)
                finalIsProjectExisting = [true]; // Mark as existing project
            } catch (error) {
                console.error("❌ Error fetching project details:", error);
                return; // Prevent sending incomplete data
            }
        } else {
            // ✅ Otherwise, use manually entered projects
            finalProjects = projects;
            finalIsProjectExisting = projects.map(() => false); // Ensure flat array of booleans
        }

        // ✅ Construct the payload
        const payload = {
            name,
            image,
            description,
            instagram_url: instagramUrl,
            projects: finalProjects[0], // This will no longer have an outer array if only one project
            is_project_existing: finalIsProjectExisting
        };

        try {
            await createArtist(payload);
            console.log("✅ Request sent successfully!");
            navigate("/artists");
        } catch (error) {
            if (error instanceof Error) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                console.error("❌ Error sending request:", (error as any)?.response?.data || error.message);
            } else {
                console.error("❌ An unknown error occurred:", error);
            }
        }
    };


    return (
        <div className="p-4 border rounded-lg max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Add Artist</h2>

            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded mb-2" />

            <label>Profile Image:</label>
            <input type="file" onChange={(e) => handleImageUpload(e, setImage)} />

            <label>Description:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded mb-2" />

            <label>Instagram URL:</label>
            <input type="text" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} className="w-full p-2 border rounded mb-2" />

            <h3 className="text-lg font-bold mt-4">Projects</h3>

            <label>Select a Project (Optional):</label>
            <select title="dropdown" onChange={(e) => setSelectedProjectId(e.target.value || null)} className="w-full p-2 border rounded mb-4">
                <option value="">-- Create New Project --</option>
                {projectOptions.map((project) => (
                    <option key={project.id} value={project.name}>
                        {project.name}
                    </option>
                ))}
            </select>

            {/* Hide project fields when an existing project is selected */}
            {!selectedProject && (
                <>
                    <label>Project Name:</label>
                    <input
                        type="text"
                        onChange={(e) => {
                            setProjects([{ ...projects[0], name: e.target.value }]);
                            setIsProjectExisting([false]);
                        }}
                        className="w-full p-2 border rounded mb-2"
                    />

                    <label>Location Name:</label>
                    <input
                        type="text"
                        onChange={(e) => {
                            setProjects([{ ...projects[0], location: { ...projects[0].location, name: e.target.value } }]);
                            setIsProjectExisting([false]);
                        }}
                        className="w-full p-2 border rounded mb-2"
                    />

                    <label>Map Address:</label>
                    <input
                        type="text"
                        onChange={(e) => {
                            setProjects([{ ...projects[0], location: { ...projects[0].location, map_address: e.target.value } }]);
                            setIsProjectExisting([false]);
                        }}
                        className="w-full p-2 border rounded mb-2"
                    />

                    <label>Project Image:</label>
                    <input type="file" onChange={(e) => handleImageUpload(e, (img) => {
                        setProjects([{ ...projects[0], image: { ...img, id: "" } }]);
                        setIsProjectExisting([false]);
                    })} />

                    <label>YouTube URL:</label>
                    <input
                        type="text"
                        onChange={(e) => {
                            setProjects([{ ...projects[0], youtube_url: e.target.value }]);
                            setIsProjectExisting([false]);
                        }}
                        className="w-full p-2 border rounded mb-2"
                    />
                </>
            )}

            <button onClick={sendRequest} className="mt-4 p-2 bg-blue-500 text-white rounded w-full">
                {selectedProjectId ? "Submit Existing Project" : "Create New Project"}
            </button>
        </div>
    );
};

export default CreateArtist;
