import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
  Button as MUIButton,
  Container as MUIContainer,
  TextField,
  Grid,
  Paper,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import LeftPanel from "../components/LeftPanel/LeftPanel";
import TopPanel from "../components/TopPanel/TopPanel";
import { useEffect, useRef, useState } from "react";
import useAsync from "../functions/hooks/useAsync";
import getJsonWithErrorHandlerFunc from "../functions/getJsonWithErrorHandlerFunc";
import API from "../network/API";
import getCachedLogin from "../functions/getCachedLogin";
import "../styles/senddocument.css";
import optional from "../functions/optional";
import formatDate from "../functions/formatDate";
import { addMonths } from "date-fns";

function SendDocument() {
  const [info, setInfo] = useState(false);
  useAsync(getJsonWithErrorHandlerFunc, setInfo, [
    (args) => API.infoEmployee(args),
    [getCachedLogin()],
  ]);

  const [receivers, setReceivers] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  function handleChange(e) {
    setReceivers(
      typeof e.target.value === "string"
        ? e.target.value.split(",")
        : e.target.value
    );
  }

  const document_input = useRef(null);
  const [documentData, setDocumentData] = useState(null);
  const [documentName, setDocumentName] = useState(null);

  function readDoc(e) {
    let files = e.target.files;
    setDocumentName(files[0].name);
    let reader = new FileReader();
    reader.readAsArrayBuffer(files[0]);
    reader.onload = (e) => {
      setDocumentData(e.target.result);
    };
  }

  const [needSignature, setNeedSignature] = useState(false);

  const [employees, setEmployees] = useState({});
  const [pretime, setPretime] = useState(null);
  useAsync(getJsonWithErrorHandlerFunc, setPretime, [
    (args) => API.listAllAttendance(args),
    [
      {
        from: formatDate(new Date()),
        to: formatDate(addMonths(new Date(), 1)),
      },
    ],
  ]);

  useEffect(() => {
    if (pretime === null) {
      return;
    }
    let emp = {};
    pretime.attendances.forEach((element) => {
      emp[element.employee.id] = element.employee;
    });
    setEmployees(emp);
  }, [pretime]);

  async function send(e) {
    e.preventDefault();
    if (receivers.length == 0 || !documentData) {
      setNotification({ open: true, message: "Заполните все поля", severity: "warning" });
      return;
    }
    let upload = await getJsonWithErrorHandlerFunc(
      (args) => API.uploadDocuments(args),
      []
    );
    let resupload = await API.xfetch({
      path: upload.url,
      isabsolute: true,
      method: "PUT",
      body: new File([documentData], documentName),
      bodyisjson: false,
    });
    let send = await API.sendDocuments({
      doc_id: upload.id,
      doc_name: name,
      doc_sign_required: needSignature,
      doc_description: description,
      employee_ids: receivers,
    });
    if (resupload && send && resupload.ok && send.ok) {
      setNotification({ open: true, message: "Документ отправлен", severity: "success" });
    } else {
      setNotification({ open: true, message: "Не удалось отправить документ", severity: "error" });
    }
  }

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  return (
    <Box display="flex" overflow="hidden" height="100vh">
      <LeftPanel highlight="senddoc" />
      <Box flexGrow={1}>
        <TopPanel
          title="Отправка документов"
          profpic={info.photo_link}
          showfunctions={false}
          username={info.name}
        />
        <MUIContainer maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Название"
                  variant="outlined"
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Описание"
                  variant="outlined"
                  multiline
                  rows={5}
                  sx={{ mt: 2 }}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MUIButton
                  variant="contained"
                  onClick={() => document_input.current.click()}
                  sx={{ mb: 2, backgroundColor: '#164f94', '&:hover': { backgroundColor: '#133d73' } }}
                >
                  Прикрепить документ
                </MUIButton>
                <Typography variant="body1">
                  {documentName ? documentName : "Файл не выбран"}
                </Typography>
                <input
                  type="file"
                  id="doc"
                  name="doc"
                  ref={document_input}
                  className="hidden"
                  onChange={readDoc}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={needSignature}
                      onChange={() => setNeedSignature(!needSignature)}
                      sx={{
                        color: '#164f94',
                        '&.Mui-checked': {
                          color: '#164f94',
                        },
                      }}
                    />
                  }
                  label="Требуется подпись сотрудников"
                  sx={{ mt: 2 }}
                />
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="receivers-label">Получатели</InputLabel>
                  <Select
                    labelId="receivers-label"
                    multiple
                    value={receivers}
                    onChange={handleChange}
                    input={<OutlinedInput label="Получатели" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={(() => {
                              let thisemp = Object.values(employees).find(
                                (emp) => {
                                  return value == emp.id;
                                }
                              );
                              return (
                                thisemp.surname +
                                " " +
                                thisemp.name +
                                " " +
                                optional(thisemp.patronymic)
                              );
                            })()}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {Object.values(employees).map((emp) => (
                      <MenuItem key={emp.id} value={emp.id}>
                        {emp.surname +
                          " " +
                          emp.name +
                          " " +
                          optional(emp.patronymic)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <MUIButton
                  variant="contained"
                  fullWidth
                  onClick={(e) => {
                    e.preventDefault();
                    setReceivers(Object.values(employees).map((emp) => emp.id));
                  }}
                  sx={{ mt: 2, backgroundColor: '#164f94', '&:hover': { backgroundColor: '#133d73' } }}
                >
                  Отправить всем
                </MUIButton>
                <MUIButton
                  variant="contained"
                  fullWidth
                  onClick={(e) => send(e)}
                  sx={{ mt: 2, backgroundColor: '#164f94', '&:hover': { backgroundColor: '#133d73' } }}
                >
                  Отправить
                </MUIButton>
              </Grid>
            </Grid>
        </MUIContainer>
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification({ ...notification, open: false })}
        >
          <Alert
            onClose={() => setNotification({ ...notification, open: false })}
            severity={notification.severity}
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default SendDocument;