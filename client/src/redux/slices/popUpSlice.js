import { createSlice } from "@reduxjs/toolkit";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const popUpSlice = createSlice({

    name: "popUpProfile",
    initialState: {
        popUp: false
    },
    reducers: {

        showHidePopUp(state) {
            state.popUp = !state.popUp;
        },

        // we make this in order when user click on links it will clsoe the popup
        hidePopUp(state) {
            state.popUp = false;
        }

    }

});

/*=========================================*/

export const popUpReducer = popUpSlice.reducer;
export const { showHidePopUp, hidePopUp } = popUpSlice.actions; 