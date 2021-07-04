import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const getSearchedstory = createAsyncThunk("story/search", async ({curr2Index,term}) => {
  const data  = await FetchData(`/story/search?currIndex=${curr2Index}`,{body:{term}});
  return data;
});

const SearchedstorySlice = createSlice({
  name: "searchstory",
  initialState: {
    isFetchingStory: true,
    Searchedstories: [],
    curr2Index:0,
  },
  extraReducers: {
    [getSearchedstory.fulfilled]: (state, action) => {
      state.isFetchingStory = action.payload.stories.length!==0;
      state.curr2index = state.curr2Index + action.payload.stories.length;
      state.Searchedstories = [...state.Searchedstories,action.payload.stories];
    },
  },
});

export default SearchedstorySlice.reducer;