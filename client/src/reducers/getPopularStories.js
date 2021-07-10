import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const Fetchpopularstories = createAsyncThunk("story/popular", async ({limit,topic}) => {
  const data  = await FetchData(`/story/popular/${topic}?limit=${limit}`);
  return data;
});

const popularStorySlice = createSlice({
  name: "popular",
  initialState: {
    isfetchingpopular: true,
    popularStories: [],    
  },
  reducers:{   
     
    SaveUnsavePopularStory(state,action){
      state.popularStories.forEach(function(x){
        console.log(x);
        if(x._id===action.payload){
          console.log("huhu");
          x.isSaved = !x.isSaved;
        }
      })
    }
  },
  extraReducers: {
    [Fetchpopularstories.fulfilled]: (state, action) => {
      state.isfetchingpopular = false;      
      state.popularStories = action.payload.stories;
    },
  },
});

export const {
  SaveUnsavePopularStory
} = popularStorySlice.actions;

export default popularStorySlice.reducer;