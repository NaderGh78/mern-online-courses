import "./update-user-profile.css";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateUser } from "../../redux/apiCalls/profileApiCall";
import { useTitle } from "../../components/helpers/useTitle";
import { ToastContainer } from 'react-toastify';
import Spinner from "../../components/common/spinner/Spinner";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const UpdateUserProfile = () => {

    useTitle(`Update User`);

    const dispatch = useDispatch();

    const { id } = useParams();

    const { profile, loading } = useSelector(state => state.profile);

    const [localLoading, setLocalLoading] = useState(true);

    const [username, setUserName] = useState("");

    const [email, setEmail] = useState("");

    const [role, setRole] = useState("");

    const [profession, setProfession] = useState("");

    const [image, setImage] = useState(null);

    const [oldPassword, setOldPassword] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [file, setFile] = useState(null);

    const [imagePreview, setImagePreview] = useState(null);

    /*=========================================*/

    useEffect(() => {

        if (id) {

            dispatch(getProfile(id));

        }

    }, [dispatch, id]);

    /*=========================================*/

    // Handle file change for image upload
    const handleFileChange = (e) => {

        const selectedFile = e.target.files[0];

        if (selectedFile) {

            setFile(selectedFile);

            setImagePreview(URL.createObjectURL(selectedFile));

        }

    };

    /*=========================================*/

    useEffect(() => {

        if (profile) {

            setUserName(profile.username || "");

            setEmail(profile.email || "");

            setRole(profile.role || "");

            setProfession(profile.profession || "");

            setImagePreview(profile.profilePhoto?.url);

            setLocalLoading(false);
        }

    }, [profile]);

    /*=========================================*/

    const handleRoleChange = (e) => {

        setRole(e.target.value);

        if (e.target.value !== "Other") {
            setProfession("");
        }

    };

    /*=========================================*/

    const handleSubmit = async (e) => {

        e.preventDefault();

        const formData = new FormData();

        formData.append("username", username);

        formData.append("email", email);

        formData.append("role", role);

        file && formData.append("profilePhoto", file);

        if (role === "Other") {
            formData.append("profession", profession);
        }

        if (image) {
            formData.append("profilePhoto", image);
        }

        if (oldPassword) {
            formData.append("oldPassword", oldPassword);
        }

        if (newPassword) {

            formData.append("newPassword", newPassword);

            formData.append("confirmPassword", confirmPassword);

        }

        await dispatch(updateUser(profile?._id, formData));

    };

    /*=========================================*/

    if (localLoading) return <Spinner />;
    return (
        <div className='update-user custom-div'>
            <div className="container p-0">
                <div className="form-box">
                    <h3>Update Profile</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 col-sm-12">
                                <label htmlFor="name">Update Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    value={username}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6 col-sm-12">
                                <label htmlFor="email">Update Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 col-sm-12">
                                <label htmlFor="password">Old Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    placeholder="Enter your old password"
                                />
                            </div>
                            <div className="col-md-6 col-sm-12">
                                <label htmlFor="newPass">New Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="newPass"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter your new password"
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 col-sm-12">
                                <label htmlFor="confirmPass">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPass"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your new password"
                                />
                            </div>
                            <div className="col-md-6 col-sm-12">
                                <label htmlFor="file">Update Picture</label>
                                <input
                                    type="file"
                                    className="form-control-file w-100"
                                    id="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 col-sm-12">
                                <label htmlFor="role">Select Role</label>
                                <select
                                    className="form-select"
                                    id="role"
                                    value={role}
                                    onChange={handleRoleChange}
                                >
                                    <option value="">Select your role</option>
                                    <option value="Teacher">Teacher</option>
                                    <option value="Student">Student</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            {role === "Other" && (
                                <div className="col-md-6 col-sm-12">
                                    <label htmlFor="profession">Your Profession</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="profession"
                                        value={profession}
                                        onChange={(e) => setProfession(e.target.value)}
                                        placeholder="Enter your profession"
                                    />
                                </div>
                            )}

                            {imagePreview && (
                                <div className="my-4">
                                    <img
                                        src={imagePreview}
                                        alt="Profle Preview"
                                        className="rounded-lg"
                                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                    />
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="custom-link border-0"
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Update Profile"}
                        </button >
                    </form>
                </div>
            </div>
            <ToastContainer autoClose={6000} />
        </div>
    );
};

export default UpdateUserProfile; 