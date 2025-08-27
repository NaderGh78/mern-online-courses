import "./playlist-details.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoursesFromPlaylist } from "../../redux/apiCalls/coursesApiCall";
import { getSinglePlaylist } from "../../redux/apiCalls/playListApiCall";
import { PlayListBox, PlaylistVideos } from "../../allPagesPaths";
import { useTitle } from "../../components/helpers/useTitle";
import Spinner from "../../components/common/spinner/Spinner";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const PlaylistDetails = () => {

    useTitle(`Playlist`);

    const { id } = useParams();

    const dispatch = useDispatch();

    // Get playlist and courses state
    const { allCourses } = useSelector(state => state.courses);

    const [isLoading, setIsLoading] = useState(true);

    // send just the approved courses 
    const justShowApprovedCourses = allCourses.length > 0 && allCourses?.filter(p => p.isCourseApproved === "approved");

    /*=========================================*/

    useEffect(() => {

        const fetchData = async () => {

            try {

                setIsLoading(true);

                // Fetch playlist and courses
                await Promise.all([
                    dispatch(getSinglePlaylist(id)),
                    dispatch(getAllCoursesFromPlaylist(id)),
                ]);

            } catch (error) {

                console.error("Error fetching data:", error);

            } finally {

                setIsLoading(false);

            }

        };

        if (id) {
            fetchData();
        }

    }, [dispatch, id]);

    /*=========================================*/

    if (isLoading) return <Spinner />;

    return (
        <div className='playlist-details custom-div'>
            <div className="container p-0">
                <PlayListBox id={id} courseCount={justShowApprovedCourses.length} playlistId={id} />
                <PlaylistVideos allCourses={justShowApprovedCourses} playlistId={id} />
            </div>
        </div>
    );
};

export default PlaylistDetails;