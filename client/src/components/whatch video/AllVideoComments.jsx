import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllComments } from "../../redux/apiCalls/commentApiCall";
import CustomHeading from "../helpers/CustomHeading";
import SingleComment from "./SingleComment";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const AllVideoComments = ({ allComments, courseId }) => {

    const dispatch = useDispatch();

    const { currentUser } = useSelector(state => state.auth);

    /*=========================================*/

    useEffect(() => {

        if (currentUser?.token) {
            dispatch(getAllComments());
        }

    }, [dispatch, currentUser?.token]);

    /*=========================================*/

    return (
        <div className="all-video-comments">
            <CustomHeading text="user comments" />
            <div className="all-comments">
                {
                    allComments?.length > 0 ?
                        allComments?.map(comment => (
                            <SingleComment
                                key={comment._id}
                                comment={comment}
                                user={currentUser}
                                courseId={courseId}
                            />
                        )) :
                        <h2 style={{ color: "var(--light-color)" }}>No comments for this course yet.</h2>
                }
            </div>
        </div>
    )
}

export default AllVideoComments;