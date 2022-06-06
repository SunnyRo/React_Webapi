import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import AddRoleModal from "./AddRoleModal";
import useAuth from "../hooks/useAuth";
const UserRoles = () => {
    const { setAuth } = useAuth();
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
                const response = await axiosPrivate.get("/Role/userroles", {
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
    const RemoveRole = async (name) => {
        console.log(name);
        const RemoveObject = {
            userName: roles[0].user,
            roleName: name,
        };
        try {
            const response = await axiosPrivate.post(
                "/Role/removerole",
                RemoveObject
            );
            console.log(response.data);
            const roles = response?.data;
            setRoles(roles);
            // setAuth((prev) => {
            //     console.log(JSON.stringify(prev));
            //     return { ...prev, roles: roles };
            // });
        } catch (err) {
            console.error(err);
            navigate("/login", {
                state: { from: location },
                replace: true,
            });
        }
    };
    const AddRole = async (name) => {
        console.log(name);
        const AddObject = {
            userName: roles[0].user,
            roleName: name,
        };
        console.log(AddObject);
        try {
            const response = await axiosPrivate.post(
                "/Role/addrole",
                AddObject
            );
            console.log(response.data);
            const roles = response?.data;
            setRoles(roles);
            // setAuth((prev) => {
            //     console.log(JSON.stringify(prev));
            //     return { ...prev, roles: roles };
            // });
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
                <AddRoleModal setOpenModal={setModalOpen} AddRole={AddRole} />
            )}
            <h2>My Roles</h2>
            {roles?.length ? (
                <ul>
                    {roles.map((role, i) => (
                        <li key={i}>
                            {role?.role}
                            <button onClick={() => RemoveRole(role?.role)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>I have no roles!!!</p>
            )}
            <div className="flexGlow">
                <button
                    onClick={() => {
                        setModalOpen(true);
                    }}
                >
                    Add Role
                </button>
            </div>
        </article>
    );
};

export default UserRoles;
