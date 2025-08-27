import { createSlice } from "@reduxjs/toolkit";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const playlistSlice = createSlice({
    name: "playlists",
    initialState: {
        playLists: [],
        teacherPlaylists: [],    // Playlists for the logged-in teacher
        searchPlaylist: [],
        singlePlayList: null,
        playlistLoading: false,
        totalCourses: 0
    },
    reducers: {

        setPlayLists(state, action) {
            state.playLists = action.payload;
        },

        setSinglePlayList(state, action) {
            state.singlePlayList = action.payload;
        },

        setLoading(state, action) {
            state.playlistLoading = action.payload;
        },

        setDeletePlaylist(state, action) {
            state.playLists = state.playLists.filter(
                playlist => playlist._id !== action.payload
            );
        },

        updatePlaylist(state, action) {
            const updated = action.payload;
            state.playLists = state.playLists.map(playlist =>
                playlist._id === updated._id ? updated : playlist
            );
        },

        setTeacherPlaylists(state, action) {
            state.teacherPlaylists = action.payload;
        },

        setDeleteTeacherPlaylist(state, action) {
            state.teacherPlaylists = state.teacherPlaylists.filter(
                playlist => playlist._id !== action.payload
            );
        },

        resetPlaylists: (state) => {
            state.playLists = [];
        },

        setTotalCourses(state, action) {
            state.totalCourses = action.payload;
        },

        setSearchPlaylist(state, action) {
            state.searchPlaylist = action.payload;
        }

    }

});

/*=========================================*/

const playListActions = playlistSlice.actions;
const playListtReducer = playlistSlice.reducer;
export const { resetPlaylists } = playlistSlice.actions;
export { playListActions, playListtReducer }