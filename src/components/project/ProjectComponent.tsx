import { useState, useEffect } from 'react';
import { getProjects } from '../../api/ProjectApi';
import { Project } from '../../models';

function ProjectComponent() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        getProjects().then((response) => {
            setProjects(response.data);
        }).catch((error) => {
            console.error(error);
        });
    }, []);

    useEffect(() => {
        projects.forEach((project) => {
            fetchImage(project.name, project.image);
        });
    }, [projects]);

    const fetchImage = async (projectName: string, image: { mimetype: string; data: string }) => {
        try {
            // Convert to Base64 URL
            const base64Url = `data:${image.mimetype};base64,${image.data}`;

            setImageUrls((prev) => ({ ...prev, [projectName]: base64Url }));
        } catch (error) {
            console.error("Error fetching image:", error);
        }
    };

    return (
        <div className="container">
            <h1>List Projects</h1>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Location</th>
                        <th>YouTube</th>
                        <th>Image</th>
                        <th>Artists</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <tr key={project.name}>
                            <td>{project.name}</td>
                            <td>{project.location.name} : {project.location.map_address}</td>
                            <td>{project.youtube_url}</td>
                            <td>
                                {imageUrls[project.name] ? (
                                    <img className='project-image'
                                        src={imageUrls[project.name]}
                                        alt={project.name}
                                    />
                                ) : (
                                    <span>Loading...</span>
                                )}
                            </td>
                            <td>
                                {project.artists
                                    ? project.artists.map((artist) => artist.name).join(", ")
                                    : "No artists available"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProjectComponent;
