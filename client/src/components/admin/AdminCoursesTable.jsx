import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPlaylists } from '../../redux/apiCalls/playListApiCall';
import { LiaTrashSolid, LiaEye } from "react-icons/lia";
import { ToastContainer } from "react-toastify";
import swal from 'sweetalert';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const AdminCoursesTable = () => {

  const { playLists } = useSelector(state => state.playlists);

  const dispatch = useDispatch();

  /*=========================================*/

  //fetch all profiles
  useEffect(() => {

    dispatch(getAllPlaylists());

  }, []);

  /*=========================================*/

  return (
    <div className='admin-courses custom-div' style={{ overflowX: "auto" }}>
      <table className="table table-bordered my-table" style={{ overflowX: "auto" }}>
        <thead>
          <tr>
            <th className="text-center" scope="col">Id</th>
            <th className="text-center" scope="col">Course Name</th>
            <th className="text-center" scope="col">Image</th>
            <th className="text-center" scope="col">In Playlist</th>
            <th className="text-center" scope="col">Approved</th>
            <th className="text-center" scope="col">Create At</th>
            <th className="text-center" scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {playLists && playLists.length > 0 ? (
            playLists.map(playlist =>
              playlist.courses.map((course, index) => (
                <tr className="text-center" key={course._id}>
                  <td>{index + 1}</td>
                  <td>{course.videoTitle}</td>
                  <td>
                    <img
                      src={course.tutorialImage?.url}
                      alt="course"
                      style={{ width: "5rem", height: "5rem", objectFit: "cover" }}
                    />
                  </td>
                  <td>{playlist.title}</td>
                  <td
                    style={{
                      color: course.isCourseApproved === "approved" ? "var(--orange)" : "",
                      fontWeight: course.isCourseApproved === "approved" ? "600" : "",
                      textTransform: "capitalize"
                    }}>
                    {course.isCourseApproved}
                  </td>
                  <td>{course.createdAt.slice(0, 10)}</td>
                  <td>
                    {/* <Link to={`/watch-video/${playlist._id}/${course._id}`} className="me-2"> */}
                    <Link to={`/admin/course-view/${playlist._id}/${course._id}`} className="me-2">
                      <LiaEye />
                    </Link>
                    <button className="btn btn-link p-0">
                      <LiaTrashSolid className="text-danger" />
                    </button>
                  </td>
                </tr>
              ))
            )
          ) : (
            <tr>
              <td colSpan={7} className="text-center">No playlists yet!</td>
            </tr>
          )}
        </tbody>

      </table>
      <ToastContainer autoClose={6000} />

    </div>
  )
}

export default AdminCoursesTable;