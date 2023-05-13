import { useEffect, useState } from "react";
import "./chat.css";
import ChatPageLeft from "./ChatPageLeft";
import ChatPageRight from "./ChatPageRight";
import { useDispatch, useSelector } from "react-redux";
import { friendsActions } from "../../redux/slices/friendsSlice";


const Chat = ({socket})=>{

    // All This Code Below, to get Online Users

    const dispatch = useDispatch();
    const [onlineF , setOnlineF] = useState(null);
    const {friends} = useSelector(state=>state.friends);
    const [offline,setOffline] = useState(null);
    const [online,setOnline] = useState(null); 

    const setOnlineFriendss = (friends)=>{
        return async (dispatch,getState)=>{
            try{
                dispatch(friendsActions.setOnlineFriends(friends)); // Redux , RealTime 
            }catch(err){
                console.log(err);
            }
        }
    }
    useEffect(()=>{
        if(friends.length !==0){
            socket.emit("getOnlineFriends" , friends);
            socket.on("onlineUsers" , friends=>{
                setOnlineF(friends);
                dispatch(setOnlineFriendss(friends));
            });

            socket.on("offline" , (id)=>{
                setOffline(id);
                console.log("new user offline");
            });

            socket.on("newOneOnline" , (id)=>{
                setOnline(id);
                console.log(id)
                console.log("new user online");
            })
        }
      }, [friends,socket,dispatch,offline,online ]);

    return(
        <>
        <section className="chat-page-container">
            <section className="chat-left-side">
            {/*
                    friends?.map(el=>(
                        <div className="ad-box2" key={el.id}>
                            <p> <Link to={`/profile/${el.id}`}> {el.username}  </Link></p>
                            <p> <Link className="btn btn-warning chbtn" to={`/chat/${el.chatId}`}> Chat </Link> </p>
                            {
                                el.image.startsWith("http") ?   // 3shan ana 3amel default photo lw md5lsh profileimg , btbtdy b http
                                <img className="dash-user-img" src= {el.image}/> : 
                                <img className="dash-user-img" src= {`http://localhost:9000/${el.image}`}/>
                            }
                        </div>
                    ))
                        */}
                        <ChatPageLeft socket={socket}/>
            </section>

            <section className="chat-right-side">
                <ChatPageRight socket={socket}/>
            </section>
        </section>
        </>
    )

}

export default Chat;