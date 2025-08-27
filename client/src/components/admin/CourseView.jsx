import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleCourseFromPlaylist } from '../../redux/apiCalls/coursesApiCall';
import request from '../../utils/request';
import { toast, ToastContainer } from 'react-toastify';
import Spinner from '../../components/common/spinner/Spinner';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const CourseView = () => {

    const { course, courseLoading } = useSelector(state => state.courses);

    const { currentUser } = useSelector(state => state.auth);

    const dispatch = useDispatch();

    const { playlistId, courseId } = useParams();

    const [approved, setApproved] = useState("pending");

    const [loading, setLoading] = useState(false);

    /*=========================================*/

    //  Fetch single playlist when playlistId changes
    useEffect(() => {

        if (playlistId, courseId) {

            dispatch(getSingleCourseFromPlaylist(playlistId, courseId));

        }

    }, [playlistId, courseId, dispatch]);

    /*=========================================*/

    // Update local state when singlePlayList loads
    useEffect(() => {

        if (course?.isCourseApproved) {

            setApproved(course.isCourseApproved);

        }

    }, [course]);

    /*=========================================*/

    // Handle form submit
    const handleUpdateStatus = async (e, isCourseApproved) => {

        e.preventDefault();

        setLoading(true);

        try {

            const res = await request.post(
                `/api/courses/approve-course/${courseId}`,
                { isCourseApproved },
                {
                    headers: { Authorization: "Bearer " + currentUser?.token },
                }
            );

            setApproved(res.data?.updatedCourse?.isCourseApproved);

            toast.success("Course status updated successfully!");

        } catch (error) {

            console.log(error.response?.data);

            alert("Error updating playlist status");

        }

        setLoading(false);

    };

    /*=========================================*/

    if (courseLoading) return <Spinner />

    return (
        <div className='view-details custom-div'>
            <h3 className='text-center mb-5'>Course Details</h3>
            <div className="container">
                <div className="row">
                    {/* Playlist info */}
                    <div className="col-lg-5 col-md-6 col-12 p-0">
                        <h4>Course</h4>
                        <div className="card" style={{ width: "100%" }}>
                            <img
                                className="card-img-top"
                                src={course?.tutorialImage?.url}
                                alt="Card image cap"
                            />
                            <div className="card-body">
                                <div
                                    className="card-title d-flex align-items-center justify-content-between"
                                >
                                    <h5 className="">{course?.videoTitle}</h5>
                                    <span>{course?.playlist?.title}</span>
                                </div>
                                <a href={course?.videoLink} target="_blank">Course video link</a>
                            </div>
                        </div>
                    </div>

                    {/* User details */}
                    <div className="col-lg-4 col-md-6 col-12 px-3">
                        <h4>User details</h4>
                        <ul>
                            <li>Created by : <span>{course?.teacher?.username}</span></li>
                            <li>Course id : <span>{course?._id}</span></li>
                            <li>Course in playlist : <span style={{ textTransform: "none" }}>{course?.playlist?.title}</span></li>
                        </ul>
                    </div>

                    {/* Status update */}
                    <div className="col-lg-3 col-md-6 col-12 p-0">
                        <form onSubmit={(e) => handleUpdateStatus(e, approved)}>
                            <h4>Status</h4>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <select
                                    className="form-select"
                                    value={approved}
                                    onChange={(e) => setApproved(e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="approved">Approved</option>
                                    <option value="cancel">Cancel</option>
                                </select>
                            </div>
                            <button type="submit" className='custom-link' disabled={loading}>
                                {loading ? "Updating..." : "Update"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer autoClose={6000} />
        </div>
    )
}

export default CourseView;