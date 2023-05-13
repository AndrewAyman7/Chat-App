import {Link} from "react-router-dom";
import "./not-found.css";
const NotFound = ()=>{
    
    return(
        <>
        <section className="not-found-page">
            <h1> 404 </h1>
            <h4> Page Not Found </h4>
            <Link to={"/"} className="btn my-btn">Back To Home Page</Link>
        </section>
        </>
    )

}

export default NotFound;