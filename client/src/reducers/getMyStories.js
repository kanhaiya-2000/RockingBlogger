import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const FetchMystory = createAsyncThunk("user/mystory", async ({currindex,user}) => {
  const data  = await FetchData(`/user/getuserdata/${user}?currIndex=${currindex}&data=mystory`);
  return data;
});

const MystorySlice = createSlice({
  name: "Mystory",
  initialState: {
    isFetchingMyStories: true,
    Mystories: [],
    currindex:0,
  },
  reducers:{    
    SaveUnsaveMyStory(state,action){
      state.Mystories.forEach(function(x){
        if(x._id===action.payload){
          x.isSaved = !x.isSaved;
        }
      })
    },
    addToMyStoryList(state,action){
      state.Mystories = [
        action.payload,
        ...state.Mystories
      ]
    },
    removeFromMyStoryList(state,action){
      state.Mystories = state.Mystories.filter(function(x){return x._id!==action.payload})
    }
  },
  extraReducers: {
    [FetchMystory.fulfilled]: (state, action) => {
      state.isFetchingMyStories = action.payload.stories.length!==0;
      state.currindex = state.currindex + action.payload.stories.length;
      state.Mystories = [...state.Mystories , ...action.payload.stories];
    },
  },
});

export const {
  SaveUnsaveMyStory,
  addToMyStoryList,
  removeFromMyStoryList
} = MystorySlice.actions;

export default MystorySlice.reducer;