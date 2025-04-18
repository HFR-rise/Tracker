import React, { useState, useEffect } from 'react';
import '../styles/allprojects.css';
import LeftPanel from "../components/LeftPanel/LeftPanel";
import TopPanelTracker from "../components/TopPanel/TopPanelTracker";
import API from "../network/API";
import {useNavigate} from "react-router-dom";
import getCachedLogin from "../functions/getCachedLogin";
import useAsync from "../functions/hooks/useAsync";
import getJsonWithErrorHandlerFunc from "../functions/getJsonWithErrorHandlerFunc";

function AllProjects() {
    const [projects, setProjects] = useState([]);
    const [apiError, setApiError] = useState(null);
    const navigate = useNavigate();



    useEffect(() => {
        async function fetchProjects() {
            try {
                const response = await API.getProjects();
                if (response.ok) {
                    const data = await response.json();
                    setProjects(data.projects);
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch projects");
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
                setApiError(error.message || "Failed to fetch projects. Please try again.");
            }
        }

        fetchProjects();
    }, []); // Empty dependency array means this effect runs only once (on mount)

    const handleProjectClick = (projectId) => {
        // Implement your navigation logic here
        console.log(`Clicked project with ID: ${projectId}`);
        // Example using react-router-dom:
        // navigate(`/project/${projectId}`);
    };

    const GoToAllTasks = (projectName) => {
        navigate("/all-tasks", { state: { project: projectName } });
    };

    // const my_id = getCachedLogin();
    // const [myInfo, setMyInfo] = useState(null);
    // myInfo.photo_link = undefined;
    // useAsync(getJsonWithErrorHandlerFunc, setMyInfo, [
    //     (args) => API.infoEmployee(args),
    //     [my_id],
    // ]);

    return (
        <div className="App">
            <LeftPanel highlight="tracker"/>
            <TopPanelTracker
                title="Трекер"
                // profpic={myInfo.photo_link}
                showfunctions={false}
                // username={myInfo.name}
            />

            <div className="all-projects">

                    {apiError && <div className="error-message">{apiError}</div>}

                    <div className="column">
                        <div className="header">Все проекты</div>
                        <div className="list-of-tasks">
                            {projects.map(project => (
                                <button
                                    key={project.id}
                                    className="task"
                                    onClick = {() => GoToAllTasks(project.project_name)}
                                >
                                    {project.project_name} ({project.tasks_count} tasks)
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
        </div>
    );
}

export default AllProjects;