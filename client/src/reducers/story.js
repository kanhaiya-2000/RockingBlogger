import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const getStory = createAsyncThunk(
    "story/getstory",
    async ({ payload, callback }) => {
        const data = await FetchData("/story/"+payload);

        if (data.success) {
            callback({success:true});
            return data;
        }
        callback({error:true});
        return null;
    }
);

export const editStory = createAsyncThunk(
    "story/editstory",
    async ({ payload, callback }) => {
        const data = await FetchData("/story/"+payload,{method:"PUT"});

        if (data.success) {
            callback({success:true});
            return;
        }
        callback({error:true});
        return;
    }
);

export const toggleLikeStory = createAsyncThunk(
    "story/togglelikestory",
    async ({ payload, callback }) => {
        const data = await FetchData("/story/togglelike",{body:payload});

        if (data.success) {
            callback({success:true});
            return;
        }
        callback({error:true});
        return;
    }
);

export const toggleLikeComment = createAsyncThunk(
    "story/togglelikecomment",
    async ({ payload, callback }) => {
        const data = await FetchData("/story/togglelikecomment",{body:payload});

        if (data.success) {
            callback({success:true});
            return;
        }
        callback({error:true});
        return;
    }
);

export const addComment = createAsyncThunk(
    "story/addcomment",
    async ({ payload, callback }) => {
        const data = await FetchData("/story/addcomment",{body:payload});

        if (data.success) {
            callback({success:true});
            return;
        }
        callback({error:true});
        return;
    }
);

export const deleteComment = createAsyncThunk(
    "story/deletecomment",
    async ({ payload, callback }) => {
        const data = await FetchData("/story/deletecomment/"+payload,{method:"DELETE"});

        if (data.success) {
            callback({success:true});
            return;
        }
        callback({error:true});
        return;
    }
);

export const reportStory = createAsyncThunk(
    "story/reportstory",
    async ({ payload, callback }) => {
        const data = await FetchData("/story/report/"+payload.sid,{body:payload});

        if (data.success) {
            callback({success:true});
            return;
        }
        callback({error:true});
        return;
    }
);

export const fetchComments = createAsyncThunk(
    "story/fetchcomments",
    async ({ payload, callback,currIndex }) => {
        const data = await FetchData("/story/fetchcomments/"+payload+"?currIndex="+currIndex);

        if (data.success) {
            callback({success:true});
            return data;
        }
        callback({error:true});
        return null;
    }
);

const StorySlice = createSlice({
    name: "story",
    initialState: {
        story: {},
        currIndex:5,//initial number of comments fetched
        ShouldFetchComments:true
    },
    reducers: {
        updateStory(state, action) {
            state.story = {
                ...state.story,
                ...action.payload,
            };
        },
        toggleLikeStory(state,action){
            state.story={
                ...state.story,
                isLiked:!state.story.isLiked
            }
        },
        toggleLikeComment(state,action){
            comments = state.story.comments;
            comments.forEach(function(x){
                if(x._id===action.payload){
                    x.isLiked = !x.isLiked;
                }
            })
            state.story={
                ...state.story,
                comments:comments
            }
        },
        addComment(state,action){
            state.story={
                ...state.story,
                comments:[action.payload,...state.story.comments]
            }
        },
        deleteComment(state,action){
            state.story={
                ...state.story,
                comments:state.story.comments.filter((x)=>x._id!==action.payload)
            }
        },       
    },

    extraReducers: {
        [getStory.fulfilled]: (state, action) => {
            state.story = action.payload || {};
        },  
        [fetchComments.fulfilled]:(state,action) => {
            state.story ={
                ...state.story,
                comments:[...state.story.comments,action.payload.comments]
            };
            state.currIndex = state.currIndex+action.payload.comments.length;
            state.ShouldFetchComments = (action.payload.comments.length !== 0);
        }      
    },
});

export const {    
    updateStory,
    logout,
} = StorySlice.actions;

export default StorySlice.reducer;