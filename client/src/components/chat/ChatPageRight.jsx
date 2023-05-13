import { useEffect, useRef, useState } from "react";
import { Link,useParams } from "react-router-dom";
import axios from "axios";
import "./chat.css";
import { useDispatch, useSelector } from "react-redux";
//import ScrollToBottom from 'react-scroll-to-bottom';
import { getFriends } from "../../redux/api-calls/friendsApi";



const ChatPageRight = ({socket})=>{

    const {user} = useSelector(state => state.auth);
    const {friends} = useSelector(state=>state.friends);

    const {onlineFriends} = useSelector(state=>state.friends);

    let {id} = useParams();
    let [mssgs,setMssgs] = useState([]);
    const getMssgs = async(id)=>{
        const res = await axios.get(`http://localhost:9000/api/chat/${id}` , { 
            headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("user") ).token }
        });
        console.log(res);
        setMssgs(res.data);
    }

    const postMssg = async(mssg)=>{
        const res = await axios.post(`http://localhost:9000/api/chat/addmssg` , mssg, { 
            headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("user") ).token }
        });
        console.log(res);
    }

    const [mssg,setMssg] = useState("");
    const [reloadNewMssg,setReloadNewMssg] = useState(null); // (1) 3shan lma ab3t rsala y3ml reload 3ndy
    const [notifiMssg,setNotifiMssg] = useState(null);       // (2) 3shan lma ygely mssg, y3ml reload w ygbha

    useEffect(()=>{
        //dispatch(getFriends()); // msh h7tagha b2a 3hsan 3mltha fe el App 5las
        getMssgs(id);
        socket.emit("joinChatRoom" , id)// iam here

        socket.on("newMssgNotifi" , (mssg)=>{  // 5ale balek kda mmkn mtsht8lsh 3shan hy3de 3la elUseEffect mra 1 bs t2rebn !!
            setNotifiMssg(new Date().toISOString()+mssg.content); // 3shan tb2a unique w el State tb2a gdeda koll mra
        }); // 7otaha fe component el App w el Navbar, 3shan ygeely notification mn ay saf7a
    }, [id, reloadNewMssg, notifiMssg]);

    // Note: you can write socket.emit("" , (data) , { CB fun })

    const goToLastMssg = useRef(null);

    useEffect(()=>{
        goToLastMssg.current?.scrollIntoView();
    },[id,reloadNewMssg,notifiMssg,mssgs])


    return(
        <>
            <div className="chat-box"> 
                <div className="chat-header">
                    {
                        mssgs.length !==0 ? <>
                        {
                            mssgs[0].chat.users.map((userr,idx)=>( // ana m5zn el users fe koll mssg, fa ha5odhom mn awl rsala w 5las
                                userr._id !== user.id? <Link to={`/profile/${userr._id}`}><p> {mssgs[0].chat.users[idx].username} </p></Link> : <></> 
                            ))
                        }
                        </> : <>user</> // awl ma yktb awl mssg, koloo hayzhrr
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
                                    {mssg.sender === user.id ? <p className="sender-m">{mssg.content}</p> : <p className="receiver-m">{mssg.content}</p>}
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
        </>
    )

}
export default ChatPageRight;