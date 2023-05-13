import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { profileReducer } from "./slices/profileSlice"; 
import { friendsReducer } from "./slices/friendsSlice";


const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        friends: friendsReducer
    }
});

export default store;