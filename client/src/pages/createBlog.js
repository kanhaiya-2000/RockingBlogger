import React from 'react';
import SunEditor,{buttonList} from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

const MyComponent = props => {

  const handleChange=(content)=>{
      localStorage.setItem("content",content);
      //console.log(content);
  }

  const imageUploadHandler = (xmlHttpRequest, info, core)=>{
	console.log(xmlHttpRequest, info, core)
}
const handleImageUploadBefore=(files, info, uploadHandler)=>{
    // uploadHandler is a function
	console.log(files, info)
}

const handleImageUpload = (targetImgElement, index, state, imageInfo, remainingFilesCount)=>{
	console.log(targetImgElement, index, state, imageInfo, remainingFilesCount)
}

const handleImageUploadError = (errorMessage, result)=>{
	console.log(errorMessage, result)
}

const handleVideoUploadBefore = (files, info, uploadHandler)=>{
    // uploadHandler is a function
	console.log(files, info)
}
const handleVideoUpload=(targetElement, index, state, info, remainingFilesCount)=>{
	console.log(targetElement, index, state, info, remainingFilesCount)
}

const handleVideoUploadError=(errorMessage, result)=>{
	console.log(errorMessage, result)
}

const handleAudioUploadBefore=(files, info, uploadHandler)=>{
    // uploadHandler is a function
	console.log(files, info)
}

const handleAudioUpload =(targetElement, index, state, info, remainingFilesCount)=>{
	console.log(targetElement, index, state, info, remainingFilesCount)
}

const handleAudioUploadError=(errorMessage, result)=>{
	console.log(errorMessage, result)
}

  return (
    <div style={{fontFamily: "'EB Garamond', serif, Roboto", fontSize: "18px"}}>      
      <SunEditor
        name="RockingBloggerEditor"
        height="100%"
        width="100%"
        placeholder="Start writing here..."
        autoFocus={true}
        onChange={handleChange}
        imageUploadHandler={imageUploadHandler}
        handleImageUploadBefore={handleImageUploadBefore}
        handleImageUpload={handleImageUpload}
        handleImageUploadError={handleImageUploadError}
        // handleAudioUploadBefore={handleAudioUploadBefore}
        // handleAudioUpload={handleAudioUpload}
        // handleAudioUploadError={handleAudioUploadError}
        handleVideoUploadBefore={handleVideoUploadBefore}
        handleVideoUpload={handleVideoUpload}
        handleVideoUploadError={handleVideoUploadError}
        defaultValue={localStorage.getItem("content")}
        setDefaultStyle="font-family: 'EB Garamond', serif, Roboto; font-size: 18px;"
        setOptions={{
            buttonList:buttonList.complex
        }}
      />
    </div>
  );
};
export default MyComponent;
