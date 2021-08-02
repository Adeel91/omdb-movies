import React, { createContext, useReducer } from "react";
import { reducer, initialState } from "./reducer";

export const SearchContext = createContext({
  state: initialState,
});

export const SearchProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <SearchContext.Provider value={[state, dispatch]}>
      {children}
    </SearchContext.Provider>
  );
};
