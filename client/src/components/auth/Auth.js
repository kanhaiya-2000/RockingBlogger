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

import Button from "@material-ui/core/Button";


const Auth = (props) => {
    const [state, currState] = useState(props.state || 0);

    const [forgetState, setForgetState] = useState(1);
    const [data, setData] = useState({
        login_uname: "",
        login_pwd: "",
        signup_email: "",
        signup_pwd: "",
        signup_uname: "",
        forget_OTP: "",
        forget_newpwd: "",
        forget_email: ""
    });
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
                    state === 0 && <div className="account">
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
                        <Button variant="outlined">Log in</Button>
                    </div>
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
                        <Button variant="outlined">Sign up</Button>
                    </div>
                }
                {
                    state === 2 && <div className="account">
                        {forgetState === 0 && <>
                            <div>
                                <EmailIcon className="svgicon" />
                                <TextField label="Email" name="forget_email" value={data.forget_email} onChange={InputEv} />
                            </div>
                            <Button variant="outlined">Recover</Button></>}
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
                                <Button style={{ background: "rgb(217, 57, 88)" }} variant="outlined">Resend OTP</Button>
                                <Button variant="outlined">Submit</Button>
                            </>
                        }
                    </div>
                }

            </div>
        </div>
    )

}

export default Auth;
