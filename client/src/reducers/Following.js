import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const FetchFollowingStory = createAsyncThunk("user/followingstories", async ({currindex}) => {
  const data  = await FetchData(`/user/getfollowingstory?currindex=${currindex}`);
  return data;
});

const FollowingStorySlice = createSlice({
  name: "followingstory",
  initialState: {
    isFetching: true,
    Followingstories: [],
    currindex:0,
  },
  reducers:{    
    SaveUnsaveStory(state,action){
      state.Followingstories.forEach(function(x){
        if(x._id===action.payload){
          x.isSaved = !x.isSaved;
        }
      })
    }
  },
  extraReducers: {
    [FetchFollowingStory.fulfilled]: (state, action) => {
      state.isFetching = !action.payload.isEnded;
      state.currindex = state.currindex + action.payload.stories.length;
      state.Followingstories = [...state.Followingstories,action.payload.stories];
    },
  },
});

export const {
  SaveUnsaveStory
} = FollowingStorySlice.actions;

export default FollowingStorySlice.reducer;