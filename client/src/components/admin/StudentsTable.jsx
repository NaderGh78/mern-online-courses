import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProfiles } from '../../redux/apiCalls/profileApiCall';
import { LiaTrashSolid, LiaEye } from "react-icons/lia";
import { ToastContainer } from "react-toastify";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const StudentsTable = () => {

    const { profiles } = useSelector(state => state.profile);

    const dispatch = useDispatch();

    /*=========================================*/

    //fetch all profiles
    useEffect(() => {

        dispatch(getAllProfiles());

    }, []);

    /*=========================================*/

    // just filter the students from profiles arr
    const getStudents = profiles?.filter(p => p.role === "Student");

    /*=========================================*/

    return (
        <div className='category custom-div' style={{ overflowX: "auto" }}>
            <Link className="my-table-link">Add new user</Link>
            <table className="table table-bordered my-table">
                <thead>
                    <tr>
                        <th className="text-center" scope="col">Id</th>
                        <th className="text-center" scope="col">Name</th>
                        <th className="text-center" scope="col">Image</th>
                        <th className="text-center" scope="col">Email</th>
                        <th className="text-center" scope="col">Create At</th>
                        <th className="text-center" scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        getStudents?.length > 0
                            ?
                            getStudents?.map(el => (
                                <tr className="text-center" key={el._id}>
                                    <td>{el._id}</td>
                                    <td>{el.username}</td>
                                    <td>
                                        <img
                                            src={el.profilePhoto?.url}
                                            alt="avatar"
                                            style={{ width: "5rem", height: "5rem" }}
                                        />
                                    </td>
                                    <td>{el.email}</td>
                                    <td>{el.createdAt.slice(0, 10)}</td>
                                    <td>
                                        <Link
                                            to={`/profile/${el._id}`}
                                            className="me-2">
                                            <LiaEye />
                                        </Link>
                                        <button className="btn btn-link p-0">
                                            <LiaTrashSolid className="text-danger" />
                                        </button></td>
                                </tr>
                            )) :
                            <tr>
                                <td colSpan={6} className="text-center">No students yet!</td>
                            </tr>
                    }
                </tbody>
            </table>
            <ToastContainer autoClose={6000} />
        </div>
    )
}

export default StudentsTable;