import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: JSON.parse(localStorage.getItem("user")) || null, //Login
        registerMssg: null,
        friendReqAccepted: false,
        friendRequests:false
    },  
    
    reducers : {  //Actions      
        login(state,action){
            state.user = action.payload;
        },
        logout(state,action){
            state.user = null;
        },
        register(state,action){
            state.registerMssg = action.payload;
        },
        updateUserPhoto(state,action){
            state.user.profileimg = action.payload;
        },
        isFriendReqAccepted(state,action){
            let req = state.user.friendRequests.find(f=> f.id===action.payload);
            let reqIndex = state.user.friendRequests.indexOf(req);
            state.user.friendRequests.splice(reqIndex,1);
            state.friendReqAccepted = true
        },
        isThereFrRequests(state,action){
            state.user.friendRequests = action.payload;
            state.friendRequests= true;
        }
    }
});

const authReducer = authSlice.reducer;
const authActions = authSlice.actions;

export {authReducer,authActions}