import './sidebar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOutUser } from '../../../redux/apiCalls/authApiCall';
import { hidePopUp } from '../../../redux/slices/popUpSlice';
import {
    FaHouse,
    FaQuestion,
    FaGraduationCap,
    FaChalkboardUser,
    FaHeadset
} from "react-icons/fa6";
import swal from 'sweetalert';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const SideBar = ({ sideBarToggle }) => {

    const dispatch = useDispatch();

    const { currentUser } = useSelector(state => state.auth);

    const location = useLocation();

    const navigate = useNavigate();

    const isAdmin = currentUser?.isAdmin ? true : false;

    /*=========================================*/

    const linkData = [
        { id: 1, goTo: "/", icon: <FaHouse />, content: "Home" },
        { id: 2, goTo: "/about", icon: <FaQuestion />, content: "About" },
        { id: 3, goTo: "/courses", icon: <FaGraduationCap />, content: "Courses" },
        { id: 4, goTo: "/teachers", icon: <FaChalkboardUser />, content: "Teachers" },
        { id: 5, goTo: "/contact", icon: <FaHeadset />, content: "Contact Us" }
    ];

    /*=========================================*/

    // close the pop up WHEN CLICK ON LINKS
    const hidePopUpHandler = () => {
        dispatch(hidePopUp());
    }

    /*=========================================*/

    const logOutHandler = (e) => {
        e.preventDefault();
        swal({
            title: "Are you sure?",
            text: "You will be logged out of your account.",
            icon: "warning",
            buttons: ["Cancel", "Yes, log me out!"],
        }).then((willLogOut) => {
            if (willLogOut) {
                dispatch(logOutUser());
                // dispatch(hidePopUp());   
                navigate("/", { replace: true });
            }
        });
    }

    /*=========================================*/

    return (
        <div className={sideBarToggle ? "side-bar full" : "side-bar"}>
            {
                currentUser
                    ?
                    <>
                        <div className="side-bar-profile">
                            <div>
                                <img
                                    src={currentUser?.profilePhoto?.url}
                                    alt="user profile"
                                />
                            </div>
                            <h3
                                className='text-capitalize'
                                style={{ color: "var(--black)" }}>{currentUser?.username}</h3>
                            <span style={
                                {
                                    color: "var(--light-color)",
                                    fontSize: "1.4rem"
                                }}>
                                {
                                    /*
                                    if the user select the role from select and if the rolw will be [Other],
                                    the text will be the profession from user , otherwise show the [teacher or student]
                                    */
                                    currentUser?.role === "Other"
                                        ?
                                        currentUser?.profession
                                        : currentUser?.role
                                }
                            </span>
                            {
                                currentUser?.role === "Teacher" || currentUser?.isAdmin ?
                                    <>
                                        <div className="link-box">
                                            <Link
                                                to={isAdmin ? "/admin" : "/teacher-dashboard"}
                                                onClick={hidePopUpHandler}
                                                className='custom-link'>{isAdmin ? "Admin Dashboard" : "Dashboard"}</Link>
                                            <Link
                                                to={`/profile/${currentUser?._id}`}
                                                className='custom-link'>Profile</Link>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <Link
                                            to={`/profile/${currentUser?._id}`}
                                            onClick={hidePopUpHandler}
                                            className='custom-link'>View Profile</Link>
                                    </>
                            }
                        </div>
                    </>
                    :
                    <>
                        <div className="no-user">
                            <h3>Online Courses</h3>
                            <div className='link-flex'>
                                <Link to={"/login"}>Login</Link>
                                <Link to={"/register"}>Register</Link>
                            </div>
                        </div>
                    </>
            }
            <ul>
                {
                    linkData?.map((el, index) => (
                        <li key={el.id}>
                            <Link
                                to={el.goTo}
                                onClick={hidePopUpHandler}
                                className={location.pathname === el.goTo ? "active" : ""}
                            >
                                {el.icon}{el.content}
                            </Link>
                        </li>
                    ))
                }
                {
                    currentUser &&
                    <>
                        <li className='last-li'>
                            <Link
                                className='log-out'
                                onClick={logOutHandler}
                            >Log Out</Link>
                        </li>
                    </>
                }
            </ul>
        </div>
    )
}

export default SideBar;