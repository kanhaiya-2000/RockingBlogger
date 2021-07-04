import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const getNotice = createAsyncThunk("user/notice", async ({currIndex}) => {
  const data  = await FetchData(`/user/getnotice?currIndex=${currIndex}`);
  return data;
});

const NoticeSlice = createSlice({
  name: "Notice",
  initialState: {
    isFetching: true,
    notices: [],
    currIndex:0,
  },
  extraReducers: {
    [getNotice.fulfilled]: (state, action) => {
      state.isFetching = action.payload.notices.length!==0;
      state.currIndex = state.currIndex + action.payload.notices.length;
      state.notices = [...state.notices,action.payload.notices];
    },
  },
});

export default NoticeSlice.reducer;