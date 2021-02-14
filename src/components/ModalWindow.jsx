import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const ModalWindow = ({ show, close }) => {
  return (
    <Modal
      show={show}
      onHide={close}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header
        style={{
          display: "flex",
          justifyContent: "flex-end",
          border: "0 none",
        }}
      >
        <Modal.Title>smth</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{ display: "flex", justifyContent: "center", border: "0 none" }}
      >
        Вы готовы?
      </Modal.Body>
      <Modal.Footer
        style={{ display: "flex", justifyContent: "center", border: "0 none" }}
      >
        <Button variant="primary" onClick={close}>Приступить</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalWindow;
