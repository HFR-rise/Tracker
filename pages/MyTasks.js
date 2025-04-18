import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/alltasks.css';
import TopPanelTracker from "../components/TopPanel/TopPanelTracker";
import LeftPanel from "../components/LeftPanel/LeftPanel";
import API from "../network/API";

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

    return (
        <div className="App">
            <LeftPanel highlight="tracker" />
            <TopPanelTracker title="Трекер" showfunctions={false} />

            {loading && <div>Loading tasks...</div>}
            {error && <div>Error: {error}</div>}

            {!loading && !error && tasks.length > 0 && (
                <div className="all-tasks">
                    <div className="kanban-container">
                        <div className="column-tasks">
                            <div className="header-tasks">
                                Бэклог
                            </div>
                            <div className="list-of-tasks">
                                {tasks.map(task => (
                                    <button key={task.id} className="task">{task.title}</button>
                                ))}
                            </div>
                        </div>
                        <div className="column-tasks">
                            <div className="header-tasks">
                                Открыт
                            </div>
                            <div className="list-of-tasks">
                                {tasks.map(task => (
                                    <button key={task.id} className="task-open">{task.title}</button>
                                ))}
                            </div>
                        </div>
                        <div className="column-tasks">
                            <div className="header-tasks">
                                В процессе
                            </div>
                            <div className="list-of-tasks">
                                {tasks.map(task => (
                                    <button key={task.id} className="task-on-check">{task.title}</button>
                                ))}
                            </div>
                        </div>
                        <div className="column-tasks">
                            <div className="header-tasks">
                                Завершён
                            </div>
                            <div className="list-of-tasks">
                                {tasks.map(task => (
                                    <button key={task.id} className="task-finished">{task.title}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!loading && !error && tasks.length === 0 && (
                <div>No tasks found.</div>
            )}
        </div>
    );
}

export default AllTasks;