import { useRef, useState, useEffect } from "react";
import AuthContext from "../context/AuthProvider";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import jwt_decode from "jwt-decode";
import { Link, useNavigate, useLocation } from "react-router-dom";
const Login = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState("");
    const [pwd, setPwd] = useState("");
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg("");
    }, [user, pwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userObject = {
            username: user,
            password: pwd,
        };
        try {
            const response = await axios.post(
                process.env.REACT_APP_LOGIN_URL,
                userObject
            );
            const accessToken = response?.data?.accessToken;
            const refreshToken = response?.data?.refreshToken;
            var decoded = jwt_decode(accessToken);
            const roles = decoded[process.env.REACT_APP_CLAIM_ROLE];
            console.log(roles);
            // let newRoles = [...roles, "User"];
            // roles = new roles();
            // console.log(roles);
            setAuth({ user, pwd, roles, accessToken, refreshToken });
            setUser("");
            setPwd("");
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg("No Server Response");
            } else if (err.response?.status === 400) {
                setErrMsg("Missing Username or Password");
            } else if (err.response?.status === 401) {
                setErrMsg("Unauthorized");
            } else {
                console.log(err);
                setErrMsg("Login Failed");
            }
            errRef.current.focus();
        }
    };
    return (
        <>
            <section>
                <p
                    ref={errRef}
                    className={errMsg ? "errmsg" : "offscreen"}
                    aria-live="assertive"
                >
                    {errMsg}
                </p>
                <h1>Sign In</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        required
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                    />
                    <button>Sign In</button>
                </form>
                <p>
                    Need an Account?
                    <br />
                    <span className="line">
                        {/*put router link here*/}
                        <a href="#">Sign Up</a>
                    </span>
                </p>
            </section>
        </>
    );
};

export default Login;
