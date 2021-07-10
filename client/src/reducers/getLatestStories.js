import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const FetchlatestStory = createAsyncThunk("story/latest", async ({limit,topic}) => {
  const data  = await FetchData(`/story/latest/${topic}?limit=${limit}`);
  return data;
});

const LatestStorySlice = createSlice({ 
  name: "latest",
  initialState: {
    isfetchinglatest: true,
    latestStories: [],    
  },
  reducers:{    
    SaveUnsaveLatestStory(state,action){
      state.latestStories.forEach(function(x){
        if(x._id===action.payload){
          console.log("huhu");
          x.isSaved = !x.isSaved;
        }
      })
    }
  },
  extraReducers: {
    [FetchlatestStory.fulfilled]: (state, action) => {
      state.isfetchinglatest = false;      
      state.latestStories = action.payload.stories;
    },
  },
});

export const {
  SaveUnsaveLatestStory
} = LatestStorySlice.actions;

export default LatestStorySlice.reducer;