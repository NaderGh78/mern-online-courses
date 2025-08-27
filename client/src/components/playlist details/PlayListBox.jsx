import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSinglePlaylist } from "../../redux/apiCalls/playListApiCall";
import { userSavedPlaylists, fetchSavedPlaylists } from "../../redux/apiCalls/profileApiCall";
import { FaRegBookmark } from "react-icons/fa6";
import CustomHeading from "../helpers/CustomHeading";
import { ToastContainer } from "react-toastify";

/*===========================================*/
/*===========================================*/
/*===========================================*/

const PlaylistBox = ({ id, playlistId, courseCount }) => {

  const dispatch = useDispatch();

  const { singlePlayList } = useSelector(state => state.playlists);

  const { savedPlayLists = [], savedPlaylistLoading } = useSelector(state => state.profile);

  const { currentUser } = useSelector(state => state.auth);

  /*===========================================*/

  // Load playlist and saved items
  useEffect(() => {

    dispatch(getSinglePlaylist(id));

    if (currentUser) {

      dispatch(fetchSavedPlaylists(currentUser._id));

    }

  }, [dispatch, id, currentUser]);

  /*===========================================*/

  // Check if current playlist is saved (only for logged-in users)
  const isSaved = currentUser && savedPlayLists.some(p => p._id === playlistId);

  // Save handler  
  const handleSave = () => {
    dispatch(userSavedPlaylists(playlistId));
  };

  /*===========================================*/

  return (
    <div className="playlist-details-box">
      <CustomHeading text="Playlist Details" />
      {/* <button
        onClick={handleSave}
        className={isSaved ? 'saved disabled' : 'not-saved'}
        disabled={isSaved}
      >
        {
          isSaved ?
            <>
              <FaRegBookmark /> Saved
            </> :
            <>
              <FaRegBookmark /> Save Playlist
            </>
        }
      </button> */}
      <button
        onClick={handleSave}
        className={isSaved ? 'saved disabled' : 'not-saved'}
        disabled={isSaved || savedPlaylistLoading}
      >
        {savedPlaylistLoading ? (
          <>
            <FaRegBookmark /> Saving...
          </>
        ) : isSaved ? (
          <>
            <FaRegBookmark /> Saved
          </>
        ) : (
          <>
            <FaRegBookmark /> Save Playlist
          </>
        )}
      </button>
      <div className="row h-100">
        <div className="col-lg-6 col-md-12">
          <div className="left w-100">
            <div className="thumb-box mb-0">
              <img
                src={singlePlayList?.mainPlaylistImage?.url}
                className="img-fluid"
                alt="playlist"
              />
              <span>{courseCount || 0} videos</span>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-12">
          <div className="right mt-4">
            <div className="top user-avatar-details">
              <div className="left">
                <img
                  src={singlePlayList?.teacher?.profilePhoto?.url}
                  alt="teacher"
                />
              </div>
              <div className="right">
                <h6>{singlePlayList?.teacher?.username}</h6>
                <span style={{ color: "var(--light-color)", fontSize: "1.5rem" }}>
                  {singlePlayList?.createdAt?.slice(0, 10)}
                </span>
              </div>
            </div>
            <div className="bottom mt-3">
              <h3 style={{ color: "var(--black)", fontSize: "1.8rem", textTransform: "capitalize" }}>
                {singlePlayList?.title}
              </h3>
              <p style={{ color: "var(--light-color)", fontSize: "1.5rem" }}>
                {singlePlayList?.description}
              </p>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <Link
                to={`/teacher-profile/${singlePlayList?.teacher?._id}`}
                className='custom-link w-auto'>View profile</Link>
              <span className="cat">{singlePlayList?.category}</span>
            </div>

          </div>
        </div>
      </div>
      <ToastContainer autoClose={6000} />
    </div>
  );
};

export default PlaylistBox;