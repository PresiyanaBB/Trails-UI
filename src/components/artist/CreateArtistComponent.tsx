import { useState, useEffect } from "react";
import { Project } from "../../models";
import { createArtist } from "../../api/ArtistApi";
import { getProjects, getProject } from "../../api/ProjectApi";
import { useNavigate } from "react-router-dom";

const CreateArtist: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [instagramUrl, setInstagramUrl] = useState("");
    const [image, setImage] = useState<{ mimetype: string; data: string }>({ mimetype: "", data: "" });
    const [project, setProject] = useState<Project>({
        id: "",
        name: "",
        location: { id: "", name: "", map_address: "" },
        image: { id: "", mimetype: "", data: "" },
        youtube_url: "",
        artists: null
    });
    const [, setIsProjectExisting] = useState<boolean>();
    const [projectOptions, setProjectOptions] = useState<Project[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => {
        getProjects()
            .then((response) => {
                setProjectOptions(response.data);
            })
            .catch((error) => console.error("Error fetching projects:", error));
    }, []);

    useEffect(() => {
        if (selectedProjectId) {
            getProject(selectedProjectId)
                .then((response) => {
                    setSelectedProject(response.data as Project);
                    setIsProjectExisting(true);
                })
                .catch((error) => console.error("Error fetching project details:", error));
        } else {
            setSelectedProject(null);
            setProject({
                id: "",
                name: "",
                location: { id: "", name: "", map_address: "" },
                image: { id: "", mimetype: "", data: "" },
                youtube_url: "",
                artists: null
            });
            setIsProjectExisting(undefined);
        }
    }, [selectedProjectId]);


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
        let finalProject: Project;
        let finalIsProjectExisting: boolean;

        if (selectedProjectId) {
            try {
                const response = await getProject(selectedProjectId);
                finalProject = response.data as Project;
                finalIsProjectExisting = true;
            } catch (error) {
                console.error("Error fetching project details:", error);
                return;
            }
        } else {
            if (!project) {
                console.error("No project data available.");
                return;
            }
            finalProject = project;
            finalIsProjectExisting = false;
        }

        const payload = {
            name,
            image,
            description,
            instagram_url: instagramUrl,
            project: finalProject,
            is_project_existing: finalIsProjectExisting
        };

        try {
            await createArtist(payload);
            console.log("Request sent successfully!");
            navigate("/artists");
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
            <select
                title="dropdown"
                onChange={(e) => setSelectedProjectId(e.target.value || null)}
                className="w-full p-2 border rounded mb-4"
            >
                <option value="">-- Create New Project --</option>
                {Array.isArray(projectOptions) &&
                    projectOptions.map((project: { id: string; name: string }) => (
                        <option key={project.id} value={project.id}>
                            {project.name}
                        </option>
                    ))
                }
            </select>

            {/* Hide project fields when an existing project is selected */}
            {!selectedProject && (
                <>
                    <label>Project Name:</label>
                    <input
                        type="text"
                        onChange={(e) => {
                            setProject({ ...project, name: e.target.value });
                            setIsProjectExisting(false);
                        }}
                        className="w-full p-2 border rounded mb-2"
                    />

                    <label>Location Name:</label>
                    <input
                        type="text"
                        onChange={(e) => {
                            setProject({
                                ...project,
                                location: {
                                    ...project.location,
                                    name: e.target.value
                                }
                            });
                            setIsProjectExisting(false);
                        }}
                        className="w-full p-2 border rounded mb-2"
                    />

                    <label>Map Address:</label>
                    <input
                        type="text"
                        onChange={(e) => {
                            setProject({
                                ...project,
                                location: {
                                    ...project.location,
                                    map_address: e.target.value
                                }
                            });
                            setIsProjectExisting(false);
                        }}
                        className="w-full p-2 border rounded mb-2"
                    />

                    <label>Project Image:</label>
                    <input type="file" onChange={(e) => handleImageUpload(e, (img) => {
                        setProject({
                            ...project,
                            image: { ...img, id: "" }
                        });
                        setIsProjectExisting(false);
                    })} />

                    <label>YouTube URL:</label>
                    <input
                        type="text"
                        onChange={(e) => {
                            setProject({
                                ...project,
                                youtube_url: e.target.value
                            });
                            setIsProjectExisting(false);
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
