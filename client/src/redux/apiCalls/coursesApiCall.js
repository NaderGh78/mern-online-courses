import request from "../../utils/request";
import { toast } from "react-toastify";
import { coursesActions } from "../slices/courseSlice";
import { getSinglePlaylist } from "./playListApiCall";

/*=========================================*/
/*=========================================*/
/*=========================================*/

// add new course to playlist
export function addNewCourse(playlistId, courseData) {

  return async (dispatch, getState) => {

    dispatch(coursesActions.setLoading(true));

    try {

      const { auth } = getState();

      const token = auth.currentUser?.token;

      const { data } = await request.post(
        `/api/courses/${playlistId}`,
        courseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          }
        }

      );

      if (data.success) {

        toast.success("Course added successfully and is pending admin approval");

        dispatch(getSinglePlaylist(playlistId));

        dispatch(getAllCoursesFromPlaylist(playlistId));

        return { success: true };

      }

    } catch (error) {

      console.error("Error adding course:", error.response?.data || error.message);

      toast.error(error.response?.data?.message || "Something went wrong!");

      return { success: false };

    } finally {

      dispatch(coursesActions.setLoading(false));

    }

  };

}

/*=========================================*/

//get single course from playlist
export function getSingleCourseFromPlaylist(playlistId, courseId) {

  return async (dispatch) => {

    dispatch(coursesActions.setLoading(true));

    try {

      const { data } = await request.get(`/api/courses/${playlistId}/${courseId}`);

      dispatch(coursesActions.setSingleCourse(data));

    } catch (error) {

      // console.error("Error fetching single course:", error.response?.data || error.message);

      // toast.error(error.response?.data?.message || "Something went wrong!");

    } finally {

      dispatch(coursesActions.setLoading(false));

    }

  }

}

/*=========================================*/

// delete course from playlist  
export function deleteCourseFromPlaylist(playlistId, courseId) {

  return async (dispatch, getState) => {

    try {

      const { auth } = getState();

      const token = auth.currentUser?.token;

      const { data } = await request.delete(`/api/courses/${playlistId}/${courseId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      )

      dispatch(coursesActions.setDeletSingleCourse(courseId));

    } catch (error) {

      console.error("Error deleting course:", error.response?.data || error.message);

      toast.error(error.response?.data?.message || "Something went wrong!");

    }

  }

}

/*=========================================*/

// get all course from playlist  
export const getAllCoursesFromPlaylist = (playlistId) => async (dispatch, getState) => {

  const { auth } = getState();

  const teacherId = auth.currentUser?._id;

  try {

    const { data } = await request.get(`/api/playlists/${playlistId}/courses?teacherId=${teacherId}`);

    dispatch(coursesActions.setAllCourses(data));

  } catch (error) {

    console.error("Error fetching courses:", error.response?.data || error.message);

    toast.error(error.response?.data?.message || "Something went wrong!");

  }

};

/*=========================================*/

// edit single course 
export function updateSingleCourse(playlistId, courseId, editCourseData) {

  return async (dispatch, getState) => {

    dispatch(coursesActions.setEditCourseLoading(true));

    try {

      const { auth } = getState();

      const token = auth.currentUser?.token;

      if (!token) {

        throw new Error("No token found. Please log in again.");

      }

      // Make the API request
      const { data } = await request.put(
        `/api/courses/${playlistId}/${courseId}`,
        editCourseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }

      );

      // Update Redux state
      dispatch(coursesActions.setUpdatCourse(data)); // Update course in state

      // Refetch courses for the current playlist to update the UI
      dispatch(getAllCoursesFromPlaylist(playlistId));

      // If the playlist was changed, refetch courses for the new playlist as well
      if (editCourseData.playlist && editCourseData.playlist !== playlistId) {

        dispatch(getAllCoursesFromPlaylist(editCourseData.playlist));

      }

      toast.success(data?.message);

    } catch (error) {

      console.error("Error editing course:", error.response?.data || error.message);

      toast.error(error.response?.data?.message || "Something went wrong!");

    } finally {

      dispatch(coursesActions.setEditCourseLoading(false));

    }

  };

}

/*=========================================*/

// add like on course
export function addLikeOnCourse(courseId) {

  return async (dispatch, getState) => {

    dispatch(coursesActions.setLikeCourseLoading(true));

    try {

      const { auth } = getState();

      const token = auth.currentUser?.token;

      if (!token) {

        toast.error("You need to be logged in to like this course.");

        return;

      }

      const { data } = await request.post(
        `/api/courses/${courseId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(coursesActions.setLikesCourse(data.likes));

    } catch (error) {

      console.log(error);

    } finally {

      dispatch(coursesActions.setLikeCourseLoading(false));

    }

  };

} 