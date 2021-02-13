import React, { useState, useEffect } from "react";
import ModalWindow from "./ModalWindow.jsx";
import useLoadData from "../hooks/useLoadData.jsx";
import { useParamsState } from "../context/ParamsContext.jsx";

const PrintSimulator = () => {
  const paramsState = useParamsState();
  const simulatorText = useLoadData(
    "https://baconipsum.com/api/?type=all-meat&paras=1&start-with-lorem=1"
  );

  const [textArray, setTextArray] = useState([]);
  const [modalShow, setModalShow] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [elRefs, setElRefs] = useState([]);

  useEffect(() => {
    setElRefs(elRefs => (
      Array(textArray.length).fill().map((_, i) => elRefs[i] || React.createRef())
    ));
  }, [textArray.length]);

  useEffect(() => {
    if (simulatorText) {
      const splitArray = () => {
        // todo ( array )
        setTextArray(simulatorText[0].split(""));
        console.log(textArray);
      };
      splitArray();
    }
  }, [simulatorText]);

  useEffect(() => {
    if (textArray) {
      window.addEventListener("keydown",compareLatter);
    }
    return () => {
      window.removeEventListener("keydown", compareLatter);
    };
  }, [textArray, currentIndex]);

  const isCurrentLatter = (latter) => {
    switch (paramsState.textLanguage) {
      case "ru": {
        return /[а-яА-ЯЁё ]/.test(latter);
      }
      case "eng": {
        return /^[a-zA-Z ]+$/.test(latter);
      }
      default: {
        return "alert";
      }
    }
  };

  const compareLatter = (e) => {
    if (isCurrentLatter(e.key) && textArray[currentIndex] == e.key) {
      setCurrentIndex((prevState) => prevState + 1);
      console.log("isCorrect");
    } else {
      console.log("bad word");
    }
  };

  const handleClose = () => {
    return setModalShow(!modalShow);
  };

  return (
    <>
      <ModalWindow handleClose={handleClose} modalShow={modalShow} />
      {textArray ? textArray.map((item, idx) => <span ref={elRefs[idx]}>{item}</span>) : ""}
    </>
  );
};

export default PrintSimulator;
