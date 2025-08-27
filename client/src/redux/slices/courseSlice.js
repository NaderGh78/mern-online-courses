import { createSlice } from "@reduxjs/toolkit";

/*===========================================*/
/*===========================================*/
/*===========================================*/

const courseSlice = createSlice({
    name: "courses",
    initialState: {
        allCourses: [],
        course: null,
        courseLoading: false,
        likeCourseLoading: false,
        editCourseLoading: false
    },
    reducers: {

        setAllCourses(state, action) {
            state.allCourses = action.payload;
        },

        setSingleCourse(state, action) {
            state.course = action.payload;
        },

        setEditCourseLoading(state, action) {
            state.editCourseLoading = action.payload;
        },

        setLoading(state, action) {
            state.courseLoading = action.payload;
        },

        setLikeCourseLoading(state, action) {
            state.likeCourseLoading = action.payload;
        },

        resetCourses: (state) => {
            state.allCourses = []; // Reset courses 
        },

        setDeletSingleCourse(state, action) {
            state.allCourses = state.allCourses.filter(el => el._id !== action.payload);
        },

        setUpdatCourse(state, action) {
            const update = action.payload;
            state.allCourses = state.allCourses.map(course =>
                course._id === update._id ? update : course
            );
        },

        setLikesCourse(state, action) {
            state.course.likes = action.payload;
        }

    }

});

/*===========================================*/

const coursesActions = courseSlice.actions;
const coursesReducer = courseSlice.reducer;
export const { resetCourses } = courseSlice.actions;
export { coursesActions, coursesReducer }