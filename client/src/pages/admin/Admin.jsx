import "./admin.css";
import { Link, Outlet, useLocation } from "react-router-dom";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const Admin = () => {

    const { pathname } = useLocation();

    /*=========================================*/

    return (
        <div className="admin custom-div">
            <div className="container p-0">
                <ul className="admin-ul">
                    <li>
                        <Link
                            to={"/admin"}
                            className={`${pathname === "/admin" ? "active" : ""}`}
                        >Playlists</Link>
                    </li>
                    <li>
                        <Link
                            to={"/admin/courses-admin"}
                            className={`${pathname === "/admin/courses-admin" ? "active" : ""}`}
                        >Courses</Link>
                    </li>
                    <li>
                        <Link
                            to={"/admin/teachers"}
                            className={`${pathname === "/admin/teachers" ? "active" : ""}`}
                        >Teachers</Link>
                    </li>
                    <li>
                        <Link
                            to={"/admin/students"}
                            className={`${pathname === "/admin/students" ? "active" : ""}`}
                        >Students</Link>
                    </li>
                    <li>
                        <Link
                            to={"/admin/other"}
                            className={`${pathname === "/admin/other" ? "active" : ""}`}
                        >Other</Link>
                    </li>
                    <li>
                        <Link
                            to={"/admin/category"}
                            className={`${pathname === "/admin/category" ? "active" : ""}`}
                        >Category</Link>
                    </li>
                </ul>
                <Outlet />
            </div>
        </div>
    )
}

export default Admin;