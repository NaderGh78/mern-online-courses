import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPlaylists } from '../../redux/apiCalls/playListApiCall';
import { LiaTrashSolid, LiaEye } from "react-icons/lia";
import { ToastContainer } from "react-toastify";
import { Spinner } from 'react-bootstrap';
import swal from 'sweetalert';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const AdminPlaylistsTable = () => {

    const { playLists, playlistLoading } = useSelector(state => state.playlists);

    const dispatch = useDispatch();

    /*=========================================*/

    //fetch all profiles
    useEffect(() => {

        dispatch(getAllPlaylists());

    }, []);

    /*=========================================*/

    if (playlistLoading) return <Spinner />;

    return (
        <div className='admin-playlists custom-div' style={{ overflowX: "auto" }}>
            <table className="table table-bordered my-table" style={{ overflowX: "auto" }}>
                <thead>
                    <tr>
                        <th className="text-center" scope="col">Id</th>
                        <th className="text-center" scope="col">Playlist Name</th>
                        <th className="text-center" scope="col">Category</th>
                        <th className="text-center" scope="col">Created By</th>
                        <th className="text-center" scope="col">Image</th>
                        <th className="text-center" scope="col">Approved</th>
                        <th className="text-center" scope="col">Create At</th>
                        <th className="text-center" scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        playLists?.length > 0
                            ?
                            playLists?.map((el, index) => (
                                <tr className="text-center" key={el._id}>
                                    <td>{index + 1}</td>
                                    <td>{el.title}</td>
                                    <td>{el.category}</td>
                                    <td>{el.teacher?.username}</td>
                                    <td>
                                        <img
                                            src={el.mainPlaylistImage?.url}
                                            alt="avatar"
                                            style={{ width: "5rem", height: "5rem" }}
                                        />
                                    </td>
                                    {/* <td>{el.isPlaylistApproved === "approved" ? "✅" : "❌"}</td> */}
                                    <td
                                        style={{
                                            color: el.isPlaylistApproved === "approved" ? "var(--orange)" : "",
                                            fontWeight: el.isPlaylistApproved === "approved" ? "600" : "",
                                            textTransform: "capitalize"
                                        }}>
                                        {el.isPlaylistApproved}
                                    </td>
                                    <td>{el.createdAt.slice(0, 10)}</td>
                                    <td>
                                        <Link
                                            // to={`/playlist-details/${el._id}`}
                                            to={`playlist-view/${el._id}`}
                                            className="me-2">
                                            <LiaEye />
                                        </Link>
                                        <button className="btn btn-link p-0">
                                            <LiaTrashSolid className="text-danger" />
                                        </button></td>
                                </tr>
                            )) :
                            <tr>
                                <td colSpan={8} className="text-center">No playlists yet!</td>
                            </tr>
                    }
                </tbody>
            </table>
            <ToastContainer autoClose={6000} />
        </div>
    )
}

export default AdminPlaylistsTable;