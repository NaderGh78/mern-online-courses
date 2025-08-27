import { categoryActions } from "../slices/categorySlice";
import request from "../../utils/request";
import { toast } from "react-toastify";

/*===========================================*/
/*===========================================*/
/*===========================================*/

// add new category
export function addNewCat(title) {

    return async (dispatch, getState) => {

        dispatch(categoryActions.setLoading(true));

        try {

            const { auth } = getState();

            const token = auth.currentUser?.token;

            const { data } = await request.post("/api/categories",
                { title },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data?.success) {

                dispatch(categoryActions.newCat(data.category));

                return { success: true };

            }

        } catch (error) {

            console.error("Error adding category :", error.response?.data || error.message);

            toast.error(error.response?.data?.message || "Something went wrong!");

            return { success: false };

        } finally {

            dispatch(categoryActions.setLoading(false));

        }

    }

}

/*===========================================*/

// get all categories 
export function getAllCat() {

    return async (dispatch) => {

        try {

            const { data } = await request.get("/api/categories");

            dispatch(categoryActions.getAllCat(data?.categories));

        } catch (error) {

            console.error("Error fetching categories :", error.response?.data || error.message);

            toast.error(error.response?.data?.message || "Something went wrong!");

        }

    }

}

/*===========================================*/

// update category
export function updateCat(catId, title) {

    return async (dispatch, getState) => {

        try {

            const { auth } = getState();

            const token = auth.currentUser?.token;

            const { data } = await request.put(`/api/categories/${catId}`,
                { title },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            dispatch(categoryActions.editCat(data?.category));

        } catch (error) {

            console.error("Error updating category :", error.response?.data || error.message);

            toast.error(error.response?.data?.message || "Something went wrong!");

        }

    }

}

/*===========================================*/

// delete category 
export function deleteCat(catId) {

    return async (dispatch, getState) => {

        dispatch(categoryActions.setLoading(true));

        try {

            const { auth } = getState();

            const token = auth.currentUser?.token;

            const { data } = await request.delete(`/api/categories/${catId}`,

                { headers: { Authorization: `Bearer ${token}` } }
            );

            dispatch(categoryActions.removeCat(catId));

            toast.success(data?.message);

        } catch (error) {

            console.error("Error deleting category :", error.response?.data || error.message);

            toast.error(error.response?.data?.message || "Something went wrong!");

        } finally {

            dispatch(categoryActions.setLoading(false));

        }

    }

}