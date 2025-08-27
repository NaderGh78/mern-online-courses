import './sidebar.css';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOutUser } from '../../../redux/apiCalls/authApiCall';
import { hidePopUp } from '../../../redux/slices/popUpSlice';
import { closeMiniSidbar } from '../../../redux/slices/sideBarSlice';
import {
    FaHouse,
    FaQuestion,
    FaGraduationCap,
    FaChalkboardUser,
    FaHeadset
} from "react-icons/fa6";
import { LiaTimesSolid } from "react-icons/lia";
import swal from 'sweetalert';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const SideBarOnSmallDevices = ({ sideBarToggle }) => {

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

    const handleScroll = () => {

        /*
        in case the sideBarToggle is TRUE that mean the side bar 
        is OPEN,when SCROLLING COLOSE the sidebar BUUUUUUUUUUUUUUUUUUUUUUUUUT IN SCREEN 1200PX
        */

        const screenWidth = window.innerWidth;
        if (sideBarToggle && screenWidth < 1200) {

            const scrolled = document.documentElement.scrollTop;

            // in case whe scroll the page , close side bar
            if (scrolled > 10) {

                dispatch(closeMiniSidbar());

            }

        }

    };

    useEffect(() => {

        // in case the side bar OPEN, CALL handleScroll function when scrolling
        if (sideBarToggle) {
            window.addEventListener('scroll', handleScroll);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

    }, [sideBarToggle]);

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
                navigate("/", { replace: true });
            }
        });
    }



    /*=========================================*/

    return (
        <div className={sideBarToggle ? "show-mini-sidebar side-bar-mini" : "side-bar-mini"}>
            {
                currentUser
                    ?
                    <>
                        <span
                            className='close-side-bar'
                            onClick={() => dispatch(closeMiniSidbar())}
                        ><LiaTimesSolid /></span>
                        <div className="side-bar-profile">
                            <div>
                                <img
                                    src={currentUser?.profilePhoto?.url}
                                    alt="user profile"
                                    className='img-fluid'
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

                    <span
                            className='close-side-bar'
                            onClick={() => dispatch(closeMiniSidbar())}
                        ><LiaTimesSolid /></span>
                        <div className="no-user">
                            <h3>Online Courses</h3>
                            <div className='link-flex'>
                                <Link
                                    to={"/login"}
                                    onClick={() => dispatch(closeMiniSidbar())}>Login</Link>
                                <Link
                                    to={"/register"}
                                    onClick={() => dispatch(closeMiniSidbar())}>Register</Link>
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
                                className={location.pathname === el.goTo ? "active" : ""}
                                onClick={() => {
                                    dispatch(closeMiniSidbar())
                                    hidePopUpHandler()
                                }}>{el.icon}{el.content}</Link>
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

export default SideBarOnSmallDevices;