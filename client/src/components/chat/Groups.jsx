import { useEffect, useState } from "react";
import "./chat.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Groups = ({socket})=>{

    const navigate = useNavigate(); 
    const {user} = useSelector(state => state.auth);

    const [rooms, setRooms] = useState([]);

    const getGroups = async()=>{
        const res = await axios.get(`http://localhost:9000/api/rooms`);
        console.log(res.data);
        setRooms(res.data);
    }

    const joinRoomFun = async(id)=>{
        await axios.post(`http://localhost:9000/api/chat/join-chat/${id}` , {} , {
            headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("user") ).token }
        });
    }

    const handleJoinRoomFun = (id)=>{
        joinRoomFun(id);
        navigate(`/room/${id}`);
    }


    useEffect(()=>{
        getGroups();
    },[])

    return(

        <>

        <div className="create-room-but">
            <Link to={`/chat/create-group`} className="btn crete-r-but"> Create Group </Link>
        </div>

        <div className="rooms-container">

        {
            rooms?.map((room,idx)=>(
                <div className="room-box" key={idx}>
                    <h3> {room.groupName} </h3>
                    <h4> creator: {room.creator.username} </h4>
                    <div className="room-box-users"> 
                        {
                            room.users?.map((user,idx)=>(
                                <p> {user.username} </p>
                            ))
                        }
                    </div>

                        {
                            room.users.find(el=> el._id === user.id) ? <> 
                                <button className="btn join-room-btn" > leave room </button>
                                <Link to={`/room/${room._id}`} className="btn join-room-btn"> Enter Room </Link>
                            </>: <>
                                <button
                                className="btn join-room-btn"
                                onClick={()=>{handleJoinRoomFun(room._id)}}
                                > Join Room </button>
                            </>
                        } 
                </div>
            ) )
        }

        </div>

        

        </>

)
}

export default Groups;