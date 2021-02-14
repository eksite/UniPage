import React, {
  useState,
  useEffect,
  createRef,
  useCallback,
  useRef,
} from "react";
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
  const [refs, setRefs] = useState([]);
  const [errorsCount, setErrorsCount] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const stateRef = useRef(0);

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
      if (e.repeat) return;
      if (textArray[stateRef.current] !== e.key) {
        if (e.key == "Shift") return;
        setErrorsCount((prevState) => prevState + 1);
        refs[stateRef.current].current.style.backgroundColor = "red";
        return;
      }
      refs[stateRef.current].current.style.color = "green";
      refs[stateRef.current].current.style.backgroundColor = "";
      refs[stateRef.current + 1].current.style.backgroundColor = "green";
      stateRef.current++;
    },
    [refs]
  );

  useEffect(() => {
    const newAccuracy =
      (Math.abs(errorsCount - textArray.length) / textArray.length) * 100;
    setAccuracy(newAccuracy);
  }, [errorsCount, textArray]);

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
      <ModalWindow show={modalShow} close={handleClose} />
      {textArray
        ? textArray.map((item, idx) =>
            idx == 0 ? (
              <span
                ref={refs[idx]}
                key={idx}
                style={{ backgroundColor: "green" }}
              >
                {item}
              </span>
            ) : (
              <span ref={refs[idx]} key={idx}>
                {item}
              </span>
            )
          )
        : ""}
      <div>{accuracy.toFixed(2)}</div>
    </>
  );
};

export default PrintSimulator;
