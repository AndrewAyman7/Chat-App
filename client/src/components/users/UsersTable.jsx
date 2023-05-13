import {Link, useNavigate} from "react-router-dom";
import "./users.css";
import UsersSidebar from "./UsersSidebar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react"; 
import { getAllUsers } from "../../redux/api-calls/profileApi";
import { deleteAccount, logOut } from "../../redux/api-calls/authApi";
import swal from "sweetalert";


const UsersTable = ()=>{
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        dispatch(getAllUsers());
    },[])
    const {profiles} = useSelector(state=>state.profile);


    return<>
    <section className="dashboard-container">
        <UsersSidebar/>

        <div className="admin-main container-fluid">
            <h1 className="table-header"> Users</h1>
            <table className="table table-dark mt-3">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">user</th>
                <th scope="col">photo</th>
                <th scope="col">email</th>
                <th scope="col">Operations</th>
                <th scope="col">Reports</th>
                </tr>
            </thead>
            <tbody>
                { profiles.map((el , idx)=>(
                    <tr key={el._id}>
                        <th scope="row">{idx+1}</th>
                        <td> <Link to={`/profile/${el._id}`}>{el.username}</Link> </td>
                        {
                            el.profileimg.url.startsWith("http") ?   // 3shan ana 3amel default photo lw md5lsh profileimg , btbtdy b http
                            <img className="dash-user-img" src= {el.profileimg.url}/> : 
                            <img className="dash-user-img" src= {`http://localhost:9000/${el.profileimg.url}`}/>
                        }

                        <td>{el.email}</td> 
                        <Link className="btn btn-info" to={`/profile/${el._id}`} >View Profile </Link>

                        <button type="button" className="btn btn-success"> Add Friend </button>
                        <td>0</td>
                    </tr>
                ))}


            </tbody>
            </table>
        </div>
    </section>


    </>
}
export default UsersTable;