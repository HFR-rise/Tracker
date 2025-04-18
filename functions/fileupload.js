import React, { useState, useRef } from 'react';
import "../styles/fileupload.css"

function FileUploadForm() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isFileSelected, setIsFileSelected] = useState(false);

    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setIsFileSelected(file !== null); // Подсветка, если файл выбран
        setSelectedFile(file);
        if (file) {
            setFileName(file.name);
        } else {
            setFileName('');
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div
            className={`file-input-label ${isFileSelected ? 'lightning' : ''}`}
            data-filename={fileName}
            onClick={handleClick}
        >
            <input
                type="file"
                id="fileInput"
                name="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
                ref={fileInputRef}
            />
            <span>{fileName || "Выберите файл"}</span>
        </div>
    );
}

export default FileUploadForm;