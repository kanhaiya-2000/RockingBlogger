import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const FetchNotice = createAsyncThunk("user/notice", async ({currIndex}) => {
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
  reducers:{
    addToNoticeList(state,action){
      state.notices = [
        action.payload,
        ...state.notices
      ]
    },
    removeFromNoticeList(state,action){
      state.notices = state.notices.filter(function(x){return x._id!==action.payload})
    }
  },
  extraReducers: {
    [FetchNotice.fulfilled]: (state, action) => {
      state.isFetching = action.payload.notices.length!==0;
      state.currIndex = state.currIndex + action.payload.notices.length;
      state.notices = [...state.notices,...action.payload.notices];
    },
  },
});

export const {
  addToNoticeList,
  removeFromNoticeList
} = NoticeSlice.actions;

export default NoticeSlice.reducer;