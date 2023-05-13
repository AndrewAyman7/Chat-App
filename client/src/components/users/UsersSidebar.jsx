import { Link } from "react-router-dom";

const AdminSidebar = ()=>{

    return(
        <>
        <section className="admin-sidebar container-fluid">  
            <div className="admin-sidebar-header">
                <i class="bi bi-columns"></i> <h3 className="admin-side-header">Dashboard</h3> 
            </div>
            <div className="sidebar-admin-list">
                <div className="admin-list-item"><Link to={"/users"} > <i class="bi bi-person"></i>  Users </Link> </div>
            </div>
        </section>
        </>
    )

}
export default AdminSidebar;