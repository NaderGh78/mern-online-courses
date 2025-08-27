import { configureStore } from "@reduxjs/toolkit";
import { sideBarReducer } from "./slices/sideBarSlice";
import { themeReducer } from "./slices/themeSlice";
import { popUpReducer } from "./slices/popUpSlice";
import { authReducer } from "./slices/authSlice";
import { profileReducer } from "./slices/profileSlice";
import { playListtReducer } from "./slices/playlistSlice";
import { coursesReducer } from "./slices/courseSlice";
import { commentReducer } from "./slices/commentSlice";
import { categoryReducer } from "./slices/categorySlice";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const store = configureStore({
    reducer: {
        sidebar: sideBarReducer,
        theme: themeReducer,
        popUpProfile: popUpReducer,
        auth: authReducer,
        profile: profileReducer,
        playlists: playListtReducer,
        courses: coursesReducer,
        comment: commentReducer,
        category: categoryReducer,
    }
});

export default store;