import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";


const ForgotPass = ()=>{

    const [email,setEmail] = useState("");

    const submitForm = (e)=>{
        e.preventDefault();

        if(email.trim() === "")  return toast.error("email is Required");
        
        console.log({email});
    }
    
    return(
        <>
        <div className="col-6 m-auto post-form">
        <ToastContainer position="top-center" theme="colored"/>

        <h1 className="text-center">Forgot Password</h1>

            <form className="m-3" onSubmit={submitForm}>
                <div className="form-group">
                    <label>Email</label>
                    <input className="form-control"  placeholder="email"  value={email} onChange={ (e)=>setEmail(e.target.value)}/>
                </div>
                <button type="submit" className="btn my-btn">send me an email</button>
            </form>

            {/** @ToDo -> Reset Password Form , b3d ma ab3tlo email verify */}
            
        </div>
        </>
    )

}

export default ForgotPass;