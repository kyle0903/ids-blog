import React, { useState, useEffect } from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Card, Form, FloatingLabel, Modal } from "react-bootstrap";
import "./App.css";
function EditIntro({
  introduce,
  isLoggedIn,
  user,
  ava_pic,
  id,
  loginId,
  setintroduce,
}) {
  const [intro, setintro] = useState("");
  const [show_modal_intro, setShow_modal_intro] = useState(false);
  const handleClose_modal_intro = () => setShow_modal_intro(false);
  const handleShow_modal_intro = () => setShow_modal_intro(true);

  Axios.get(`http://localhost:8081/api/get/intro/${id}`).then((data) => {
    console.log("test");
    if (data.data.state === "success") {
      setintroduce(data.data.message);
    } else if (data.data.state === "logout") {
      setintroduce(data.data.message);
    } else {
      setintroduce(data.data.message);
    }
  });
  const introEdit = () => {
    if (!isLoggedIn) {
      toast.error("請先登入才能編輯唷", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    } else {
      if (parseInt(id) === parseInt(loginId)) {
        handleShow_modal_intro();
      } else {
        toast.error("無法編輯別人的簡介", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
      }
    }
  };
  const introsubmit = () => {
    if (intro == "") {
      toast.error("欄位未填寫唷", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    } else {
      Axios.post("http://localhost:8081/api/intro", {
        intro: intro,
        id: id,
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
    <div>
      <div>
        <Form.Control
          type="textarea"
          onClick={introEdit}
          placeholder={introduce}
          style={{ marginTop: "20px" }}
        />
        <Modal show={show_modal_intro} onHide={handleClose_modal_intro}>
          <Modal.Header closeButton>
            <Modal.Title>編輯簡介</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {ava_pic}&nbsp; {user}
            <FloatingLabel
              label="簡介"
              style={{
                marginTop: "20px",
                color: "gray",
                fontStyle: "italic",
              }}
            >
              <Form.Control
                as="textarea"
                placeholder=" "
                defaultValue={introduce}
                onChange={(e) => {
                  setintro(e.target.value);
                }}
              />
            </FloatingLabel>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose_modal_intro}>
              離開
            </Button>
            <Button variant="primary" onClick={introsubmit}>
              送出
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default EditIntro;
