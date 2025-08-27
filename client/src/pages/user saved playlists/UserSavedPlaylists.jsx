import "./user-saved-playlist.css";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSavedPlaylists, unsavedUserPlaylist } from "../../redux/apiCalls/profileApiCall";
import CustomHeading from "../../components/helpers/CustomHeading";
import { CourseCard } from '../../allPagesPaths';
import { LiaTimesSolid } from "react-icons/lia";
import swal from 'sweetalert';

/*===========================================*/
/*===========================================*/
/*===========================================*/

const UserSavedPlaylists = () => {

    const dispatch = useDispatch();

    const { savedPlayLists = [] } = useSelector(state => state.profile);

    const { currentUser } = useSelector(state => state.auth);

    const { id } = useParams();

    /*===========================================*/

    useEffect(() => {

        dispatch(fetchSavedPlaylists(id));

    }, [id]);

    /*===========================================*/

    const unsavedUserPlaylistHandler = (playlistId) => {
        swal({
            title: "Unsave this playlist?",
            icon: "warning",
            buttons: ["Cancel", "Unsave"],
        }).then((willUnsave) => {
            if (willUnsave) {
                dispatch(unsavedUserPlaylist(playlistId))
                    .then(() => dispatch(fetchSavedPlaylists(id)));
            }
        });
    };

    /*===========================================*/

    return (
        <div className="user-saved-playlist custom-div">
            <div className="container p-0">
                <CustomHeading text="User saved playlists" />
                <div className="row">
                    {savedPlayLists?.length > 0 ?
                        savedPlayLists.map((playlist) => {
                            const coursesCount = (playlist.courses || [])
                                .filter(course => course.isCourseApproved === "approved").length;

                            console.log(playlist.title, coursesCount);

                            const showUnsavedIcon =
                                id === currentUser?._id &&
                                playlist.savedBy?.includes(currentUser?._id);

                            return (
                                <div className="col-12 col-sm-6 col-lg-4 position-relative" key={playlist._id}>
                                    {showUnsavedIcon && (
                                        <span
                                            className="unsaved"
                                            onClick={() => unsavedUserPlaylistHandler(playlist._id)}
                                        >
                                            <LiaTimesSolid />
                                        </span>
                                    )}
                                    <CourseCard data={{ ...playlist, coursesCount }} />
                                </div>
                            );
                        }
                        ) : (
                            <h2 style={{ color: "var(--light-color)" }}>No saved playlists yet.</h2>
                        )}
                </div>
            </div>
        </div>
    );

}

export default UserSavedPlaylists;