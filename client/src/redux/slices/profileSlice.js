import {createSlice} from "@reduxjs/toolkit";

const profileSlice = createSlice({
    name: "profile",
    initialState: {
        profile: null,
        profiles : [],
        profilesCount : null,
        sentReq : false, // for Rerendering the component , y3ml Rerender lel component , fa ygeeb elData elgdeeda
        reqAccepted: false,
        friendDeleted: false,
        reqRejected : false
    },  
    
    reducers : {                    
        setProfile(state,action){         // Get User By ID
            state.profile = action.payload;
        },
        setProfilePhoto(state,action){
            state.profile.profileimg = action.payload;
        },
        /** @Todo -> #53 enhancements : Delete Profile */

        setProfiles(state,action){
            state.profiles = action.payload
        },
        setProfilesCount(state,action){
            state.profilesCount = action.payload
        },
        setProfileSentReq(state,action){
            state.profile.friendRequests.push(action.payload);
            state.sentReq = true;

        },
        setProfileCancelReq(state,action){
            let request = state.profile.friendRequests.find(r=> r.id===action.payload);
            let requestIndex = state.profile.friendRequests.indexOf(request);
            state.profile.friendRequests.splice(requestIndex,1);
            state.sentReq = false;
        },
        setAcceptFriendReq(state,action){
            state.profile.friends.push(action.payload);
            state.sentReq = false;
            state.reqAccepted = true;
        },
        setRejectFriendReq(state,action){
            let req = state.profile.sentRequests.find(f=> f.id===action.payload);
            let reqIndex = state.profile.sentRequests.indexOf(req);
            state.profile.sentRequests.splice(reqIndex,1);
            state.reqRejected = true
        },
        setDeleteFriend(state,action){
            let friend = state.profile.friends.find(f=> f.id===action.payload);
            let friendIndex = state.profile.friends.indexOf(friend);
            state.profile.friends.splice(friendIndex,1);
            state.friendDeleted = true;
            state.reqAccepted = false;
        }
    }
});

const profileReducer = profileSlice.reducer;
const profileActions = profileSlice.actions;

export {profileReducer,profileActions}