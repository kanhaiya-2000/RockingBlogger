import React, { useEffect } from 'react';
import SunEditor, { buttonList } from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import { uploadImage } from '../utils/connect';
import { NotifyUser } from '../utils/NotifyUser';
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import { addStory } from '../reducers/user';
import TextArea from "@material-ui/core/TextField";
import  Button  from '@material-ui/core/Button';
import { useHistory, useParams } from 'react-router-dom';
import { editStory} from "../reducers/story";

const MyComponent = ({ isEditing }) => {
  const myEditor = React.useRef(null);
  const getSunEditorInstance = (sunEditor) => {
    myEditor.current = sunEditor;
    console.log(sunEditor);
  };
  const titleref = React.useRef(null);
  const descref = React.useRef(null);
  const topics = React.useRef(null);
  const char = React.useRef(0);
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [storystate, setStoryState] = React.useState(0);
  const src = React.useRef(null);
  const { sid } = useParams();
  const {data} = useSelector((state)=>state.user);
  const history = useHistory();
  const handleChange = (content) => {
    localStorage.setItem("content", content);
    // console.log(myEditor.current.getCharCount());
    // console.log(myEditor.current.getImagesInfo())
  }
  useEffect(() => {
    const t = document.querySelector("button[data-command='save']");
    t && (t.disabled = false);
    //document.querySelector("button[data-command='save']").onClick= 
  }, []);
  const VerifyStory = () => {
    const images = (myEditor.current.getImagesInfo());
    if (images.length === 0) {
      NotifyUser({ content: "You must add atleast one image to your story", type: "error", addToast });
      return false;
    }
    if (myEditor.current.getCharCount() < 500) {
      NotifyUser({ content: "Your story is too short", type: "error", addToast });
      return false;
    }
    src.current = images[0].src;
    char.current = myEditor.current.getCharCount();
    return true;
  }
  const checkStoryWritten = () => {
    if (!VerifyStory()) {
      return;
    }
    setStoryState(1);
  }

  const editStoryfunc = (storydata) => {
    if (!data) {
      history.push("/signin");
      NotifyUser({ content: "Please login first", type: "error", addToast });
      return;
    }
    console.log(storydata);
    
    const { short_des, title, html_content, topics, cover,charcount } = storydata;
    const payload = {};
    if (short_des) {
      payload.short_des = short_des;
    }
    if (title) {
      payload.title = title;
    }
    if (html_content) {
      payload.html_content = html_content;
    }
    if(cover) payload.cover = cover;
    if (topics) {
      payload.topics = topics;
    }

    if (Object.keys(payload).length === 0) {
      NotifyUser({ content: "You have not written anything yet", type: "error", addToast: addToast })
      return;
    }

    payload.sid = sid;
    payload.charcount = charcount;

    const callback = (res) => {
      if (res) {
        
        setTimeout(()=>{
            window.location.replace("/stories/"+sid)
        },100)
      }
      else {
        NotifyUser({ content: "Something went wrong", type: "error", addToast: addToast })
      }
    }

    dispatch(editStory({ payload: payload, callback: callback }));
  }
  const submitStory = () => {

    const payload = {
      title: titleref.current,
      short_des: descref.current,
      topics: topics.current,
      html_content: localStorage.getItem("content"),
      cover: src.current,
      charcount: char.current
    }
    if (!payload.title || !payload.short_des || !payload.topics) {
      return NotifyUser({ content: "Please fill all the fields", type: "error", addToast });
    }
    payload.topics = payload.topics.split(",");
    if (isEditing) {
      editStoryfunc(payload);
    }
    else {
      dispatch(addStory({
        payload, callback: function (res, data) {
          if (res) {
            localStorage.setItem("content", "");
            window.location.replace(data);
          }
          else {
            NotifyUser({ content: "Story could not be posted", type: "error", addToast })
          }
        }
      }))
    }
  }

  //   const imageUploadHandler = (xmlHttpRequest, info, core)=>{
  // 	console.log(xmlHttpRequest, info, core)
  // }
  const handleImageUploadBefore = (files, info, uploadHandler) => {
    // uploadHandler is a function
    uploadImage(files[0]).then((data) => uploadHandler({ "result": [{ "url": data, "size": files[0].size, "name": files[0].name }] })).catch(err => { console.log(err); uploadHandler("Image could not be uploaded") });
    //console.log(files, info,uploadHandler)
  }

  // const handleImageUpload = (targetImgElement, index, state, imageInfo, remainingFilesCount)=>{
  // 	console.log(targetImgElement, index, state, imageInfo, remainingFilesCount)
  // }

  const handleImageUploadError = (errorMessage, result) => {
    NotifyUser({ content: errorMessage, type: "error", addToast })
  }

  const handleVideoUploadBefore = (files, info, uploadHandler) => {
    // uploadHandler is a function
    console.log(files, info)
  }
  const handleVideoUpload = (targetElement, index, state, info, remainingFilesCount) => {
    console.log(targetElement, index, state, info, remainingFilesCount)
  }

  const handleVideoUploadError = (errorMessage, result) => {
    console.log(errorMessage, result)
  }

  const handleAudioUploadBefore = (files, info, uploadHandler) => {
    // uploadHandler is a function
    console.log(files, info)
  }

  const handleAudioUpload = (targetElement, index, state, info, remainingFilesCount) => {
    console.log(targetElement, index, state, info, remainingFilesCount)
  }

  const goBack = () => {
    setStoryState(0);
    setTimeout(() => {
      const t = document.querySelector("button[data-command='save']");
      t && (t.disabled = false);
    }, 100)
  }
  const handleAudioUploadError = (errorMessage, result) => {
    console.log(errorMessage, result)
  }


  return (
    <>
      {storystate === 0 ? <SunEditor
        name="RockingBloggerEditor"
        getSunEditorInstance={getSunEditorInstance}
        height="100%"
        width="100%"
        placeholder="Start writing here..."
        autoFocus={true}
        onChange={handleChange}
        onImageUploadBefore={handleImageUploadBefore}
        onImageUploadError={handleImageUploadError}
        // handleAudioUploadBefore={handleAudioUploadBefore}
        // handleAudioUpload={handleAudioUpload}
        // handleAudioUploadError={handleAudioUploadError}
        onVideoUploadBefore={handleVideoUploadBefore}
        onVideoUpload={handleVideoUpload}
        onVideoUploadError={handleVideoUploadError}
        defaultValue={localStorage.getItem("content")}
        setDefaultStyle="font-family: 'EB Garamond', serif, Roboto; font-size: 22px;"
        setOptions={{
          buttonList: buttonList.complex,
          charCounter: true,
          charCounterType: 'char',
          callBackSave: function (contents, isChanged) {
            checkStoryWritten();
          }
        }}
      /> : <div className="story_modal">
        <div className="story_title">
          <TextArea
            required={true}
            placeholder="Enter title of your story"
            onChange={(e) => titleref.current = e.target.value}
          />
        </div>
        <div className="story_des">
          <TextArea
            required={true}
            placeholder="Enter short description of your story"
            onChange={(e) => descref.current = e.target.value}
          />
        </div>
        <div className="story_des">
          <TextArea
            required={true}
            placeholder="Enter topics with (,)"
            onChange={(e) => topics.current = e.target.value}
          />
        </div>
        <div className="story_action">
          <Button onClick={goBack}>
            Back
          </Button>
          <Button onClick={submitStory}>
            Post
          </Button>
        </div>
      </div>}
    </>

  );
};
export default MyComponent;
