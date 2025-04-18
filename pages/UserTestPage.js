import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { Drawer } from "@mui/material";
import TitleField from "../components/UserPage/TitleField";
import LeftPanel from "../components/LeftPanel/LeftPanel";
import TopPanel from "../components/TopPanel/TopPanel";
import Config from "../config/UserPageConfig";
import "../styles/userpage.css";

function UserTestPage() {
  return (
    <div style={{ display: "flex" }}>
      <LeftPanel />
      <div>
        <TopPanel />
        <Container className="main-body" fluid>
          <Row>
            <Col md="auto">
              <h1 className="user-page-name">Петр Иванович Здюков</h1>
              <div className="user-page-position">
                <h2 className="no-margin font-props-inherit">Стажер</h2>
                <h2 className="no-margin font-props-inherit">Проктолог</h2>
              </div>
              <TitleField title="Email" value="johndoe@example.com" />
              <TitleField title="Phone Number" value="+1 123 456 7890" />
              <Row>
                <Col className="user-page-col-padding">
                  <TitleField title="Department" value="Engineering" />
                </Col>
                <Col className="user-page-col-padding">
                  <TitleField title="Office Location" value="New York" />
                </Col>
              </Row>
              <Row>
                <Col className="user-page-col-padding">
                  <TitleField title="Country" value="United States" />
                </Col>
                <Col className="user-page-col-padding">
                  <TitleField title="Preferred Language" value="English" />
                </Col>
              </Row>
              <Button className="edit-button">
                Изменить личную информацию
              </Button>
            </Col>
            <Col className="img-col" md="auto">
              <Image
                className="img"
                src="/images/photo-1492633423870-43d1cd2775eb.jpg"
                width={370}
                height={358}
                roundedCircle
              />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default UserTestPage;
