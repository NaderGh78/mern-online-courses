import request from "../../utils/request"
import { playListActions } from "../slices/playlistSlice";
import { toast } from "react-toastify";

/*=========================================*/
/*=========================================*/
/*=========================================*/

// add new playlist
export function addNewPlaylist(playlist) {

    return async (dispatch, getState) => {

        dispatch(playListActions.setLoading(true));

        try {

            const { auth } = getState();

            const token = auth.currentUser?.token;

            const { data } = await request.post("/api/playlists", playlist,

                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }

            )

            //in case response returns success
            if (data.success) {

                toast.success("Course added successfully and is pending admin approval");

                dispatch(playListActions.setPlayLists(data));

                return { success: true }; // send this to the component

            }

        } catch (error) {

            console.error("Error adding new playlist :", error.response?.data || error.message);

            toast.error(error.response?.data?.message || "Something went wrong!");

            return { success: false };

        } finally {

            dispatch(playListActions.setLoading(false));

        }

    }

}

/*=========================================*/

// get all playlists
export function getAllPlaylists() {

    return async (dispatch) => {

        dispatch(playListActions.setLoading(true));

        try {

            const { data } = await request.get("/api/playlists");

            dispatch(playListActions.setPlayLists(data?.playlists));

        } catch (error) {

            console.error("Error fetching all playlists :", error.response?.data || error.message);

            toast.error(error.response?.data?.message || "Something went wrong!");

        } finally {

            dispatch(playListActions.setLoading(false));

        }

    }

}

/*=========================================*/

// get single playlist 
export function getSinglePlaylist(playListId) {

    return async (dispatch) => {

        dispatch(playListActions.setLoading(true));

        try {

            const { data } = await request.get(`/api/playlists/${playListId}`);

            dispatch(playListActions.setSinglePlayList(data));

        } catch (error) {

            console.error("Error fetching single playlist :", error.response?.data || error.message);

            toast.error(error.response?.data?.message || "Something went wrong!");

        } finally {

            dispatch(playListActions.setLoading(false));

        }

    }

}

/*=========================================*/

// delete single playlist 
export function deleteSinglePlaylist(playListId, teacherId) {

    return async (dispatch, getState) => {

        try {

            console.log("teacherId:", teacherId);

            const { auth } = getState();

            const token = auth.currentUser?.token;

            const { data } = await request.delete(`/api/playlists/${playListId}/${teacherId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            dispatch(playListActions.setDeletePlaylist(playListId));

            dispatch(playListActions.setDeleteTeacherPlaylist(playListId));

            toast.success(data?.message);

        } catch (error) {

            console.error("Error delete playlist:", error.response?.data || error.message);

            toast.error(error.response?.data?.message || "Something went wrong!");

        }

    };

}

/*=========================================*/

// update playlist 
export function updatePlaylist(playlistId, playlist) {

    return async (dispatch, getState) => {

        dispatch(playListActions.setLoading(true));

        try {

            const { auth } = getState();

            const token = auth.currentUser?.token;

            const { data } = await request.put(`/api/playlists/${playlistId}`, playlist,

                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }

            );

            dispatch(playListActions.updatePlaylist(data.data));

            toast.success(data?.message);

        } catch (error) {

            console.error("Error updating playlist :", error.response?.data || error.message);

            toast.error(error.response?.data?.message || "Something went wrong!");

        } finally {

            dispatch(playListActions.setLoading(false));

        }

    }

}

/*=========================================*/

// get playlist that belong to teacher
export const getTeacherPlaylists = (teacherId) => async (dispatch, getState) => {

    dispatch(playListActions.setLoading(true));

    try {

        const { auth } = getState();

        const token = auth.currentUser?.token;

        const { data } = await request.get(`/api/playlists/teacher/${teacherId}`, {

            headers: {
                Authorization: `Bearer ${token}`,
            },

        });

        const { playlists, coursesCount } = data;

        dispatch(playListActions.setTeacherPlaylists(playlists));

        dispatch(playListActions.setTotalCourses(coursesCount));

        return data;

    } catch (error) {

        console.error("Error fetching teacher playlists :", error.response?.data || error.message);

        toast.error(error.response?.data?.message || "Something went wrong!");

    } finally {

        dispatch(playListActions.setLoading(false));

    }

};

/*=========================================*/

//search for a playlist
export function searchForPlaylist(querySearch) {

    return async (dispatch) => {

        dispatch(playListActions.setLoading(true));

        try {

            const { data } = await request.get("/api/playlists/search-playlist",
                { params: { q: querySearch } }
            );

            dispatch(playListActions.setSearchPlaylist(data?.data));

        } catch (error) {

            console.error("Error searching playlist :", error.response?.data || error.message);

        } finally {

            dispatch(playListActions.setLoading(false));

        }

    }

} 