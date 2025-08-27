import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateCat } from "../../redux/apiCalls/categoryApiCall";
import { Modal, Button } from "react-bootstrap";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const EditCatModal = ({ show, handleClose, cat }) => {

    const dispatch = useDispatch();

    const [title, setTitle] = useState("");

    /*=========================================*/

    useEffect(() => {

        if (cat?.title) {

            setTitle(cat.title);

        }

    }, [cat]);

    /*=========================================*/

    // category edit
    const editCat = () => {

        // close the modal when finish
        dispatch(updateCat(cat.id, title)).then(() => {

            handleClose();

        });

    }

    /*=========================================*/

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Category name"
                    className="form-control" />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button
                    variant="primary"
                    onClick={editCat}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditCatModal;