import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeSingleComment, updateComment } from '../../redux/apiCalls/commentApiCall';
import { LiaEdit, LiaTrashSolid } from 'react-icons/lia';
import swal from 'sweetalert';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const SingleComment = ({ comment, user, courseId }) => {

    const dispatch = useDispatch();

    const { loadingCommentId } = useSelector(state => state.comment);

    const [editComment, setEditComment] = useState(false);

    const [text, setText] = useState(comment?.text);

    /*=========================================*/

    const editCommentHandler = () => {
        setEditComment(!editComment);
    };

    /*=========================================*/

    const closeCommentHandler = () => {
        setEditComment(false);
    };

    /*=========================================*/

    const removeCommentHandler = (id) => {
        swal({
            title: "Are you sure?",
            text: "This action will permanently delete the comment.",
            icon: "warning",
            buttons: ["Cancel", "Yes, delete it!"]
        }).then((willDeleteComment) => {
            if (willDeleteComment) {
                dispatch(removeSingleComment(id));
            }
        });
    };

    /*=========================================*/

    const updateCommentHandler = (e) => {

        e.preventDefault();

        if (comment?._id && courseId) {

            dispatch(updateComment(comment._id, text, courseId));

            setEditComment(false);

        }

    };

    /*=========================================*/

    return (
        <div className="single-comment-box">
            {
                !editComment ?
                    <>
                        <div className="single-comment">
                            <img src={comment?.user?.profilePhoto?.url} alt="user avatar" />
                            <div>
                                <h5>
                                    {comment?.user?.username}
                                    <span>{comment?.createdAt.slice(0, 10)}</span>
                                </h5>
                                {/* Show loading only for the updating comment */}
                                <p>{loadingCommentId === comment._id ? "Loading..." : comment?.text}</p>
                            </div>
                            {
                                user?._id === comment?.user._id &&
                                <ul>
                                    <li
                                        title='Edit comment'
                                        onClick={editCommentHandler}
                                    ><LiaEdit /></li>
                                    <li
                                        title='Delete comment'
                                        onClick={() => removeCommentHandler(comment?._id)}
                                    ><LiaTrashSolid /></li>
                                </ul>
                            }
                        </div>
                    </>
                    :
                    <>
                        <div className="single-comment">
                            <img src={comment?.user?.profilePhoto.url} alt="user avatar" />
                            <div>
                                <h5>
                                    {comment?.user?.username}
                                    <span>{comment?.createdAt.slice(0, 10)}</span>
                                </h5>
                                <form>
                                    <div className="form-group">
                                        <textarea
                                            className="form-control my-textarea"
                                            style={{ fontSize: "1.5rem" }}
                                            rows={3}
                                            value={text || ""}
                                            onChange={(e) => setText(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="btn-box">
                                        <button
                                            type="submit"
                                            className="bg-success"
                                            onClick={updateCommentHandler}>
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="bg-danger"
                                            onClick={closeCommentHandler}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
            }
        </div>
    );
};

export default SingleComment; 