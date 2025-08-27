import { createSlice } from "@reduxjs/toolkit";

/*===========================================*/
/*===========================================*/
/*===========================================*/

const authSlice = createSlice({
    name: "auth",
    initialState: {
        currentUser: localStorage.getItem("currentUser") ?
            JSON.parse(localStorage.getItem("currentUser")) : null,
        registerMessage: null,
        registerLoading: false,
        loginLoading: false
    },
    reducers: {

        showSuccesRegisterMsg(state, action) {
            state.registerMessage = action.payload;
        },

        hideSuccesRegisterMsg(state) {
            state.registerMessage = null;
        },

        login(state, action) {
            state.currentUser = action.payload;
        },

        logOut(state) {
            state.currentUser = null;
        },

        // show loading when register
        setRegisterLoading(state, action) {
            state.registerLoading = action.payload;
        },

        // show loading when login 
        setLoaginLoading(state, action) {
            state.loginLoading = action.payload;
        }

    }

});

/*===========================================*/

const authActions = authSlice.actions;
const authReducer = authSlice.reducer;
export const { hideSuccesRegisterMsg } = authSlice.actions;
export { authActions, authReducer }