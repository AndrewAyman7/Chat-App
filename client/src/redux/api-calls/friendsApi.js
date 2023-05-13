import axios from "axios";
import { friendsActions } from "../slices/friendsSlice";

const getFriends = ()=>{
    return async (dispatch,getState)=>{
        try{
            const res = await axios.get("http://localhost:9000/api/friends" , { 
                headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("user") ).token }
            });
            dispatch( friendsActions.setfriends(res.data.friends) ); // Redux , RealTime 
            console.log(res.data);
        }catch(err){
            console.log(err);
        }
    }
}


export {getFriends} 