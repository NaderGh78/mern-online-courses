import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hidePopUp } from "../../../redux/slices/popUpSlice";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const SingleTeacherCard = ({ data: { _id, approvedCoursesCount, mainPlaylistImage, title } }) => {

  const dispatch = useDispatch();

  /*=========================================*/

  // close the pop up WHEN CLICK ON LINKS
  const hidePopUpHandler = () => {
    dispatch(hidePopUp());
  }

  /*=========================================*/

  return (
    <div className='course-card'>
      <div className="thumb-box mt-0">
        <img src={mainPlaylistImage?.url}
          className='img-fluid'
          alt="single course"
        />
        <span style={{ fontSize: "1.5rem" }}>{approvedCoursesCount || 0} videos</span>
      </div>
      <div className="bottom">
        <h5 style={{ color: "var(--black)", marginBottom: "15px", fontSize: "2rem" }}>{title}</h5>
        <Link
          to={`/playlist-details/${_id}`}
          onClick={hidePopUpHandler}
          className='main-custom-link'>View Playlist</Link>
      </div>
    </div>
  )
}

export default SingleTeacherCard;