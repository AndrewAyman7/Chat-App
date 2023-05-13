import { Link, useNavigate, useParams } from "react-router-dom";
import "./chat.css";
import { useSelector } from "react-redux";


const ChatPageLeft = ({socket})=>{

    const {friends} = useSelector(state=>state.friends);
    const {onlineFriends} = useSelector(state=>state.friends);

    let navigate = useNavigate();

    let {id} = useParams();

    return(
        <>

        <div className="create-group-but">
            <Link to={`/chat/create-group`} className="btn crete-g-but"> Create Group </Link>
        </div>
        {
            friends?.map(el=>(
                <div className={id===el.chatId? "ch-left-p-box ch-b-active" : "ch-left-p-box"  }  key={el.id} onClick={()=>{ navigate(`/chat/${el.chatId}`); }}> 
                    <div className="ch-left-p-box-gr">
                        {
                            el.image.startsWith("http") ?   // 3shan ana 3amel default photo lw md5lsh profileimg , btbtdy b http
                            <img className="dash-user-img" src= {el.image}/> : 
                            <img className="dash-user-img" src= {`http://localhost:9000/${el.image}`}/>
                        }
                        { 
                            onlineFriends?.map(onF=>(  
                                onF.id === el.id ? 
                                    <span className="mssg-nav-notifi2"> </span> 
                                : <></>
                            ))
                        }
                        <p> {el.username} </p>
                    </div>
                </div>
            ))
        }

                                          

        </>
    )

}
export default ChatPageLeft;