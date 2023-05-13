import { useState } from "react";
import "./chat.css";
import axios from "axios";
import { useSelector } from "react-redux";

const CreateChatGroup = ({socket})=>{

    const {friends} = useSelector(state=>state.friends);
    const {user} = useSelector(state => state.auth);

    const CreateTheChatGroup = async(data)=>{
        console.log(data);
        const res = axios.post("http://localhost:9000/api/chat/create-group" , data , {
            headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("user") ).token }
        });
    }

    const [groupName,setGroupName] = useState("");
    const [privacy,setPrivacy] = useState("");
    const [checkedUsers, setCheckedUsers] = useState([]);


    const handleCheck = (event) => {
        var updatedList = [...checkedUsers];
        if (event.target.checked) {
          updatedList = [...checkedUsers, event.target.value];
        } else {
          updatedList.splice(checkedUsers.indexOf(event.target.value), 1);
        }
        setCheckedUsers(updatedList);
      };

    const submitGroupChatForm = (e)=>{
        e.preventDefault();
        console.log(groupName, checkedUsers, privacy);
        CreateTheChatGroup({
            users: checkedUsers,
            creator: user.id,
            groupName: groupName,
            privacy: privacy
        });
    }

    return(
        <>

        <div className="ch-gr-form-container">

        <h1 className="text-center">Create Group Chat</h1>

            <form className="m-3" onSubmit={submitGroupChatForm} >
                <div className="form-group">
                    <label>Group Chat Name</label>
                    <input className="form-control" placeholder="name" value={groupName} onChange={(e)=>setGroupName(e.target.value)} />
                </div>
                <div class="form-group">
                    <label for="exampleFormControlSelect1">Private Chat or Public Chat</label>
                    <select class="form-control" id="exampleFormControlSelect1" value={privacy} onChange={ (e)=>setPrivacy(e.target.value)}>
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                    </select>
                </div>

                {
                    friends?.map((item,idx)=>( <>
                        <div class="form-check form-check-inline" key={idx}>
                            <input class="form-check-input" type="checkbox" value={item.id} onChange={handleCheck}/>
                            <label class="form-check-label">{item.username}</label> 
                        </div> <br/> 
                    </> ))
                }

                <br/><br/>
                <button type="submit" className="btn my-btn">Create Group</button>
            </form>

            
        </div>

        </>
    )

}
export default CreateChatGroup;

