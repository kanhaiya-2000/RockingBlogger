import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const getreadingList = createAsyncThunk("user/readingList", async ({curr5Index}) => {
  const data  = await FetchData(`/user/getuserdata?currIndex=${curr5Index}&data=readinglist`);
  return data;
});

const readingListSlice = createSlice({
  name: "readingList",
  initialState: {
    isFetchingreadingList:true,
    readingList: [],
    curr5Index:0,
  },
  extraReducers: {
    [getreadingList.fulfilled]: (state, action) => {
      state.isFetchingreadingList = action.payload.stories.length!==0;
      state.curr5index = state.curr5Index + action.payload.stories.length;
      state.readingList = [...state.readingList,action.payload.stories];
    },
  },
});

export default readingListSlice.reducer;