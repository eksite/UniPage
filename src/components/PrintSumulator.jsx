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
import { currentTime } from "../utils/time.jsx";

const PrintSimulator = () => {
  const paramsState = useParamsState();
  const simulatorText =
    useLoadData(
      "https://baconipsum.com/api/?type=all-meat&paras=1&start-with-lorem=1"
    ) || [];
  const [time, setTime] = useState(currentTime());
  const [refs, setRefs] = useState([]);
  const [textArray, setTextArray] = useState([]);
  const [modalShow, setModalShow] = useState(true);
  const [errorShow, setErrorShow] = useState(false);
  const [errorsCount, setErrorsCount] = useState(0);
  const correctWords = useRef(0);
  const [accuracy, setAccuracy] = useState(100);
  const lpm = useRef(0);
  const cursorRef = useRef(0);
  const [isStart, setIsStart] = useState(false);
  const secondsPassed = useRef(0);

  //timer + lpm counting
  useEffect(() => {
    let interval;
    if (isStart) {
      interval = setInterval(() => {
        secondsPassed.current = secondsPassed.current + 1;
        setTime(currentTime());
      }, 1000);
    }
    if (correctWords.current > 0 && secondsPassed.current > 0) {
      lpm.current = Math.round(
        correctWords.current / (secondsPassed.current / 60)
      );
    }
    return () => {
      clearInterval(interval);
    };
  }, [time, isStart]);

  //creating refs for all array's element's
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

  //compareLatter + start Timer
  const compareLetter = useCallback(
    (e) => {
      if (!isCorrectLanguage(e.key)) {
        setErrorShow(true);
        toggleTimer();
        return;
      }
      if (e.repeat) return;
      if (textArray[cursorRef.current] !== e.key) {
        if (e.key == "Shift") return;
        setErrorsCount((prevState) => prevState + 1);
        refs[cursorRef.current].current.style.backgroundColor = "red";
        return;
      }
      if (!isStart) {
        toggleTimer();
      }
      refs[cursorRef.current].current.style.color = "green";
      refs[cursorRef.current].current.style.backgroundColor = "";
      refs[cursorRef.current + 1].current.style.backgroundColor = "green";
      correctWords.current++;
      cursorRef.current++;
    },
    [refs, isStart]
  );

  const toggleTimer = () => {
    setIsStart(!isStart);
  };

  //todo with ref
  useEffect(() => {
    const newAccuracy =
      (Math.abs(errorsCount - textArray.length) / textArray.length) * 100 ||
      100;
    setAccuracy(newAccuracy);
  }, [errorsCount]);

  const isModalDisabled = () => {
    return !modalShow && !errorShow ? true : false;
  };

  useEffect(() => {
    if (textArray && isModalDisabled()) {
      window.addEventListener("keydown", compareLetter);
    }
    return () => {
      window.removeEventListener("keydown", compareLetter);
    };
  }, [compareLetter, isModalDisabled]);

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
      <div>{accuracy.toFixed(1)}</div>
      <div>{lpm.current}</div>
    </>
  );
};

export default PrintSimulator;
