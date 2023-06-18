import { React, useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  Modal,
  Button,
  FloatingLabel,
} from "react-bootstrap";
import "./App.css";
import Axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import logo from "./smile.png";

const Nav1 = () => {
  toast.configure();
  //modal-登入
  const [show_modal, setShow_modal] = useState(false);
  const handleClose_modal = () => setShow_modal(false);
  const handleShow_modal = () => setShow_modal(true);
  //modal-註冊
  const [show_modal_sign, setShow_modal_sign] = useState(false);
  const handleClose_modal_sign = () => setShow_modal_sign(false);
  const handleShow_modal_sign = () => setShow_modal_sign(true);
  //modal-忘記密碼
  const [show_modal_forget, setShow_modal_forget] = useState(false);
  const handleClose_modal_forget = () => setShow_modal_forget(false);
  const handleShow_modal_forget = () => setShow_modal_forget(true);
  //pwd
  const [password, setpwd] = useState("");
  const [password_sign, setpwd_sign] = useState("");
  const [repassword, setrepwd] = useState("");
  //user
  const [user, setUser] = useState("");
  const [user_sign, setUser_sign] = useState("");
  const [user_forget, setUser_forget] = useState("");
  //email
  const [email, setemail] = useState("");
  const [email_forget, setEmail_forget] = useState("");
  //islogin
  const [islogin, setislogin] = useState(false);
  //token
  const [token, setToken] = useState(localStorage.getItem("token"));
  //id
  const [postId, setpostid] = useState("");
  //Nav狀態
  var Nav_state;
  //跳轉頁面
  const navigate = useNavigate();
  const Nav_login = //狀態顯示登入
    (
      <Nav onSelect={select}>
        <Nav.Link eventKey="link-1">登入</Nav.Link>
        <Nav.Link eventKey="link-2">註冊</Nav.Link>
      </Nav>
    );
  const Nav_logout = //狀態顯示登出
    (
      <Nav onSelect={select_2}>
        <Nav.Link eventKey="link-1">{user}</Nav.Link>
        <Nav.Link eventKey="link-2">登出</Nav.Link>
      </Nav>
    );

  useEffect(() => {
    //console.log($(document).find(".NavLink ").length);

    if (window.location.href.split("/")[3] === "personal") {
      $($(document).find(".NavLink")[1]).addClass("active");
    } else if (window.location.href === "http://localhost:5001/") {
      $($(document).find(".NavLink")[0]).addClass("active");
    }
    $($(document).find(".NavLink")).bind("click", function () {
      $(this).parent().find(".active").removeClass("active");
      $(this).addClass("active");
    });

    //console.log($(document).find(".NavLink "));
    Axios.post("http://localhost:8081/api/token", {
      token: token,
    }).then((data) => {
      if (data.data === false) {
        setToken(null);
        setpostid("0");
      } else {
        setislogin(true);
        setUser(data.data["user"]);
        setpostid(data.data["id"]);
      }
    });
  }, []);
  //判斷是否為登入狀態
  if (islogin) {
    Nav_state = Nav_logout;
  } else {
    Nav_state = Nav_login;
  }
  function select(eventKey) {
    if (eventKey === "link-1") {
      handleShow_modal();
    } else {
      handleShow_modal_sign();
    }
  }
  function select_2(eventKey) {
    if (eventKey === "link-1") {
      window.location.replace("/personal/" + postId);
    } else {
      setislogin(false);
      setToken(null);
      localStorage.clear();
      toast.success("登出中...", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
      setTimeout(function () {
        if (window.location.href.split("/")[3] === "personal") {
          window.location.replace("http://localhost:5001/personal/0");
        } else {
          window.location.reload();
        }
      }, 1500);
    }
  }
  //登入
  const submitLogin = () => {
    if (user === "" || password === "") {
      alert("帳號或密碼尚未填寫！");
    } else {
      Axios.post("http://localhost:8081/api/login", {
        user: user,
        password: password,
      }).then((data) => {
        if (data.data.state === "success") {
          toast.success(data.data.message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
          setislogin(true);
          handleClose_modal();
          window.localStorage.setItem("token", data.data.token); // save to local
          setToken(data.data.token);
          setTimeout(function () {
            if (window.location.href.split("/")[3] === "personal") {
              window.location.replace(
                "http://localhost:5001/personal/" + data.data.id
              );
            } else {
              window.location.reload();
            }
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
  //忘記密碼
  const sendmail = () => {
    if (user_forget === "" || email_forget === "") {
      alert("帳號或電子郵件尚未填寫！");
    } else {
      Axios.post("http://localhost:8081/api/email", {
        user: user_forget,
        email: email_forget,
      }).then((data) => {
        if (data.data.state === "success") {
          toast.success(data.data.message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
          handleClose_modal_forget();
          handleClose_modal();
        } else {
          toast.error(data.data.message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
        }
      });
    }
  };
  //註冊
  const submitsign = () => {
    if (user_sign === "" || password_sign === "" || email.value === "") {
      alert("帳號或密碼尚未填寫！");
    } else if (password_sign !== repassword) {
      alert("密碼不一致！");
    } else {
      Axios.post("http://localhost:8081/api/sign", {
        user: user_sign,
        password: password_sign,
        email: email,
      }).then((data) => {
        alert(data.data);
        handleClose_modal_sign();
        navigate("/");
      });
    }
  };
  const notify = () => {
    // Calling toast method by passing string
    toast.success("successful", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1000,
    });
  };

  return (
    <div>
      <Navbar expand="lg" bg="light" variant="light">
        <Container>
          <a href="http://localhost:5001/">
            <img src={logo} width="32px" />
          </a>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Navbar.Brand>IDS BLOG</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Link to="/" className="NavLink">
                首頁
              </Link>
              <Link to={"personal/" + postId} className="NavLink">
                個人檔案
              </Link>
            </Nav>
            {Nav_state}

            {/* 登入畫面 */}

            <Modal show={show_modal} onHide={handleClose_modal}>
              <Modal.Header closeButton>
                <Modal.Title>登入</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <b style={{ color: "blue" }}>*請輸入您註冊時之帳號與密碼*</b>
                <br />
                <br />
                <Form>
                  <Form.Group className="mb-3">
                    <FloatingLabel label="帳號" className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="User's Name"
                        onChange={(e) => {
                          setUser(e.target.value);
                        }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            submitLogin();
                          }
                        }}
                      />
                    </FloatingLabel>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <FloatingLabel label="密碼">
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        onChange={(e) => {
                          setpwd(e.target.value);
                        }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            submitLogin();
                          }
                        }}
                      />
                    </FloatingLabel>
                  </Form.Group>
                </Form>
              </Modal.Body>

              <Modal.Footer>
                <Button
                  onClick={handleShow_modal_forget}
                  style={{
                    marginRight: "240px",
                    fontSize: "14px",
                    color: "black",
                    backgroundColor: "transparent",
                    border: "0px",
                  }}
                >
                  忘記密碼？
                </Button>
                <Button variant="secondary" onClick={handleClose_modal}>
                  離開
                </Button>
                <Button variant="primary" onClick={submitLogin} id="loginBtn">
                  送出
                </Button>
              </Modal.Footer>
            </Modal>

            {/* {忘記密碼畫面} */}
            <Modal show={show_modal_forget} onHide={handleClose_modal_forget}>
              <Modal.Header closeButton>
                <Modal.Title>忘記密碼？</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <b style={{ color: "red" }}>*請輸入您註冊時之帳號與電子郵件*</b>
                <br />
                <br />
                <Form>
                  <Form.Group className="mb-3">
                    <FloatingLabel label="帳號" className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="User's Name"
                        onChange={(e) => {
                          setUser_forget(e.target.value);
                        }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            sendmail();
                          }
                        }}
                      />
                    </FloatingLabel>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <FloatingLabel label="電子郵件" className="mb-3">
                      <Form.Control
                        type="email"
                        placeholder="User's E-mail"
                        onChange={(e) => {
                          setEmail_forget(e.target.value);
                        }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            sendmail();
                          }
                        }}
                      />
                    </FloatingLabel>
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose_modal_forget}>
                  離開
                </Button>
                <Button variant="primary" onClick={sendmail}>
                  送出
                </Button>
              </Modal.Footer>
            </Modal>
            {/* 註冊畫面 */}

            <Modal show={show_modal_sign} onHide={handleClose_modal_sign}>
              <Modal.Header closeButton>
                <Modal.Title>註冊</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <b style={{ color: "blue" }}>*請輸入您欲註冊之帳號與密碼*</b>
                <br />
                <br />
                <Form>
                  <Form.Group className="mb-3">
                    <FloatingLabel label="帳號" className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="User's Name"
                        onChange={(e) => {
                          setUser_sign(e.target.value);
                        }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            submitsign();
                          }
                        }}
                      />
                    </FloatingLabel>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <FloatingLabel label="密碼">
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        onChange={(e) => {
                          setpwd_sign(e.target.value);
                        }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            submitsign();
                          }
                        }}
                      />
                    </FloatingLabel>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <FloatingLabel label="確認密碼">
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        onChange={(e) => {
                          setrepwd(e.target.value);
                        }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            submitsign();
                          }
                        }}
                      />
                    </FloatingLabel>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <FloatingLabel label="電子郵件">
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        onChange={(e) => {
                          setemail(e.target.value);
                        }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            submitsign();
                          }
                        }}
                      />
                    </FloatingLabel>
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose_modal_sign}>
                  離開
                </Button>
                <Button variant="primary" onClick={submitsign}>
                  送出
                </Button>
              </Modal.Footer>
            </Modal>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Nav1;
