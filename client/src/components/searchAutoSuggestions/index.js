import React, { useContext } from "react";
import { SearchContext } from "../../contexts/Search";
import "./searchSuggestions.css";

function SearchAutoSuggestions({ focusIndex, handleAutoSuggestClick }) {
  const [state] = useContext(SearchContext);

  return (
    <>
      {!state.autoSuggests &&
        state.search.length > 0 &&
        state.searchResults.length > 0 && (
          <div className="search-suggestions">
            {state.searchResults.map((item, index) => (
              <div
                onMouseDown={() => handleAutoSuggestClick(index)}
                key={index}
                className={
                  focusIndex === index ? "autosuggest active" : "autosuggest"
                }
              >
                {item}
              </div>
            ))}
          </div>
        )}
    </>
  );
}

export default SearchAutoSuggestions;
