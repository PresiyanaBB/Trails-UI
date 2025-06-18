import { useState, useEffect } from 'react';
import { getProjects } from '../../api/ProjectApi';
import { Project } from '../../models';
import '../../styles/project.css';

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
            const base64Url = `data:${image.mimetype};base64,${image.data}`;

            setImageUrls((prev) => ({ ...prev, [projectName]: base64Url }));
        } catch (error) {
            console.error("Error fetching image:", error);
        }
    };

    return (
        <div className="project-container">
            <h1 className="project-title">List Projects</h1>
            <table className="project-table">
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
                            <td>
                                <div className="project-name">{project.name}</div>
                            </td>
                            <td>
                                <div className="project-description">{project.location.name} : {project.location.map_address}</div>
                            </td>
                            <td>
                                <a
                                    href={project.youtube_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="project-youtube"
                                >
                                    {project.youtube_url}
                                </a>
                            </td>
                            <td>
                                {imageUrls[project.name] ? (
                                    <img
                                        className="project-image"
                                        src={imageUrls[project.name]}
                                        alt={project.name}
                                    />
                                ) : (
                                    <span className="loading-text">Loading...</span>
                                )}
                            </td>
                            <td>
                                <div className="project-artists">
                                    {project.artists
                                        ? project.artists.map((artist) => artist.name).join(", ")
                                        : "No artists available"}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProjectComponent;
