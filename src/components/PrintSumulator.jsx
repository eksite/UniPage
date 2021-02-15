import React, {
  useState,
  useEffect,
  createRef,
  useCallback,
  useRef,
} from "react";
import ModalWindow from "./ModalWindow.jsx";
import ModalError from "./ModalError.jsx";
import ModalResult from "./ModalError.jsx";
import useLoadData from "../hooks/useLoadData.jsx";
import { useParamsState } from "../context/ParamsContext.jsx";
import { currentTime } from "../utils/time.jsx";
import styled from "styled-components";
import { Bullseye, Speedometer, ArrowRepeat } from "react-bootstrap-icons";

const url =
  "https://baconipsum.com/api/?type=all-meat&paras=1&start-with-lorem=1";

const Container = styled.div`
  display: flex;
  margin: 0 auto;
  flex-direction: row;
  justify-content: space-around;
  width: 900px;
  margin-top: 200px;
  background-color: #f1ece9;
  padding: 30px 0 30px 45px;
  border-radius: 10px;
`;
const TextContainer = styled.div`
  width: 680px;
`;

const Span = styled.span`
  border-radius: 3px;
  font-size: 21px;
`;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 125px;
  padding: 5px 0px 0px 0px;
`;

const Accuracy = styled.div`
  display: flex;
  flex-direction: column;
`;

const LetterPerMinute = styled.div`
  display: flex;
  flex-direction: column;
`;

const DataContainer = styled.div`
  display: flex;
  height: 25px;
`;

const ParagraphContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ButtonContainer = styled.div``;
// TODOTODOTODOTODOTDOTOFDJLKJHnfgkdjsf
const ButtonText = styled.p`
  font-weight: bold;
  color: #2f5d8c;
  padding-left: 5px;
  font-size: 15px;
`;

const RestartButton = styled.button`
  padding: 0;
  background-color: #f1ece9;
  border: none;
`;
// TODOTODOTODOTODOTDOTOFDJLKJHnfgkdjsf
const H6 = styled.div`
  padding-left: 5px;
`;

const Paragraph = styled.p`
  font-size: 32px;
`;

const PrintSimulator = () => {
  const paramsState = useParamsState();
  const [time, setTime] = useState(currentTime());
  const [refs, setRefs] = useState([]);
  const [textArray, setTextArray] = useState([]);
  const [modalShow, setModalShow] = useState(true);
  const [errorShow, setErrorShow] = useState(false);
  const [resultShow, setResultShow] = useState(false);
  const [errorsCount, setErrorsCount] = useState(0);
  const correctWords = useRef(0);
  const accuracy = useRef(100);
  const lpm = useRef(0);
  const cursorRef = useRef(0);
  const [isStart, setIsStart] = useState(false);
  const secondsPassed = useRef(0);
  const { simulatorText, doFetch } =
    useLoadData(
      "https://baconipsum.com/api/?type=all-meat&paras=1&start-with-lorem=1"
    ) || [];

  //timer + lpm counting
  useEffect(() => {
    let interval;
    if (isStart) {
      interval = setInterval(() => {
        secondsPassed.current = secondsPassed.current + 1;
        setTime(currentTime());
        console.log(correctWords.current, secondsPassed.current, )
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
      if (cursorRef.current == refs.length - 1) {
        setResultShow(true);
        return;
      }
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
      refs[cursorRef.current].current.style.padding = "0";
      refs[cursorRef.current].current.style.color = "green";
      refs[cursorRef.current].current.style.backgroundColor = "";
      refs[cursorRef.current + 1].current.style.backgroundColor = "#698C84";
      refs[cursorRef.current + 1].current.style.padding = "3px";
      correctWords.current++;
      cursorRef.current++;
    },
    [refs, isStart]
  );

  const toggleTimer = () => {
    setIsStart(!isStart);
  };

  useEffect(() => {
    const newAccuracy =
      (Math.abs(errorsCount - textArray.length) / textArray.length) * 100 ||
      100;
    accuracy.current = newAccuracy;
  }, [errorsCount]);

  const isModalDisabled = () => {
    return !modalShow && !errorShow && !resultShow ? true : false;
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
        return /^[\.\-\=\+\_\(\)\>\<\'\"\:\;а-яА-ЯЁё0-9,!?  ]*$/.test(latter);
      }
      case "eng": {
        return /^[\.\-\=\+\_\(\)\>\<\'\"\:\;a-zA-Z0-9,!? ]*$/.test(latter);
      }
      default:
    }
  };

  const handleClose = () => {
    return setModalShow(!modalShow);
  };

  const errorClose = () => {
    return setErrorShow(!errorShow);
  };

  const restart = () => {
    resetAllData();
    doFetch();
    refs[0].current.style.backgroundColor = "#698C84";
  };

  const resetAllData = () => {
    for (let i = 0; i <= correctWords.current; i++) {
      refs[i].current.style.color = "black";
      refs[i].current.style.backgroundColor = "";
    }
    correctWords.current = 0;
    lpm.current = 0;
    secondsPassed.current = 0;
    cursorRef.current = 0;
    toggleTimer();
    setModalShow(true);
    setIsStart(false);
    setErrorsCount(0);
  };

  return (
    <Container>
      <ModalResult show={resultShow} lpm={lpm.current} accuracy={accuracy.current} restart={restart}/>
      <ModalError show={errorShow} close={errorClose} />
      <ModalWindow show={modalShow} close={handleClose} />
      <TextContainer>
        {textArray
          ? textArray.map((item, idx) =>
              idx == 0 ? (
                <Span
                  ref={refs[idx]}
                  key={idx}
                  style={{ backgroundColor: "#698C84" }}
                >
                  {item}
                </Span>
              ) : (
                <Span ref={refs[idx]} key={idx}>
                  {item}
                </Span>
              )
            )
          : ""}
      </TextContainer>
      <StatsContainer>
        <Accuracy>
          <DataContainer>
            <Bullseye size={24} />
            <H6>точность</H6>
          </DataContainer>
          <ParagraphContainer>
            <Paragraph>{accuracy.current.toFixed(1)}</Paragraph>%
          </ParagraphContainer>
        </Accuracy>
        <LetterPerMinute>
          <DataContainer>
            <Speedometer size={24} />
            <H6>скорость</H6>
          </DataContainer>
          <ParagraphContainer>
            <Paragraph>{lpm.current} </Paragraph>
            зн/мин
          </ParagraphContainer>
        </LetterPerMinute>
        <ButtonContainer>
          <RestartButton>
            <DataContainer onClick={restart}>
              <ArrowRepeat size={22} color="#2F5D8C" />
              <ButtonText>заново</ButtonText>
            </DataContainer>
          </RestartButton>
        </ButtonContainer>
      </StatsContainer>
    </Container>
  );
};

export default PrintSimulator;
