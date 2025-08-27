import "./watching-video.css";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSingleCourseFromPlaylist } from "../../redux/apiCalls/coursesApiCall";
import { AddComment, AllVideoComments, MainVideo } from "../../allPagesPaths";
import { useTitle } from "../../components/helpers/useTitle";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const WatchingVideo = () => {

    // get the page title
    useTitle(`Video`);

    const dispatch = useDispatch();

    const { playlistId, courseId } = useParams();

    const { course } = useSelector(state => state.courses);

    const { allComments } = useSelector(state => state.comment);

    /*=========================================*/

    useEffect(() => {

        if (playlistId && courseId) {

            dispatch(getSingleCourseFromPlaylist(playlistId, courseId));

        }

    }, [dispatch, playlistId, courseId]);

    /*=========================================*/

    // Show only comments related to this video course
    const filteredComments = allComments?.filter(
        comment => comment.courseId?.toString() === courseId
    );

    /*=========================================*/

    return (
        <div className='watching-video custom-div'>
            <div className="container p-0">
                <MainVideo data={course || ""} courseId={courseId} />
                <AddComment
                    courseId={courseId}
                    commentsLength={filteredComments?.length || 0}
                />
                <AllVideoComments
                    allComments={filteredComments}
                    courseId={courseId}
                />
            </div>
        </div>
    )
}

export default WatchingVideo;