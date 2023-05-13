import Navbar from "./Navbar";

const Header = ({socket})=>{

    return(
        <>
        <Navbar socket= {socket} />
        </>
    )

}
export default Header;