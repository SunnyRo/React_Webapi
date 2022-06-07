import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import CreateRoleModal from "./CreateRoleModal";
import "./css/Roles.css";
const Roles = () => {
    const [roles, setRoles] = useState();
    const [role, setRole] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const [modalOpen, setModalOpen] = useState(false);
    const onRoleChanged = (e) => setRole(e.target.value);
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getRoles = async () => {
            try {
                const response = await axiosPrivate.get("/Role/roles", {
                    signal: controller.signal,
                });
                console.log(response.data);
                isMounted && setRoles(response.data);
            } catch (err) {
                console.error(err);
                navigate("/login", {
                    state: { from: location },
                    replace: true,
                });
            }
        };

        getRoles();
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);
    const deleteRole = async (name) => {
        console.log(name);
        const deleteObject = {
            name: name,
        };
        try {
            const response = await axiosPrivate.post(
                "/Role/deleterole",
                deleteObject
            );
            console.log(response.data);
            setRoles(response.data);
        } catch (err) {
            console.error(err);
            navigate("/login", {
                state: { from: location },
                replace: true,
            });
        }
    };
    const createRole = async (name) => {
        console.log(name);
        const createObject = {
            name: name,
        };
        try {
            const response = await axiosPrivate.post(
                "/Role/createrole",
                createObject
            );
            console.log(response.data);
            setRoles(response.data);
        } catch (err) {
            console.error(err);
            navigate("/login", {
                state: { from: location },
                replace: true,
            });
        }
    };
    return (
        <article>
            {modalOpen && (
                <CreateRoleModal
                    setOpenModal={setModalOpen}
                    createRole={createRole}
                />
            )}
            <h2>Roles List</h2>
            {roles?.length ? (
                <div>
                    {roles.map((role, i) => (
                        <div className="item_container" key={i}>
                            <div className="item_name">{role?.name}</div>
                            <div className="item_button">
                                <button onClick={() => deleteRole(role?.name)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No users to display</p>
            )}
            <div className="flexGlow">
                <button
                    onClick={() => {
                        setModalOpen(true);
                    }}
                >
                    Create Role
                </button>
            </div>
        </article>
    );
};

export default Roles;
