import Header from "./components/header/Header";
import {Routes, Route , Navigate}  from "react-router-dom";
import Home from "./components/home/Home";
import Footer from "./components/footer/Footer";
import UserProfile from "./components/UserProfile/UserProfile";
import UsersTable from "./components/users/UsersTable";
import Register from "./components/forms/Register";
import Login from "./components/forms/Login";
import ForgotPass from "./components/forms/ForgotPass";
import NotFound from "./components/not found/NotFound";


import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable'; // To Open React App On Edge Browser

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';



import {socket} from "./socket";
import Friends from "./components/friends/Friends";
import Chat from "./components/chat/Chat";
import { getFriends } from "./redux/api-calls/friendsApi";
import CreateChatGroup from "./components/chat/CreateChatGroup";
import Groups from "./components/chat/Groups";
import GroupRoom from "./components/chat/GroupRoom";


const  App = ()=> {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);  // state.auth.user
  const {friends} = useSelector(state=>state.friends);

  useEffect(()=>{
    dispatch(getFriends());
    socket.on("connect" , ()=>{
      console.log("you connected to server" , user?.id);
      socket.emit("joinMeInNotifiRoom" , user?.id);
      socket.emit("goOnline" , (user?.id));

      // Note: you can write socket.emit("" , (data) , { CB fun })
      
      socket.on("newFReq", (data)=>{
        alert("new f req");
      });
      socket.on("acceptFReqNotifi" , (data)=>{
        alert(`${data.name } Accepted your friend request, you are friends now`);
      })
    });

    //socket.emit("goOnline" , (user?.id));
    
    /*socket.on("newFReq", (data)=>{.js

      alert("new f req");
    });
    socket.on("acceptFReqNotifi" , (data)=>{
      alert(`${data.name } Accepted your friend request, you are friends now`);
      //alert("accepted");
    })*/
  }, []);

  return <>
      <Header socket={socket}/>
      <Routes>
        <Route path="/" element={!user? <Login/> : <Navigate to="/friends"/> } />
        <Route path="/profile/:id" element={ <UserProfile/> } />
        <Route path="/profile" element={ <Navigate to={`/profile/${user?.id}`} /> } /> 

        <Route path="users" element=    {<UsersTable/>} />

        <Route path="/register" element={ !user? <Register/> : <Navigate to="/"/> } />
        <Route path="/login" element={ !user? <Login/> : <Navigate to="/"/> } />
        <Route path="/forgot-password" element={<ForgotPass/>} />

        <Route path="/friends" element = { <Friends socket={socket}/> } />

        <Route path="/chat/:id" element = { !user? <Login/> : <Chat socket={socket}/> } /> 

        <Route path="/chat/create-group" element = { !user? <Login/> : <CreateChatGroup/> } /> 
        
        <Route path="/rooms" element={<Groups/>} />
        <Route path="/room/:id" element={ <GroupRoom socket={socket}/>}  />

        <Route path="*" element={<NotFound/>} />  {/** Lazem a5er Route */}
      </Routes>
      <Footer/>
      </>

}

export default App;
