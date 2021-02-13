import React, { useState, useEffect, createRef, useCallback, useRef } from "react";
import ModalWindow from "./ModalWindow.jsx";
import ModalError from "./ModalError.jsx";
import useLoadData from "../hooks/useLoadData.jsx";
import { useParamsState } from "../context/ParamsContext.jsx";

const PrintSimulator = () => {
  const paramsState = useParamsState();
  const simulatorText =
    useLoadData(
      "https://baconipsum.com/api/?type=all-meat&paras=1&start-with-lorem=1"
    ) || [];

  const [textArray, setTextArray] = useState([]);
  const [modalShow, setModalShow] = useState(true);
  const [errorShow, setErrorShow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [refs, setRefs] = useState([]);
  const stateRef = useRef();

  useEffect(() => {
    const newTextArray = simulatorText.length
      ? simulatorText[0]?.split("")
      : [];
    setTextArray(newTextArray);
  }, [simulatorText]);

  useEffect(() => {
    setRefs(() =>
      Array(textArray.length)
        .fill()
        .map(() => createRef())
    );
  }, [textArray]);

  const compareLetter = useCallback(
    (e) => {
      if (!isCorrectLanguage(e.key)) {
        setErrorShow(true);
      }
      if (textArray[currentIndex] == e.key) {
        setCurrentIndex((prevState) => prevState + 1);
        refs[currentIndex].current.style.color = "green";
        refs[currentIndex].current.style.backgroundColor = "";
        refs[currentIndex + 1].current.style.backgroundColor = "green";
      } else {
        if (e.key == "Shift") return;
        refs[currentIndex].current.style.backgroundColor = "red";
      }
    },
    [textArray, currentIndex]
  );

  useEffect(() => {
    if (textArray) {
      window.addEventListener("keydown", compareLetter);
    }
    return () => {
      window.removeEventListener("keydown", compareLetter);
    };
  }, [compareLetter]);

  const isCorrectLanguage = (latter) => {
    switch (paramsState.textLanguage) {
      case "ru": {
        return /^[\.а-яА-ЯЁё0-9,!?  ]*$/.test(latter);
      }
      case "eng": {
        return /^[\.a-zA-Z0-9,!? ]*$/.test(latter);
      }
      //todo empty default
      default:
    }
  };

  const handleClose = () => {
    return setModalShow(!modalShow);
  };

  const errorClose = () => {
    return setErrorShow(!errorShow);
  };

  return (
    <>
      <ModalError show={errorShow} close={errorClose} />
      <ModalWindow close={handleClose} show={modalShow} />
      {textArray
        ? textArray.map((item, idx) => (
            <span ref={refs[idx]} key={idx}>
              {console.log()}
              {item}
            </span>
          ))
        : ""}
    </>
  );
};

export default PrintSimulator;
