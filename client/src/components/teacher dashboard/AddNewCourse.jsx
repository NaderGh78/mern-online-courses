import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTeacherPlaylists } from "../../redux/apiCalls/playListApiCall";
import { addNewCourse } from "../../redux/apiCalls/coursesApiCall";
import { getAllCat } from "../../redux/apiCalls/categoryApiCall";
import { useTitle } from "../helpers/useTitle";
import { ToastContainer, toast } from "react-toastify";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const AddNewCourse = () => {

  useTitle(`New Course`);

  const dispatch = useDispatch();

  const { teacherPlaylists, playlistLoading } = useSelector(state => state.playlists);

  const { currentUser } = useSelector(state => state.auth);

  const { courseLoading } = useSelector(state => state.courses);

  const [videoTitle, setVideoTitle] = useState("");

  const [videoLink, setVideoLink] = useState("");

  const [playlistId, setPlaylistId] = useState("");

  const [description, setDescription] = useState("");

  const [file, setFile] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);

  /*=========================================*/

  // Fetch teacher playlists
  useEffect(() => {

    if (currentUser?._id) {

      dispatch(getTeacherPlaylists(currentUser?._id));

    }

    dispatch(getAllCat());

  }, [dispatch, currentUser?._id]);

  /*=========================================*/

  const handleFileChange = (e) => {

    const selectedFile = e.target.files[0];

    if (selectedFile) {

      setFile(selectedFile);

      setImagePreview(URL.createObjectURL(selectedFile));

    }

  };

  /*=========================================*/

  const addNewCourseHandler = (e) => {

    e.preventDefault();

    if (!playlistId) {

      toast.error("No playlist selected! Please choose one.");

      return;

    }

    const selectedPlaylist = teacherPlaylists.find(p => p._id === playlistId);

    const formData = new FormData();

    formData.append("videoTitle", videoTitle);

    formData.append("videoLink", videoLink);

    file && formData.append("tutorialImage", file);

    formData.append("playlistId", selectedPlaylist._id);

    formData.append("description", description);

    formData.append("playlistCategory", selectedPlaylist.category || "");

    dispatch(addNewCourse(selectedPlaylist._id, formData)).then((res) => {

      if (res?.success) {

        setVideoTitle("");

        setVideoLink("");

        setFile(null);

        setImagePreview(null);

        setPlaylistId("");

        setDescription("");

      }

    });

  };

  /*=========================================*/

  return (
    <div className="add-new-course">
      <div className="form-box">
        <h3>New Course</h3>
        <form onSubmit={addNewCourseHandler}>
          {/* Course Title */}
          <div className="form-group">
            <label>Course Title <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Enter course title"
            />
          </div>

          {/* Course Video Link */}
          <div className="form-group">
            <label>Course Video Link <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              placeholder="Enter video link"
            />
          </div>

          {/* Playlist Select */}
          <div className="form-group">
            <label>Select Playlist <span className="text-danger">*</span></label>
            <select
              className="form-select"
              value={playlistId}
              onChange={(e) => setPlaylistId(e.target.value)}
            >
              <option value="">-- Select Playlist --</option>
              {playlistLoading ? (
                <option>Loading playlists...</option>
              ) : (
                teacherPlaylists?.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.title} {p.category ? `(${p.category})` : ""}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Course Image */}
          <div className="form-group">
            <label>Course Image <span className="text-danger">*</span></label>
            <input
              type="file"
              className="form-control-file"
              onChange={handleFileChange}
              accept="image/*"
            />
            {imagePreview
              &&
              <img src={imagePreview || "/assets/images/no-picture.jpg"}
                alt="Preview"
                style={{ width: "200px", marginTop: "10px" }}
              />}
          </div>

          <div className="form-group">
            <label>Course description <span className="text-danger">*</span></label>
            <textarea
              className="form-control my-textarea"
              rows={5}
              id="tutorial-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter course description"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button type="submit" className="custom-link border-0" disabled={courseLoading}>
            {courseLoading ? "Adding..." : "Add Course"}
          </button>
        </form>
      </div>
      <ToastContainer autoClose={10000} />
    </div>
  );
};

export default AddNewCourse;