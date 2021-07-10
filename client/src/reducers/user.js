import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";


export const login = createAsyncThunk(
    "user/login",
    async ({ payload, callback }) => {
        
        const user = await FetchData("/auth/login", { body: payload })
        console.log(user);
        if (user.token) {
            localStorage.setItem("user",JSON.stringify(user.authdata));
            localStorage.setItem("accesstoken",user.token);
            setTimeout(()=>{
                callback("done",null);
            },1000);
            return user;
        }
        else if(user.verifyotp){
            callback("twofactor",user.data);
            return null;
        }
        else{
            callback("error",user.message);
            return null;
        }   
    
    }
);

export const twofactorOTPVerify = createAsyncThunk(
    "user/twofactorotpverify",
    async ({ payload, callback }) => {
        const user = await FetchData("/auth/twofactorotpverify", { body: payload });

        if (user.token) {
            localStorage.setItem("user",JSON.stringify(user.authdata));
            localStorage.setItem("accesstoken",user.token);
            setTimeout(()=>{
                callback(true,null);
            },1000);
            return user;
        }
        callback(false,user.message);
        return null;
    }
);

export const ReqForgottenPwdOTP = createAsyncThunk(
    "auth/recoveryOTP",
    async ({ payload, callback }) => {
        const status = await FetchData("/auth/recoveryOTP", { body: payload });

        if (status.success) {
            callback(true,null);
            return ;
        }
        callback(false,status.message);
        return ;
    }
);

export const signup = createAsyncThunk(
    "user/signup",
    async ({ payload, callback }) => {
        const user = await FetchData("/auth/signup", { body: payload });
        
        if (user.token) {
            localStorage.setItem("user",JSON.stringify(user.authdata));
            localStorage.setItem("accesstoken",user.token);            
            callback(true,null);
            return user;
        }
        callback(false,user.message);
        return null;
    }
);

export const RequestOTPforPWchange = createAsyncThunk(
    "user/changepasswordotp",
    async ({ callback }) => {
        const status = await FetchData("/user/requestOTP");

        if (status.success) {
            callback(true,null);
            return true;
        }
        callback(false,status.message);
        return null;
    }
);

export const resetPassword = createAsyncThunk(
    "user/resetpassword",
    async ({ payload, callback }) => {
        const data = await FetchData("/auth/changepassword", { body: payload });

        if (data.token) {
            localStorage.setItem("user",JSON.stringify(data.authdata));
            localStorage.setItem("accesstoken",data.token);            
            callback(true,null);
            return data;
        }
        callback(false,data.message);
        return null;
    }
);

export const changePassword = createAsyncThunk(
    "user/changepassword",
    async ({ payload, callback }) => {
        const data = await FetchData("/user/changepassword", { body: payload });

        if (data.token) {            
            localStorage.setItem("accesstoken",data.token);
            callback(true,null);
            return true;
        }
        callback(false,data.message);
        return false;
    }
);

export const togglefollowPeople = createAsyncThunk(
    "user/togglefollowpeople",
    async ({ payload,callback}) => {
        const status = await FetchData("/user/togglefollowpeople", { body: payload }); 

        if (status.success) {
            callback(true,null);
            return true;
        }
        callback(false,status.message);
        return false;
    }
);

export const togglefollowTopic = createAsyncThunk(
    "user/togglefollowtopic",
    async ({ payload,callback}) => {
       // console.log(payload);
        const status = await FetchData("/user/togglefollowtopic", { body: {name:payload}}); 

        if (status.success) {
            callback(true,null);
            return true;
        }
        callback(false,status.message);
        return false;
    }
);

export const addToReadingList = createAsyncThunk(
    "user/addtoreadinglist",
    async({payload,callback}) =>{
        const status = await FetchData("/user/addtoreadinglist/"+payload);
        if (status.success) {
            callback(true,null);
            return true;
        }
        callback(false,status.message);
        return false;

    }
)

export const removeFromReadingList = createAsyncThunk(
    "user/removefromreadinglist",
    async({payload,callback}) =>{
        const status = await FetchData("/user/removefromreadinglist/"+payload);
        if (status.success) {
            callback(true,null);
            return true;
        }
        callback(false,status.message);
        return false;

    }
)


export const togglesaveUserStory = createAsyncThunk( 
    "user/togglesavestory",
    async ({ payload, callback }) => {
        const data = await FetchData("/user/togglesavestory/"+payload);

        if (data.success) {
            callback(true,null);
            return true;
        }
        callback(false,data.message);
        return false;
    }
);

export const addStory = createAsyncThunk(
    "user/addstory",
    async ({ payload, callback }) => {
        const data = await FetchData("/user/addstory",{body:payload});

        if (data.success) {
            callback(true,data.url);
            return true;
        }
        callback(false,null);
        return false;
    }
);

export const deleteUser = createAsyncThunk(
    "user/deleteAccount",
    async ({ payload, callback }) => {
        const data = await FetchData("/admin/deleteUserId/"+payload,{method:"DELETE"});
        console.log(data);
        if (data.success) {
            callback(true,null);
            return true;
        }
        callback(false,data.message);
        return false;
    }
);

export const deleteStory = createAsyncThunk(
    "user/deletestory",
    async ({ payload, callback }) => {
        const data = await FetchData("/admin/deleteStory/"+payload,{method:"DELETE"});

        if (data.success) {
            callback(true,null);
            return true;
        }
        callback(false,data.message);
        return false;
    }
);

const userSlice = createSlice({
    name: "user",
    initialState: {
        data: JSON.parse(localStorage.getItem("user")) ,
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
            state.data = action.payload ;
        },
        [signup.fulfilled]: (state, action) => {
            state.data = action.payload ;
        },
        [twofactorOTPVerify.fulfilled]:(state,action)=>{
            state.data = action.payload ;
        },
        [resetPassword.fulfilled]:(state,action)=>{
            state.data = action.payload ;
        }
    },
});

export const {    
    updateUser,
    logout,
} = userSlice.actions;

export default userSlice.reducer;