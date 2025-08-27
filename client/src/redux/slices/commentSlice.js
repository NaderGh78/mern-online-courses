import { createSlice } from "@reduxjs/toolkit";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const commentSlice = createSlice(
    {
        name: "comment",
        initialState: {
            allComments: [],
            currentComment: null,
            commentLoading: false,
            loadingCommentId: null
        },
        reducers: {

            setAddComment(state, action) {
                state.currentComment = action.payload;
            },

            setAllComments(state, action) {
                state.allComments = action.payload;
            },

            setLoading(state, action) {
                state.commentLoading = action.payload;
            },

            setLoadingForComment(state, action) {
                state.loadingCommentId = action.payload; // Set the ID of the comment being updated
            },

            setUpdatComment(state, action) {
                const updated = action.payload;
                state.allComments = state.allComments.map(comment =>
                    comment._id.toString() === updated._id ? updated : comment
                );
            }

        }

    }

);

/*=========================================*/

const commentActions = commentSlice.actions;
const commentReducer = commentSlice.reducer;
export { commentActions, commentReducer }