import './profile.css';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSavedPlaylists, getProfile } from '../../redux/apiCalls/profileApiCall';
import { hidePopUp } from '../../redux/slices/popUpSlice';
import { FaComment, FaHeart, FaBookmark } from "react-icons/fa6";
import CustomHeading from '../../components/helpers/CustomHeading';
import { useTitle } from '../../components/helpers/useTitle';
import Spinner from "../../components/common/spinner/Spinner";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const Profile = () => {

    // get the page title
    useTitle(`Profile User`);

    const dispatch = useDispatch();

    const { currentUser } = useSelector(state => state.auth);

    const { profile, loading } = useSelector(state => state.profile);

    const { savedPlayLists = [] } = useSelector(state => state.profile);

    const { id } = useParams();

    /*=========================================*/

    // close the pop up WHEN CLICK ON LINKS
    const hidePopUpHandler = () => {

        dispatch(hidePopUp());

    }

    /*=========================================*/

    // get single profile depend on id param
    useEffect(() => {

        dispatch(getProfile(id));

    }, [id]);

    /*=========================================*/

    useEffect(() => {

        if (id) {
            dispatch(fetchSavedPlaylists(id));
        }

    }, [dispatch, id]);

    /*=========================================*/

    if (loading) return <Spinner />;
    return (
        <div className='profile custom-div'>
            <div className="container p-0">
                <CustomHeading text="profile details" />
                <div className="profile-user-box">
                    <div className="user-info text-center">
                        <img
                            src={profile?.profilePhoto?.url}
                            className='img-fluid'
                            alt="teacher" />
                        <h5>{profile?.username}</h5>
                        <span style={{
                            color: "var(--light-color)",
                            display: "block",
                            fontSize: "1.7rem"
                        }}>
                            {
                                profile?.role === "Other"
                                    ?
                                    profile?.profession
                                    : profile?.role
                            }
                        </span>
                        {
                            profile?._id === currentUser?._id
                            &&
                            <>
                                <Link
                                    to={`/update-user/${profile?._id}`}
                                    onClick={hidePopUpHandler}
                                    className='custom-link'>Update Profile</Link>
                            </>
                        }
                    </div>
                    {/* user-info end */}
                    <div className="profile-user-info">
                        <div className="row">
                            <div className="col-lg-4 col-md-4 col-sm-6">
                                <div>
                                    <div className="icon">
                                        <span><FaBookmark /></span>
                                        <div>
                                            <h6>{savedPlayLists?.length || 0}</h6>
                                            <p>saved playlist</p>
                                        </div>
                                    </div>
                                    <Link
                                        // /user-saved-playlist
                                        to={`/user-saved-playlist/${id}`}
                                        className='custom-link'
                                    >View Playlists</Link>
                                </div>
                            </div>
                            {/* col #1 */}
                            <div className="col-lg-4 col-md-4 col-sm-6">
                                <div>
                                    <div className="icon">
                                        <span><FaHeart /></span>
                                        <div>
                                            <h6>33</h6>
                                            <p>videos liked</p>
                                        </div>
                                    </div>
                                    <Link className='custom-link'>View Liked</Link>
                                </div>
                            </div>
                            {/* col #2 */}
                            <div className="col-lg-4 col-md-4 col-sm-6">
                                <div>
                                    <div className="icon">
                                        <span><FaComment /></span>
                                        <div>
                                            <h6>12</h6>
                                            <p>videos comments</p>
                                        </div>
                                    </div>
                                    <Link className='custom-link'>View Comments</Link>
                                </div>
                            </div>
                            {/* col #3 */}
                        </div>
                        {/* row end */}
                    </div>
                    {/* profile-user-info end */}
                </div>
                {/* profile-user-box end */}
            </div>
        </div>
    )
}

export default Profile;