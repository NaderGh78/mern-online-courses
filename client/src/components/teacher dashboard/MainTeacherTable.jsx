import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTeacherPlaylists, deleteSinglePlaylist } from "../../redux/apiCalls/playListApiCall";
import { LiaTrashSolid, LiaEdit, LiaEye } from "react-icons/lia";
import { useTitle } from '../../components/helpers/useTitle';
import Spinner from "../common/spinner/Spinner";
import swal from 'sweetalert';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const MainTeacherTable = () => {

    useTitle(`Main Dashboard`);

    const dispatch = useDispatch();

    const { currentUser } = useSelector(state => state.auth);

    const [playlists, setPlaylists] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const [deletingPlaylistId, setDeletingPlaylistId] = useState(null);

    /*=========================================*/

    // Fetch playlists when the component mounts
    useEffect(() => {

        if (currentUser?._id) {

            setIsLoading(true);

            dispatch(getTeacherPlaylists(currentUser._id))
                .then((data) => {

                    if (data) {

                        // Assuming the backend response is { playlists: [], coursesCount: number }
                        const { playlists, coursesCount } = data;

                        // Update local state with playlists
                        setPlaylists(playlists);

                    } else {

                        console.warn("No playlists found in the response.");

                    }

                    setIsLoading(false);
                })
                .catch((error) => {

                    console.error("Error fetching playlists:", error);

                    setIsLoading(false);

                });

        }

    }, [dispatch, currentUser?._id]);

    /*=========================================*/

    const deletePlayList = (playlistId, teacherId) => {
        swal({
            title: "Are you sure?",
            text: "This action will permanently delete the playlist.",
            icon: "warning",
            buttons: ["Cancel", "Yes, delete it!"]
        }).then((willDeletePlaylist) => {
            if (willDeletePlaylist) {
                setDeletingPlaylistId(playlistId);
                dispatch(deleteSinglePlaylist(playlistId, teacherId))
                    .then(() => {
                        // Remove the deleted playlist from local state
                        setPlaylists(playlists.filter(playlist => playlist._id !== playlistId));
                        // Re-fetch playlists after deletion to make sure data is fresh
                        dispatch(getTeacherPlaylists(currentUser._id)).then((data) => {
                            if (data) {
                                const { playlists } = data;
                                setPlaylists(playlists);
                            }
                        });
                    })
                    .finally(() => setDeletingPlaylistId(null)); // Reset after deletion
            }
        });
    };

    /*=========================================*/

    // Show spinner while loading
    if (isLoading) return <Spinner />;

    return (
        <div className="main-teacher-table" style={{ overflowX: "auto" }}>
            <Link to="/teacher-dashboard/add-playlist" className="my-table-link">
                Add new playlist
            </Link>

            {playlists?.length > 0 ? (
                <table className="table table-bordered my-table">
                    <thead>
                        <tr>
                            <th className="text-center">Id</th>
                            <th className="text-center">Title</th>
                            <th className="text-center">Description</th>
                            <th className="text-center">Category</th>
                            <th className="text-center">Cover</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Created</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {playlists?.map((el, index) => (
                            <tr className="text-center" key={el._id}>
                                {deletingPlaylistId === el._id ? (
                                    <td colSpan="8" className="text-center">
                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                            <div className="spinner-border text-danger" role="status"></div>
                                            <span>Deleting playlist...</span>
                                        </div>
                                    </td>
                                ) : (
                                    <>
                                        <td>{index + 1}</td>
                                        <td>{el.title}</td>
                                        <td>
                                            {el.description.length > 50
                                                ? `${el.description.slice(0, 50)} ...`
                                                : el.description}
                                        </td>
                                        <td>{el.category}</td>
                                        <td>
                                            <img
                                                // src={el.mainPlaylistImage?.url} 
                                                src={el.mainPlaylistImage?.url || `${process.env.REACT_APP_BASE_URL}/uploads/no-picture.jpg`}
                                                alt="cover"
                                                width={50}
                                            />
                                        </td>
                                        <td
                                            style={{
                                                color: el.isPlaylistApproved === "approved" ? "var(--orange)" : "",
                                                fontWeight: el.isPlaylistApproved === "approved" ? "600" : "",
                                                textTransform: "capitalize"
                                            }}>
                                            {el.isPlaylistApproved}</td>
                                        <td style={{ whiteSpace: "nowrap" }}>{el.createdAt?.slice(0, 10)}</td>
                                        <td style={{ whiteSpace: "nowrap" }}>
                                            <Link
                                                to={`/playlist-details/${el._id}`}
                                                className="me-2"
                                            >
                                                <LiaEye className="text-primary" />
                                            </Link>
                                            <Link
                                                to={`/teacher-dashboard/edit-playlist/${el._id}`}
                                                className="me-2"
                                            >
                                                <LiaEdit className="text-success" />
                                            </Link>
                                            <button
                                                onClick={() => deletePlayList(el._id, el.teacher?._id)}
                                                className="btn btn-link p-0"
                                            >
                                                <LiaTrashSolid className="text-danger" />
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <h2 className="text-center">No playlists found.</h2>
            )}
        </div>
    );
};

export default MainTeacherTable;