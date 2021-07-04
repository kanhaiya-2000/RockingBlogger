import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const getSearchedUser = createAsyncThunk("user/search", async ({currIndex,term}) => {
  const body = {
    term
  }
  const data  = await FetchData(`/user/search?currIndex=${currIndex}`,{body});
  return data;
});

const SearchedUserSlice = createSlice({
  name: "searchpeople",
  initialState: {
    isFetching: true,
    SearchedUsers: [],
    currIndex:0,
  },
  extraReducers: {
    [getSearchedUser.fulfilled]: (state, action) => {
      state.isFetching = action.payload.users.length!=0;
      state.currIndex = state.currIndex + action.payload.users.length;
      state.SearchedUsers = [...state.SearchedUsers,action.payload.users];
    },
  },
});

export default SearchedUserSlice.reducer;