import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const getSavedStory = createAsyncThunk("user/savedstory", async ({curr5Index}) => {
  const data  = await FetchData(`/user/getuserdata?currIndex=${curr5Index}&data=savedstory`);
  return data;
});

const SavedStorySlice = createSlice({
  name: "SavedStory",
  initialState: {
    isFetchingSaved: true,
    SavedStories: [],
    curr5Index:0,
  },
  extraReducers: {
    [getSavedStory.fulfilled]: (state, action) => {
      state.isFetchingSaved = action.payload.stories.length!==0;
      state.curr5index = state.curr5Index + action.payload.stories.length;
      state.SavedStories = [...state.SavedStories,action.payload.stories];
    },
  },
});

export default SavedStorySlice.reducer;