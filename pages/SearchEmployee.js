import { useEffect, useState } from "react";
import useAsync from "../functions/hooks/useAsync";
import getJsonWithErrorHandlerFunc from "../functions/getJsonWithErrorHandlerFunc";
import API from "../network/API";
import LeftPanel from "../components/LeftPanel/LeftPanel";
import TopPanel from "../components/TopPanel/TopPanel";
import { Drawer } from "@mui/material";
import Config from "../config/UserPageConfig";
import BellIcon from "../components/TopPanel/BellIcon";
import AngleDownIcon from "../components/TopPanel/AngleDownIcon";
import Function from "../components/TopPanel/Function";
import UserIcon from "../components/TopPanel/UserIcon";
import UnlockIcon from "../components/TopPanel/UnlockIcon";
import MoneyIcon from "../components/TopPanel/MoneyIcon";
import optional from "../functions/optional";
import { Button, Container, Form, Image, Row } from "react-bootstrap";
import "../styles/overlay_search.css";
import "../styles/search.css";
import getCachedLogin from "../functions/getCachedLogin";
import { Link, useNavigate } from "react-router-dom";
import IconRender from "../components/IconRender/IconRender";
import SearchPanel from "../components/SearchPanel";

function SearchEmployee() {
  const [res, setRes] = useState([]);
  const [info, setInfo] = useState(null);
  useAsync(getJsonWithErrorHandlerFunc, setInfo, [
    (args) => API.infoEmployee(args),
    [getCachedLogin()],
  ]);


  const [request, setRequest] = useState("");

  const navigate = useNavigate();

  function logout() {
    API.logout();
    navigate("/login");
  }

  async function searchFunc(e) {
    e.preventDefault();
    let r = await getJsonWithErrorHandlerFunc(
      (args) => API.fullSearch(args),
      [{ search_key: request }]
    );
    if (r) {
      setRes(r.employees);
    }
  }

  return !info ? null : (
    <div style={{ display: "flex", overflow: "hidden", maxWidth: "100vw" }}>
      <LeftPanel highlight="search" />
      <div>
        <SearchPanel
          setOuterRequest={setRequest}
          searchFunc={searchFunc}
        />

        <p className="search-title-task">Коллеги</p>
        <div className="search-results-wrapper">
          <div className="search-results">
            {res.map((user) => {
              return (
                <div className="search-result">
                  <Image
                    className="search-result-profpic"
                    src={user.photo_link}
                    width={80}
                    height={80}
                    roundedCircle
                  />
                  <Link to={"/user/" + user.id} className="search-result-label">
                    <p className="search-result-label-p">{user.surname}</p>
                    <p className="search-result-label-p">{user.name}</p>
                    <p className="search-result-label-p">
                      {optional(user.patronymic)}
                    </p>
                  </Link>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}

export default SearchEmployee;
