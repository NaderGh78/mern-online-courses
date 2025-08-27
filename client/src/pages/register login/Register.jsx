import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { hideSuccesRegisterMsg } from "../../redux/slices/authSlice";
import { registerUser } from "../../redux/apiCalls/authApiCall";
import { ToastContainer } from 'react-toastify';
import { useTitle } from "../../components/helpers/useTitle";
import swal from "sweetalert";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const Register = () => {

    // get the page title
    useTitle(`Register`);

    const dispatch = useDispatch();

    const { registerMessage, registerLoading } = useSelector(state => state.auth);

    const navigate = useNavigate();

    const [username, setUsername] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [confPassword, setConfPassword] = useState("");

    const [file, setFile] = useState(null);

    const [imagePreview, setImagePreview] = useState(null);

    const [role, setRole] = useState('');

    const [profession, setProfession] = useState('');

    /*=========================================*/

    const roleHandler = (e) => {
        setRole(e.target.value)
    }

    /*=========================================*/

    const handleFileChange = (e) => {

        const selectedFile = e.target.files[0];

        if (selectedFile) {

            setFile(selectedFile);

            setImagePreview(URL.createObjectURL(selectedFile));

        }

    };

    /*=========================================*/

    const handleSubmit = (e) => {

        e.preventDefault();

        var formData = new FormData();

        formData.append("username", username);

        formData.append("email", email);

        formData.append("password", password);

        formData.append("confirmPassword", confPassword);

        formData.append("role", role);

        // if select other role it will show the profession input,append to formData
        if (role === "Other" && profession) {
            formData.append("profession", profession);
        }

        file && formData.append("profilePhoto", file);

        dispatch(registerUser(formData));

    }

    /*=========================================*/

    // in case there are a succefully register , show swal to navigate to login page
    if (registerMessage) {
        swal({
            title: registerMessage,
            icon: "success"
        }).then(isOk => {
            if (isOk) {
                navigate("/login");
                setUsername("");
                setEmail("");
                setPassword("");
                setFile(null);
                setImagePreview(null);
                // Clear registerMessage from the Redux store after success
                dispatch(hideSuccesRegisterMsg());
            }
        })
    }

    /*=========================================*/

    // prevent the success msg show again in case the user back to the register page
    useEffect(() => {

        return () => {
            if (registerMessage) {
                dispatch(hideSuccesRegisterMsg());
            }
        };

    }, [registerMessage]);

    /*=========================================*/

    return (
        <div className='register custom-div'>
            <div className="container p-0">
                <div className="form-box">
                    <h3>Register Now</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 col-sm-12">
                                <label htmlFor="name">
                                    your name <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="enter your name"
                                />
                            </div>
                            <div className="col-md-6 col-sm-12">
                                <label htmlFor="email">
                                    your email <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="enter your email"
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 col-sm-12">
                                <label htmlFor="password">
                                    your password <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="enter your password"
                                />
                            </div>
                            <div className="col-md-6 col-sm-12">
                                <label htmlFor="confPass">
                                    confirm password <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confPass"
                                    value={confPassword}
                                    onChange={(e) => setConfPassword(e.target.value)}
                                    placeholder="confirm your password"
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <label htmlFor="file">
                                    select profile <span className="text-danger">*</span>
                                </label>
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
                                <label htmlFor="role">select your role</label>
                                <select className="form-select" value={role} id="role" onChange={roleHandler}>
                                    <option value="">Select your role</option>
                                    <option value="Teacher">Teacher</option>
                                    <option value="Student">Student</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="col-md-6 col-sm-12">
                                {
                                    // if select role and role equaly [other] show the profession input
                                    role && role === "Other"
                                        ?
                                        <>
                                            <div className="form-group">
                                                <label htmlFor="profession">
                                                    your profession
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="profession"
                                                    value={profession}
                                                    onChange={(e) => setProfession(e.target.value)}
                                                    placeholder="enter your profesion"
                                                />
                                            </div>
                                        </>
                                        :
                                        ""
                                }
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 col-sm-12">
                                {imagePreview && (
                                    <div className="my-4">
                                        <img
                                            src={imagePreview}
                                            alt="Course Preview"
                                            className="rounded-lg"
                                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="custom-link border-0"
                        >
                            {registerLoading ? "Loading..." : "Register Now"}
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer autoClose={6000} />
        </div>
    )
}

export default Register;