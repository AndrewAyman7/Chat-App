import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getUserProfileById, uploadProfilePhoto } from "../../redux/api-calls/profileApi";
import { toast, ToastContainer } from "react-toastify";
import { deleteAccount, logOut } from "../../redux/api-calls/authApi";
import swal from "sweetalert";
import { acceptFriendRequest, cancelRequest, deleteFriend, rejectFriendRequest, sendRequest } from "../../redux/api-calls/friendApi";

import {socket} from "../../socket";




const UserProfile = ()=>{

    const navigate = useNavigate();
    const dispatch = useDispatch();
    let {id} = useParams();

//////////////////////////////////////////////////////////////////////////////////
    // Upload photo 

    const [file,setFile] = useState(null);

    const addPhoto = (e)=>{
        e.preventDefault();

        const formData = new FormData(); 
        formData.append("image" , file);
        
        dispatch(uploadProfilePhoto(formData));
    }
//////////////////////////////////////////////////////////////////////////////////

    const {profile} = useSelector(state=>state.profile);
    const {user} = useSelector(state=>state.auth);
    const {notifiReqAccepted} = useSelector(state=>state.auth);
    const {sentReq} = useSelector(state=>state.profile); // for Redux RealTime , To re-render Component
    const {reqAccepted} = useSelector(state=>state.profile);
    const {friendDeleted} = useSelector(state=>state.profile);
    const {reqRejected} = useSelector(state=>state.profile);

    useEffect(()=>{
        dispatch(getUserProfileById(id));
        //window.scrollTo(0,0);
        //console.log(profile)
        //console.log(user);
        /*socket.on("newFReq", (data)=>{
            alert("new f req");
        })*/

    } , [id,sentReq,reqAccepted,notifiReqAccepted,friendDeleted,reqRejected]);

    useEffect(()=>{    // a7san mkan lel notifi , 3shan awl ma yft7 y3ml listen lel event da mra 1 bs, w awl ma y7sl yt3ml
        socket.on("newFReq", (data)=>{
            alert("new f req");
        });
    },[]);

    /*socket.on("newFReq", (data)=>{
        alert("new f req");
    })*/


    const deleteAcc = (id)=>{ 
        swal({
            title: "Are You Sure To Delete ?",
            icon: "warning",
            buttons: true
        }).then(clicked=>{
            if(clicked){
                dispatch(deleteAccount(id));
                dispatch(logOut());
                navigate("/");
            }
        })
    }

    {/**  @ToDo -> upload photo cloudinary, and update profile  #43,45  */}

    return(
        <>
        <ToastContainer position="top-center" theme="colored"/>

        <h1> {profile?.username} </h1>   {/** lazem if 3shan bya5od wa2t elawl 3o2bal maygeeb eluser */}
        {
            profile?.profileimg?.url.startsWith("http") ?   // 3shan ana 3amel default photo lw md5lsh profileimg , btbtdy b http
            <img src= {  file? URL.createObjectURL(file) : profile? profile.profileimg.url : null }/> :  
            <img src= { file? URL.createObjectURL(file) : profile? `http://localhost:9000/${profile.profileimg.url}` : null}/>
        }
        
        <h1> User {id}</h1>

        { /* ---------- Buttons (friend operations) --------------- */ }
        {/* lma a5osh profile anyone */ }

        {
            user? <> {
                profile?._id === user?.id ? <> 
                    <button type="submit" className="btn btn-info"> its Me </button> </>
                : profile?.friends?.find( f=>f.id===user?.id ) ? <>
                    <button type="submit"
                            className="btn btn-danger"
                            onClick={ ()=>{ dispatch(deleteFriend(profile._id)) } }
                        > delete friend </button></>
                : profile?.friendRequests?.find( f=>f.id===user?.id ) ? <>
                    <button type="submit"
                            className="btn btn-info"
                            onClick={ ()=>{ dispatch(cancelRequest(profile._id)) } }
                        > Cancel Request </button></>
                : profile?.sentRequests?.find( f=>f.id===user?.id ) ? <>
                    <button type="submit"
                            className="btn btn-info"
                            onClick={ ()=>{
                                dispatch(acceptFriendRequest(profile));
                                socket.emit("acceptFReq" , user, profile);

                            } } 
                        > Accept </button>
                    <button type="submit"
                            className="btn btn-info"
                            onClick={ ()=>{ dispatch(rejectFriendRequest(profile._id)) } }
                        > Reject </button>
                    </>    
                : <><button type="submit"
                            className="btn btn-info" 
                            onClick={ ()=>{
                                dispatch(sendRequest(profile));
                                socket.emit("sendNewFReq" , user, profile);
                            } }
                        >Add Friend </button></>
                } 
            </> 
            
            : <> </>
        }


        <form className="m-3" onSubmit={addPhoto}>
            <div className="form-group">
                <label>Image </label>
                <input type="file" className="form-control"  onChange={ (e)=>setFile(e.target.files[0])}/>
            </div>
            <button type="submit" className="btn my-btn">upload photo</button>
        </form>

        {
            profile?._id === user?.id || user?.admin ? <>
                <button className="btn my-btn" onClick={ ()=>deleteAcc(profile._id)} >Delete account</button> <br/><br/><br/>
            </> : <></>
        }

        {/*
            socket.on("newFReq", (data)=>{
                alert("new f req");
            })
        */}


        </>
    ) 

}
export default UserProfile;
