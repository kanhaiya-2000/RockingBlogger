import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils";

export const getTrending = createAsyncThunk("story/trending", async ({currIndex}) => {
  const data  = await FetchData(`/story/trending?currIndex=${currIndex}`);
  return data;
});

const TrendingSlice = createSlice({
  name: "trendingStory",
  initialState: {
    isFetching: true,
    Trendingstories: [],
    currIndex:0,
  },
  extraReducers: {
    [getTrending.fulfilled]: (state, action) => {
      state.isFetching = !action.payload.isEnded;
      state.currIndex = state.currIndex + action.payload.stories.length;
      state.Trendingstories = [...state.Trendingstories,action.payload.stories];
    },
  },
});

export default TrendingSlice.reducer;