import './top-header.css';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hidePopUp, showHidePopUp } from '../../../redux/slices/popUpSlice';
import { searchForPlaylist } from '../../../redux/apiCalls/playListApiCall';
import { logOutUser } from '../../../redux/apiCalls/authApiCall';
import { showSidbar } from '../../../redux/slices/sideBarSlice';
import { toggleTheme } from '../../../redux/slices/themeSlice';
import useHideOnScroll from '../hooks/useHideOnScroll';
import { FaBars, FaUser, FaRegSun, FaSistrix, FaMoon } from "react-icons/fa6";
import swal from 'sweetalert';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const TopHeader = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { currentUser } = useSelector(state => state.auth);

    const { isDarkMode } = useSelector(state => state.theme);

    const { popUp } = useSelector(state => state.popUpProfile);

    const [showFrom, setShowForm] = useState(false);

    const [query, setQuery] = useState('');

    /*=========================================*/

    // open sidebar
    const open = () => {
        dispatch(showSidbar());
    }

    // dark mood
    const darkMoodToogleHandler = () => {
        dispatch(toggleTheme());
    }

    // open user profile pop uop
    const openPopUpHandler = () => {
        dispatch(showHidePopUp());
    }

    // close the pop up WHEN CLICK ON LINKS
    const closePopUpHandler = () => {
        dispatch(hidePopUp());
    }

    /*=========================================*/

    // custom hook to hide the form on small devices when scroll
    useHideOnScroll(showFrom, setShowForm);

    /*=========================================*/

    // custom hook to hide the user profile popup when scroll
    useHideOnScroll(true, dispatch, hidePopUp);

    /*=========================================*/

    // log out the user and close the popup user profile, in case the popup is open when log out 
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
                dispatch(hidePopUp()); // Ensure the popup closes on logout
                navigate("/", { replace: true });//navigate to main page and prevent to back to previous page
            }
        });
    };

    /*=========================================*/

    const myLocation = useLocation();

    useEffect(() => {

        const params = new URLSearchParams(myLocation.search);

        const q = params.get('q') || '';

        if (myLocation.pathname === '/course-search') {

            setQuery(q);

        } else {

            setQuery('');

        }

    }, [myLocation]);

    /*=========================================*/

    //for search icon
    const handleClick = () => {

        if (query?.trim()) {

            navigate(`/course-search?q=${query.trim()}`);

        } else {

            alert("Search for something!");

        }

    }

    /*=========================================*/

    return (
        <div className='top-header' id='top-header'>
            <div className="top-header-content">
                <div className="container p-0">
                    <div className="row align-items-center">
                        <div className="col-lg-2 col-sm-3 col-3">
                            <Link
                                to={"/"}
                                style={{
                                    color: "var(--black)",
                                    whiteSpace: "nowrap",
                                    fontWeight: "700"
                                }}>Online Courses</Link>
                        </div>
                        <div className="col-lg-7 col-sm-5 col-2">
                            <form action="">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleClick();
                                            }
                                        }}
                                        placeholder="Search Courses..."
                                    />
                                </div>
                                <span onClick={handleClick}>
                                    <FaSistrix />
                                </span>
                            </form>
                            {/* show this form in small devices */}
                            <form
                                action=""
                                className={showFrom ? "hidden-form show-form" : "hidden-form"}
                            >
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search Courses..."
                                    />
                                </div>
                                <span onClick={handleClick}>
                                    <FaSistrix />
                                </span>
                            </form>
                        </div>
                        <div className="col-lg-3 col-sm-4 col-7 position-relative p-0">
                            <ul>
                                <li onClick={open}><FaBars /></li>
                                <li className='hidden-icon'>
                                    <FaSistrix onClick={() => setShowForm(!showFrom)} />
                                </li>
                                <li
                                    onClick={openPopUpHandler}
                                ><FaUser /></li>
                                <li onClick={darkMoodToogleHandler}>
                                    {isDarkMode ? <FaMoon /> : < FaRegSun />}
                                </li>
                            </ul>
                            <div className={`login-popup ${popUp ? "active-popup" : "inactive-popup"}`}>
                                {currentUser ?
                                    <>
                                        <div className="profile">
                                            <img
                                                src={currentUser?.profilePhoto?.url}
                                                alt="user profile"
                                                className='img-fluid'
                                            />
                                            <h3
                                                className='text-capitalize'
                                                style={{
                                                    color: "var(--black)",
                                                    margin: "1rem 0"
                                                }}>{currentUser?.username}</h3>
                                            <span
                                                style={{
                                                    color: "var(--light-color)",
                                                    fontSize: "1.8rem"
                                                }}>
                                                {
                                                    currentUser?.role === "Other"
                                                        ?
                                                        currentUser?.profession
                                                        : currentUser?.role
                                                }
                                            </span>
                                        </div>
                                        <div className="btn-box">
                                            {
                                                currentUser?.role === "Teacher" ?
                                                    <>
                                                        <Link
                                                            to={"/teacher-dashboard"}
                                                            className='first-btn'
                                                            onClick={closePopUpHandler}
                                                        >Dashboard</Link>

                                                    </>
                                                    :
                                                    <>
                                                        <Link
                                                            to={`/profile/${currentUser?._id}`}
                                                            className='custom-link'
                                                            onClick={closePopUpHandler}
                                                        >View Profile</Link>
                                                    </>
                                            }
                                            <Link
                                                className='log-out'
                                                onClick={logOutHandler}
                                                style={{ marginTop: "0" }}
                                            >Log Out</Link>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className={`btn-box ${!currentUser && popUp ? "active-popup" : "inactive-popup"}`}>
                                            <Link to={"/login"} onClick={closePopUpHandler}>Login</Link>
                                            <Link to={"/register"} onClick={closePopUpHandler}>Register</Link>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopHeader;