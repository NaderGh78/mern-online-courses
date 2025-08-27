import { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTeacherPlaylists } from '../../redux/apiCalls/playListApiCall';
import { deleteCourseFromPlaylist, getAllCoursesFromPlaylist } from '../../redux/apiCalls/coursesApiCall';
import { LiaEye, LiaEdit, LiaTrashSolid } from 'react-icons/lia';
import { useTitle } from '../helpers/useTitle';
import Spinner from '../common/spinner/Spinner';
import swal from 'sweetalert';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const CoursesTable = () => {

    useTitle(`Courses`);

    const dispatch = useDispatch();

    const { playlistId } = useParams();

    const { state } = useLocation();

    const [selectedPlaylistId, setSelectedPlaylistId] = useState(playlistId || state?.playlistId);

    const { currentUser } = useSelector(state => state.auth);

    const { teacherPlaylists } = useSelector(state => state.playlists);

    const { allCourses, courseLoading } = useSelector(state => state.courses);

    const [deletingCourseId, setDeletingCourseId] = useState(null);

    /*=========================================*/

    // Fetch playlists for the teacher
    useEffect(() => {

        if (currentUser?._id) {

            dispatch(getTeacherPlaylists(currentUser._id));

        }

    }, [dispatch, currentUser?._id]);

    /*=========================================*/

    // Set default playlist if none is selected
    useEffect(() => {

        if (teacherPlaylists?.length > 0 && !selectedPlaylistId) {

            setSelectedPlaylistId(teacherPlaylists[0]._id);
        }

    }, [teacherPlaylists, selectedPlaylistId]);

    /*=========================================*/

    // Fetch courses for the selected playlist
    useEffect(() => {

        if (selectedPlaylistId) {

            dispatch(getAllCoursesFromPlaylist(selectedPlaylistId));

        }

    }, [selectedPlaylistId, dispatch]);

    /*=========================================*/

    const deleteCourse = (playlistId, courseId) => {

        if (!playlistId || !courseId) {

            console.error("Invalid IDs:", { playlistId, courseId });

            return;

        }

        swal({
            title: "Are you sure?",
            text: "This action will permanently delete the playlist.",
            icon: "warning",
            buttons: ["Cancel", "Yes, delete it!"]
        }).then((willDeleteCourse) => {
            if (willDeleteCourse) {
                setDeletingCourseId(courseId);
                dispatch(deleteCourseFromPlaylist(playlistId, courseId))
                    .finally(() => setDeletingCourseId(null));
            }
        });

    };

    /*=========================================*/

    return (
        <div className="course-table" style={{ overflowX: "auto" }}>
            <Link to="/teacher-dashboard/add-course" className="my-table-link">
                Add new course
            </Link>

            {/* Playlist selection dropdown */}
            {teacherPlaylists?.length > 0 && (
                <div className="my-3">
                    <label htmlFor="playlist-select" className="me-2">Select Playlist:</label>
                    <select
                        id="playlist-select"
                        className="form-select w-auto d-inline-block"
                        value={selectedPlaylistId || ''}
                        onChange={(e) => setSelectedPlaylistId(e.target.value)}
                    >
                        {teacherPlaylists?.map((playlist) => (
                            <option key={playlist._id} value={playlist._id}>
                                {playlist.title}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Show spinner while loading */}
            {courseLoading && <Spinner />}

            {/* Show "No playlists" message if no playlists exist */}
            {teacherPlaylists?.length === 0 && !courseLoading && (
                <h2 className="text-center">No playlists found. Add a playlist to get started!</h2>
            )}

            {/* Show "Select a playlist" message if no playlist is selected */}
            {!selectedPlaylistId && teacherPlaylists?.length > 0 && !courseLoading && (
                <h2 className="text-center">Please select a playlist to view courses.</h2>
            )}

            {/* Show table or "No courses yet!" message after loading */}
            {!courseLoading && selectedPlaylistId && teacherPlaylists?.length > 0 && (
                allCourses?.length > 0 ? (
                    <table className="table table-bordered my-table">
                        <thead>
                            <tr>
                                <th className="text-center">Id</th>
                                <th className="text-center">Playlist</th>
                                <th className="text-center">Description</th>
                                <th className="text-center">Title</th>
                                <th className="text-center" style={{ width: "50px" }}>Link</th>
                                <th className="text-center">Cover</th>
                                <th className="text-center">Status</th>
                                <th className="text-center">Created</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allCourses?.map((course, index) => (
                                <tr className="text-center" key={course._id}>
                                    {deletingCourseId === course._id ? (

                                        <td colSpan="9" className="text-center">
                                            <div className="d-flex justify-content-center align-items-center gap-2">
                                                <div className="spinner-border text-danger" role="status"></div>
                                                <span>Deleting course...</span>
                                            </div>
                                        </td>
                                    ) : (
                                        <>

                                            <td>{index + 1}</td>
                                            <td>{course.playlist?.title || 'No Playlist'}</td>

                                            <td>
                                                {course.description.length > 50
                                                    ? `${course.description.slice(0, 50)} ...`
                                                    : course.description}
                                            </td>

                                            <td>{course.videoTitle}</td>
                                            <td>{course.videoLink}</td>
                                            <td>
                                                <img
                                                    src={course.tutorialImage?.url || `${process.env.REACT_APP_BASE_URL}/uploads/no-picture.jpg`}
                                                    alt="cover"
                                                    width={50}
                                                />
                                            </td>
                                            <td
                                                style={{
                                                    color: course.isCourseApproved === "approved" ? "var(--orange)" : "",
                                                    fontWeight: course.isCourseApproved === "approved" ? "600" : "",
                                                    textTransform: "capitalize"
                                                }}>
                                                {course.isCourseApproved}
                                            </td>
                                            <td style={{ whiteSpace: "nowrap" }}>{course.createdAt?.slice(0, 10)}</td>
                                            <td style={{ whiteSpace: "nowrap" }}>
                                                <Link
                                                    // to={`/playlist-details/${selectedPlaylistId}`}
                                                    to={`/playlist-details/${selectedPlaylistId}?scrollTo=courses-section`}
                                                    state={{ courseId: course._id }} // Pass courseId as state
                                                    className="me-2"
                                                >
                                                    <LiaEye className="text-primary" />
                                                </Link>
                                                <Link
                                                    to={`/teacher-dashboard/edit-course/${selectedPlaylistId}/${course._id}`}
                                                    className="me-2"
                                                >
                                                    <LiaEdit className="text-success" />
                                                </Link>
                                                <button
                                                    onClick={() => deleteCourse(selectedPlaylistId, course._id)}
                                                    className="btn btn-link p-0"
                                                >
                                                    <LiaTrashSolid className="text-danger" />
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <h2 className="text-center" style={{ color: "var(--light-color)" }}>No courses yet!</h2>
                )
            )}
        </div>
    );
};

export default CoursesTable;