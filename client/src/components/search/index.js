import React, { useState, useEffect, useContext } from "react";
import { SearchContext } from "../../contexts/Search";
import Button from "../button";
import Input from "../input";
import "./search.css";
import SearchAutoSuggestions from "../searchAutoSuggestions";
import { useDispatch } from "react-redux";
import { searchMovies } from "../../store/actions/movies";

const Search = ({ moviesAutosuggestions }) => {
  const [focusIndex, setFocusIndex] = useState(-1);
  const [state, dispatch] = useContext(SearchContext);
  const [searchResults, setSearchResults] = useState([]);

  const reduxDispatch = useDispatch();

  const keys = {
    ENTER: 13,
    ARROW_UP: 38,
    ARROW_DOWN: 40,
  };

  useEffect(() => {
    setSearchResults(moviesAutosuggestions);
  }, [moviesAutosuggestions]);

  const updateSearch = (e) => {
    showAutoSuggest();

    const searchTerm = e.target.value;
    updateSearchCriteria(e.target.value);

    if (!searchResults.length) {
      return false;
    }

    let filteredResults = searchResults.filter((result) =>
      result.match(new RegExp(searchTerm, "gi"))
    );
    updateFilteredResults(filteredResults);
  };

  const hideAutoSuggest = () => {
    dispatch({ type: "DISPLAY_AUTO_SUGGESTS", payload: true });
    setFocusIndex(-1);
  };

  const showAutoSuggest = () => {
    dispatch({ type: "DISPLAY_AUTO_SUGGESTS", payload: false });
  };

  const navigateSearchList = (data) => {
    data = typeof data === "string" && data === "" ? data : state.search;

    hideAutoSuggest();
    reduxDispatch(searchMovies(data));
  };

  const handleNavigation = (e) => {
    switch (e.keyCode) {
      case keys.ENTER:
        if (focusIndex > -1) {
          updateFilteredResults([state.searchResults[focusIndex]]);
        }

        navigateSearchList();
        break;
      case keys.ARROW_UP:
        if (focusIndex > 0) {
          setFocusIndex(focusIndex - 1);
          updateSearchCriteria(state.searchResults[focusIndex - 1]);
        }
        break;
      case keys.ARROW_DOWN:
        if (focusIndex < state.searchResults.length - 1) {
          setFocusIndex(focusIndex + 1);
          updateSearchCriteria(state.searchResults[focusIndex + 1]);
        }
        break;
      default:
        break;
    }
  };

  const updateSearchCriteria = (payloadData) => {
    dispatch({ type: "SEARCH_TEXT", payload: payloadData });
  };

  const updateFilteredResults = (payloadData) => {
    dispatch({ type: "FILTERED_RESULTS", payload: payloadData });
  };

  const handleAutoSuggestClick = (index) => {
    hideAutoSuggest();
    updateSearchCriteria(state.searchResults[index]);
    updateFilteredResults([state.searchResults[index]]);
  };

  const handleResetSearchCriteria = (index) => {
    hideAutoSuggest();
    updateSearchCriteria("");
    updateFilteredResults([]);
    navigateSearchList("");
  };

  return (
    <section className="search">
      <div className="search-wrapper">
        <Input
          placeholder="Please enter search term here..."
          searchValue={state.search}
          onChangeHandle={updateSearch}
          onKeyDownHandle={handleNavigation}
          onBlurHandle={hideAutoSuggest}
          onFocusHandle={showAutoSuggest}
        />

        {state.search.length > 0 && (
          <Button
            icon="x"
            size={30}
            btnClass="reset-btn"
            onClickHandle={handleResetSearchCriteria}
          />
        )}

        <Button
          icon="search"
          size={18}
          btnClass="search-btn"
          onClickHandle={navigateSearchList}
        />
      </div>

      <SearchAutoSuggestions
        focusIndex={focusIndex}
        handleAutoSuggestClick={handleAutoSuggestClick}
      />
    </section>
  );
};

export default Search;
