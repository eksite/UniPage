import React, { useEffect, useReducer } from "react";
import ModalWindow from "./ModalWindow.jsx";
import ModalError from "./ModalError.jsx";
import ModalResult from "./ModalResult.jsx";
import useLoadData from "../hooks/useLoadData.jsx";
import { useParamsState } from "../context/ParamsContext.jsx";
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

const BaseLetter = styled.span`
  border-radius: 3px;
  font-size: 21px;
`;

const ValidLetter = styled(BaseLetter)`
  padding: 0;
  color: green;
  background-color: "";
`;

const CursorLetter = styled(BaseLetter)`
  background-color: #698c84;
  padding: 3px;
`;

const InvalidLetter = styled(BaseLetter)`
  background-color: red;
  padding: 3px;
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

const DEFAULT_STATE = {
  leftSide: [],
  rightSide: [],
  isTimerToggled: false,
  startModal: true,
  errorModal: false,
  resultModal: false,
  keyPressAmount: 0,
  counter: 0,
  invalidCharAtCursor: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "fetch_success": {
      const rightSide = action.text.length
        ? prepareCharArray(action.text[0])
        : [];
      return { ...state, rightSide: rightSide };
    }
    case "increment_counter":
      return { ...state, counter: state.counter + 1 };
    case "show_error_modal":
      return { ...state, errorModal: true, isTimerToggled: false };
    case "show_start_modal": {
      return { ...state, startModal: true };
    }
    case "close_error_modal":
      return { ...state, errorModal: false };
    case "close_start_modal":
      return { ...state, startModal: false };
    case "invalid_char":
      return {
        ...state,
        invalidCharAtCursor: true,
        isTimerToggled: true,
        keyPressAmount: state.keyPressAmount + 1,
      };
    case "valid_char": {
      const rightSide = state.rightSide;
      const char = rightSide.shift();
      let isEnd = rightSide.length === 0;
      return {
        ...state,
        invalidCharAtCursor: false,
        isTimerToggled: !isEnd,
        keyPressAmount: state.keyPressAmount + 1,
        leftSide: [...state.leftSide, char],
        rightSide: rightSide,
        resultModal: isEnd,
      };
    }
    case "reset": {
      return { ...DEFAULT_STATE, resultModal: false };
    }
  }
};

const prepareCharArray = (text) => text?.replace(/  +/g, " ").split("").slice(0,10);

const PrintSimulator = () => {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);
  const { simulatorText, doFetch } = useLoadData(URL) || [];
  const paramsState = useParamsState();
  let lpm = 0;

  if (state.leftSide.length > 0 && state.counter > 0) {
    lpm = Math.round(state.leftSide.length / (state.counter / 60));
  }

  useEffect(() => {
    dispatch({ type: "fetch_success", text: simulatorText });
  }, [simulatorText]);

  useEffect(() => {
    let interval;
    if (state.isTimerToggled) {
      interval = setInterval(() => {
        dispatch({ type: "increment_counter" });
      }, 1000);
    }
    console.log(state.counter)
    return () => {
      clearInterval(interval);
    };
  }, [state.counter, state.isTimerToggled]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isCorrectLanguage(e.key)) {
        dispatch({ type: "show_error_modal" });
        return;
      }
      if (e.repeat) return;
      if (e.key == "Shift" || e.key == "Alt") return;

      if (state.rightSide[0] !== e.key) {
        dispatch({ type: "invalid_char" });
        return;
      }
      dispatch({ type: "valid_char" });
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [state.rightSide]);

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
    dispatch({ type: "reset" });
    doFetch();
  };

  const getAccuracy = () => {
    let accuracy =
      state.keyPressAmount > 0 && state.leftSide.length > 0
        ? (state.leftSide.length / state.keyPressAmount) * 100
        : 0;
    return accuracy.toFixed(1);
  };

  const renderLeftSide = () => {
    if (state.leftSide.length === 0) {
      return "";
    }
    return state.leftSide.map((item, idx) => (
      <ValidLetter key={`left-${idx}`}>{item}</ValidLetter>
    ));
  };


  const renderCursorElement = (item) => {
    if (state.invalidCharAtCursor) {
      return <InvalidLetter idx="right-0">{item}</InvalidLetter>;
    }
    return <CursorLetter idx="right-0">{item}</CursorLetter>;
  };

 
  const renderRightSide = () => {
    if (state.rightSide.length === 0) {
      return "";
    }

    return state.rightSide.map((item, idx) =>
      idx === 0 ? (
        renderCursorElement(item)
      ) : (
        <BaseLetter key={`right-${idx}`}>{item}</BaseLetter>
      )
    );
  };

  return (
    <Container>
      <ModalResult
        show={state.resultModal}
        lpm={lpm}
        accuracy={getAccuracy()}
        restart={restart}
      />
      <ModalError
        show={state.errorModal}
        close={() => dispatch({ type: "close_error_modal" })}
      />
      <ModalWindow
        show={state.startModal}
        close={() => dispatch({ type: "close_start_modal" })}
      />
      <TextContainer>
        {renderLeftSide()}
        {renderRightSide()}
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
            <Paragraph>{lpm} </Paragraph>
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
