import React, { useEffect, useState } from "react";
import Axios from "axios";
import {
  Button,
  Card,
  Form,
  FloatingLabel,
  DropdownButton,
  Dropdown,
  Modal,
} from "react-bootstrap";
import moment from "moment";
import { AiOutlineLike, AiTwotoneLike } from "react-icons/ai";
import { toast } from "react-toastify";

function History({ user, ava_pic, id, loginId, Like_id, setLike_id }) {
  const [postList, setPostList] = useState([]);
  const [show_modal, setShow_modal] = useState(false);
  const handleClose_modal = () => setShow_modal(false);
  const handleShow_modal = () => setShow_modal(true);
  const [postId, setpostId] = useState("");
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    Axios.get(`http://localhost:8081/api/get/post/${id}`).then((data) => {
      setPostList(data.data);
    });
  }, []);

  const select = (eventKey, postid, posttitle, posttext) => {
    if (eventKey == "1") {
      handleShow_modal();
      setText(posttext);
      setTitle(posttitle);
      setpostId(postid);
    } else {
      Axios.post("http://localhost:8081/api/delete", {
        id: postid,
      }).then((data) => {
        if (data.data.state === "success") {
          toast.success(data.data.message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
          setTimeout(function () {
            window.location.reload();
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
  const edit = () => {
    Axios.post("http://localhost:8081/api/edit", {
      title: title,
      text: text,
      id: postId,
    }).then((data) => {
      if (data.data.state === "success") {
        toast.success(data.data.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
        setTimeout(function () {
          window.location.reload();
        }, 1500);
      } else {
        toast.error(data.data.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
      }
    });
  };

  const LikePost = (id_post) => {
    Axios.post("http://localhost:8081/api/like", {
      id: loginId,
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
    });
  };

  return (
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
              style={{ width: "65rem", marginTop: "20px", marginLeft: "20px" }}
            >
              <Card.Header>
                {parseInt(id) === parseInt(loginId) ? (
                  <DropdownButton
                    title="編輯"
                    style={{ float: "right" }}
                    onSelect={(e) =>
                      select(e, val.post_id, val.title, val.post_text)
                    }
                  >
                    <Dropdown.Item eventKey="1">修改</Dropdown.Item>
                    <Dropdown.Item eventKey="2">刪除</Dropdown.Item>
                  </DropdownButton>
                ) : (
                  <p></p>
                )}

                <h3>{val.title}</h3>
                <b>發佈者：{val.user}</b>
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
      <Modal show={show_modal} onHide={handleClose_modal}>
        <Modal.Header closeButton>
          <Modal.Title>修改文章</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ava_pic}&nbsp; {user}
          <FloatingLabel
            label="讓標題更聳動吧！"
            style={{
              marginTop: "20px",
              color: "gray",
              fontStyle: "italic",
            }}
          >
            <Form.Control
              as="textarea"
              placeholder=" "
              defaultValue={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FloatingLabel>
          <FloatingLabel
            label="讓您的文章變更好！"
            style={{
              marginTop: "20px",
              color: "gray",
              fontStyle: "italic",
            }}
          >
            <Form.Control
              as="textarea"
              placeholder=" "
              defaultValue={text}
              style={{ height: "150px" }}
              onChange={(e) => {
                setText(e.target.value);
              }}
            />
          </FloatingLabel>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose_modal}>
            離開
          </Button>
          <Button variant="primary" onClick={edit}>
            送出
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
{
  /* <h1 onClick={() => navigate(`/post/${val.id}`)}>{val.title}</h1> */
}
export default History;
