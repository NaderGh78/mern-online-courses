import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addLikeOnCourse } from "../../redux/apiCalls/coursesApiCall";
import { FaCalendar, FaHeart } from "react-icons/fa6";
import Spinner from "../common/spinner/Spinner";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const MainVideo = ({ data: {
    videoTitle,
    videoLink,
    description,
    playlist,
    teacher,
    createdAt }, courseId }) => {

    const { course, likeCourseLoading } = useSelector(state => state.courses);

    const { currentUser } = useSelector(state => state.auth);

    const dispatch = useDispatch();

    const [iframeLoaded, setIframeLoaded] = useState(false);

    /*=========================================*/

    const toggleLikeHandler = () => {

        if (courseId) {

            dispatch(addLikeOnCourse(courseId));

        }

        return;

    }

    /*=========================================*/

    const isLiked = course?.likes?.includes(currentUser?._id);

    /*=========================================*/

    // get the span text while user like the video
    const getSpanText = () => {

        if (isLiked) return "Liked";

        if (likeCourseLoading) return "Liking";

        return "Like";

    }

    /*=========================================*/

    return (
        <div className="main-video">
            {videoLink ? (
                <div>
                    {!iframeLoaded && (
                        <div><Spinner /></div>
                    )}
                    <iframe
                        src={`https://www.youtube.com/embed/${videoLink}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={() => setIframeLoaded(true)}
                        style={{ visibility: iframeLoaded ? "visible" : "hidden" }}
                    ></iframe>
                </div>
            ) : (
                <p>Video not available.</p>
            )}

            <div className="video-info">
                <h2 style={{ color: "var(--black)" }}>{videoTitle}</h2>
                <ul>
                    <li><span><FaCalendar /></span> {createdAt?.slice(0, 10)}</li>
                    <li><span><FaHeart /></span> {course?.likes?.length || 0} likes</li>
                </ul>
            </div>

            <div className="video-details">
                <div className="top user-avatar-details my-4">
                    <div className="left">
                        <img
                            src={teacher?.profilePhoto?.url}
                            alt="teacher"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>
                    <div className="right">
                        <Link><h6>{teacher?.username}</h6></Link>
                        <span style={{ color: "var(--light-color)", fontSize: "1.3rem" }}>
                            {teacher?.role}
                        </span>
                    </div>
                </div>

                <div className="middle">
                    <Link
                        to={`/playlist-details/${playlist?._id}`}
                        className="custom-link">View Playlist</Link>
                    <span
                        onClick={toggleLikeHandler}
                        className={isLiked || likeCourseLoading ? "like-it" : ""}
                    >
                        <FaHeart />{getSpanText()}
                    </span>
                </div>

                <p className="mb-0">{description}</p>
            </div>
        </div>
    );

}

export default MainVideo;