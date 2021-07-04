import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const getMystory = createAsyncThunk("user/mystory", async ({currIndex}) => {
  const data  = await FetchData(`/user/getuserdata?currIndex=${currIndex}&data=mystory`);
  return data;
});

const MystorySlice = createSlice({
  name: "Mystory",
  initialState: {
    isFetchingMyStories: true,
    Mystories: [],
    currIndex:0,
  },
  extraReducers: {
    [getMystory.fulfilled]: (state, action) => {
      state.isFetchingMyStories = action.payload.stories.length!==0;
      state.currindex = state.currIndex + action.payload.stories.length;
      state.Mystories = [...state.Mystories,action.payload.stories];
    },
  },
});

export default MystorySlice.reducer;