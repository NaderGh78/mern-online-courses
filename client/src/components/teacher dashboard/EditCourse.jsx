import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getSingleCourseFromPlaylist, updateSingleCourse } from "../../redux/apiCalls/coursesApiCall";
import { getTeacherPlaylists } from "../../redux/apiCalls/playListApiCall";
import { useTitle } from '../../components/helpers/useTitle';
import { ToastContainer } from 'react-toastify';
import Spinner from "../common/spinner/Spinner";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const EditCourse = () => {

    useTitle(`Edit Course`);

    const dispatch = useDispatch();

    const { playlistId, courseId } = useParams(); // Get playlistId and courseId from URL

    // Redux states
    const { currentUser } = useSelector((state) => state.auth);

    const { teacherPlaylists, playlistLoading } = useSelector((state) => state.playlists);

    const { course, courseLoading, editCourseLoading } = useSelector((state) => state.courses);

    // Component states
    const [videoTitle, setVideoTitle] = useState("");

    const [videoLink, setVideoLink] = useState("");

    const [description, setDescription] = useState("");

    const [file, setFile] = useState(null);

    const [imagePreview, setImagePreview] = useState(null);

    const [teacherPlaylistId, setTeacherPlaylistId] = useState("");

    /*=========================================*/

    // Fetch course data on component mount
    useEffect(() => {

        if (playlistId && courseId) {

            dispatch(getSingleCourseFromPlaylist(playlistId, courseId));

        }

    }, [dispatch, playlistId, courseId]);

    /*=========================================*/

    // Fetch teacher playlists
    useEffect(() => {

        if (currentUser?._id) {

            dispatch(getTeacherPlaylists(currentUser?._id));

        }

    }, [dispatch, currentUser?._id]);

    /*=========================================*/

    // Populate form fields when course data is fetched
    useEffect(() => {

        if (course) {

            setVideoTitle(course.videoTitle);

            setVideoLink(course.videoLink);

            setDescription(course.description);

            setImagePreview(course.tutorialImage?.url);

            setTeacherPlaylistId(course.playlist?._id || "");

        }

    }, [course]);

    /*=========================================*/

    // Handle file change for image upload
    const handleFileChange = (e) => {

        const selectedFile = e.target.files[0];

        if (selectedFile) {

            setFile(selectedFile);

            setImagePreview(URL.createObjectURL(selectedFile));

        }

    };

    /*=========================================*/

    if (courseLoading) return <Spinner />;

    // Handle form submission
    const EditCourseHandler = (e) => {

        e.preventDefault();

        // Prepare form data
        const formData = new FormData();

        formData.append("videoTitle", videoTitle);

        formData.append("videoLink", videoLink);

        formData.append("description", description);

        formData.append("playlist", teacherPlaylistId);

        file && formData.append("tutorialImage", file);

        // Dispatch update action
        dispatch(updateSingleCourse(playlistId, courseId, formData));

    };

    /*=========================================*/

    return (
        <div className="edit-playlist">
            <div className="form-box">
                <h3>Edit Course</h3>
                <form onSubmit={EditCourseHandler}>
                    {/* Course Title */}
                    <div className="form-group">
                        <label htmlFor="course-title">
                            Course Title <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="course-title"
                            value={videoTitle}
                            onChange={(e) => setVideoTitle(e.target.value)}
                            placeholder="Enter course title"
                        />
                    </div>

                    {/* Course Video Link */}
                    <div className="form-group">
                        <label htmlFor="course-video-link">
                            Course Video Link <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="course-video-link"
                            value={videoLink}
                            onChange={(e) => setVideoLink(e.target.value)}
                            placeholder="Enter video link"
                        />
                    </div>

                    {/* Select Playlist */}
                    <div className="form-group">
                        <label htmlFor="select-playlist">
                            Select Playlist <span className="text-danger">*</span>
                        </label>
                        <select
                            className="form-select"
                            id="select-playlist"
                            value={teacherPlaylistId}
                            onChange={(e) => setTeacherPlaylistId(e.target.value)}
                        >
                            <option value="">-- Select Playlist --</option>
                            {playlistLoading ? (
                                <option>Loading playlists...</option>
                            ) : (
                                teacherPlaylists?.length > 0 && teacherPlaylists?.map((playlist) => (
                                    <option key={playlist._id} value={playlist._id}>
                                        {playlist.title}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    {/* Course Image */}
                    <div className="form-group file-input">
                        <label htmlFor="course-image">
                            Course Image <span className="text-danger">*</span>
                        </label>
                        <input
                            type="file"
                            className="form-control-file"
                            id="course-image"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                        {imagePreview && (
                            <div className="my-4">
                                <img
                                    src={imagePreview}
                                    alt="Course Preview"
                                    className="rounded-lg"
                                    style={{ width: "200px", height: "auto", objectFit: "cover" }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Course description <span className="text-danger">*</span></label>
                        <textarea
                            className="form-control my-textarea"
                            rows={5}
                            id="tutorial-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter course description"
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="custom-link border-0"
                        disabled={editCourseLoading}
                    >
                        {editCourseLoading ? "Editing..." : "Edit Course"}
                    </button>
                </form>
            </div>
            <ToastContainer autoClose={6000} />
        </div>
    );
};

export default EditCourse;