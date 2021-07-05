import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";


export const login = createAsyncThunk(
    "user/login",
    async ({ payload, callback }) => {
        const user = await FetchData("/auth/login", { body: payload })

        if (user.token) {
            callback({success:true});
            return user;
        }
        return null;
    }
);

export const twofactorOTPVerify = createAsyncThunk(
    "user/twofactorotpverify",
    async ({ payload, callback }) => {
        const user = await FetchData("/auth/twofactorotpverify", { body: payload });

        if (user.token) {
            callback({success:true});
            return user;
        }
        return null;
    }
);

export const ReqForgottenPwdOTP = createAsyncThunk(
    "auth/recoveryOTP",
    async ({ payload, callback }) => {
        const status = await FetchData("/auth/recoveryOTP", { body: payload });

        if (status.success) {
            callback({success:true});
            return true;
        }
        callback({error:true});
        return null;
    }
);

export const signup = createAsyncThunk(
    "user/signup",
    async ({ payload, callback }) => {
        const user = await FetchData("/auth/signup", { body: payload });

        if (user.token) {
            callback({success:true});
            return user;
        }
        return null;
    }
);

export const RequestOTPforPWchange = createAsyncThunk(
    "user/changepasswordotp",
    async ({ callback }) => {
        const status = await FetchData("/user/requestOTP");

        if (status.success) {
            callback({success:true});
            return true;
        }
        return false;
    }
);

export const resetPassword = createAsyncThunk(
    "user/resetpassword",
    async ({ payload, callback }) => {
        const data = await FetchData("/auth/changepassword", { body: payload });

        if (data.token) {
            callback({success:true});
            return data;
        }
        return null;
    }
);

export const changePassword = createAsyncThunk(
    "user/changepassword",
    async ({ payload, callback }) => {
        const data = await FetchData("/user/changepassword", { body: payload });

        if (data.token) {
            callback();
            return true;
        }
        return false;
    }
);

export const togglefollowPeople = createAsyncThunk(
    "user/togglefollowpeople",
    async ({ payload,callback}) => {
        const status = await FetchData("/user/togglefollowpeople", { body: payload }); 

        if (status.success) {
            callback({success:true});
            return true;
        }
        callback({error:true});
        return false;
    }
);

export const togglefollowTopic = createAsyncThunk(
    "user/togglefollowtopic",
    async ({ payload,callback}) => {
        const status = await FetchData("/user/togglefollowtopic", { body: payload }); 

        if (status.success) {
            callback({success:true});
            return true;
        }
        callback({error:true});
        return false;
    }
);

export const addToReadingList = createAsyncThunk(
    "user/addtoreadinglist",
    async({payload,callback}) =>{
        const status = await FetchData("/user/addtoreadinglist/"+payload);
        if (status.success) {
            callback({success:true});
            return true;
        }
        callback({error:true});
        return false;

    }
)

export const removeFromReadingList = createAsyncThunk(
    "user/removefromreadinglist",
    async({payload,callback}) =>{
        const status = await FetchData("/user/removefromreadinglist/"+payload);
        if (status.success) {
            callback({success:true});
            return true;
        }
        callback({error:true});
        return false;

    }
)


export const togglesaveStory = createAsyncThunk(
    "user/togglesavestory",
    async ({ payload, callback }) => {
        const data = await FetchData("/user/togglesavestory/"+payload);

        if (data.success) {
            callback({success:true});
            return true;
        }
        callback({error:true});
        return false;
    }
);

export const addStory = createAsyncThunk(
    "user/addstory",
    async ({ payload, callback }) => {
        const data = await FetchData("/user/addstory",{body:payload});

        if (data.success) {
            callback({success:true});
            return true;
        }
        callback({error:true});
        return false;
    }
);

export const deleteUser = createAsyncThunk(
    "user/deleteAccount",
    async ({ payload, callback }) => {
        const data = await FetchData("/admin/deleteUserId/"+payload,{method:"DELETE"});

        if (data.success) {
            callback({success:true});
            return true;
        }
        callback({error:true});
        return false;
    }
);

export const deleteStory = createAsyncThunk(
    "user/deletestory",
    async ({ payload, callback }) => {
        const data = await FetchData("/admin/deleteStory/"+payload,{method:"DELETE"});

        if (data.success) {
            callback({success:true});
            return true;
        }
        callback({error:true});
        return false;
    }
);

const userSlice = createSlice({
    name: "user",
    initialState: {
        data: JSON.parse(localStorage.getItem("user")) || {},
    },
    reducers: {
        updateUser(state, action) {
            state.data = {
                ...state.data,
                ...action.payload,
            };
        },
        logout(state, action) {
            state.data = {};
            localStorage.clear();
            window.location.reload();
        },
    },
    extraReducers: {
        [login.fulfilled]: (state, action) => {
            state.data = action.payload || {};
        },
        [signup.fulfilled]: (state, action) => {
            state.data = action.payload || {};
        },
        [twofactorOTPVerify.fulfilled]:(state,action)=>{
            state.data = action.payload || {};
        },
        [resetPassword.fulfilled]:(state,action)=>{
            state.data = action.payload || {};
        }
    },
});

export const {    
    updateUser,
    logout,
} = userSlice.actions;

export default userSlice.reducer;