import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const getSuggestedUser = createAsyncThunk("user/suggested", async ({limit}) => {
  const data  = await FetchData(`/user/getsuggesteduser?limit=${limit}`);
  return data;
});

const SuggestedUserSlice = createSlice({
  name: "suggesteduser",
  initialState: {
    isFetchingSuggestedUsers: true,
    SuggestedUsers: [],
    
  },
  extraReducers: {
    [getSuggestedUser.fulfilled]: (state, action) => {
      state.isFetchingSuggestedUsers = false;      
      state.SuggestedUsers = action.payload.users;
    },
  },
});

export default SuggestedUserSlice.reducer;