import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const getExplored = createAsyncThunk("user/explore", async ({currIndex}) => {
  const data  = await FetchData(`/user/getsuggestedstory?currIndex=${currIndex}`);
  return data;
});

const ExploredSlice = createSlice({
  name: "explore",
  initialState: {
    isFetching: true,
    exploredstories: [],
    currIndex:0,
  },
  extraReducers: {
    [getExplored.fulfilled]: (state, action) => {
      state.isFetching = !action.payload.isEnded;
      state.currIndex = state.currIndex + action.payload.stories.length;
      state.exploredstories = [...state.exploredstories,action.payload.stories];
    },
  },
});

export default ExploredSlice.reducer;