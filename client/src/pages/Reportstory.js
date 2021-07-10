import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { NotifyUser } from "../utils/NotifyUser";
import {reportStory} from "../reducers/story";
import TextArea from "@material-ui/core/TextField";
import  Button  from '@material-ui/core/Button';
import { useDispatch } from "react-redux";

const Reportstory = ()=>{
    const history = useHistory();
    const descref = React.useRef("");
    const {addToast} = useToasts();
    const dispatch = useDispatch();
    const {sid} = useParams();

    const submitReport = ()=>{
        if(!descref.current||descref.current.length<100){
            return NotifyUser({content:"Please write sufficient words",addToast,type:"error"})
        }
        reportStoryFunc({sid})
    }
    const reportStoryFunc = ({sid})=>{
        
        const callback = (res)=>{
            if(res){
                NotifyUser({content:"Report submitted successfully",type:"success",addToast});
                history.goBack();
            }
            else{
                NotifyUser({content:"Something went wrong",type:"error",addToast:addToast})
            }
        }
        dispatch(reportStory({payload:{sid,description:descref.current},callback:callback}));
    }
    return (
        <div className="story_modal">        
        <div className="story_des">
          <TextArea
            required={true}
            placeholder="Breify describe your problem"
            onChange={(e) => descref.current = e.target.value}
          />
        </div>        
        <div className="story_action">
          <Button onClick={()=>history.goBack()}>
            Back
          </Button>
          <Button onClick={submitReport}>
            Post
          </Button>
        </div>
      </div>
    )
}

export default Reportstory;