import "./courses.css";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPlaylists } from '../../redux/apiCalls/playListApiCall';
import { CourseCard } from '../../allPagesPaths';
import Spinner from '../../components/common/spinner/Spinner';
import { useTitle } from '../../components/helpers/useTitle';
import CustomHeading from "../../components/helpers/CustomHeading";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const Courses = () => {

    useTitle("All Courses");

    const dispatch = useDispatch();

    const { playLists, playlistLoading } = useSelector(state => state.playlists);

    /*=========================================*/

    useEffect(() => {

        dispatch(getAllPlaylists());

    }, [dispatch]);

    /*=========================================*/

    // just filter by approved playlist to draw the ui   
    const approvedPlaylists = playLists?.length > 0
        ? playLists.filter(p => p.isPlaylistApproved === "approved")
        : [];

    /*=========================================*/

    if (playlistLoading) return <Spinner />;

    return (
        <div className="all-courses-page custom-div">
            <CustomHeading text="all courses" />
            <div className="container p-0">
                <div className="row">
                    {approvedPlaylists?.length > 0 ? (
                        approvedPlaylists.map(card => (
                            <div className="col-lg-4 col-sm-6" key={card._id}>
                                <CourseCard
                                    data={{
                                        ...card,
                                        coursesCount: card.approvedCoursesCount
                                    }}
                                />
                            </div>
                        ))
                    ) : (
                        <h2 style={{ color: "var(--light-color)" }}>No Courses yet.</h2>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Courses; 