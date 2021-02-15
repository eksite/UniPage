import React, {
  useState,
  useEffect,
  createRef,
  useCallback,
  useRef,
} from "react";
import ModalWindow from "./ModalWindow.jsx";
import ModalError from "./ModalError.jsx";
import ModalResult from "./ModalResult.jsx";
import useLoadData from "../hooks/useLoadData.jsx";
import useToggle from "../hooks/useToggle.jsx";
import { useParamsState } from "../context/ParamsContext.jsx";
import { currentTime } from "../utils/time.jsx";
import styled from "styled-components";
import { Bullseye, Speedometer, ArrowRepeat } from "react-bootstrap-icons";

const RU_REGEX = /^[\.\-\=\+\_\(\)\>\<\'\"\:\;а-яА-ЯЁё0-9,!?  ]*$/;
const ENG_REGEX = /^[\.\-\=\+\_\(\)\>\<\'\"\:\;a-zA-Z0-9,!? ]*$/;
const URL =
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

const Properties = styled.p`
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
  const [startModal, toggleStartModal] = useToggle(true);
  const [errorModal, toggleErrorModal] = useToggle(false);
  const [resultModal, toggleResultModal] = useToggle(false);
  const correctLetters = useRef(0);
  const lpm = useRef(0);
  const amountOfKeyPress = useRef(0);
  const cursorRef = useRef(0);
  const [isTimerToggled, toggleTimer] = useToggle(false);
  const secondsPassed = useRef(0);
  const { simulatorText, doFetch } = useLoadData(URL) || [];

  //timer + lpm counting
  useEffect(() => {
    let interval;
    if (isTimerToggled) {
      interval = setInterval(() => {
        secondsPassed.current = secondsPassed.current + 1;
        setTime(currentTime());
        console.log(correctLetters.current, secondsPassed.current);
      }, 1000);
    }
    if (correctLetters.current > 0 && secondsPassed.current > 0) {
      lpm.current = Math.round(
        correctLetters.current / (secondsPassed.current / 60)
      );
    }
    return () => {
      clearInterval(interval);
    };
  }, [time, isTimerToggled]);

  //creating refs for all array's element's
  useEffect(() => {
    const newTextArray = simulatorText.length
      ? simulatorText[0]?.replace(/  +/g, ' ').split("").slice(0, 100)
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
  const validateLetter = useCallback(
    (e) => {
      if (!isCorrectLanguage(e.key)) {
        toggleErrorModal();
        toggleTimer();
        return;
      }
      if (e.repeat) return;
      if (e.key == "Shift" || e.key == "Alt") return;
        amountOfKeyPress.current++;    
      if (textArray[cursorRef.current] !== e.key) {
        refs[cursorRef.current].current.style.backgroundColor = "red";
        return;
      }
      if (!isTimerToggled) {
        toggleTimer();
      }
      refs[cursorRef.current].current.style.padding = "0";
      refs[cursorRef.current].current.style.color = "green";
      refs[cursorRef.current].current.style.backgroundColor = "";
      if (refs[cursorRef.current + 1]) {
        refs[cursorRef.current + 1].current.style.backgroundColor = "#698C84";
        refs[cursorRef.current + 1].current.style.padding = "3px";
      }
      correctLetters.current++;
      cursorRef.current++;
      if (cursorRef.current >= refs.length) {
        toggleTimer();
        toggleResultModal(true);
        return;
      }
    },
    [refs, isTimerToggled]
  );

  const isModalsDisabled = () => {
    return startModal || errorModal || resultModal ? false : true;
  };

  useEffect(() => {
    if (textArray && isModalsDisabled()) {
      window.addEventListener("keydown", validateLetter);
    }
    return () => {
      window.removeEventListener("keydown", validateLetter);
    };
  }, [validateLetter, isModalsDisabled]);

  const isCorrectLanguage = (latter) => {
    switch (paramsState.textLanguage) {
      case "ru": {
        return RU_REGEX.test(latter);
      }
      case "eng": {
        return ENG_REGEX.test(latter);
      }
      default:
    }
  };

  const restart = () => {
    resetAllData();
    doFetch();
    refs[0].current.style.backgroundColor = "#698C84";
    if (resultModal) {
      toggleResultModal();
    }
    toggleStartModal();
  };

  const resetAllData = () => {
    refs.forEach((item) => {
      item.current.style.color = "black";
      item.current.style.backgroundColor = "";
      item.current.style.padding = "0px";
    });
    setAmountOfKeyPress(0);
    correctLetters.current = 0;
    lpm.current = 0;
    secondsPassed.current = 0;
    cursorRef.current = 0;
    toggleTimer();
  };

  const getAccuracy = () => {
    let accurancy = amountOfKeyPress.current > 0 ? (correctLetters.current / amountOfKeyPress.current ) * 100  : 100;
    return accurancy.toFixed(1);
  };

  return (
    <Container>
      <ModalResult
        show={resultModal}
        lpm={lpm.current}
        accuracy={getAccuracy()}
        restart={restart}
      />
      <ModalError show={errorModal} close={toggleErrorModal} />
      <ModalWindow show={startModal} close={toggleStartModal} />
      <TextContainer>
        {textArray
          ? textArray.map((item, idx) =>
              idx == 0 ? (
                <Span
                  ref={refs[idx]}
                  key={idx}
                  style={{ backgroundColor: "#698C84", padding: "3px" }}
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
            <Properties>точность</Properties>
          </DataContainer>
          <ParagraphContainer>
            <Paragraph>{getAccuracy()}</Paragraph>%
          </ParagraphContainer>
        </Accuracy>
        <LetterPerMinute>
          <DataContainer>
            <Speedometer size={24} />
            <Properties>скорость</Properties>
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
