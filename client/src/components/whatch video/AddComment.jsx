import { useState } from "react";
import { useDispatch } from "react-redux";
import { addComment } from "../../redux/apiCalls/commentApiCall";
import CustomHeading from "../helpers/CustomHeading";
import { ToastContainer } from "react-toastify";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const AddComment = ({ courseId, commentsLength }) => {

    const dispatch = useDispatch();

    const [text, setText] = useState("");

    /*=========================================*/

    const newComment = (e) => {

        e.preventDefault();

        dispatch(addComment(text, courseId)).then((res) => {

            if (res.success) {

                setText("");

            }

        })

    }

    /*=========================================*/

    return (
        <div className="add-comment">
            <CustomHeading text={`${commentsLength} comments`} />
            <div className="comment-box-from">
                <form onSubmit={newComment}>
                    <div className="form-group">
                        <label htmlFor="comment">
                            Add comment
                        </label>
                        <textarea
                            className="form-control my-textarea"
                            rows={6}
                            id="comment"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter your comment"
                        ></textarea>
                    </div>
                    <button type="submit" className="custom-link border-0 w-auto">
                        Add Comment
                    </button>
                </form>
            </div>
            <ToastContainer autoClose={6000} />
        </div>
    )
}

export default AddComment;