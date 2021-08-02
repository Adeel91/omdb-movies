import Actions from "./constants";

export const reducer = (state, action) => {
  switch (action.type) {
    case Actions.SEARCH_TEXT:
      return {
        ...state,
        search: action.payload,
      };
    case Actions.FILTERED_RESULTS:
      return {
        ...state,
        searchResults: action.payload,
      };
    case Actions.DISPLAY_AUTO_SUGGESTS:
      return {
        ...state,
        autoSuggests: action.payload,
      };

    default:
      return state;
  }
};

export const initialState = {
  search: "",
  searchResults: [],
  autoSuggests: false,
};
