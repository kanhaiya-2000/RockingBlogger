import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const TrendingTopic = createAsyncThunk("user/Trendingtopic", async () => {
  const data  = await FetchData(`/user/getsuggestedtopic?trending=true`);
  return data;
});

const TrendingTopicSlice = createSlice({
  name: "trendingtopic",
  initialState: {
    isfetchingtrendingtopic: true,
    Trendingtopics: [],    
  },
  extraReducers: {
    [TrendingTopic.fulfilled]: (state, action) => {
      state.isfetchingtrendingtopic = false;        
      state.Trendingtopics = action.payload.topics;
    },
  },
});

export default TrendingTopicSlice.reducer;