import React, { useState, useEffect } from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Card, Form, FloatingLabel, Modal } from "react-bootstrap";
import "./App.css";
function Postfast({ isLoggedIn, user, ava_pic }) {
  const [show_modal_post, setShow_modal_post] = useState(false);
  const handleClose_modal_post = () => setShow_modal_post(false);
  const handleShow_modal_post = () => setShow_modal_post(true);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const date_posted = new Date();
  const post = () => {
    if (!isLoggedIn) {
      toast.error("請先登入才能發表唷", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    } else {
      handleShow_modal_post();
    }
  };

  const submitPost = () => {
    if (title == "" || text == "") {
      toast.error("有欄位未填寫唷", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    } else {
      Axios.post("http://localhost:8081/api/create", {
        userName: user,
        title: title,
        text: text,
        date_posted: date_posted,
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
  return (
    <div style={{ justifyContent: "center", display: "flex" }}>
      <Card
        style={{
          width: "65rem",
          marginTop: "20px",
          marginLeft: "20px",
        }}
      >
        <Card.Body>
          <div style={{ display: "inline-block", width: "50px" }}>
            {ava_pic}
          </div>

          <div
            style={{
              marginLeft: "10px",
              display: "inline-block",
              width: "85%",
            }}
          >
            <Form.Control
              type="text"
              onClick={post}
              placeholder="發表文章吧！"
            />
            <Modal show={show_modal_post} onHide={handleClose_modal_post}>
              <Modal.Header closeButton>
                <Modal.Title>發表文章</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {ava_pic}&nbsp; {user}
                <FloatingLabel
                  label="標題"
                  style={{
                    marginTop: "20px",
                    color: "gray",
                    fontStyle: "italic",
                  }}
                >
                  <Form.Control
                    as="textarea"
                    placeholder="標題"
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingTextarea2"
                  label="分享您的事情吧！"
                  style={{
                    marginTop: "20px",
                    color: "gray",
                    fontStyle: "italic",
                  }}
                >
                  <Form.Control
                    as="textarea"
                    placeholder="在想些什麼呢?"
                    style={{ height: "150px" }}
                    onChange={(e) => {
                      setText(e.target.value);
                    }}
                  />
                </FloatingLabel>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose_modal_post}>
                  離開
                </Button>
                <Button variant="primary" onClick={submitPost}>
                  送出
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Postfast;
