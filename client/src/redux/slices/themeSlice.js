import { createSlice } from "@reduxjs/toolkit";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const themeSlice = createSlice({
    name: "theme",
    initialState: {
        isDarkMode: localStorage.getItem("isDarkMode") !== undefined
            ? JSON.parse(localStorage.getItem("isDarkMode"))
            : false
    },
    reducers: {
        toggleTheme(state) {
            state.isDarkMode = !state.isDarkMode;
            localStorage.setItem("isDarkMode", state.isDarkMode);
        }
    }
});

/*=========================================*/

const themeActions = themeSlice.actions;
const themeReducer = themeSlice.reducer;
export const { toggleTheme } = themeSlice.actions;
export { themeActions, themeReducer }