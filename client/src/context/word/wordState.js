import React, { useReducer } from "react";
import axios from "axios";
import WordContext from "./wordContext";
import wordReducer from "./wordReducer";
import {
  GET_WORDS,
  WORD_ERROR,
  FILTER_WORDS,
  CLEAR_FILTER,
  SET_CURRENT,
  OPEN_MODAL,
  CLOSE_MODAL,
  ADD_NEW_DEFINITION,
  ADD_WORD,
  GET_DEFINITIONS
} from "../types";

const WordState = props => {
  const initialState = {
    suggestDefs: null,
    words: null,
    current: null,
    filtered: null,
    modal: {
      isOpen: false,
      dest: ""
    },
    notification: null,
    error: null
  };

  const [state, dispatch] = useReducer(wordReducer, initialState);

  // Get Words
  const getWords = async () => {
    try {
      const res = await axios.get("/api/terms");
      dispatch({
        type: GET_WORDS,
        payload: res.data
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: WORD_ERROR
      });
    }
  };

  // Add New Definition
  const addNewDefinition = async newterm => {
    const config = { headers: { "Content-Type": "application/json" } };

    try {
      const res = await axios.post("/api/suggest/definition", newterm, config);

      dispatch({
        type: ADD_NEW_DEFINITION,
        payload: res.data
      });
    } catch (error) {
      dispatch({
        type: WORD_ERROR,
        payload: error.response.msg
      });
    }
  };

  // Add New Word Suggestion
  const suggestNewWord = async newterm => {
    const config = { headers: { "Content-Type": "application/json" } };

    console.log(newterm);

    try {
      const res = await axios.post("/api/suggest/newterm", newterm, config);
      // console.log(res.data);
      dispatch({
        type: ADD_WORD,
        payload: res.data
      });
    } catch (error) {
      dispatch({
        type: WORD_ERROR,
        payload: error.response.msg
      });
    }
  };

  // Add New Word (Only Users Can Do)
  const addNewWord = async newterm => {
    const config = { headers: { "Content-Type": "application/json" } };

    // console.log(newterm);

    try {
      const res = await axios.post("/api/terms", newterm, config);
      console.log(res.data);
      dispatch({
        type: ADD_WORD,
        payload: res.data
      });
    } catch (error) {
      dispatch({
        type: WORD_ERROR,
        payload: error.response.msg
      });
    }
  };

  // Set Current Definition
  const setCurrent = word => {
    console.log(<word></word>);
    dispatch({ type: SET_CURRENT, payload: word });
  };

  // Filter Words
  const filterWords = text => {
    dispatch({ type: FILTER_WORDS, payload: text });
  };

  // Clear Filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  // Open Modal Form
  const openModal = dest => {
    dispatch({ type: OPEN_MODAL, payload: dest });
  };

  // Close Modal Form
  const closeModal = () => {
    dispatch({ type: CLOSE_MODAL });
  };

  // ---------------------------- SUGGSESSTION SECTION -------------------------------------//

  // Get all Suggested Definitions
  const getDefs = async () => {
    // const config = { headers: { "Content-Type": "application/json" } };

    try {
      const res = await axios.get("/api/suggest");
      // console.log(res.data);
      dispatch({
        type: GET_DEFINITIONS,
        payload: res.data
      });
    } catch (error) {
      dispatch({
        type: WORD_ERROR,
        payload: error.response.msg
      });
    }
  };

  return (
    <WordContext.Provider
      value={{
        words: state.words,
        suggestDefs: state.suggestDefs,
        notification: state.notification,
        current: state.current,
        filtered: state.filtered,
        modal: state.modal,
        error: state.error,
        getWords,
        addNewDefinition,
        addNewWord,
        suggestNewWord,
        setCurrent,
        filterWords,
        clearFilter,
        openModal,
        closeModal,
        getDefs
      }}
    >
      {props.children}
    </WordContext.Provider>
  );
};

export default WordState;
