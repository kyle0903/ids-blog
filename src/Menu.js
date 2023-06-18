import React, { useState, useEffect } from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Card, Form, FloatingLabel, Modal } from "react-bootstrap";
import moment from "moment";
import { AiOutlineLike, AiTwotoneLike } from "react-icons/ai";
import "./App.css";

function Menu({
  isLoggedIn,
  user,
  user_2,
  ava_pic,
  loginId,
  setislogin,
  setToken,
  id,
  Like_id,
  setLike_id,
}) {
  const [pwdChange, setpwdChange] = useState("");
  const [originPwd, setoriginPwd] = useState("");
  const [pwdCheck, setpwdCheck] = useState("");
  const [postList, setPostList] = useState([]);

  const [show_modal_changePwd, setShow_modal_changePwd] = useState(false);
  const handleClose_modal_changePwd = () => setShow_modal_changePwd(false);
  const handleShow_modal_changePwd = () => setShow_modal_changePwd(true);
  const [modalShow_like, setModalShow_like] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => load(), 100);
    return () => clearTimeout(timeout);
    async function load() {
      Axios.get(`http://localhost:8081/api/get/like/${id}`).then((data) => {
        setPostList(data.data);
      });
    }
  }, [Like_id]);
  const changeShow = () => {
    if (!isLoggedIn) {
      toast.error("請先登入才能操作唷", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    } else {
      handleShow_modal_changePwd();
    }
  };
  const changepwdSubmit = () => {
    if (pwdChange == "" || originPwd == "" || pwdCheck == "") {
      toast.error("有欄位未輸入", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    } else {
      Axios.post("http://localhost:8081/api/changepwd", {
        loginId: loginId,
        originPwd: originPwd,
        pwdChange: pwdChange,
        pwdCheck: pwdCheck,
      }).then((data) => {
        if (data.data.state == "success") {
          setislogin(false);
          setToken(null);
          localStorage.clear();
          toast.success(data.data.message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
          setTimeout(function () {
            window.location.replace("http://localhost:5001/personal/0");
          }, 1500);
        } else {
          toast.error(data.data.message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
        }
      });
    }
  };
  const LikePostShow = () => {
    if (!isLoggedIn) {
      toast.error("請先登入才能操作唷", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    } else {
      setModalShow_like(true);
    }
  };
  const LikePost = (id_post) => {
    Axios.post("http://localhost:8081/api/like", {
      id: loginId,
      id_post: id_post,
    }).then((data1) => {
      if (data1.data.state === "delete") {
        setLike_id((current) =>
          current.filter((likeId) => {
            return likeId !== id_post;
          })
        );
      }
    });
  };
  var person_url = "http://localhost:5001/personal/";

  function Likemenu(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            按讚的內容
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {postList.map((val, key) => {
              return (
                <div
                  style={{
                    padding: "20px",
                    justifyContent: "center",
                    display: "flex",
                  }}
                  key={key}
                >
                  <Card
                    style={{
                      width: "65rem",
                      marginTop: "20px",
                      marginLeft: "20px",
                    }}
                  >
                    <Card.Header>
                      <h3>{val.title}</h3>
                      <b>
                        發佈者：
                        <a
                          href={person_url + val.id}
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          {val.user}
                        </a>
                      </b>
                    </Card.Header>
                    <Card.Body>
                      <h5>{val.post_text}</h5>

                      <Button
                        variant="outline-primary"
                        style={{ border: "0px" }}
                        onClick={() => LikePost(val.post_id)}
                      >
                        {Like_id.includes(val.post_id) ? (
                          <AiTwotoneLike />
                        ) : (
                          <AiOutlineLike />
                        )}
                        &nbsp;{val.likes}
                      </Button>
                      <label
                        style={{
                          float: "right",
                          fontStyle: "italic",
                          fontSize: "15px",
                          color: "gray",
                        }}
                      >
                        {moment(val.date_posted).startOf("hour").fromNow()}
                      </label>
                    </Card.Body>
                  </Card>
                </div>
              );
            })}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  return (
    <div>
      <div>
        <Card style={{ width: "15rem", marginTop: "20px" }}>
          <Card.Body>
            <div className="d-grid gap-2">
              <Button
                variant="outline-primary"
                size="md"
                style={{ border: "0px" }}
                onClick={changeShow}
              >
                更改密碼
              </Button>
              <Button
                variant="outline-primary"
                size="md"
                style={{ border: "0px" }}
                onClick={LikePostShow}
              >
                {isLoggedIn ? `${user_2}按讚內容` : "按讚內容"}
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* <-更改密碼介面-> */}
        <Modal show={show_modal_changePwd} onHide={handleClose_modal_changePwd}>
          <Modal.Header closeButton>
            <Modal.Title>更改密碼</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {ava_pic}&nbsp; {user}
            <FloatingLabel
              label="原始密碼"
              style={{
                marginTop: "20px",
                color: "gray",
                fontStyle: "italic",
              }}
            >
              <Form.Control
                type="password"
                placeholder=" "
                onChange={(e) => {
                  setoriginPwd(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              label="欲更改之密碼"
              style={{
                marginTop: "20px",
                color: "gray",
                fontStyle: "italic",
              }}
            >
              <Form.Control
                type="password"
                placeholder=" "
                onChange={(e) => {
                  setpwdChange(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              label="確認更改密碼"
              style={{
                marginTop: "20px",
                color: "gray",
                fontStyle: "italic",
              }}
            >
              <Form.Control
                type="password"
                placeholder=" "
                onChange={(e) => {
                  setpwdCheck(e.target.value);
                }}
              />
            </FloatingLabel>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose_modal_changePwd}>
              離開
            </Button>
            <Button variant="primary" onClick={changepwdSubmit}>
              送出
            </Button>
          </Modal.Footer>
        </Modal>
        {/* 按讚的內容介面 */}
        <Likemenu
          show={modalShow_like}
          onHide={() => setModalShow_like(false)}
        />
      </div>
    </div>
  );
}

export default Menu;
