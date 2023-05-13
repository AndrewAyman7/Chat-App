import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {Link} from "react-router-dom";
import { useDispatch } from "react-redux"; // Connect between React App & Redux
import { loginUser } from "../../redux/api-calls/authApi";

const Login = ()=>{

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const dispatch = useDispatch();

    const submitForm = (e)=>{
        e.preventDefault();

        if(email.trim() === "")    return toast.error("email is Required");
        if(password.trim() === "")  return toast.error("password is Required");

        dispatch(loginUser({email,password}));
    }
    
    return(
        <>
        <div className="col-6 m-auto post-form">
        <ToastContainer position="top-center" theme="colored"/>

        <h1 className="text-center">Sign In</h1>

            <form className="m-3" onSubmit={submitForm}>
                <div className="form-group">
                    <label>Email</label>
                    <input className="form-control"  placeholder="email"  value={email} onChange={ (e)=>setEmail(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control"  placeholder="password"  value={password} onChange={ (e)=>setPassword(e.target.value)}/>
                </div>

                <button type="submit" className="btn my-btn">Login</button>
            </form>

            <div>
                forgot your password ? <Link to={"/forgot-password"} type="button" className="btn my-btn">Forgot password</Link>
            </div>
            <br/>
            <div>
                You don't have an account ? <Link to={"/register"} type="button" className="btn my-btn">Register</Link>
            </div>
            
        </div>
        </>
    )

}

export default Login;