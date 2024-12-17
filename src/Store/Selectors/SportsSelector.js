import { createSelector } from "@reduxjs/toolkit";

export const selectSportsState = (state) => state.sports;

export const selectSportsList = createSelector(
  [selectSportsState],
  (sportsState) => sportsState.sportsList
);

export const selectLoading = createSelector(
  [selectSportsState],
  (sportsState) => sportsState.loading
);

export const selectError = createSelector(
  [selectSportsState],
  (sportsState) => sportsState.error
);
