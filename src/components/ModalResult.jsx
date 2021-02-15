import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";


const ModalResult = ({ show, restart, lpm, accuracy }) => {
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
          justifyContent: "center",
          border: "0 none",
        }}
      >
        <Modal.Title>Congratz</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{ display: "flex", justifyContent: "center", border: "0 none" }}
      >
        <ul>
          <li>{lpm}</li>
          <li>{accuracy}</li>
        </ul>
      </Modal.Body>
      <Modal.Footer
        style={{ display: "flex", justifyContent: "center", border: "0 none" }}
      >
        <Button variant="primary" onClick={restart}>
          Приступить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalResult;
