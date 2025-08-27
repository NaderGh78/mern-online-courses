import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/apiCalls/authApiCall";
import { getTeacherPlaylists } from "../../redux/apiCalls/playListApiCall";
import { useTitle } from "../../components/helpers/useTitle";
import { ToastContainer } from 'react-toastify';

/*===========================================*/
/*===========================================*/
/*===========================================*/

const Login = () => {

    useTitle(`Login`);

    const dispatch = useDispatch();

    const { currentUser, loginLoading } = useSelector(state => state.auth);

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    /*===========================================*/

    const handleSubmit = (e) => {

        e.preventDefault();

        dispatch(loginUser({ email, password }));

    };

    /*===========================================*/

    // Navigate to home page if user is logged in
    useEffect(() => {

        if (currentUser) {

            navigate("/");

        } else {

            navigate("/login");

        }

    }, [currentUser, navigate]);

    /*===========================================*/

    // Fetch playlists after login
    useEffect(() => {

        if (currentUser?._id) {

            dispatch(getTeacherPlaylists(currentUser._id));

        }

    }, [dispatch, currentUser?._id]);

    /*===========================================*/

    return (
        <div className='register custom-div'>
            <div className="container p-0">
                <div className="form-box">
                    <h3>Login Now</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
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
                        <div className="form-group">
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
                        <button
                            type="submit"
                            className="custom-link border-0"
                        >
                            {loginLoading ? "Loading..." : "Login Now"}
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer autoClose={6000} />
        </div>
    );
};

export default Login;