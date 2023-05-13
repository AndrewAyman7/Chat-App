import { useEffect, useRef, useState } from "react";
import { Link,useNavigate,useParams } from "react-router-dom";
import axios from "axios";
import "./chat.css";
import { useDispatch, useSelector } from "react-redux";

const GroupRoom = ({socket})=>{

    const {user} = useSelector(state => state.auth);
    //const {friends} = useSelector(state=>state.friends);
    const navigate = useNavigate();

    const {onlineFriends} = useSelector(state=>state.friends);

    let {id} = useParams();
    let [mssgs,setMssgs] = useState([]);
    let [roomUsers, setRoomUsers] = useState([]);

    let [groupInfo, setGroupInfo] = useState({});

    const getRoomMssgs = async(id)=>{
        const res = await axios.get(`http://localhost:9000/api/room/${id}` , { 
            headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("user") ).token }
        });
        console.log(res);
        setMssgs(res.data.mssgs);
        setGroupInfo(res.data.groupInfo);
        setRoomUsers(res.data.groupInfo[0].users);
        console.log(res.data.groupInfo[0].users);
    }

    const postMssg = async(mssg)=>{
        const res = await axios.post(`http://localhost:9000/api/chat/addgroupmssg` , mssg, { 
            headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("user") ).token }
        });
        console.log(res);
    }

    const [mssg,setMssg] = useState("");
    const [reloadNewMssg,setReloadNewMssg] = useState(null); 
    const [notifiMssg,setNotifiMssg] = useState(null);       

    useEffect(()=>{
        //dispatch(getFriends()); // msh h7tagha b2a 3hsan 3mltha fe el App 5las
        getRoomMssgs(id);
        socket.emit("joinChatRoom" , id)// iam here

        socket.on("newMssgNotifi" , (mssg)=>{  
            setNotifiMssg(new Date().toISOString()+mssg.content); 
        });
    }, [id, reloadNewMssg, notifiMssg]);


    const goToLastMssg = useRef(null);

    useEffect(()=>{
        goToLastMssg.current?.scrollIntoView();
    },[id,reloadNewMssg,notifiMssg,mssgs])


    return(
        <>
        <div className="room-chat-container">
        <div className="room-chat-users">
            <h1> Group Users </h1>
            {
                roomUsers?.map((el,idx)=>(
                    <div className={el._id===user.id? "ch-left-p-box ch-b-active" : "ch-left-p-box"  }  key={idx} onClick={()=>{ navigate(`/profile/${el._id}`); }}> 
                        <div className="ch-left-p-box-gr">
                            {
                                el.profileimg.url.startsWith("http") ?   // 3shan ana 3amel default photo lw md5lsh profileimg , btbtdy b http
                                <img className="dash-user-img" src= {el.profileimg.url}/> : 
                                <img className="dash-user-img" src= {`http://localhost:9000/${el.profileimg.url}`}/>
                            }
                            <div>
                                <p> {el.username} </p>
                                {
                                    groupInfo[0]?.creator === el._id ? <span className="admin-room-span">Admin</span> : <></>
                                }
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>

        <div className="chat-room-box"> 
                <div className="chat-header">
                    {
                     <h2> {groupInfo[0]?.groupName} </h2>
                    }
                    {/* mssgs.length !==0 ? <p> {mssgs[0].chat.users[0].username} </p> : <>user</> } {/* ha5od elFriend Info mn ay mssg mn elArray */}
                    { /** Lw mfeesh mssgs, haat elData bta3et elfriend mn elId bta3 elchat aw haga, sahla fe kza tare2a */}

                    { 
                        onlineFriends?.map(onF=>(  
                            onF.chatId === id ? 
                                <span className="mssg-nav-notifi3"> </span> 
                            : <></>
                        ))
                    }
                </div>

                <div className="chat-content">
               
                {
                    mssgs.length !==0 ? <>
                    
                        {
                            
                            mssgs.map(mssg=>(
                               <>
                                <div className="mssg-box">
                                    
                                    { mssg.sender._id === user.id ? <p className="sender-m">{mssg.content}</p> : <>
                                        <div className="receiver-g-m">  
                                            <span className="receiver-g-span"> {mssg.sender.username} </span>
                                            <p>{mssg.content}</p> 
                                        </div>
                                     </>
                                    }
                                </div>
                               </>
                            ))
            
                        }
                       
                    </> : <>Start The Chat</>
                }
               <div ref={goToLastMssg}/>

                </div>

                <div className="chat-form">
                    <div className="chat-form-textarea">
                        <textarea placeholder="Message" value={mssg} onChange={(e=>setMssg(e.target.value))} ></textarea>
                    </div>
                    <div className="chat-form-submit">
                        <button
                        className="btn btn-info"
                        onClick={()=>{
                            // put Condition here , if empty content, refuse.. , shhof elVideo el 59_min (elAgnby) 3amlha
                            let fullMssg = {
                                chat: id,
                                content: mssg,
                                sender: user.id
                            }
                            console.log(fullMssg);
                            postMssg(fullMssg);
                            socket.emit("sendMssg" , fullMssg);

                            setMssg(""); // 3shan afddy el input
                            setReloadNewMssg(new Date().toISOString()+fullMssg.content); // 3shan tb2a unique w el State tb2a gdeda koll mra
                        }}
                      > Send </button>
                    </div>
                </div>
            </div>
        </div>
            
        </>
    )

}
export default GroupRoom;