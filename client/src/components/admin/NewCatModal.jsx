import { useState } from "react";
import { useDispatch } from "react-redux";
import { addNewCat } from "../../redux/apiCalls/categoryApiCall";
import { Modal, Button } from "react-bootstrap";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const NewCatModal = ({ show, handleClose }) => {

    const [title, setTitle] = useState("");

    const dispatch = useDispatch();

    //add new category
    const newCat = () => {

        dispatch(addNewCat(title)).then((res) => {

            if (res.success) {

                setTitle("");

            }

        });

    }

    /*=========================================*/

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Category name"
                    className="form-control" />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => newCat(title)}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default NewCatModal;