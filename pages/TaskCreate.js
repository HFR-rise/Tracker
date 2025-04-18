import React, {useEffect, useState} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import "../styles/taskcreate.css";
import LeftPanel from "../components/LeftPanel/LeftPanel";
import TopPanelTracker from "../components/TopPanel/TopPanelTracker";
import FileUploadForm from "../functions/fileupload";
import DatePicker from 'react-datepicker';
import API from '../network/API';

function TaskCreate() {
    const [activeTab, setActiveTab] = useState('all');
    const [activeInfoTab, setActiveInfoTab] = useState('title-task');


    const [administratorOptions, setAdministratorOptions] = useState([]);
    const [workerOptions, setWorkerOptions] = useState([]);

    const [inputText, setInputText] = useState('');
    const [isInputExists, setIsInputExists] = useState(false);

    const [textareaText, setTextareaText] = useState('');
    const [isTextareaActive, setIsTextareaActive] = useState(false);

    const [level, setLevel] = useState('');
    const [projecttype, setProjectType] = useState('');
    const [beginning, setBeginning] = useState('');
    const [deadline, setDeadline] = useState('');
    const [administrator, setAdministrator] = useState('');
    const [worker, setWorker] = useState('');

    const [isLevelSelected, setIsLevelSelected] = useState(false);
    const [isProjectTypeSelected, setIsProjectTypeSelected] = useState(false);
    const [isBeginningSelected, setIsBeginningSelected] = useState(false);
    const [isDeadlineSelected, setIsDeadlineSelected] = useState(false);
    const [isAdministratorSelected, setIsAdministratorSelected] = useState(false);
    const [isWorkerSelected, setIsWorkerSelected] = useState(false);

    const handleTextareaChange = (event) => {
        const newText = event.target.value;
        setTextareaText(newText);
        setIsTextareaActive(newText.length > 0);
    };

    const handleInputChange = (event) => {
        const newText = event.target.value;
        setInputText(newText);
        setIsInputExists(newText.length > 0);
    };

    const handleLevelChange = (event) => {
        setLevel(event.target.value);
        setIsLevelSelected(true);
    };
    const handleProjectTypeChange = (event) => {
        setProjectType(event.target.value);
        setIsProjectTypeSelected(true);
    };
    const handleBeginningChange = (event) => {
        setBeginning(event.target.value);
        setIsBeginningSelected(true);
    };
    const handleDeadlineChange = (event) => {
        setDeadline(event.target.value);
        setIsDeadlineSelected(true);
    };
    const handleAdministratorChange = (event) => {
        setAdministrator(event.target.value);
        setIsAdministratorSelected(true);
    };
    const handleWorkerChange = (event) => {
        setWorker(event.target.value);
        setIsWorkerSelected(true);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    const handleInfoTabClick = (tab) => {
        setActiveInfoTab(tab);
    };

    const [selectedDateTime1, setSelectedDateTime1] = useState(null);
    const [selectedDateTime2, setSelectedDateTime2] = useState(null);
    const [isCalendarOpen1, setIsCalendarOpen1] = useState(false);
    const [isCalendarOpen2, setIsCalendarOpen2] = useState(false);
    const [tempDateTime, setTempDateTime] = useState(null);

    const handleDateTimeChange = (date) => {
        setTempDateTime(date);
    };

    const handleSaveDate1 = () => {
        setSelectedDateTime1(tempDateTime);
        setIsCalendarOpen1(false);
    };

    const handleSaveDate2 = () => {
        setSelectedDateTime2(tempDateTime);
        setIsCalendarOpen2(false);
    };

    const openCalendar1 = () => {
        setIsCalendarOpen1(true);
    };

    const openCalendar2 = () => {
        setIsCalendarOpen2(true);
    };

    const formatTime = (date) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    useEffect(() => {
        async function loadDropdownData() {
            try {
                const employeesResponse = await API.getEmployees();
                console.log("Employees Response:", employeesResponse);

                const employeesData = await employeesResponse.json();
                console.log("Employees Data:", employeesData);

                // Check if employeesData is an object and has the "employees" property
                if (employeesData && employeesData.employees && Array.isArray(employeesData.employees)) {
                    const employeeArray = employeesData.employees; // Access the "employees" array

                    setAdministratorOptions(employeeArray.map(employee => ({
                        value: employee.id, // Use employee ID as value
                        label: employee.name // Use employee name as label
                    })));

                    setWorkerOptions(employeeArray.map(employee => ({
                        value: employee.id, // Use employee ID as value
                        label: employee.name // Use employee name as label
                    })));
                } else {
                    console.error("Unexpected response format:", employeesData);
                }

            } catch (error) {
                console.error("Error loading dropdown data:", error);
            }
        }

        loadDropdownData();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const taskData = {
            title: inputText,
            description: textareaText,
            project_name: projecttype,
            assignee: "ipetrov", // Предполагается, что worker содержит ID
            beginning: selectedDateTime1 ? formatTime(selectedDateTime1) : null,
            deadline: selectedDateTime2 ? formatTime(selectedDateTime2) : null,
        };

        try {
            console.log("taskData:", taskData)
            const response = await API.addTask(taskData);
            console.log(response);
            if (response.ok) {
                console.log('Task created successfully!');
                // Сброс формы
                setInputText('');
                setTextareaText('');
                setLevel('');
                setProjectType('');
                setWorker('');
                setSelectedDateTime1(null);
                setSelectedDateTime2(null);
            } else {
                console.error('Error creating task:', response.statusText);
                alert(`Error creating task: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error creating task:', error);
            alert(`Error creating task: ${error}`);
        }
    };

    return (
        <div className="App">
            <LeftPanel highlight="tracker"/>
            <TopPanelTracker
                title="Трекер"
                showfunctions={false}
            />
            <div className="tracker">
                <div className="Info">
                    <form onSubmit={handleSubmit}>
                        <div className={`rounded-form-task ${isInputExists ? 'lightning' : ''}`}>
                            <div className="form-left-task">
                                <label className="title-task">Название</label>
                            </div>
                            <div className="separator-container">
                                <div className="separator"></div>
                            </div>
                            <div className="form-right-input">
                                <div className="form-right-content">
                                    <input type="text" className="input" onChange={handleInputChange}
                                           placeholder="Введите текст" value={inputText}/>
                                </div>
                            </div>
                        </div>

                        <div className={`rounded-form-task ${isLevelSelected ? 'lightning' : ''}`}>
                            <div className="form-left-task">
                                <label className="title-task">
                                    Приоритет
                                </label>
                            </div>
                            <div className={`separator-container ${isLevelSelected ? 'lightning' : ''}`}>
                                <div className="separator"></div>
                            </div>
                            <div className="form-right-select">
                                <select
                                    className="select"
                                    id="level"
                                    value={level}
                                    onChange={handleLevelChange}
                                    required>
                                    <option value="" disabled hidden>
                                        Выбрать
                                    </option>
                                    <option value="high">Высокий</option>
                                    <option value="medium">Средний</option>
                                    <option value="low">Низкий</option>
                                </select>
                            </div>
                        </div>

                        <div className={`rounded-form-task ${isWorkerSelected ? 'lightning' : ''}`}>
                            <div className="form-left-task">
                                <label className="title-task">
                                    Исполнитель
                                </label>
                            </div>
                            <div className={`separator-container ${isWorkerSelected ? 'lightning' : ''}`}>
                                <div className="separator"></div>
                            </div>
                            <div className="form-right-select">
                                <select
                                    className="select"
                                    id="worker"
                                    value={worker}
                                    onChange={handleWorkerChange}
                                    required
                                >
                                    <option value="" disabled hidden>
                                        Выбрать
                                    </option>
                                    {workerOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={`rounded-form-task ${selectedDateTime1 ? 'lightning' : ''}`}>
                            <div className="form-left-task">
                                <label className="title-task">
                                    Начало
                                </label>
                            </div>
                            <div className="separator-container">
                                <div className="separator"></div>
                            </div>
                            <div className="form-right-calendar">
                                <button className="calendar-button" onClick={openCalendar1}>
                                    {selectedDateTime1 ? formatTime(selectedDateTime1) : 'Выберите дату и время'}
                                </button>
                                {isCalendarOpen1 && (
                                    <div className="date-picker-container">
                                        <DatePicker
                                            key="datePicker1"
                                            selected={tempDateTime || selectedDateTime1}
                                            onChange={handleDateTimeChange}
                                            dateFormat="yyyy-MM-dd HH:mm"
                                            showTimeSelect
                                            inline
                                        />
                                        <button className="save-calendar-button" onClick={handleSaveDate1}>Сохранить
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={`rounded-form-task ${selectedDateTime2 ? 'lightning' : ''}`}>
                            <div className="form-left-task">
                                <label className="title-task">
                                    Дедлайн
                                </label>
                            </div>
                            <div className="separator-container">
                                <div className="separator"></div>
                            </div>
                            <div className="form-right-calendar">
                                <button className="calendar-button" onClick={openCalendar2}>
                                    {selectedDateTime2 ? formatTime(selectedDateTime2) : 'Выберите дату и время'}
                                </button>
                                {isCalendarOpen2 && (
                                    <div className="date-picker-container">
                                        <DatePicker
                                            key="datePicker2"
                                            selected={tempDateTime || selectedDateTime2}
                                            onChange={handleDateTimeChange}
                                            dateFormat="yyyy-MM-dd HH:mm"
                                            showTimeSelect
                                            inline
                                         showMonthYearDropdown/>
                                        <button className="save-calendar-button" onClick={handleSaveDate2}>Сохранить
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                <div className="Customization">
                    <form>
                        <div className={`textarea-container-task ${isTextareaActive ? 'lightning' : ''}`}>
                            <textarea
                                className="description-form"
                                placeholder="Начните вводить текст здесь..."
                                value={textareaText}
                                onChange={handleTextareaChange}
                            />
                        </div>
                        <div className="AddCreate-task">
                            <FileUploadForm/>
                            <button
                                className={`Customization-button-task create-button-task ${activeInfoTab === 'create' ? 'active' : ''}`}
                                onClick={handleSubmit}
                                type="submit"
                            >
                                Создать
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TaskCreate;