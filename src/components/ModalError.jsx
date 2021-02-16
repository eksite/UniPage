import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const ModalError = ({ close, show }) => {
  return (
    <Modal
      show={show}
      onHide={close}
      backdrop="static"
      keyboard="false"
      centered
    >
      <Modal.Header style={{ display: "flex", justifyContent: "center", border: "0 none" }}>
        <Modal.Title >
          Упс...
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{ display: "flex", justifyContent: "center", border: "0 none" }}
      >
        Проверьте язык
      </Modal.Body>
      <Modal.Footer
        style={{ display: "flex", justifyContent: "center", border: "0 none" }}
      >
        <Button variant="primary" onClick={close}>Продолжить</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalError;
