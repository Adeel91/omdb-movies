import Actions from "../constants";

export const errorMessage = (error) => ({
  type: Actions.FETCH_FAILURE,
  error,
});
