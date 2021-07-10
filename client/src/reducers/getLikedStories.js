import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const FetchLikedstory = createAsyncThunk("user/likedstory", async ({curr4Index,user}) => {
  const data  = await FetchData(`/user/getuserdata/${user}?currIndex=${curr4Index}&data=likedstory`);
  return data;
});

const LikedstorySlice = createSlice({
  name: "likedstory",
  initialState: {
    isFetchingLiked: true,
    Likedstories: [],
    curr4Index:0,
  },
  reducers:{    
    SaveUnsaveLikedStory(state,action){
      state.Likedstories.forEach(function(x){
        if(x._id===action.payload){
          x.isSaved = !x.isSaved;
        }
      })
    },
    addToLikedList(state,action){
      state.Likedstories = [
        action.payload,
        ...state.Likedstories
      ]
    },
    removeFromLikedList(state,action){
      state.Likedstories = state.Likedstories.filter(function(x){return x._id!==action.payload})
    }
  },
  extraReducers: {
    [FetchLikedstory.fulfilled]: (state, action) => {
      state.isFetchingLiked = action.payload.stories.length!==0;
      state.curr4Index = state.curr4Index + action.payload.stories.length;
      state.Likedstories = [...state.Likedstories,...action.payload.stories];
    },
  },
});

export const {
  SaveUnsaveLikedStory,
  addToLikedList,
  removeFromLikedList
} = LikedstorySlice.actions;

export default LikedstorySlice.reducer;