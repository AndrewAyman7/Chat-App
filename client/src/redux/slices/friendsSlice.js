import {createSlice} from "@reduxjs/toolkit";

const friendsSlice = createSlice({
    name: "friends",
    initialState: {
        friends : [],
        onlineFriends: [],
        //neUserOffline : null
    },  
    
    reducers : {                    
        setfriends(state,action){         // Get User By ID
            state.friends = action.payload;
        },
        setOnlineFriends(state,action){
            state.onlineFriends = action.payload;
        },
        /*userGetOffline(state,action){
            state.neUserOffline = action.payload;
        }*/
    }
});

const friendsReducer = friendsSlice.reducer;
const friendsActions = friendsSlice.actions;

export {friendsReducer,friendsActions}