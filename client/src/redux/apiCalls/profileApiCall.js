import { profileActions } from "../slices/profileSlice";
import request from "../../utils/request";
import { authActions } from "../slices/authSlice";
import { toast } from "react-toastify";

/*=========================================*/
/*=========================================*/
/*=========================================*/

// get all profiles
export function getAllProfiles() {

  return async (dispatch) => {

    try {

      const { data } = await request.get("/api/users/profile");

      dispatch(profileActions.setProfiles(data.users));

    } catch (error) {

      console.log(error);

    }

  }
}

/*=========================================*/

// get single profile
export function getProfile(profileId) {

  return async (dispatch, getState) => {

    dispatch(profileActions.setLoading(true));

    try {

      const { auth } = getState();

      const token = auth.currentUser?.token;

      const { data } = await request.get(`/api/users/profile/${profileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(profileActions.setSingleProfile(data));

    } catch (error) {

      console.error("Error fetching profile :", error);

    } finally {

      dispatch(profileActions.setLoading(false));

    }

  };

}

/*=========================================*/

// update user profile
export function updateUser(userId, profile) {

  return async (dispatch, getState) => {

    dispatch(profileActions.setLoading(true));
    //  `http://localhost:3001/api/users/profile/${userId}`,
    try {
      const token = getState().auth.currentUser?.token;

      const { data } = await request.put(
        `/api/users/profile/${userId}`,
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data?.updatedUser) {

        dispatch(profileActions.setUpdateProfile(data?.updatedUser));

        dispatch(authActions.login(data?.updatedUser));

        localStorage.setItem("currentUser", JSON.stringify(data?.updatedUser));

        toast.success(data?.message || "Profile updated successfully!");

      } else {

        toast.error("Failed to update profile.");

      }

    } catch (error) {

      console.error("Error updating user:", error.response?.data || error.message);

      toast.error(error.response?.data?.message || "Something went wrong!");

    } finally {

      dispatch(profileActions.setLoading(false));

    }

  };

}

/*=========================================*/

//user saved playlists   
export const userSavedPlaylists = (playlistId) => {

  return async (dispatch, getState) => {

    const { auth } = getState();

    const token = auth.currentUser?.token;

    if (!token) {

      toast.error("You should login to save playlists");

      return { success: false };

    }

    dispatch(profileActions.setSavedPlaylistLoading(true));

    try {

      const { data } = await request.post(
        `/api/users/savePlaylist/${playlistId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {

        dispatch(profileActions.setSavedPlayLists(data.data));

        dispatch(profileActions.setIsSavedPlaylist(true));

      }

      return data;

    } catch (error) {

      toast.error(error.response?.data?.message || "Save failed");

      return { success: false };

    } finally {

      dispatch(profileActions.setSavedPlaylistLoading(false));

    }

  };

};

/*=========================================*/

//fetching saved user playlists
export function fetchSavedPlaylists(userId) {

  return async (dispatch) => {

    try {

      const { data } = await request.get(
        `/api/users/savedPlaylists?userId=${userId}`
      );

      if (data.success) {

        dispatch(profileActions.setSavedPlayLists(data?.data));

      }

    } catch (error) {

      console.error("Fetch error:", error);

    }

  };

}

/*=========================================*/

// delete or unsaved single user playlist
export function unsavedUserPlaylist(playlistId) {

  return async (dispatch, getState) => {

    try {

      const { auth } = getState();

      const token = auth.currentUser?.token;

      if (!token) {
        return
      }

      const { data } = await request.delete(`/api/users/savedPlaylists/${playlistId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      dispatch(profileActions.setDelete(playlistId));

      toast.success(data?.message);

    } catch (error) {

      console.error("Error delete saved playlist :", error.response?.data || error.message);

      toast.error(error.response?.data?.message || "Something went wrong!");

    }

  }

}

/*=========================================*/

//search for a teacher
export function searchForTeachers(teacherQuery) {

  return async (dispatch) => {

    dispatch(profileActions.setLoadingSearch(true));

    try {

      const { data } = await request.get("/api/users/teacherSearch", { params: { q: teacherQuery } });

      dispatch(profileActions.setTeacherSearch(data?.data));

      // console.log(data?.data);

    } catch (error) {

      console.error("Error searching teacher :", error.response?.data || error.message);

    } finally {

      dispatch(profileActions.setLoadingSearch(false));

    }

  }

}  