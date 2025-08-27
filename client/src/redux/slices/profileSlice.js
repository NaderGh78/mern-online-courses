import { createSlice } from "@reduxjs/toolkit";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const profileSlice = createSlice({
    name: "profile",
    initialState: {
        profiles: [],
        savedPlayLists: [],
        profile: null,
        loading: false,
        loadingSearch: false,
        savedPlaylistLoading: false,
        teacherSearchResults: null,
        isSavedPlaylist: false
    },
    reducers: {

        setProfiles(state, action) {
            state.profiles = action.payload;
        },

        setSingleProfile(state, action) {
            state.profile = action.payload;
        },

        setUpdateProfile(state, action) {
            state.profile = action.payload;
        },

        setLoading(state, action) {
            state.loading = action.payload;
        },

        setSavedPlaylistLoading(state, action) {
            state.savedPlaylistLoading = action.payload
        },

        // save plylist actions
        setSavedPlayLists(state, action) {
            state.savedPlayLists = action.payload || [];
        },

        setIsSavedPlaylist(state, action) {
            state.isSavedPlaylist = action.payload;
        },

        setDelete(state, action) {
            state.savedPlayLists = state.savedPlayLists.filter(
                p => p._id.toString() !== action.payload.toString()
            );
        },

        setTeacherSearch(state, action) {
            state.teacherSearchResults = action.payload;
        },

        setLoadingSearch(state, action) {
            state.loadingSearch = action.payload;
        }

    }

});

/*=========================================*/

const profileActions = profileSlice.actions;
const profileReducer = profileSlice.reducer;
export { profileActions, profileReducer };