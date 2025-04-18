import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import "../styles/projectcreate.css";
import LeftPanel from "../components/LeftPanel/LeftPanel";
import TopPanelTracker from "../components/TopPanel/TopPanelTracker";
import FileUploadForm from "../functions/fileupload";
import TimePicker from 'react-datepicker';
import API from "../network/API";
import { useNavigate } from 'react-router-dom';

function ProjectCreate() {
  const navigate = useNavigate();

  const priorityOptions = [
    { value: 'high', label: 'Высокий' },
    { value: 'medium', label: 'Средний' },
    { value: 'low', label: 'Низкий' },
  ];

  const projectTypeOptions = [
    { value: 'public', label: 'Открытый' },
    { value: 'private', label: 'Закрытый' },
  ];

  const [administratorOptions, setAdministratorOptions] = useState([]);
  const [workerOptions, setWorkerOptions] = useState([]);

  const [level, setLevel] = useState('');
  const [projecttype, setProjectType] = useState('');
  const [administrator, setAdministrator] = useState('');
  const [worker, setWorker] = useState('');

  const [selectedDateTime1, setSelectedDateTime1] = useState(null);
  const [selectedDateTime2, setSelectedDateTime2] = useState(null);
  const [isCalendarOpen1, setIsCalendarOpen1] = useState(false);
  const [isCalendarOpen2, setIsCalendarOpen2] = useState(false);

  const [tempDateTime, setTempDateTime] = useState(null);

  const [inputText, setInputText] = useState('');
  const [textareaText, setTextareaText] = useState('');
  const [apiError, setApiError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [activeInfoTab, setActiveInfoTab] = useState('create');

  const [isLevelSelected, setIsLevelSelected] = useState(false);
  const [isProjectTypeSelected, setIsProjectTypeSelected] = useState(false);
  const [isAdministratorSelected, setIsAdministratorSelected] = useState(false);
  const [isWorkerSelected, setIsWorkerSelected] = useState(false);

  const [isInputExists, setIsInputExists] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleInfoTabClick = (tab) => {
    setActiveInfoTab(tab);
  };

  useEffect(() => {
    async function loadDropdownData() {
      try {
        const employeesResponse = await API.getEmployees();
        console.log("Employees Response:", employeesResponse);

        const employeesData = await employeesResponse.json();
        console.log("Employees Data:", employeesData);

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
          setApiError("Failed to load employee data. The server returned an unexpected format.");
        }

      } catch (error) {
        console.error("Error loading dropdown data:", error);
        setApiError("Failed to load employee data. Please try again.");
      }
    }

    loadDropdownData();
  }, []);

  const handleLevelChange = (event) => {
    setLevel(event.target.value);
    setIsLevelSelected(true);
  };
  const handleProjectTypeChange = (event) => {
    setProjectType(event.target.value);
    setIsProjectTypeSelected(true);
  };
  const handleAdministratorChange = (event) => {
    setAdministrator(event.target.value);
    setIsAdministratorSelected(true);
  };
  const handleWorkerChange = (event) => {
    setWorker(event.target.value);
    setIsWorkerSelected(true);
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
    setIsInputExists(event.target.value.length > 0);
  };

  const handleTextareaChange = (event) => {
    setTextareaText(event.target.value);
  };
  const handleDateTimeChange = (date) => {
    setTempDateTime(date); // Save the selected date/time in the temporary state
  };

  const openCalendar1 = () => {
    setIsCalendarOpen1(true);
  };
  const handleSaveDate1 = () => {
    setSelectedDateTime1(tempDateTime); // Save the temporary date to the main state
    setIsCalendarOpen1(false); // Close the calendar
  };

  const closeCalendar1 = () => {
    setIsCalendarOpen1(false);
  };
  const openCalendar2 = () => {
    setIsCalendarOpen2(true);
  };

  const handleSaveDate2 = () => {
    setSelectedDateTime2(tempDateTime);
    setIsCalendarOpen2(false);
  };

  const closeCalendar2 = () => {
    setIsCalendarOpen2(false);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError(null);

    console.log("Is sent:", inputText);

    try {
      const response = await API.addProject({project_name: inputText});
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create project");
      }

      console.log("Project created successfully!");
      navigate('/all-projects');

    } catch (error) {
      console.error("Error creating project:", error);
      setApiError(error.message || "Failed to create project. Please try again.");
    }
  };

  return (
      <div className="App">
        <LeftPanel highlight="tracker"/>
        <TopPanelTracker
            title="Трекер"
            // profpic={myInfo.photo_link}
            showfunctions={false}
            // username={myInfo.name}
        />
        <div className="tracker">
          <div className="Info">
            <form onSubmit={handleSubmit}>
              <div className={`rounded-form ${isInputExists ? 'lightning' : ''}`}>
                <div className="form-left">
                  <label className="title">Название</label>
                </div>
                <div className="separator-container">
                  <div className="separator"></div>
                </div>
                <div className="form-right-input">
                  <div className="form-right-content">
                    <input type="text" className="input" onChange={handleInputChange}  value={inputText} placeholder="Введите текст"/>
                  </div>
                </div>
              </div>

              <div className={`rounded-form ${isLevelSelected ? 'lightning' : ''}`}>
                <div className="form-left">
                  <label className="title">
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
                      required
                  >
                    <option value="" disabled hidden>
                      Выбрать
                    </option>
                    {priorityOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={`rounded-form ${isProjectTypeSelected ? 'lightning' : ''}`}>
                <div className="form-left">
                  <label className="title">
                    Тип проекта
                  </label>
                </div>
                <div className={`separator-container ${isProjectTypeSelected ? 'lightning' : ''}`}>
                  <div className="separator"></div>
                </div>
                <div className="form-right-select">
                  <select
                      className="select"
                      id="projecttype"
                      value={projecttype}
                      onChange={handleProjectTypeChange}
                      required
                  >
                    <option value="" disabled hidden>
                      Выбрать
                    </option>
                    {projectTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={`rounded-form ${isAdministratorSelected ? 'lightning' : ''}`}>
                <div className="form-left">
                  <label className="title">
                    Главный
                  </label>
                </div>
                <div className={`separator-container ${isAdministratorSelected ? 'lightning' : ''}`}>
                  <div className="separator"></div>
                </div>
                <div className="form-right-select">
                  <select
                      className="select"
                      id="administrator"
                      value={administrator}
                      onChange={handleAdministratorChange}
                      required
                  >
                    <option value="" disabled hidden>
                      Выбрать
                    </option>
                    {administratorOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={`rounded-form ${isWorkerSelected ? 'lightning' : ''}`}>
                <div className="form-left">
                  <label className="title">
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

              <div className={`rounded-form ${selectedDateTime1 ? 'lightning' : ''}`}>
                <div className="form-left">
                  <label className="title">
                    Начало
                  </label>
                </div>
                <div className="separator-container">
                  <div className="separator"></div>
                </div>
                <div className="form-right-calendar">
                  <button className="calendar-button"  onClick={openCalendar1}>
                    {selectedDateTime1 ? formatTime(selectedDateTime1) : 'Выберите дату и время'}
                  </button>
                  {isCalendarOpen1 && (
                      <div className="date-picker-container">
                        <TimePicker
                            key="datePicker1"
                            selected={tempDateTime || selectedDateTime1}
                            onChange={handleDateTimeChange}
                            dateFormat="yyyy-MM-dd"
                            timeFormat="HH:mm"
                            showTimeSelect
                            inline
                        />
                        <button className="save-calendar-button" onClick={handleSaveDate1}>Сохранить</button>
                      </div>
                  )}
                </div>
              </div>
              <div className={`rounded-form ${selectedDateTime2 ? 'lightning' : ''}`}>
                <div className="form-left">
                  <label className="title">
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
                        <TimePicker
                            key="datePicker2"
                            // onChange={handleDateChange2}
                            selected={tempDateTime || selectedDateTime2}
                            onChange={handleDateTimeChange}
                            showTimeSelect
                            inline
                            dateFormat="yyyy-MM-dd"
                            timeFormat="HH:mm"
                        />
                        <button className="save-calendar-button" onClick={handleSaveDate2}>Сохранить</button>
                      </div>
                  )}
                </div>
              </div>

            </form>
          </div>


          <div className="Customization">
            <form>
              <div className={`textarea-container`}>
              <textarea
                  className="description-form"
                  placeholder="Начните вводить текст здесь..."
                  value={textareaText}
                  onChange={handleTextareaChange}
              >

              </textarea>
              </div>
              <div className="AddCreate">
                <FileUploadForm/>

                <button
                    className={`Customization-button create-button ${activeInfoTab === 'create' ? 'active' : ''}`}
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

export default ProjectCreate;