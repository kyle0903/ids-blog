import React, { useState, useEffect } from "react";
import Axios from "axios";
import {
  Button,
  Form,
  Card,
  FloatingLabel,
  Modal,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import "./App.css";
import Avatar from "react-avatar";
import ava12 from "./ava1.png";
import avatar from "./avatar.jpg";
import { AiOutlineLike, AiTwotoneLike } from "react-icons/ai";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import token from "./server/config/token";
import Postfast from "./Postfast";

function MainPage() {
  const [postList, setPostList] = useState([]);
  const { vaildcode } = useParams();
  const navigate = useNavigate();
  const [show_modal, setShow_modal] = useState(false);
  const handleClose_modal = () => setShow_modal(false);
  const handleShow_modal = () => setShow_modal(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState("");
  const [password, setpwd] = useState("");
  const [repassword, setrepwd] = useState("");
  const [user_posted, setuser_posted] = useState("");
  const [log_id, setlog_id] = useState("");
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [ava_pic, setava_pic] = useState("");
  const [comment, setComment] = useState("");
  const [comment_all, setComment_all] = useState([]);
  const [Like_id, setLike_id] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => load(), 100);
    return () => clearTimeout(timeout);
    async function load() {
      if (vaildcode) {
        console.log(vaildcode);
        Axios.get(`http://localhost:8081/api/forget/${vaildcode}`).then(
          (data) => {
            if (data.data.state == "failed") {
              toast.error(data.data.message, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
              });
              navigate("/");
            } else {
              setUser(data.data.user);
              handleShow_modal();
            }
          }
        );
      } else if (token) {
        Axios.post("http://localhost:8081/api/token", { token: token }).then(
          (data) => {
            if (!data.data) {
              toast.error("請重新登入", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
              });
              localStorage.clear();
            } else {
              setisLoggedIn(true);
              setuser_posted(data.data["user"]);
              setlog_id(data.data["id"]);

              Axios.post("http://localhost:8081/api/get/like", {
                userid: data.data["id"],
              }).then((data) => {
                for (let i = 0; i < data.data.length; i++) {
                  setLike_id((arr_like_id) => [
                    ...arr_like_id,
                    data.data[i].post_id,
                  ]);
                }
              });
              setava_pic(<Avatar round true size="45px" src={ava12} />);
            }
          }
        );
      } else {
        setuser_posted("未登入用戶");
        setava_pic(<Avatar round true size="45px" src={avatar} />);
        setisLoggedIn(false);
      }

      Axios.get("http://localhost:8081/api/get/all").then((data) => {
        setPostList(data.data);
      });
      Axios.get("http://localhost:8081/api/get/comment").then((data) => {
        setComment_all(data.data);
      });
    }
  }, []);

  const forget_check = () => {
    if (password == "" || repassword == "") {
      toast.error("有欄位未填寫唷", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    } else if (password != repassword) {
      toast.error("密碼不一致！", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    } else {
      Axios.post("http://localhost:8081/api/forget_check", {
        user: user,
        password: password,
      }).then((data) => {
        if (data.data.state == "success") {
          toast.success(data.data.message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
          handleClose_modal();
          navigate("/");
        }
      });
    }
  };

  const commentSumbit = (postid) => {
    if (comment === "") {
      toast.error("留言不得為空", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    } else {
      Axios.post("http://localhost:8081/api/insert/comment", {
        postid: postid,
        comment: comment,
        user: user_posted,
      }).then((data) => {
        if (data.data.state === "success") {
          toast.success(data.data.message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
          setComment_all(data.data.info);
        } else {
          toast.error(data.data.message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
        }
      });
    }
  };

  const LikePost = (id_post) => {
    if (!isLoggedIn) {
      toast.error("請先登入才能按讚", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    } else {
      Axios.post("http://localhost:8081/api/like", {
        id: log_id,
        id_post: id_post,
      }).then((data1) => {
        if (data1.data.state === "new") {
          setLike_id((arr_like_id) => [...arr_like_id, id_post]);
        } else if (data1.data.state === "delete") {
          setLike_id((current) =>
            current.filter((likeId) => {
              return likeId !== id_post;
            })
          );
        }
        Axios.get("http://localhost:8081/api/get/all").then((data1) => {
          setPostList(data1.data);
        });
      });
    }
  };
  var person_url = "http://localhost:5001/personal/";

  return (
    <div>
      {/* 發表文章 */}
      <Postfast
        ava_pic={ava_pic}
        isLoggedIn={isLoggedIn}
        user_posted={user_posted}
      />
      {/* 所有文章*/}
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
                    href={person_url + val.account_id}
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
                  {/* 判斷登入用戶在哪篇post按過讚 */}
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
                <table>
                  <tbody>
                    <tr>
                      <td style={{ width: "50%" }}>
                        <hr />
                      </td>
                      <td>
                        <b>Comment</b>
                      </td>
                      <td style={{ width: "50%" }}>
                        <hr />
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div>
                  {/* <button
                    style={{
                      float: "right",
                      background: "transparent",
                      color: "gray",
                      border: "0px",
                    }}
                  >
                    顯示更多留言...
                  </button> */}
                  {comment_all.map((vals, keys) => {
                    if (vals.post_id == val.post_id) {
                      return (
                        <div key={keys}>
                          <Card>
                            <Card.Header>
                              <Avatar round true size="45px" src={ava12} />{" "}
                              &nbsp; {vals.user}
                            </Card.Header>
                            <Card.Body>{vals.comment}</Card.Body>
                          </Card>
                        </div>
                      );
                    } else {
                      return <div key={keys}></div>;
                    }
                  })}
                  <br />
                  <div className="comment-form">
                    <div style={{ marginBottom: "10px" }}>
                      {ava_pic}&nbsp;&nbsp;
                      {user_posted}
                    </div>
                    <FloatingLabel label="Comments">
                      <Form.Control
                        as="textarea"
                        placeholder="Leave a comment here"
                        style={{ height: "100px" }}
                        onChange={(e) => {
                          setComment(e.target.value);
                        }}
                      />

                      <Button
                        variant="outline-secondary"
                        style={{
                          float: "right",
                          marginTop: "10px",
                          border: "0px",
                          color: "black",
                        }}
                        onClick={() => commentSumbit(val.post_id)}
                        disabled={user_posted === "未登入用戶"}
                      >
                        送出
                      </Button>
                    </FloatingLabel>
                    <br />
                    <br />
                  </div>
                </div>
              </Card.Body>
            </Card>
            <Modal show={show_modal} onHide={handleClose_modal}>
              <Modal.Header closeButton>
                <Modal.Title>忘記密碼？</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <b style={{ color: "blue" }}>*請輸入您註冊時之帳號與密碼*</b>
                <br />
                <br />
              </Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>帳號</Form.Label>
                  <Form.Control placeholder={user} disabled />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <FloatingLabel label="密碼">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      onChange={(e) => {
                        setpwd(e.target.value);
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
                    />
                  </FloatingLabel>
                </Form.Group>
              </Form>
              <Modal.Footer>
                <Button variant="primary" onClick={forget_check}>
                  送出
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        );
      })}
    </div>
  );
}

export default MainPage;
