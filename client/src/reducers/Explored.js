import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const getExplored = createAsyncThunk("user/explore", async ({currIndex}) => {
  const data  = await FetchData(`/user/getsuggestedstory?currIndex=${currIndex}`);
  return data;
});

const ExploredSlice = createSlice({
  name: "explore",
  initialState: {
    isFetching: true,
    exploredstories: [],
    currIndex:0,
  },
  reducers:{    
    SaveUnsaveStoryInExplored(state,action){
      state.exploredstories.forEach(function(x){
        if(x._id===action.payload){
          x.isSaved = !x.isSaved;
        }
      })
    }
  },
  extraReducers: {
    [getExplored.fulfilled]: (state, action) => {
      state.isFetching = !action.payload.isEnded;
      state.currIndex = state.currIndex + action.payload.stories.length;
      state.exploredstories = [...state.exploredstories,action.payload.stories];
    },
  },
});

export const {
  SaveUnsaveStoryInExplored
} = ExploredSlice.actions;

export default ExploredSlice.reducer;