import { ButtonBase, Tooltip, Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import "../styles/reportdocuments.css";
import IconRender from "../components/IconRender/IconRender";
import useAsync from "../functions/hooks/useAsync";
import API from "../network/API";
import getJsonWithErrorHandlerFunc from "../functions/getJsonWithErrorHandlerFunc";
import sortSignTooltipData from "../functions/sortSignTooltipData";
import { Link } from "react-router-dom";
import LeftPanel from "../components/LeftPanel/LeftPanel";
import TopPanel from "../components/TopPanel/TopPanel";
import getCachedLogin from "../functions/getCachedLogin";

async function download(doc) {
  let url = await getJsonWithErrorHandlerFunc(
    (args) => API.downloadDocuments(args),
    [doc.id]
  );
  window.open(url.url, "_blank");
}

function ReportDocuments() {
  const [docData, setDocData] = useState(null);
  useAsync(getJsonWithErrorHandlerFunc, setDocData, [
    (args) => API.listAllDocuments(args),
    [],
  ]);

  const [signTooltipOpen, setSignTooltipOpen] = useState({});
  const [signTooltipData, setSignTooltipData] = useState({});
  const [ueran, setUeran] = useState(false);

  useEffect(() => {
    if (!docData) {
      return;
    }
    let nsto = {};
    let nstd = {};
    docData.documents.forEach((doc) => {
      nsto[doc.id] = false;
      nstd[doc.id] = null;
    });
    setSignTooltipOpen(nsto);
    setUeran(true);
  }, [docData]);

  const [info, setInfo] = useState(null);
  useAsync(getJsonWithErrorHandlerFunc, setInfo, [
    (args) => API.infoEmployee(args),
    [getCachedLogin()],
  ]);

  const handleTooltipToggle = async (doc) => {
    if (!signTooltipData[doc.id]) {
      let nstd = { ...signTooltipData };
      nstd[doc.id] = (
        await getJsonWithErrorHandlerFunc((args) => API.getSignsDocuments(args), [doc.id])
      ).signs;
      setSignTooltipData(nstd);
    }
    let nsto = { ...signTooltipOpen };
    nsto[doc.id] = !nsto[doc.id]; // Toggle the tooltip state
    setSignTooltipOpen(nsto);
  };

  return !info || !docData || !ueran ? null : (
    <div style={{ display: "flex" }}>
      <LeftPanel highlight="docreport" />
      <div>
        <TopPanel
          title="Отчет по документам"
          profpic={info.photo_link}
          showfunctions={false}
          username={info.name}
        />
          <Row>
            <Col>
              <div className="report-doc-sent-area">
              <Typography variant="h4" style={{textAlign: 'center' }}>Отправленные сотрудникам</Typography>
                {docData.documents.map((doc) =>
                  doc.type === "admin_request" ? (
                    <Paper elevation={3} key={doc.id} style={{ margin: "20px 0", padding: "20px" }}>
                      <form>
                        <Row className="report-doc-sent-doc">
                          <Col className="report-doc-info-col">
                            <Typography variant="body1" className="report-doc-name">
                              {doc.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              className="report-doc-preformat"
                              
                            >
                              {doc.description}
                            </Typography>
                          </Col>
                          <Col className="report-doc-button-col">
                            <Button
                              className="report-doc-button"
                              onClick={() => download(doc)}
                            >
                              Прочитать
                            </Button>
                            {doc.sign_required && (
                              <Tooltip
                                interactive
                                PopperProps={{}}
                                onClose={() => {
                                  let nsto = { ...signTooltipOpen };
                                  nsto[doc.id] = false;
                                  setSignTooltipOpen(nsto);
                                }}
                                open={signTooltipOpen[doc.id]}
                                disableFocusListener
                                disableHoverListener
                                disableTouchListener
                                title={
                                  <Container>
                                    {signTooltipData[doc.id]
                                      ? sortSignTooltipData(
                                          signTooltipData[doc.id]
                                        ).map((sign) => (
                                          <Link
                                            to={"/user/" + sign.employee.id}
                                            className="report-doc-user-link"
                                            key={sign.employee.id}
                                          >
                                            <Row
                                              className={
                                                sign.signed
                                                  ? "report-doc-employee-signed"
                                                  : "report-doc-employee-unsigned"
                                              }
                                            >
                                              <Typography variant="body2">
                                                {sign.employee.surname +
                                                  " " +
                                                  sign.employee.name}
                                              </Typography>
                                              <IconRender
                                                path={
                                                  sign.signed
                                                    ? "/images/icons/tick.svg"
                                                    : "/images/icons/cross.svg"
                                                }
                                                width="16px"
                                                height="16px"
                                                iwidth="16px"
                                                iheight="16px"
                                              />
                                            </Row>
                                          </Link>
                                        ))
                                      : null}
                                  </Container>
                                }
                              >
                                <Button
                                  className="report-doc-button"
                                  onClick={() => handleTooltipToggle(doc)}
                                >
                                  Кто подписал?
                                </Button>
                              </Tooltip>
                            )}
                          </Col>
                        </Row>
                      </form>
                    </Paper>
                  ) : null
                )}
              </div>
            </Col>

            <Col>
              <div className="report-doc-sent-area">
              <Typography variant="h4" style={{textAlign: 'center' }}>Запросы от сотрудников</Typography>
                {docData.documents.map((doc) =>
                  doc.type === "employee_request" ? (
                    <Paper elevation={3} key={doc.id} style={{ margin: "20px 0", padding: "20px" }}>
                      <form>
                        <Row className="report-doc-sent-doc">
                          <Col className="report-doc-info-col">
                            <Typography variant="body1" className="report-doc-name">
                              {doc.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              className="report-doc-preformat"
                            >
                              {doc.description}
                            </Typography>
                          </Col>
                          <Col className="report-doc-button-col">
                            <Button
                              className="report-doc-button"
                              onClick={() => download(doc)}
                            >
                              Прочитать
                            </Button>
                            {doc.sign_required && (
                              <Tooltip
                                interactive
                                PopperProps={{}}
                                onClose={() => {
                                  let nsto = { ...signTooltipOpen };
                                  nsto[doc.id] = false;
                                  setSignTooltipOpen(nsto);
                                }}
                                open={signTooltipOpen[doc.id]}
                                disableFocusListener
                                disableHoverListener
                                disableTouchListener
                                title={
                                  <Container>
                                    {signTooltipData[doc.id]
                                      ? sortSignTooltipData(
                                          signTooltipData[doc.id]
                                        ).map((sign) => (
                                          <Link
                                            to={"/user/" + sign.employee.id}
                                            className="report-doc-user-link"
                                            key={sign.employee.id}
                                          >
                                            <Row
                                              className={
                                                sign.signed
                                                  ? "report-doc-employee-signed"
                                                  : "report-doc-employee-unsigned"
                                              }
                                            >
                                              <Typography variant="body2">
                                                {sign.employee.surname +
                                                  " " +
                                                  sign.employee.name}
                                              </Typography>
                                              <IconRender
                                                path={
                                                  sign.signed
                                                    ? "/images/icons/tick.svg"
                                                    : "/images/icons/cross.svg"
                                                }
                                                width="16px"
                                                height="16px"
                                                iwidth="16px"
                                                iheight="16px"
                                              />
                                            </Row>
                                          </Link>
                                        ))
                                      : null}
                                  </Container>
                                }
                              >
                                <Button
                                  className="report-doc-button"
                                  onClick={() => handleTooltipToggle(doc)}
                                >
                                  Кто подписал?
                                </Button>
                              </Tooltip>
                            )}
                          </Col>
                        </Row>
                      </form>
                    </Paper>
                  ) : null
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>
  );
}

export default ReportDocuments;
