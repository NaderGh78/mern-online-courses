import './course-card.css';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { hidePopUp } from '../../../redux/slices/popUpSlice';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const CourseCard = ({ data: {
  _id,
  teacher,
  mainPlaylistImage,
  title, category, coursesCount
} }) => {

  const dispatch = useDispatch();

  /*=========================================*/

  const hidePopUpHandler = () => {
    dispatch(hidePopUp());
  };

  /*=========================================*/

  return (
    <div className='course-card'>
      <div className="card" >
        <div className="master-img-box">
          <img className="card-img-top" src={mainPlaylistImage?.url} alt="single course" />
          <span>
            {coursesCount || 0} videos
          </span>
        </div>

        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <div className="avatar">
            <div className="left">
              <img src={teacher?.profilePhoto?.url}
                alt="teacher" />
              <div className="info">
                <h5>{teacher?.username}</h5>
                <span>{category}</span>
              </div>
            </div>
            <Link
              to={`/playlist-details/${_id}`}
              onClick={hidePopUpHandler}
              className='main-custom-link'
            >
              View Playlist
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;