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
  reducers:{    
    SaveUnsaveSearchStory(state,action){
      state.Searchedstories.forEach(function(x){
        if(x._id===action.payload){
          x.isSaved = !x.isSaved;
        }
      })
    }
  },
  extraReducers: {
    [getSearchedstory.fulfilled]: (state, action) => {
      state.isFetchingStory = (action.payload.stories.length!==0);
      state.curr2index = state.curr2Index + action.payload.stories.length;
      state.Searchedstories = [...state.Searchedstories,action.payload.stories];
    },
  },
});
export const {
  SaveUnsaveSearchStory
} = SearchedstorySlice.actions;

export default SearchedstorySlice.reducer;