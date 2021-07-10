import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const getStory = createAsyncThunk(
    "story/getstory",
    async ({ payload, callback }) => {
        const data = await FetchData("/story/"+payload);

        if (data.success) {
            callback(data.story.html_content);
            console.log(data);
            return data.story;
        }
        callback(false);
        return {};
    }
);

export const editStory = createAsyncThunk(
    "story/editstory",
    async ({ payload, callback }) => {
        const data = await FetchData("/story/"+payload.sid,{body:{payload},method:"PUT"});

        if (data.success) {
            callback(true);
            return;
        }
        callback(false);
        return;
    }
);

export const toggleLikeStory = createAsyncThunk(
    "story/togglelikestory",
    async ({ payload, callback }) => {
        const data = await FetchData("/story/togglelike",{body:payload});

        if (data.success) {
            callback(true);
            return;
        }
        callback(false);
        return;
    }
);

export const toggleLikeComment = createAsyncThunk(
    "story/togglelikecomment",
    async ({ payload, callback }) => {
        const data = await FetchData("/story/togglelikecomment",{body:payload});

        if (data.success) {
            callback(true);
            return;
        }
        callback(false);
        return;
    }
);

export const addComment = createAsyncThunk(
    "story/addcomment",
    async ({ payload, callback }) => {
        const data = await FetchData("/story/addcomment",{body:payload});
        
        if (data.success) {
            callback(true);
            return;
        }
        console.log(data);
        callback(false);
        return;
    }
);

export const deleteComment = createAsyncThunk(
    "story/deletecomment",
    async ({ payload, callback }) => {
        const data = await FetchData("/story/deletecomment/"+payload,{method:"DELETE"});

        if (data.success) {
            callback(true);
            return;
        }
        callback(false);
        return;
    }
);

export const reportStory = createAsyncThunk(
    "story/reportstory",
    async ({ payload, callback }) => {
        const data = await FetchData("/story/report/"+payload.sid,{body:payload});

        if (data.success) {
            callback(true);
            return;
        }
        callback(false);
        return;
    }
);

export const fetchComments = createAsyncThunk(
    "story/fetchcomments",
    async ({ payload, callback,currIndex }) => {
        const data = await FetchData("/story/fetchcomments/"+payload+"?currIndex="+currIndex);

        if (data.success) {
            callback(true);
            return data;
        }
        callback(false);
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
        togglelikeStory(state,action){
            state.story={
                ...state.story,                
                likesCount:state.story.isLiked?state.story.likesCount-1:state.story.likesCount+1,
                isLiked:!state.story.isLiked
            }
        },
        togglesaveStory(state,action){
            state.story={
                ...state.story,
                isSaved:!state.story.isSaved
            }
        },
        togglelikeComment(state,action){
            const comments = state.story.comments;
            comments.forEach(function(x){
                if(x._id===action.payload){                    
                    x.likesCount=x.isLiked?x.likesCount-1:x.likesCount+1;
                    x.isLiked = !x.isLiked;
                }
            })
            state.story={
                ...state.story,
                comments:comments
            }
        },
        addcomment(state,action){
            state.story={
                ...state.story,
                comments:[action.payload,...state.story.comments]
            }
        },
        toggleFollowAuthor(state,action){
            state.story = {
               ...state.story,
               user:{...state.story.user,isFollowing:!state.story.user.isFollowing}
            }
            //console.log(state.story);
        },
        deletecomment(state,action){
            state.story={
                ...state.story,
                comments:state.story.comments.filter((x)=>x._id!==action.payload)
            }
        },       
    },

    extraReducers: {
        [getStory.fulfilled]: (state, action) => {            

            state.story = {
                ...state.story,
                ...action.payload
            };
            
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
    togglelikeStory,
    togglelikeComment,
    togglesaveStory,
    addcomment,
    toggleFollowAuthor,
    deletecomment
} = StorySlice.actions;

export default StorySlice.reducer;