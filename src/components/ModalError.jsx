import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const ModalError = ({ mainText, buttonText, close, show }) => {
  return (
    <Modal
      show={show}
      onHide={close}
      backdrop="static"
      keyboard="false"
      centered
    >

      <Modal.Body
        style={{ display: "flex", justifyContent: "center", border: "0 none" }}
      >
        Cмените язык!
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
