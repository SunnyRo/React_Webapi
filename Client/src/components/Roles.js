import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import CreateRoleModal from "./CreateRoleModal";
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
                <ul>
                    {roles.map((role, i) => (
                        <li className="item_container" key={i}>
                            {role?.name}
                            <button onClick={() => deleteRole(role?.name)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
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
