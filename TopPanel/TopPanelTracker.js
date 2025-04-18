import React, { useState, useEffect } from "react";
import { Drawer, Button as MUIButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Button, Image } from "react-bootstrap";
import Config from "../../config/UserPageConfig";
import "../../styles/toppaneltracker.css";
import BellIcon from "../../components/TopPanel/BellIcon";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Link, useNavigate } from "react-router-dom";
import API from "../../network/API";
import optional from "../../functions/optional";


function TopPanelTracker({
                    profpic,
                    title = "Мой профиль",
                    showfunctions = true,
                    username,
                  }) {
  let height = showfunctions ? 164 : 128;
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function logout() {
    API.logout();
    navigate("/login");
  }



  const GoToProjectCreate = () => {
    navigate("/project-create");
  };
  const GoToAllProject = () => {
    navigate("/all-projects");
  };
  const GoToMyTasks = () => {
    navigate("/my-tasks");
  };
  const GoToAllTasks = () => {
    navigate("/all-tasks");
  };



  useEffect(() => {
    document.getElementById("tp-drawer").style.height =
      document.getElementById("top-panel-all").offsetHeight.toString() + "px";
  });

  const handleEmailModalOpen = () => {
    navigate("/select-email-client");
  };



  return (
      <div className="the-line">
        <Drawer
          id="tp-drawer"
          sx={{
            "& .MuiDrawer-paper": {
              zIndex: 1,
            },
          }}
          variant="permanent"
          anchor="top"
        >

        <div
          id="top-panel-all"
          className="top-panel-all"
          style={{ marginLeft: Config.leftPanelWidth }}
        >
          <div className="top-panel-content">
            <p className="top-panel-title">{title}</p>
            <div className="top-panel-tracker-buttons">
              <Button
                  variant="outline-primary"
                  onClick={GoToAllProject}
                  className="all-projects-button"
              >
                Все проекты
              </Button>

              <Button
                variant="outline-primary"
                onClick={GoToMyTasks}
                className="my-tasks-button"
              >
                Мои задачи
              </Button>
              <Button
                variant="outline-primary"
                onClick={GoToProjectCreate}
                className="project-button"
              >
                Создать проект
              </Button>

            </div>


            <div className="top-panel-controls">
              <Link to="/notifications">
                <BellIcon />
              </Link>
              {optional(
                profpic,
                <Image
                  className="top-panel-profpic"
                  src={profpic}
                  width={40}
                  height={40}
                  roundedCircle
                />
              )}
              <Link to="/user/me" className="top-panel-mp-link">
                {username ? username : "Мой профиль"}
              </Link>



              <Button
                variant="outline-primary"
                onClick={handleClickOpen}
                className="support-button"
              >
                <span className="icon-wrapper"><HelpOutlineIcon /></span>
                Поддержка
              </Button>
              <Button
                variant="outline-primary"
                onClick={logout}
                style={{
                  borderColor: "#EA1515",
                  color: "#EA1515",
                  marginLeft: "10px",
                  transition: "all 0.3s ease-in-out",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#EA1515";
                  e.target.style.color = "#fff";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#fff";
                  e.target.style.color = "#EA1515";
                }}
              >
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "15px",
            padding: "20px",
          },
        }}
        TransitionProps={{
          onEntering: (node) => {
            node.style.transition = "all 0.3s ease-in-out";
            node.style.opacity = 0;
            node.style.transform = "scale(0.9)";
          },
          onEntered: (node) => {
            node.style.opacity = 1;
            node.style.transform = "scale(1)";
          },
          onExiting: (node) => {
            node.style.transition = "all 0.3s ease-in-out";
            node.style.opacity = 1;
            node.style.transform = "scale(1)";
          },
          onExited: (node) => {
            node.style.opacity = 0;
            node.style.transform = "scale(0.9)";
          },
        }}
      >
        <DialogTitle>Поддержка</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Выберите способ связи:
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outline-primary"
            onClick={() => window.open("https://t.me/working_day_support", "_blank", "noopener noreferrer")}
            style={{
              borderColor: "#164f94",
              color: "#164f94",
              transition: "all 0.3s ease-in-out",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#164f94";
              e.target.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#fff";
              e.target.style.color = "#164f94";
            }}
          >
            Написать в Телеграмм
          </Button>
          <Button
            variant="outline-primary"
            onClick={handleEmailModalOpen}
            style={{
              borderColor: "#164f94",
              color: "#164f94",
              transition: "all 0.3s ease-in-out",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#164f94";
              e.target.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#fff";
              e.target.style.color = "#164f94";
            }}
          >
            Написать на почту
          </Button>
          <MUIButton onClick={handleClose} style={{ color: "#EA1515" }}>Закрыть</MUIButton>
        </DialogActions>
      </Dialog>
      </div>
  );
}

export default TopPanelTracker;
