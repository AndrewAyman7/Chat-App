import { authActions } from "../slices/authSlice";
import axios from "axios";
import { toast } from "react-toastify";


//1- Login fun
const loginUser = (user)=>{
    return async (dispatch,getState)=>{     // Lazem el Api Call tb2a fe elAnomious fun inside the fun
        try{
            const response = await axios.post("http://localhost:9000/api/auth/login" , user);
            dispatch(authActions.login(response.data));
            localStorage.setItem("user" , JSON.stringify(response.data));  // 3lshan ha5od msh eltoken bs , token w name w img
        }catch(err){  // ooooooof, wow, de htsht8l fe 7ala -> statusCode 400 , lw 3mltha 200 mn elApi msh htsht8l, msh hayegy 3nd elcatch
            toast.error(err.response.data.message);  // Hywslo b3d ma y3ml el validation bta3 elfrontend , (mykonsh input faddy y3ni)
            // ooooooof, wow, de htsht8l fe 7ala -> statusCode 400 , lw 3mltha 200 mn elApi msh htsht8l, msh hayegy 3nd elcatch
            // grbt a3ml elError with status code 200 -> da5ll el error mssg fe ellocal storage !! , 3ml eltry msh el catch
        }
    }
}

const logOut = ()=>{  // just make user state = null , and delete localStorage, mfehash ay call lw api
    return (dispatch,getState)=>{  
        dispatch(authActions.logout());
        localStorage.removeItem("user");
    }
}

const register = (user)=>{
    return async (dispatch,getState)=>{
        try{
            const {data} = await axios.post("http://localhost:9000/api/auth/signup" , user);
            dispatch(authActions.register(data.message));  // hena msh ha5od data wla token wla haga, just mssg success
        }catch(err){
            toast.error(err.response.data.message);
        }
    }
}

const deleteAccount = (id)=>{
    return async (dispatch,getState)=>{
        try{
            const {data} = await axios.delete(`http://localhost:9000/api/user/${id}` , {
                headers: { Authorization: "Bearer " + getState().auth.user.token }
            });
            /** @Todo -> #53 enhancements : Delete Profile */
        }catch(err){
            toast.error(err.response.data.message);
        }
    }
}

const hiddenReloadForNewRequests = ()=>{  // Before Socketio, lma adoos 3la dropdown elRequests, yb3t request ygeeb el data w y7otha k state gdeda
    return async (dispatch,getState)=>{
        try{
            const data = await axios.get(`http://localhost:9000/api/user/friendrequests` , {
                headers: { Authorization: "Bearer " + getState().auth.user.token }
            });
            let friendRequests = data.data.friendRequests;
            //console.log(data);
           // console.log(friendRequests)
            let user = JSON.parse(localStorage.getItem("user"));
            user.friendRequests = friendRequests;
            dispatch(authActions.isThereFrRequests(friendRequests));
            localStorage.setItem("user" , JSON.stringify(user));
        }catch(err){
            console.log(err);
        }
    }
}


export {loginUser , logOut , register , deleteAccount ,hiddenReloadForNewRequests}