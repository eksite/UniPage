import React, { useReducer, useContext } from "react";

const ParamsStateContext = React.createContext();
const ParamsDispatchContext = React.createContext();

const initialState = {
  textLanguage: "ru",
  textForType: "",
};

const paramsReducer = (action, state) => {
  return state;
};

const ParamsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(paramsReducer, initialState);

  const changeLanguage = (lang) => {
    dispatch({ type: "CHANGE_LANGUAGE", lang });
  };

  const updateText = (text) => {
    dispatch({ type: "UPDATE_TEXT", text });
  };

  return (
    <ParamsStateContext.Provider value={state}>
      <ParamsDispatchContext.Provider
        value={{ dispatch, changeLanguage, updateText }}
      >
        {children}
      </ParamsDispatchContext.Provider>
    </ParamsStateContext.Provider>
  );
};

const useParamsDispatch = () => {
  const context = useContext(ParamsDispatchContext);
  if (context === undefined) {
    throw new Error("useParamsDispatch must be used within a ParamsProvider");
  }
  return context;
};

const useParamsState = () => {
  const context = useContext(ParamsStateContext);
  if (context === undefined) {
    throw new Error("useParamsState must be used within a ParamsProvider");
  }
  return context;
};

export { ParamsProvider, useParamsState, useParamsDispatch };
