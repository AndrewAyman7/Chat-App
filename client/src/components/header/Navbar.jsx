import { useDispatch, useSelector } from "react-redux";
import {Link, Navigate, useNavigate} from "react-router-dom";
import { hiddenReloadForNewRequests, logOut } from "../../redux/api-calls/authApi";
import "./header.css";
import { useEffect, useState } from "react";
import { socket } from "../../socket";

const Navbar = ({socket})=>{

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {user} = useSelector(state => state.auth);  // state.auth.user
    const {friendRequests} = useSelector(state=> state.auth);
    const {friends} = useSelector(state=>state.friends);

    useEffect(()=>{
        if(user){  // for errors , 3shan lma yd5ol w hwa msh online, hygblo error , Redux -> no auth user state
            dispatch(hiddenReloadForNewRequests());
        }
    }, [friendRequests]);
    

    const [newReq , setNewReq] = useState(null);
    const [notifiBox, setNotifiBox] = useState(false);

    useEffect(()=>{    // a7san mkan lel notifi , 3shan awl ma yft7 y3ml listen lel event da mra 1 bs, w awl ma y7sl yt3ml
        socket.on("newFReq", (data)=>{
            //alert("new f req");
            setNewReq({name: data.name , id: data.id});
            console.log(data);
            setNotifiBox(true);
        });
    },[]);

    const logOutFun = ()=>{
        navigate("/");
        dispatch(logOut());
        socket.disconnect(user.id);
    }

    const [notifiMssg,setNotifiMssg] = useState(null);      
    useEffect(()=>{
        socket.on("newMssgNotifi" , (mssg)=>{ 
            setNotifiMssg(new Date().toISOString()+mssg.content);
        });
    }, [notifiMssg,socket]);

    return<>

        <nav className="navbar navbar-expand-lg navbar-light myNav ">
            <div className="logo">
                <Link className="navbar-brand" to="/">Chat App</Link >
            </div>

            <div className="links">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Home</Link >
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/users">Users</Link >
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/friends">friends</Link >
                    </li>
                    { user?.admin? <>
                            <li className="nav-item">
                            <Link className="nav-link" to="/admin-dashboard">Admin Dashboard</Link >
                            </li>
                        </> : <></>
                    }

                </ul>
            </div>

            {
                user? <>
                        <div className="btn-group">
                            <button type="button"
                                   className= { notifiBox? "btn btn-danger" : "btn btn-info" }
                                   onClick={ ()=>{ dispatch(hiddenReloadForNewRequests()); } }
                                >friend requests</button>
                            <button type="button"
                                    //className="btn btn-info dropdown-toggle dropdown-toggle-split"
                                    className= { notifiBox? "btn btn-danger dropdown-toggle dropdown-toggle-split" : "btn btn-info dropdown-toggle dropdown-toggle-split" }
                                    data-toggle="dropdown" 
                                    aria-haspopup="true" 
                                    aria-expanded="false"
                                    onClick={ ()=>{ dispatch(hiddenReloadForNewRequests()); } }
                                    >
                                <span className="sr-only">Toggle Dropdown</span>
                            </button>
                            <div className="dropdown-menu">
                                {
                                    user?.friendRequests?.map(el=>(
                                        <a key={el.id}  className="dropdown-item" href={`/profile/${el.id}`}> {el.username}</a>
                                    ))
                                }
                                {
                                    newReq? <a className="dropdown-item" href={`/profile/${newReq.id}`}> {newReq.name}</a> : <></>
                                }
                            </div>
                        </div>
                </> : <></>
            }

            {/** Messanger Notifi */}
            <div class="btn-group mssg-nav-icon-box">
            <i type="button" class="bi bi-chat mssg-nav-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            </i>
            {notifiMssg? <span className="mssg-nav-notifi"> </span> : <></>}
            <div class="dropdown-menu">
                {
                    friends?.map(el=>(
                        <a class="dropdown-item" href={`/chat/${el.chatId}`} key={el.id} >{el.username}</a>
                    ))
                }
            </div>
            </div>

            <div className="rooms-nav">
                <Link to={"/rooms"}> Rooms </Link> 
            </div>

            { user? <>
                        <Link className="nav-link" to={`/profile/${user.id}`}>{user.username} </Link > {/** 7ott hena b2a sora eluser ely 3ml login */} 
                        <button onClick={()=>{ logOutFun() }}>Logout</button>
                    </> :   
                            <div className="btns"  >
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item">
                                    <Link to={"/register"} type="button" className="btn my-btn">Register</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to={"/login"} type="button" className="btn my-btn">Login</Link>
                                </li>
                            </ul>
                        </div> 
            }

        </nav>
    </>

}

export default Navbar