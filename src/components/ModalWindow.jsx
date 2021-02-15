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
      <Modal.Body
        style={{ display: "flex", justifyContent: "center", alignItems: "center",  border: "0 none" }}
      >
        <h4>Вы готовы?</h4>
      </Modal.Body>
      <Modal.Footer
        style={{ display: "flex", justifyContent: "center", border: "0 none" }}
      >
        <Button variant="primary" onClick={close}>
          Приступить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalWindow;
