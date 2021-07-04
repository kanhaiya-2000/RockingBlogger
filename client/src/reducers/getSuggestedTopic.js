import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const getsuggestedTopic = createAsyncThunk("user/suggestedtopic", async ({currIndex2}) => {
  const data  = await FetchData(`/user/getsuggestedtopic?currIndex=${currIndex2}`);
  return data;
});

const suggestedTopicSlice = createSlice({
  name: "suggestedtopic",
  initialState: {
    isfetchingsuggestedtopic: true,
    suggestedtopics: [],    
  },
  extraReducers: {
    [getsuggestedTopic.fulfilled]: (state, action) => {
      state.isfetchingsuggestedtopic = action.payload.topics!==0;     
      state.currIndex2 = state.currIndex2 + action.payload.topics.length; 
      state.suggestedtopics = [...state.suggestedtopics,action.payload.topics];
    },
  },
});

export default suggestedTopicSlice.reducer;