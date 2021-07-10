import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const FetchTrending = createAsyncThunk("story/trending", async ({currIndex}) => {
  const data  = await FetchData(`/story/trending?currIndex=${currIndex}`);
  return data;
});

const TrendingSlice = createSlice({ 
  name: "trendingStory",
  initialState: {
    isFetching: true,
    Trendingstories: [],
    currIndex:0,
  },
  reducers:{  
    ClearTrendingStory(state,action){
      state.isFetching=true;
      state.Trendingstories= [];
      state.currIndex=0     
    },
    SaveUnsaveTrendingStory(state,action){
      state.Trendingstories.forEach(function(x){
        if(x._id===action.payload){
          x.isSaved = !x.isSaved;
        }
      })
    }
  },
  extraReducers: {
    [FetchTrending.fulfilled]: (state, action) => {
      state.isFetching = (action.payload.stories.length!==0);
      state.currIndex = state.currIndex + action.payload.stories.length;
      state.Trendingstories = [...state.Trendingstories,...action.payload.stories];
    },
  },
});

export const {
  SaveUnsaveTrendingStory,
  ClearTrendingStory
} = TrendingSlice.actions;

export default TrendingSlice.reducer;