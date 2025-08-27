import "./teacher-dashboard.css";
import { Link, Outlet, useLocation } from "react-router-dom";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const TeacherDashboard = () => {

    const { pathname } = useLocation();

    /*=========================================*/

    return (
        <div className="teacher-dashboard custom-div">
            <div className="container p-0">
                <ul className="d-flex gap-5">
                    <li className={`${pathname === "/teacher-dashboard" ? "active" : ""}`}>
                        <Link to={"/teacher-dashboard"}>playlist table</Link>
                    </li>
                    <li className={`${pathname === "/teacher-dashboard/add-playlist" ? "active" : ""}`}>
                        <Link to={"/teacher-dashboard/add-playlist"}>add new playlist</Link>
                    </li>
                    <li className={`${pathname === "/teacher-dashboard/table-course" ? "active" : ""}`}>
                        <Link to={"/teacher-dashboard/table-course"}>courses table</Link>
                    </li>
                    <li className={`${pathname === "/teacher-dashboard/add-course" ? "active" : ""}`}>
                        <Link to={"/teacher-dashboard/add-course"}>add new course</Link>
                    </li>
                </ul>
                <Outlet />
            </div>
        </div>
    )
}

export default TeacherDashboard;