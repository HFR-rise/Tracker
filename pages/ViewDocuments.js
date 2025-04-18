import { useEffect, useState } from "react";
import API from "../network/API";
import useAsync from "../functions/hooks/useAsync";
import getJsonWithErrorHandlerFunc from "../functions/getJsonWithErrorHandlerFunc";
import getCachedLogin from "../functions/getCachedLogin";
import LeftPanel from "../components/LeftPanel/LeftPanel";
import TopPanel from "../components/TopPanel/TopPanel";
import {
  Box,
  Container as MUIContainer,
  Grid,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import Document from "../components/Document";
import "../styles/viewdocuments.css";

function ViewDocuments() {
  const [data, setData] = useState(null);
  const [info, setInfo] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useAsync(getJsonWithErrorHandlerFunc, setInfo, [
    (args) => API.infoEmployee(args),
    [getCachedLogin()],
  ]);

  useAsync(getJsonWithErrorHandlerFunc, setData, [
    (args) => API.listDocuments(args),
    [],
  ]);

  return !data || !info ? null : (
    <Box display="flex" overflow="hidden" height="100vh">
      <LeftPanel highlight="viewdoc" />
      <Box flexGrow={1} display="flex" flexDirection="column">
        <TopPanel
          title="Мои документы"
          profpic={info.photo_link}
          showfunctions={false}
          username={info.name}
        />
        <MUIContainer maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1, overflowY: 'auto' }}>
            <Grid container spacing={3}>
              {data.documents.map((doc) => (
                <Grid item xs={12} key={doc.id}>
                  <Document {...doc} />
                </Grid>
              ))}
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

export default ViewDocuments;
