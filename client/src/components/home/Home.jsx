import "./home.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Friends from "../friends/Friends";

const Home = ({socket})=>{ 
    const dispatch = useDispatch();
    return(
        <>
        <section className="home">
            <div className="home-header">
                <Friends socket={socket}/>
            </div>
        </section>

        </>
    )

}
export default Home;