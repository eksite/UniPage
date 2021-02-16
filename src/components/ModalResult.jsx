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
        <Modal.Title>Молодец!</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{ display: "flex", justifyContent: "center", border: "0 none" }}
      >
        <ul style={{listStyleType: "none", padding: "0px"}}>
          <li>Скорость - {lpm} зн/мин</li>
          <li>Точность - {accuracy} %</li>
        </ul>
      </Modal.Body>
      <Modal.Footer
        style={{ display: "flex", justifyContent: "center", border: "0 none" }}
      >
        <Button variant="primary" onClick={restart}>
          Попробовать снова
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalResult;
