import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/alltasks.css';
import TopPanelTracker from "../components/TopPanel/TopPanelTracker";
import LeftPanel from "../components/LeftPanel/LeftPanel";
import API from "../network/API";
import { useNavigate } from 'react-router-dom';


function AllTasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    const projectName = new URLSearchParams(location.search).get('project') || location.state?.project || '';

    useEffect(() => {
        console.log("Project Name in AllTasks:", projectName);
    }, [projectName]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await API.getTasks();
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setTasks(data.tasks);
            console.log("Fetched tasks:", data.tasks);
        } catch (err) {
            console.error("Unable to fetch tasks:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredTasks = tasks.filter(task => task.project_name === projectName);
    const hasMatchingTasks = filteredTasks.length > 0;

    const navigate = useNavigate();


    function GoToTaskCreate() {
        navigate("/task-create");
    }

    return (
        <div className="App">
            <LeftPanel highlight="tracker" />
            <TopPanelTracker title="Трекер" showfunctions={false} />

            {loading && <div>Loading tasks...</div>}
            {error && <div>Error: {error}</div>}

            <div className="all-tasks">
                <div className="project-header">
                    <div className="project-name">{projectName}</div>
                    <button className="create-task-button" onClick={GoToTaskCreate}>
                        Создать задачу
                    </button>
                </div>

                {!loading && !error && tasks.length > 0 && hasMatchingTasks ? (
                    <div className="kanban-container">
                        <div className="column-tasks">
                            <div className="header-tasks">
                                Бэклог
                            </div>
                            <div className="list-of-tasks">
                                {filteredTasks.map(task => (
                                    <button key={task.id} className="task">{task.title}</button>
                                ))}
                            </div>
                        </div>
                        <div className="column-tasks">
                            <div className="header-tasks">
                                Открыт
                            </div>
                            <div className="list-of-tasks">
                                {filteredTasks.map(task => (
                                    <button key={task.id} className="task-open">{task.title}</button>
                                ))}
                            </div>
                        </div>
                        <div className="column-tasks">
                            <div className="header-tasks">
                                В процессе
                            </div>
                            <div className="list-of-tasks">
                                {filteredTasks.map(task => (
                                    <button key={task.id} className="task-on-check">{task.title}</button>
                                ))}
                            </div>
                        </div>
                        <div className="column-tasks">
                            <div className="header-tasks">
                                Завершён
                            </div>
                            <div className="list-of-tasks">
                                {filteredTasks.map(task => (
                                    <button key={task.id} className="task-finished">{task.title}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="no-tasks-message">
                        Нет задач для проекта {projectName}
                    </div>
                )}

                {!loading && !error && tasks.length === 0 && (
                    <div className="no-tasks-message">No tasks found.</div>
                )}
            </div>
        </div>
    );
}

export default AllTasks;