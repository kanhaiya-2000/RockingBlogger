


export const NotifyUser = ({content,type,addToast})=>{
    //
    addToast(content, {
        appearance: type,//type--->'success','info','warning','error'
        autoDismiss: true,
    }) 
}

