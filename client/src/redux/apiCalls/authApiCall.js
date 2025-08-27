import { playListActions, resetPlaylists } from "../slices/playlistSlice";
import { resetCourses } from "../slices/courseSlice";
import { authActions } from "../slices/authSlice";
import request from "../../utils/request";
import { toast } from "react-toastify";

/*===========================================*/
/*===========================================*/
/*===========================================*/

// register user
export function registerUser(userData) {

    return async (dispatch) => {

        // run the loader
        dispatch(authActions.setRegisterLoading(true));

        try {

            // we need header, cos the user will upload his image when register
            const { data } = await request.post("/api/auth/register", userData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            dispatch(authActions.showSuccesRegisterMsg(data.message));

        } catch (error) {

            // if there is error message in data show it ,otherwise show custom msg
            const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";

            toast.error(errorMessage);

        } finally {
            dispatch(authActions.setRegisterLoading(false));
        }

    }

}

/*===========================================*/

// login user
export function loginUser(userData) {

    return async (dispatch) => {

        dispatch(authActions.setLoaginLoading(true));

        try {

            const { data } = await request.post("/api/auth/login", userData);

            dispatch(authActions.login(data));
            /*
             we reset the playlist and course in ordert to avoid the teacher who does 
             not have playlist or cousrse yet ,to not see the other teacher tah has playlist and course
            */
            dispatch(playListActions.resetPlaylists()); // Reset playlists

            dispatch(resetCourses());                   // Reset courses

            localStorage.setItem("currentUser", JSON.stringify(data));

        } catch (error) {

            // if there is error message in data show it ,otherwise show custom msg
            const errorMessage = error.response?.data?.message || "Registration failed.";

            toast.error(errorMessage);

        } finally {

            dispatch(authActions.setLoaginLoading(false));

        }
    };

}

/*===========================================*/

// log out user  
export function logOutUser() {

    return async (dispatch) => {

        try {

            dispatch(authActions.logOut());

            dispatch(resetPlaylists());

            dispatch(resetCourses());

            localStorage.removeItem("currentUser");

        } catch (error) {

            console.log(error);

        }

    };

}