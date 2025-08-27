import { createSlice } from "@reduxjs/toolkit";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const categorytSlice = createSlice(
    {
        name: "category",
        initialState: {
            catArr: [],
            catLoading: false
        },

        reducers: {

            // 
            newCat(state, action) {
                state.catArr.push(action.payload);
            },

            getAllCat(state, action) {
                state.catArr = action.payload;
            },

            editCat(state, action) {
                const update = action.payload;
                state.catArr = state.catArr.map(c => c._id.toString() === update._id ? update : c)
            },

            removeCat(state, action) {
                state.catArr = state.catArr.filter(el => el._id !== action.payload);
            },

            setLoading(state, action) {
                state.catLoading = action.payload;
            },

        }

    }

);

/*=========================================*/

const categoryActions = categorytSlice.actions;
const categoryReducer = categorytSlice.reducer;
export { categoryActions, categoryReducer };