import axios from "axios";
import { authActions } from "../slices/authSlice";
import { profileActions } from "../slices/profileSlice";


// Without Redux (Not RealTime)
/*const sendRequest = async (friend)=>{
        try{
            console.log(friend);
            const res = await axios.post("http://localhost:9000/api/friend/sendreq" , friend , { 
                headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("user") ).token }
            });
            console.log(res);
        }catch(err){
            console.log(err);
        }
} */

// With Redux (RealTime)
const sendRequest = (friend)=>{
    return async (dispatch,getState)=>{
        try{
            console.log(friend);
            const res = await axios.post("http://localhost:9000/api/friend/sendreq" , friend , { 
                headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("user") ).token }
            });
            dispatch( profileActions.setProfileSentReq(res.data.user2) ); // Redux , RealTime 
            console.log(res.data.user2);
        }catch(err){
            console.log(err);
        }
    }
}

const cancelRequest = (friendId)=>{
    return async (dispatch,getState)=>{
        try{
            const res = await axios.delete(`http://localhost:9000/api/friend/cancelreq/${friendId}` , { 
                headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("user") ).token }
            });
            dispatch( profileActions.setProfileCancelReq(res.data.user2.id) ); // Redux , RealTime 
            console.log(res.data.user2);
        }catch(err){
            console.log(err);
        }
    }
}

const acceptFriendRequest = (friend)=>{
    return async (dispatch,getState)=>{
        try{
            console.log(friend);
            const res = await axios.post("http://localhost:9000/api/friend/accept" , friend , {
                headers: { Authorization: "Bearer " + getState().auth.user.token }
            });
            dispatch( profileActions.setAcceptFriendReq(res.data.user2) ); // Redux , RealTime 
            dispatch( authActions.isFriendReqAccepted(res.data.user1._id) );
            
            // 3shan a3dl el data bta3et elUser ely 3amel Login, fe ellocalstorage, 3shan elFriendRequests tt3dl
            let user = JSON.parse(localStorage.getItem("user"));
            let fr = user.friendRequests.find(f=> f.id===res.data.user1._id);
            let frIndex = user.friendRequests.indexOf(fr);
            user.friendRequests.splice(frIndex,1);
            localStorage.setItem("user" , JSON.stringify(user));
            //console.log(res.data.user1._id);
        }catch(err){
            console.log(err);
        }
    }
}

const rejectFriendRequest = (friendId)=>{
    return async (dispatch,getState)=>{
        try{
            const res = await axios.delete(`http://localhost:9000/api/friend/reject/${friendId}` , { 
                headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("user") ).token }
            });
            dispatch( profileActions.setRejectFriendReq(res.data.user2._id) ); // Redux , RealTime 
        }catch(err){
            console.log(err);
        }
    }
}

const deleteFriend = (friendId)=>{
    return async (dispatch,getState)=>{
        try{
            const res = await axios.delete(`http://localhost:9000/api/friend/delete/${friendId}` , { 
                headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("user") ).token }
            });
            dispatch( profileActions.setDeleteFriend(res.data.user2._id) ); // Redux , RealTime 
        }catch(err){
            console.log(err);
        }
    }
}


export {sendRequest , cancelRequest , acceptFriendRequest , rejectFriendRequest, deleteFriend} 