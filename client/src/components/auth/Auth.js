import React, { useState } from "react";
import './Auth.css';

import TextField from '@material-ui/core/TextField';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import EmailIcon from '@material-ui/icons/Email';
import Zoom from "@material-ui/core/Zoom";
import Tooltip from '@material-ui/core/Tooltip';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ActivityIndicator from '@material-ui/core/CircularProgress';

import Button from "@material-ui/core/Button";
import { login, ReqForgottenPwdOTP, resetPassword, signup, twofactorOTPVerify } from "../../reducers/user";
import { NotifyUser } from "../../utils/NotifyUser";
import { useToasts } from "react-toast-notifications";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

export const LoadingButton = ()=>{
    return <ActivityIndicator size={20} color="secondary"/>
}

const Auth = (props) => {
    const [state, currState] = useState(props.state || 0);
    const { addToast } = useToasts();
    const [isloading,setLoading] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();
    const [forgetState, setForgetState] = useState(0);
    const [loginstate, setLoginState] = useState(0);
    const [data, setData] = useState({
        login_uname: "",
        login_pwd: "",
        login_otp: "",
        signup_email: "",
        signup_pwd: "",
        signup_fullname: "",
        signup_uname: "",
        forget_OTP: "",
        forget_newpwd: "",
        forget_email: "",
    });

    const loginFun = () => {
        const payload = {
            email: data.login_uname,
            password: data.login_pwd
        }
        if (!payload.email || !payload.password) {
            NotifyUser({ content: "Please fill all fields", type: "error", addToast })
            return;
        }
        setLoading(true);
        dispatch(login({
            payload, callback: function (res, data) {
                setLoading(false);
                if (res === "twofactor") {
                    setLoginState(1);
                    InputEv({ target: { value: data, name: "login_uname" } });
                    NotifyUser({ content: "Enter the email sent to your mail", type: "info", addToast });
                }
                else if (res === "done") {
                    history.goBack();
                }
                else{
                    NotifyUser({ content: data, type: "error", addToast });
                }
            }
        }));
    }

    const signupFun = () => {
        const payload = {
            email: data.signup_email,
            username: data.signup_uname,
            password: data.signup_pwd,
            fullname: data.signup_fullname
        };
        if (!payload.email || !payload.username || !payload.password || !payload.password) {
            NotifyUser({ content: "Please fill all fields", type: "error", addToast })
            return;
        }
        if ((/^[a-z0-9]+$/i).exec(payload.username) == null) {
            NotifyUser({ content: "Username should only contain letter and digit only", type: "error", addToast })
            return;
        }

        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!re.test(String(payload.email).toLowerCase())) {
            NotifyUser({ content: "Email is invalid", type: "error", addToast })
            return;
        }

        if (payload.username.length < 7) {
            NotifyUser({ content: "Username should have length more than 6", type: "error", addToast })
            return;
        }
        setLoading(true);
        dispatch(signup({
            payload, callback: function (res,msg) {
                setLoading(false);
                if (res) {
                    history.goBack();
                }
                else{                    
                    NotifyUser({ content: msg, type: "error", addToast })
                }
            }
        }));
    }

    const twoFactorOtpVerifyFun = () => {
        const payload = {
            email: data.login_uname,
            OTP: data.login_otp
        }
        if (!payload.email || !payload.OTP) {
            NotifyUser({ content: "Please fill all field", type: "error", addToast });
            return;
        }
        setLoading(true);
        dispatch(twofactorOTPVerify({
            payload, callback: function (res,msg) {
                setLoading(false);
                if (res) {
                    history.goBack();
                }
                else{                    
                    NotifyUser({ content: msg, type: "error", addToast })
                }
            }
        }));
    }

    const requestOTPfun = () => {
        const payload = {
            email: data.forget_email
        }
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!payload.email) {
            NotifyUser({ content: "Please fill your email", type: "error", addToast })
            return;
        }
        if (!re.test(String(payload.email).toLowerCase())) {
            NotifyUser({ content: "Email is invalid", type: "error", addToast })
            return;
        }
        setLoading(true);
        dispatch(ReqForgottenPwdOTP({
            payload, callback: function (res,msg) {
                setLoading(false);
                if (res) {
                    setForgetState(1);
                    NotifyUser({ content: "Enter the OTP sent to your email", type: "success", addToast })
                }
                else{                    
                    NotifyUser({ content: msg, type: "error", addToast })
                }
            }
        }))
    }

    const resetPasswordFun = () => {
        const payload = {
            email: data.forget_email,
            password: data.forget_newpwd,
            OTP: data.forget_OTP
        }
        if (!payload.email || !payload.password || !payload.OTP) {
            NotifyUser({ content: "Please fill all field", type: "error", addToast });
            return;
        }
        setLoading(true);
        dispatch(resetPassword({
            payload, callback: function (res,msg) {
                setLoading(false);
                if (res) {
                    history.goBack();
                }
                else{                    
                    NotifyUser({ content: msg, type: "error", addToast })
                }
            }
        }))
    }
    const [pwdstate, setPwdState] = useState({
        login_pwd_visibility: false,
        forget_pwd_visibility: false,
        signup_pwd_visibility: false
    })
    const InputEv = (e) => {

        const { name, value } = e.target;
        // console.log(name, value);
        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const changePwdState = (event) => {
        let name;
        switch (event) {
            case "login_pwd":
                name = "login_pwd_visibility";
                setPwdState((prev) => {
                    return {
                        ...prev,
                        [name]: !prev.login_pwd_visibility
                    }
                })
                break;
            case "signup_pwd":
                name = "signup_pwd_visibility";
                setPwdState((prev) => {
                    return {
                        ...prev,
                        [name]: !prev.signup_pwd_visibility
                    }
                })
                break;
            case "forget_pwd":
                name = "forget_pwd_visibility";
                setPwdState((prev) => {
                    return {
                        ...prev,
                        [name]: !prev.forget_pwd_visibility
                    }
                })
                break;
            default:
                break;
        }
    }


    const handleChange = (event, val) => {
        currState(val);
    }
    //state==0  ==>> Login component
    //state==1 ===> Register component
    //state==2 ===> Forgot pwd component
    return (
        <div className="modal_bg">

            <div className="modal-auth">


                <Paper square>
                    <Tabs
                        value={state}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={handleChange}
                        aria-label="login-signup-tabs"
                    >
                        <Tab label="Login" />
                        <Tab label="Signup" />
                        <Tab label="Recover" />
                    </Tabs>
                </Paper>

                {
                    state === 0 && (loginstate === 0 ? <div className="account">
                        <div>
                            <AccountCircleIcon className="svgicon" />
                            <TextField label="Username or Email" name="login_uname" value={data.login_uname} onChange={InputEv} />
                        </div>
                        <div>
                            <LockIcon className="svgicon" />
                            <TextField label="Password" name="login_pwd" value={data.login_pwd} onChange={InputEv} type={pwdstate.login_pwd_visibility ? "text" : "password"} />
                            {pwdstate.login_pwd_visibility ?
                                <Tooltip title="Hide password" TransitionComponent={Zoom} arrow>
                                    <VisibilityOffIcon className="svgicon svgtype2" onClick={() => changePwdState("login_pwd")} />
                                </Tooltip> :
                                <Tooltip title="View password" TransitionComponent={Zoom} arrow
                                ><VisibilityIcon className="svgicon svgtype2" onClick={() => changePwdState("login_pwd")} />
                                </Tooltip>}
                        </div>
                        <div className="forget_pwd"><span onClick={() => currState(2)} style={{ margin: "auto" }}>Forgotten password?</span></div>
                        {isloading?<Button variant="outlined" style={{background:"white"}}><LoadingButton/></Button>: <Button variant="outlined" onClick={loginFun}>Log in</Button>}
                    </div> : <div className="account">
                        <div>
                            <KeyboardIcon className="svgicon" />
                            <TextField label="Email OTP" name="login_otp" value={data.login_otp} onChange={InputEv} />
                        </div>
                        {isloading?<Button variant="outlined" style={{background:"white"}}><LoadingButton/></Button>:<Button style={{ background: "rgb(217, 57, 88)" }} variant="outlined" onClick={loginFun}>Resend OTP</Button>}
                        {isloading?<Button variant="outlined" style={{background:"white"}}><LoadingButton/></Button>:<Button variant="outlined" onClick={twoFactorOtpVerifyFun}>Submit</Button>}
                    </div>)
                }
                {
                    state === 1 && <div className="account">
                        <div>
                            <EmailIcon className="svgicon" />
                            <TextField label="Email" name="signup_email" value={data.signup_email} onChange={InputEv} />
                        </div>
                        <div>
                            <AccountCircleIcon className="svgicon" />
                            <TextField label="Username" name="signup_uname" value={data.signup_uname} onChange={InputEv} />
                        </div>
                        <div>
                            <AccountCircleIcon className="svgicon" />
                            <TextField label="Fullname" name="signup_fullname" value={data.signup_fullname} onChange={InputEv} />
                        </div>
                        <div>
                            <LockIcon className="svgicon" />
                            <TextField label="Password" name="signup_pwd" value={data.signup_pwd} onChange={InputEv} type={pwdstate.signup_pwd_visibility ? "text" : "password"} />
                            {pwdstate.signup_pwd_visibility ?
                                <Tooltip title="Hide password" TransitionComponent={Zoom} arrow>
                                    <VisibilityOffIcon className="svgicon svgtype2" onClick={() => changePwdState("signup_pwd")} />
                                </Tooltip>
                                :
                                <Tooltip title="View password" TransitionComponent={Zoom} arrow>
                                    <VisibilityIcon className="svgicon svgtype2" onClick={() => changePwdState("signup_pwd")} />
                                </Tooltip>
                            }
                        </div>
                        {isloading?<Button variant="outlined" style={{background:"white"}}><LoadingButton/></Button>:<Button variant="outlined" onClick={signupFun}>Sign up</Button>}
                    </div>
                }
                {
                    state === 2 && <div className="account">
                        {forgetState === 0 && <>
                            <div>
                                <EmailIcon className="svgicon" />
                                <TextField label="Email" name="forget_email" value={data.forget_email} onChange={InputEv} />
                            </div>
                            {isloading?<Button variant="outlined" style={{background:"white"}}><LoadingButton/></Button>:<Button variant="outlined" onClick={requestOTPfun}>Recover</Button>}</>}
                        {
                            forgetState === 1 && <>
                                <div>
                                    <LockIcon className="svgicon" />
                                    <TextField label="New Password" name="forget_newpwd" value={data.forget_newpwd} onChange={InputEv} type={pwdstate.forget_pwd_visibility ? "text" : "password"} />
                                    {pwdstate.forget_pwd_visibility ?
                                        <Tooltip title="Hide password" TransitionComponent={Zoom} arrow>
                                            <VisibilityOffIcon className="svgicon svgtype2" onClick={() => changePwdState("forget_pwd")} />
                                        </Tooltip> :
                                        <Tooltip title="View password" TransitionComponent={Zoom} arrow>
                                            <VisibilityIcon className="svgicon svgtype2" onClick={() => changePwdState("forget_pwd")} />
                                        </Tooltip>
                                    }
                                </div>
                                <div>
                                    <KeyboardIcon className="svgicon" />
                                    <TextField label="Email OTP" name="forget_OTP" value={data.forget_OTP} onChange={InputEv} />
                                </div>
                                {isloading?<Button variant="outlined" style={{background:"white"}}><LoadingButton/></Button>:<Button style={{ background: "rgb(217, 57, 88)" }} variant="outlined" onClick={requestOTPfun}>Resend OTP</Button>}
                                {isloading?<Button variant="outlined" style={{background:"white"}}><LoadingButton/></Button>:<Button variant="outlined" onClick={resetPasswordFun}>Submit</Button>}
                            </>
                        }
                    </div>
                }

            </div>
        </div>
    )

}

export default Auth;
