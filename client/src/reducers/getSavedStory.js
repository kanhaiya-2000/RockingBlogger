import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const FetchSavedStory = createAsyncThunk("user/savedstory", async ({curr5Index,user}) => {
  const data  = await FetchData(`/user/getuserdata/${user}?currIndex=${curr5Index}&data=savedstory`);
  return data;
});

const SavedStorySlice = createSlice({
  name: "SavedStory",
  initialState: {
    isFetchingSaved: true,
    SavedStories: [],
    curr5Index:0,
  },
  reducers:{    
    addToSaved(state,action){
      state.SavedStories = [
        action.payload,
        ...state.SavedStories
      ]
    },
    removeFromSaved(state,action){
      state.SavedStories = state.SavedStories.filter(x=>x._id!==action.payload)
      
    },
    saveUnsaveInSavedList(state,action){
      state.SavedStories.forEach(function(x){
        //console.log(x);
        if(x._id===action.payload){
          //console.log("huhu");
          x.isSaved = !x.isSaved;
        }
      })
    }
  },
  extraReducers: {
    [FetchSavedStory.fulfilled]: (state, action) => {
      state.isFetchingSaved = action.payload.stories.length!==0;
      state.curr5Index = state.curr5Index + action.payload.stories.length;
      state.SavedStories = [...state.SavedStories,...action.payload.stories];
    },
  },
});

export const {
  addToSaved,
  removeFromSaved,
  saveUnsaveInSavedList
} = SavedStorySlice.actions;

export default SavedStorySlice.reducer;