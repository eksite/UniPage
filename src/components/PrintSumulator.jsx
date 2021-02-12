import React, { useState, useEffect } from "react";
import ModalWindow from "./ModalWindow.jsx";
// import { useParamsDispatch } from "../context/ParamsContext.jsx";
import useLoadData from "../hooks/useLoadData.jsx";

const PrintSimulator = () => {
  const [textArray, setTextArray] = useState([]);
  const [modalShow, setModalShow] = useState(true);
  const simulatorText = useLoadData(
    "https://baconipsum.com/api/?type=all-meat&paras=1&start-with-lorem=1"
  );

  

  useEffect(() => {
    if (simulatorText) {
      const splitArray = () => {
        const arr = simulatorText[0].split("");
        setTextArray(arr);
      };
      splitArray();
    }
    console.log(textArray)
  }, [simulatorText]);

  const handleClose = () => {
    if (modalShow) {
      return setModalShow(false);
    }
    return setModalShow(true);
  };
 
  return (
    <>
      <ModalWindow handleClose={handleClose} modalShow={modalShow} />
      {textArray ? textArray.map((item)=><span>{item}</span>): ""}
    </>
  );
};

export default PrintSimulator;
