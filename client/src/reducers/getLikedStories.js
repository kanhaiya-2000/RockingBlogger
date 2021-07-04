import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const getLikedstory = createAsyncThunk("user/likedstory", async ({curr4Index}) => {
  const data  = await FetchData(`/user/getuserdata?currIndex=${curr4Index}&data=likedstory`);
  return data;
});

const LikedstorySlice = createSlice({
  name: "likedstory",
  initialState: {
    isFetchingLiked: true,
    Likedstories: [],
    curr4Index:0,
  },
  extraReducers: {
    [getLikedstory.fulfilled]: (state, action) => {
      state.isFetchingLiked = action.payload.stories.length!==0;
      state.curr4index = state.currIndex + action.payload.stories.length;
      state.Likedstories = [...state.Likedstories,action.payload.stories];
    },
  },
});

export default LikedstorySlice.reducer;