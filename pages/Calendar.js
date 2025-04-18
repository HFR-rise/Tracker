import * as React from "react";
import dayjs from "dayjs";
import "dayjs/locale/ru"; 
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { useEffect, useState } from "react";
import { Circle } from "@mui/icons-material";
import "../styles/calendar.css"; 
import useAsync from "../functions/hooks/useAsync";
import getJsonWithErrorHandlerFunc from "../functions/getJsonWithErrorHandlerFunc";
import API from "../network/API";
import formatDate from "../functions/formatDate";
import { addMonths } from "date-fns";
import date_leq from "../functions/date_leq";
import { Typography, Paper, Box } from "@mui/material";
import LeftPanel from "../components/LeftPanel/LeftPanel";
import TopPanel from "../components/TopPanel/TopPanel";
import getCachedLogin from "../functions/getCachedLogin";

dayjs.locale("ru");

function CalendarDay(props) {
  const { highlightedDays = {}, day, outsideCurrentMonth, onSelectDay, ...other } = props;
  let events = highlightedDays[props.day.date()];

  // Separate events by type
  const vacationEvents = events.filter(event => event.type === "vacation");
  const attendanceEvents = events.filter(event => event.type === "attendance");

  // Determine if we should show icons
  const showVacationIcon = !outsideCurrentMonth && vacationEvents.length > 0;
  const showAttendanceIcon = !outsideCurrentMonth && attendanceEvents.length > 0;

  return (
    <Badge
      overlap="circular"
      badgeContent={
        <span className="circle-container">
          {showVacationIcon && (
            <Circle
              sx={{
                width: "40%",
                color: "purple",
                position: "absolute",
                top: 0,
                right: 0,
              }}
            />
          )}
          {showAttendanceIcon && (
            <Circle
              sx={{
                width: "40%",
                color: "green",
                position: "absolute",
                top: 0,
                right: showVacationIcon ? 8 : 0,
              }}
            />
          )}
        </span>
      }
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
      sx={{ "& .MuiBadge-badge": { right: "50%" } }}
      onClick={() => onSelectDay(day, events)}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        sx={{
          color: outsideCurrentMonth ? "#9e9e9e" : undefined,
        }}
      />
    </Badge>
  );
}

function Calendar() {
  const defaultHighlightedDays = () => {
    let obj = {};
    for (let index = 1; index <= 31; index++) {
      obj[index] = [];
    }
    return obj;
  };

  const [highlightedDays, setHighlightedDays] = useState(defaultHighlightedDays());
  const [hdDone, setHdDone] = useState(false);
  const [month, setMonth] = useState(() => {
    let d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [actions, setActions] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [workedDays, setWorkedDays] = useState(0);

  useAsync(
    getJsonWithErrorHandlerFunc,
    setActions,
    [
      (args) => API.actions(args),
      [{ from: formatDate(month), to: formatDate(addMonths(month, 1)) }],
    ],
    [month]
  );

  useEffect(() => {
    if (!actions) return;

    let newhd = defaultHighlightedDays();
    let newWorkedDays = 0;
    actions.actions.forEach((action) => {
      let start = new Date(Date.parse(action.start_date)).setHours(0, 0, 0);
      let end = new Date(Date.parse(action.end_date)).setHours(23, 59, 59);
      for (let index = 1; index <= 31; index++) {
        let day = new Date(month);
        day.setDate(index);
        if (date_leq(start, day) && date_leq(day, end)) {
          newhd[index].push(action);
          if (action.type === "attendance") {
            newWorkedDays++;
          }
        }
      }
    });
    setHighlightedDays(newhd);
    setHdDone(true);
    setWorkedDays(newWorkedDays);
  }, [actions, month]);

  const handleMonthChange = (date) => {
    setHighlightedDays(defaultHighlightedDays());
    setMonth(new Date(date));
  };

  const handleSelectDay = (day, events) => {
    setSelectedDay(day);
    setSelectedEvents(events);
  };

  const my_id = getCachedLogin();
  const [myInfo, setMyInfo] = useState(null);
  useAsync(getJsonWithErrorHandlerFunc, setMyInfo, [
    (args) => API.infoEmployee(args),
    [my_id],
  ]);

  return !hdDone || !myInfo ? null : (
    <div className="calendar-layout">
      <LeftPanel highlight="calendar" />
      <div className="calendar-content">
        <TopPanel
          title="Учет рабочего времени"
          profpic={myInfo.photo_link}
          showfunctions={false}
          username={myInfo.name}
        />
        <div className="calendar-container">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <DateCalendar
              defaultValue={dayjs(new Date())}
              onMonthChange={handleMonthChange}
              renderLoading={() => <DayCalendarSkeleton />}
              slots={{
                day: CalendarDay,
              }}
              slotProps={{
                day: {
                  highlightedDays,
                  onSelectDay: handleSelectDay,
                },
              }}
              sx={{ maxWidth: '100%', '& .MuiCalendarPicker-root': { transform: 'scale(1.5)' } }}
            />
          </LocalizationProvider>
        </div>
        <Paper elevation={3} className="info-panel">
          <Typography variant="h6" className="worked-days">
            Отработанных дней: {workedDays}
          </Typography>
          {selectedDay && (
            <Box className="day-info">
              <Typography variant="h6">Информация о дне</Typography>
              <Typography variant="body1">{selectedDay.format("DD/MM/YYYY")}</Typography>
              {selectedEvents.length > 0 ? (
                selectedEvents.map((event, index) => (
                  <Typography key={index} variant="body1">
                    {event.type === "vacation"
                      ? `Отпуск с ${new Date(Date.parse(event.start_date)).toLocaleDateString()} по ${new Date(Date.parse(event.end_date)).toLocaleDateString()}`
                      : `Посещение с ${event.start_date.slice(11, 16)} по ${event.end_date.slice(11, 16)}`}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2">Нет событий</Typography>
              )}
            </Box>
          )}
        </Paper>
      </div>
    </div>
  );
}

export default Calendar;
