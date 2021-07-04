import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const getTopicdetail = createAsyncThunk("story/topicdetail", async ({topicname}) => {
  const data  = await FetchData(`/story/gettopicdetail/${topicname}`);
  return data;
});

const TopicdetailSlice = createSlice({
  name: "Topicdetail",
  initialState: {
    isFetching: true,
    topicDetail: {},    
  },
  extraReducers: {
    [getTopicdetail.fulfilled]: (state, action) => {
      state.isfetching = false;      
      state.topicDetail = action.payload.topic;
    },
  },
});

export default TopicdetailSlice.reducer;