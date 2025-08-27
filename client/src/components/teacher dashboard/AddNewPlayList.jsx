import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewPlaylist } from "../../redux/apiCalls/playListApiCall";
import { getAllCat } from "../../redux/apiCalls/categoryApiCall";
import { useTitle } from "../helpers/useTitle";
import { ToastContainer } from 'react-toastify';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const AddNewPlayList = () => {

    // get the page title
    useTitle(`New Playlist`);

    const dispatch = useDispatch();

    const { playlistLoading } = useSelector(state => state.playlists);

    const { catArr } = useSelector(state => state.category);

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [category, setCategory] = useState("");

    const [file, setFile] = useState(null);

    const [imagePreview, setImagePreview] = useState(null);

    /*=========================================*/

    const handleFileChange = (e) => {

        const selectedFile = e.target.files[0];

        if (selectedFile) {

            setFile(selectedFile);

            setImagePreview(URL.createObjectURL(selectedFile));

        }
    };

    /*=========================================*/

    const addNewPlayListHandler = (e) => {

        e.preventDefault();

        var formData = new FormData();

        formData.append("title", title);

        formData.append("description", description);

        formData.append("category", category);

        file && formData.append("mainPlaylistImage", file);

        dispatch(addNewPlaylist(formData)).then((res) => {

            if (res.success) {

                // Clear fields on success only
                setTitle('');

                setDescription('');

                setCategory('');

                setFile(null);

                setImagePreview(null);

            }

        });

    }

    /*=========================================*/

    //fetch all categories
    useEffect(() => {

        dispatch(getAllCat());

    }, []);

    /*=========================================*/

    return (
        <div className="add-new-playlist">
            <div className="form-box">
                <h3>New Playlist</h3>
                <form onSubmit={addNewPlayListHandler}>
                    <label htmlFor="category">Category</label>
                    <select
                        className="form-select"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Select playlist category</option>
                        {
                            catArr.length > 0 ?
                                catArr.map(el => (<option value={el.title} key={el._id}>{el.title}</option>))
                                :
                                <option value="">No categories yet!</option>
                        }
                    </select>

                    <div className="form-group">
                        <label htmlFor="title">
                            Title <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter playlist title"
                        />
                    </div>

                    <div className="form-group file-input">
                        <label htmlFor="main-image">
                            Playlist Image <span className="text-danger">*</span>
                        </label>
                        <input
                            type="file"
                            className="form-control-file"
                            id="main-image"
                            onChange={handleFileChange}
                        />
                        {imagePreview && (
                            <div className="my-4">
                                <img
                                    src={imagePreview}
                                    alt="Playlist Preview"
                                    className="rounded-lg"
                                    style={{ width: '200px', height: 'auto', objectFit: 'cover' }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="tutorial-desc">
                            Description  <span className="text-danger">*</span>
                        </label>
                        <textarea
                            className="form-control my-textarea"
                            rows={5}
                            id="tutorial-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter playlist description"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="custom-link border-0"
                    >
                        {playlistLoading ? "Adding..." : "Add Playlist"}
                    </button>
                </form>
            </div>
            <ToastContainer autoClose={10000} />
        </div>
    )
}

export default AddNewPlayList; 