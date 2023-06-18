import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { Card, Row, Col } from "react-bootstrap";
import Avatar from "react-avatar";
import ava1 from "./ava1.png";
import "./App.css";
import avatar from "./avatar.png";
import Postfast from "./Postfast";
import History from "./History";
import EditIntro from "./EditIntro";
import Menu from "./Menu";
function Personal() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState("");
  const [user_2, setUser_2] = useState("");
  const [isLoggedIn, setislogin] = useState(false);
  const [ava_pic, setava_pic] = useState("");
  const [pic, setpic] = useState("");
  const [introduce, setintroduce] = useState("");
  const [loginId, setloginId] = useState("");
  const [Like_id, setLike_id] = useState([]);
  const { id } = useParams();
  var ava_user = <Avatar round true size="45px" src={ava1} />;
  var ava_guest = <Avatar round true size="45px" src={avatar} />;

  const Historya = () => {
    Axios.get(`http://localhost:8081/api/get/user/${id}`).then((data1) => {
      if (id == 0) {
        setUser_2("未登入用戶");
      } else {
        setUser_2(data1.data[0].user);
      }
    });
    if (isLoggedIn) {
      return (
        <>
          <History
            user={user}
            ava_pic={ava_pic}
            id={id}
            loginId={loginId}
            Like_id={Like_id}
            setLike_id={setLike_id}
          />
        </>
      );
    } else {
      return (
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            marginTop: "50px",
            fontSize: "20px",
            fontStyle: "italic",
            color: "gray",
          }}
        >
          未登入無法查看內容
        </div>
      );
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => verifylogin(), 100);
    return () => clearTimeout(timeout);
    async function verifylogin() {
      if (token) {
        Axios.post("http://localhost:8081/api/token", {
          token: token,
        }).then((data) => {
          if (data.data === false) {
            setToken(null);
            setislogin(false);
            localStorage.clear();
          } else {
            Axios.get(`http://localhost:8081/api/get/like/${id}`).then(
              (data) => {
                for (let i = 0; i < data.data.length; i++) {
                  setLike_id((arr_like_id) => [
                    ...arr_like_id,
                    data.data[i].post_id,
                  ]);
                }
              }
            );
            setToken(token);
            setislogin(true);
            setloginId(data.data.id);
            setUser(data.data.user);
            setava_pic(ava_user);
            setpic(ava1);
          }
        });
      } else {
        setislogin(false);
        setava_pic(ava_guest);
        setpic(avatar);
      }
      Axios.get(`http://localhost:8081/api/get/intro/${id}`).then((data) => {
        if (data.data.state === "success") {
          setintroduce(data.data.message);
        } else if (data.data.state === "logout") {
          setintroduce(data.data.message);
        } else {
          setintroduce(data.data.message);
        }
      });
    }
  }, []);

  // const Upload = () => {
  //   if (parseInt(id) === parseInt(loginId)) {
  //     return (
  //       <>
  //         <label
  //           htmlFor="file-upload"
  //           className="custom-file-upload"
  //           style={{
  //             marginTop: "10px",
  //             justifyContent: "center",
  //             display: "flex",
  //           }}
  //         >
  //           Custom Upload
  //         </label>
  //       </>
  //     );
  //   } else {
  //     return <></>;
  //   }
  // };
  return (
    <div>
      <head>
        <link rel="icon" href="smile.png" />
      </head>

      <div>
        <Row>
          {/* 個人簡介區 */}
          <Col xl={3} style={{ justifyContent: "center", display: "flex" }}>
            <Card
              style={{
                width: "30rem",
                marginTop: "20px",
                marginLeft: "20px",
              }}
            >
              <Card.Img
                variant="top"
                src={pic}
                style={{
                  width: "200px",
                  margin: "0 auto",
                  marginTop: "10px",
                  display: "block",
                }}
              />
              <Card.Body>
                <label
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    fontSize: "30px",
                  }}
                >
                  {user_2}
                </label>

                <hr />
                <Card.Title>個人簡介</Card.Title>
                <EditIntro
                  ava_pic={ava_pic}
                  user={user}
                  isLoggedIn={isLoggedIn}
                  introduce={introduce}
                  id={id}
                  loginId={loginId}
                  setintroduce={setintroduce}
                />
              </Card.Body>
            </Card>
          </Col>
          {/* 貼文區 */}
          <Col xl={6}>
            <Postfast ava_pic={ava_pic} user={user} isLoggedIn={isLoggedIn} />
            <Historya />
          </Col>
          {/* 選單區 */}
          <Col xl={3}>
            <Menu
              ava_pic={ava_pic}
              user={user}
              user_2={user_2}
              isLoggedIn={isLoggedIn}
              setislogin={setislogin}
              setToken={setToken}
              loginId={loginId}
              id={id}
              Like_id={Like_id}
              setLike_id={setLike_id}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}
export default Personal;
