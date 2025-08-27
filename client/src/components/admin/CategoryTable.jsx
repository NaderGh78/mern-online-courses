import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCat, getAllCat } from '../../redux/apiCalls/categoryApiCall';
import NewCatModal from './NewCatModal';
import EditCatModal from './EditCatModal';
import { LiaEdit, LiaTrashSolid } from 'react-icons/lia';
import { ToastContainer } from "react-toastify";
import swal from 'sweetalert';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const CategoryTable = () => {

    const { catArr } = useSelector(state => state.category);

    const dispatch = useDispatch();

    /*=========================================*/

    const [showModal, setShowModal] = useState(false);

    const [showEditModal, setEditShowModal] = useState(false);

    // to send some data to edit modal
    const [selectedCat, setSelectedCat] = useState({ id: "", title: "" });

    /*=========================================*/

    //fetch all categories
    useEffect(() => {

        dispatch(getAllCat());

    }, []);

    /*=========================================*/

    // remove category    
    const removeCat = (id) => {

        if (!id) { return; }

        swal({
            title: "Are you sure?",
            text: "This action will permanently delete the category.",
            icon: "warning",
            buttons: ["Cancel", "Yes, delete it!"]
        }).then((willDeleteCategory) => {
            if (willDeleteCategory) {
                dispatch(deleteCat(id));
            }
        });

    };

    /*=========================================*/

    return (
        <div className='category custom-div' style={{ overflowX: "auto" }}>
            <Link className="my-table-link" onClick={() => setShowModal(true)}>
                Add new category
            </Link>
            {/* add new category modal */}
            <NewCatModal
                show={showModal}
                handleClose={() => setShowModal(false)}
            />

            {/* edit category modal */}
            <EditCatModal
                show={showEditModal}
                handleClose={() => setEditShowModal(false)}
                cat={selectedCat}
            />

            <table className="table table-bordered my-table">
                <thead>
                    <tr>
                        <th className="text-center" scope="col">Id</th>
                        <th className="text-center" scope="col">Name</th>
                        <th className="text-center" scope="col">Create At</th>
                        <th className="text-center" scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        catArr?.length > 0
                            ?
                            catArr?.map(el => (
                                <tr className="text-center" key={el._id}>
                                    <td>{el._id}</td>
                                    <td>{el.title}</td>
                                    <td>{el.createdAt.slice(0, 10)}</td>
                                    <td>
                                        <Link
                                            className="me-2">
                                            <LiaEdit
                                                onClick={() => {
                                                    // fill the state with this obj ,in order to send to editcatModal comp
                                                    setSelectedCat({ id: el._id, title: el.title });
                                                    setEditShowModal(true);
                                                }}
                                            />
                                        </Link>
                                        <button
                                            onClick={() => removeCat(el._id)}
                                            className="btn btn-link p-0"
                                        >
                                            <LiaTrashSolid className="text-danger" />
                                        </button></td>
                                </tr>
                            )) :
                            <tr>
                                <td colSpan={4} className="text-center">No categories yet!</td>
                            </tr>
                    }
                </tbody>
            </table>
            <ToastContainer autoClose={6000} />
        </div>
    )
}

export default CategoryTable;