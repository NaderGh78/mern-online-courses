import request from "../../utils/request";
import { commentActions } from "../slices/commentSlice";
import { toast } from "react-toastify";

/*=========================================*/
/*=========================================*/
/*=========================================*/

//Add new comment 
export function addComment(text, courseId) {

  return async (dispatch, getState) => {

    try {

      const { auth } = getState();

      const token = auth.currentUser?.token;

      if (!token) {

        toast.error("You should be logged in to comment!");

        return;

      }

      const { data } = await request.post(
        "/api/comments",
        { text, courseId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (data.success) {

        toast.success(data.message);

        dispatch(commentActions.setAddComment(data?.comment));

        dispatch(getAllComments());

        return { success: true };

      }

      // console.log(data);
    } catch (error) {

      console.log(error?.response?.data);

      toast.error(error.response?.data?.message || "Something went wrong!");

      return { success: false };

    }

  };

}

/*=========================================*/

//Get all comments
export function getAllComments() {

  return async (dispatch, getState) => {

    try {

      const { auth } = getState();

      const token = auth.currentUser?.token;

      const { data } = await request.get("/api/comments",

        {
          headers: { Authorization: `Bearer ${token}` }
        }

      );

      dispatch(commentActions.setAllComments(data?.comments));

    } catch (error) {

      console.log(error);

    }

  }

}

/*=========================================*/

//Remove single comment
export function removeSingleComment(commentId) {

  return async (dispatch, getState) => {

    try {

      const { auth } = getState();

      const token = auth.currentUser?.token;

      if (!token) {

        toast.error("You cant remove this comment.");

        return

      }

      const { data } = await request.delete(`/api/comments/${commentId}`,

        {

          headers: { Authorization: `Bearer ${token}` }

        }

      );

      if (data?.success) {

        toast.success(data?.message);

        // get all comments again when success removing comment
        dispatch(getAllComments());

      }

    } catch (error) {

      console.log(error);

      toast.error("Something went wrong!");

    }

  }

}

/*=========================================*/

// Update single comment
export function updateComment(commentId, text, courseId) {

  return async (dispatch, getState) => {

    dispatch(commentActions.setLoadingForComment(commentId)); // Start loading for the specific comment

    try {

      const { auth } = getState();

      const token = auth.currentUser?.token;

      if (!token) {

        toast.error("You can't update this comment.");

        return;

      }

      const { data } = await request.put(`/api/comments/${commentId}`,
        { text, courseId },
        { headers: { Authorization: `Bearer ${token}` } });

      if (data?.success) {

        dispatch(commentActions.setUpdatComment(data?.updatedComment)); // Update the comment

        toast.success(data?.message);

      }

    } catch (error) {

      console.log(error);

      toast.error("Something went wrong!");

    } finally {

      dispatch(commentActions.setLoadingForComment(null)); // End loading after the update

    }

  };

} 