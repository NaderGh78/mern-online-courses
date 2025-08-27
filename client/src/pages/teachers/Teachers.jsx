import './teachers.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchForTeachers } from '../../redux/apiCalls/profileApiCall';
import { hidePopUp } from '../../redux/slices/popUpSlice';
import { useTitle } from '../../components/helpers/useTitle';
import CustomHeading from '../../components/helpers/CustomHeading';
import Spinner from "../../components/common/spinner/Spinner";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const Teachers = () => {

    useTitle(`Teachers`);

    const dispatch = useDispatch();

    const { teacherSearchResults, loading, loadingSearch } = useSelector(state => state.profile);

    const [query, setQuery] = useState("");

    const { currentUser } = useSelector(state => state.auth);

    // hide the become a tutor from ui in case the user already login and this user role is [teacher or admin]
    const hideBecomeTutor = currentUser && (currentUser?.isAdmin || currentUser?.role === "Teacher") ? false : true;

    /*=========================================*/

    useEffect(() => {

        dispatch(searchForTeachers(""));

    }, [dispatch]);

    /*=========================================*/

    // When query changes, trigger search
    useEffect(() => {

        if (query.trim() === "" || query.trim().length >= 2) {

            dispatch(searchForTeachers(query.trim()));

        }

    }, [query, dispatch]);

    /*=========================================*/

    // Close pop-up on link click
    const hidePopUpHandler = () => {

        dispatch(hidePopUp());

    }

    /*=========================================*/

    if (loading) return <Spinner />;

    return (
        <div className='teachers custom-div position-relative'>
            <div className="container p-0">
                <CustomHeading text="expert teachers" />
                <div className="teacher-box">
                    <form>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder='search tutors...'
                            />
                        </div>
                    </form>
                    <div className="teachers-cards">
                        <div className="row">
                            <h4
                                style={{
                                    textAlign: "center",
                                    padding: "5px 0",
                                    fontSize: "18px",
                                    fontWeight: "400",
                                    visibility: loadingSearch ? "visible" : "hidden",
                                    color: "var(--light-color)",
                                }}
                            >
                                Loading...
                            </h4>
                            {
                                hideBecomeTutor ?
                                    <>
                                        <div className="col-lg-4 col-sm-6">
                                            <div className="teacher-single-card text-center">
                                                <h3 style={{ color: "var(--black)", fontSize: "1.8rem" }}>Become A Tutor</h3>
                                                <p style={{ color: "var(--light-color)", fontSize: "1.4rem" }}>
                                                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                                    Eveniet, itaque ipsam fuga ex et aliquam.
                                                </p>
                                                <Link
                                                    to={"/register"}
                                                    onClick={hidePopUpHandler}
                                                    className='custom-link'>Get Started</Link>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    null
                            }

                            {teacherSearchResults && teacherSearchResults.length > 0 ? (

                                teacherSearchResults.map(({ teacher, playlists }) => {

                                    // make reudce and get just the approved courses by filter
                                    const totalCourses = playlists.reduce(
                                        (acc, pl) =>
                                            acc + (pl.courses?.filter(c => c.isCourseApproved === "approved").length || 0),
                                        0
                                    );

                                    const justShowApprovedPlaylists =
                                        playlists.length > 0 &&
                                        playlists?.filter(
                                            (p) => p.isPlaylistApproved === "approved"
                                        ).length;

                                    return (
                                        <div key={teacher._id} className="col-lg-4 col-sm-6">
                                            <div className="teacher-single-card">
                                                <div className="top user-avatar-details">
                                                    <div className="left">
                                                        <img src={teacher?.profilePhoto?.url} alt={teacher.username} />
                                                    </div>
                                                    <div className="right">
                                                        <Link><h6>{teacher.username}</h6></Link>
                                                        <span style={{ color: "var(--light-color)", fontSize: "1.3rem" }}>
                                                            {teacher.role}
                                                        </span>
                                                    </div>
                                                </div>
                                                <ul>
                                                    <li>Total playlists : <span>{justShowApprovedPlaylists}</span></li>
                                                    <li>Total videos : <span>{totalCourses}</span></li>
                                                    <li>Total likes : <span>22</span></li>
                                                </ul>
                                                <Link
                                                    to={`/teacher-profile/${teacher._id}`}
                                                    onClick={hidePopUpHandler}
                                                    className='custom-link'
                                                >
                                                    View Profile
                                                </Link>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                !loadingSearch && <h4 className="no-teacher">No teacher found.</h4>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Teachers; 