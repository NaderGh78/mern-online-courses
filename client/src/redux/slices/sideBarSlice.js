import { createSlice } from "@reduxjs/toolkit";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const sideBarSlice = createSlice({
    name: "sidebar",
    initialState: {
        sideBarToggle: false
    },
    reducers: {

        // this will toggle the state like [open or close]
        showSidbar(state) {
            state.sideBarToggle = !state.sideBarToggle;
        },

        // this will use in small devices when sidebar is open ,the x icon will just close the mini side bar  
        closeMiniSidbar(state) {
            state.sideBarToggle = false;
        }
    }
});

/*=========================================*/

const sideBarReducer = sideBarSlice.reducer;
const sideBarActions = sideBarSlice.actions;
export const { showSidbar, closeMiniSidbar } = sideBarSlice.actions;
export { sideBarReducer, sideBarActions }