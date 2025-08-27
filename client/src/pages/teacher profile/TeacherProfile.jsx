import "./teacher-profile.css";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../redux/apiCalls/profileApiCall";
import { getAllPlaylists } from "../../redux/apiCalls/playListApiCall";
import { TeacherProfileBttom, TeacherProfileTop } from "../../allPagesPaths";
import { useTitle } from "../../components/helpers/useTitle";
import Spinner from "../../components/common/spinner/Spinner";

/*=========================================*/
/*=========================================*/

const TeacherProfile = () => {

    // get the page title
    useTitle(`Teacher Profile`);

    const dispatch = useDispatch();

    const { id } = useParams();

    const { profile, loading } = useSelector(state => state.profile);

    const { playLists } = useSelector(state => state.playlists);

    /*=========================================*/

    // get single profile depend on id param
    useEffect(() => {
        dispatch(getProfile(id));
    }, [dispatch, id]);

    /*=========================================*/

    useEffect(() => {
        dispatch(getAllPlaylists());
    }, [dispatch]);

    /*=========================================*/

    // get the approved playlists for specific teacher id
    const approvedPlaylists = playLists?.length > 0
        ? playLists
            .filter(p =>
                p.isPlaylistApproved === "approved" &&
                p.teacher?._id === id
            )
            .map(p => ({
                ...p,
                coursesCount: (p.courses || []).filter(c => c.isCourseApproved === "approved").length
            }))
        : [];

    /*=========================================*/

    const totalApprovedCourses = approvedPlaylists
        .reduce((total, p) => total + (p.coursesCount || 0), 0);

    /*=========================================*/

    if (loading) return <Spinner />;

    return (
        <div className="teacher-profile custom-div">
            <div className="teacher-profile-box">
                <div className="container p-0">
                    <TeacherProfileTop
                        profile={profile}
                        playlists={approvedPlaylists}
                        approvedCoursesCount={totalApprovedCourses}
                    />
                    <TeacherProfileBttom
                        playlists={approvedPlaylists}
                    />
                </div>
            </div>
        </div>
    );
};

export default TeacherProfile; 