import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const getLatestStory = createAsyncThunk("story/latest", async ({limit,topic}) => {
  const data  = await FetchData(`/story/latest/${topic}?limit=${limit}`);
  return data;
});

const LatestStorySlice = createSlice({
  name: "latest",
  initialState: {
    isfetchinglatest: true,
    latestStories: [],    
  },
  extraReducers: {
    [getLatestStory.fulfilled]: (state, action) => {
      state.isfetchinglatest = false;      
      state.latestStories = action.payload.stories;
    },
  },
});

export default LatestStorySlice.reducer;