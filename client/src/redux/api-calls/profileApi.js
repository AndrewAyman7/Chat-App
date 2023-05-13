import axios from "axios";
import { toast } from "react-toastify";
import { authActions } from "../slices/authSlice";
import { profileActions } from "../slices/profileSlice";

const getUserProfileById = (id)=>{
    return async (dispatch,getState)=>{
        try{
            let user = await axios.get(`http://localhost:9000/api/user/profile/${id}`);
            dispatch(profileActions.setProfile(user.data))
            //console.log(user);
        }catch(err){
            toast.error(err.response.data.message);
            console.log(err);
        }
    }
}

const uploadProfilePhoto = (photo)=>{
    return async (dispatch,getState)=>{
        try{
            let state = getState();
            let response = await axios.post("http://localhost:9000/api/user/upload-photo" , photo, {
                headers: { Authorization: "Bearer " + state.auth.user.token },  // **Note: you can take token from redux or local storage
                "Content-Type" : "multipart/form-data"
             } );
            dispatch(profileActions.setProfilePhoto(response.data.img));

            // Lazem b3d kda t3dl elLocalStorage, mt5zn feha elsora eladema, w 3shan tt3dl fe Redux
            dispatch(authActions.updateUserPhoto(response.data.img));
            let user = JSON.parse(localStorage.getItem("user"));
            user.profileimg = response?.data.img;
            localStorage.setItem("user" , JSON.stringify(user));
            
            toast.success(response.data.message);
        }catch(err){
            toast.error(err.response.data.message);
            console.log(err);
        }
    }
}

const getAllUsers = ()=>{
    return async (dispatch,getState)=>{
        try{
            let users = await axios.get(`http://localhost:9000/api/users` , {
                headers: { Authorization: "Bearer " + getState().auth.user.token }
            });
            dispatch(profileActions.setProfiles(users.data))
            //console.log(users);
        }catch(err){
            toast.error(err.response.data.message);
            console.log(err);
        }
    }
}

const getUsersCount = ()=>{
    return async (dispatch,getState)=>{
        try{
            let users = await axios.get(`http://localhost:9000/api/users/count` , {
                headers: { Authorization: "Bearer " + getState().auth.user.token }
            });
            dispatch(profileActions.setProfilesCount(users.data));
        }catch(err){
            toast.error(err.response.data.message);
            console.log(err);
        }
    }
}

export {getUserProfileById, uploadProfilePhoto ,getAllUsers , getUsersCount}