import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSinglePlaylist } from '../../redux/apiCalls/playListApiCall';
import request from '../../utils/request';
import Spinner from '../../components/common/spinner/Spinner';
import { toast, ToastContainer } from 'react-toastify';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const PlaylistView = () => {

    const { singlePlayList, playlistLoading } = useSelector(state => state.playlists);

    const { currentUser } = useSelector(state => state.auth);

    const dispatch = useDispatch();

    const { playlistId } = useParams();

    const [approved, setApproved] = useState("pending");

    const [loading, setLoading] = useState(false);

    /*=========================================*/

    // Fetch single playlist when playlistId changes
    useEffect(() => {

        if (playlistId) {

            dispatch(getSinglePlaylist(playlistId));

        }

    }, [playlistId, dispatch]);

    /*=========================================*/

    // Update local state when singlePlayList loads
    useEffect(() => {

        if (singlePlayList?.isPlaylistApproved) {

            setApproved(singlePlayList.isPlaylistApproved);

        }

    }, [singlePlayList]);

    /*=========================================*/

    // Handle form submit
    const handleUpdateStatus = async (e, isPlaylistApproved) => {

        e.preventDefault();

        setLoading(true);

        try {

            const res = await request.post(
                `/api/playlists/approve-playlist/${playlistId}`,
                { isPlaylistApproved },
                {
                    headers: { Authorization: "Bearer " + currentUser?.token },
                }
            );

            setApproved(res.data?.updatedPlaylist?.isPlaylistApproved);

            toast.success("Playlist status updated successfully!");

        } catch (err) {

            console.log(err);

            alert("Error updating playlist status");

        }

        setLoading(false);

    };

    /*=========================================*/

    if (playlistLoading) return <Spinner />;

    return (
        <div className='view-details custom-div'>
            <h3 className='text-center mb-5'>Playlist Details</h3>
            <div className="container">
                <div className="row">
                    {/* Playlist info */}
                    <div className="col-lg-5 col-md-6 col-12 p-0">
                        <h4>Playlist</h4>
                        <div className="card" style={{ width: "100%" }}>
                            <img
                                className="card-img-top"
                                src={singlePlayList?.mainPlaylistImage?.url}
                                alt="Card image cap"
                            />
                            <div className="card-body">
                                <div
                                    className="card-title d-flex align-items-center justify-content-between"
                                >
                                    <h5 className="">{singlePlayList?.title}</h5>
                                    <span>{singlePlayList?.category}</span>
                                </div>
                                <p className="card-text">{singlePlayList?.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* User details */}
                    <div className="col-lg-4 col-md-6 col-12 px-3">
                        <h4>User details</h4>
                        <ul>
                            <li>Playlists id: <span>{singlePlayList?.teacher?._id}</span></li>
                            <li>Courses in this playlist : <span>{singlePlayList?.courses?.length || 0}</span></li>
                            <li>Created by : <span>{singlePlayList?.teacher?.username}</span></li>
                            <li>Email : <span style={{ textTransform: "none" }}>{singlePlayList?.teacher?.email}</span></li>
                            <li>Join at : <span>{singlePlayList?.teacher?.createdAt.slice(0, 10)}</span></li>
                            <li>All user playlists counts : <span>{singlePlayList?.teacher?.createdPlaylists.length || 0}</span></li>
                        </ul>
                    </div>

                    {/* Status update */}
                    <div className="col-lg-3 col-md-6 col-12 p-0">
                        <form onSubmit={(e) => handleUpdateStatus(e, approved)}>
                            <h4>Status</h4>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <select
                                    className="form-select"
                                    value={approved}
                                    onChange={(e) => setApproved(e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="approved">Approved</option>
                                    <option value="cancel">Cancel</option>
                                </select>
                            </div>
                            <button type="submit" className='custom-link' disabled={loading}>
                                {loading ? "Updating..." : "Update"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer autoClose={6000} />
        </div>
    );
};

export default PlaylistView; 