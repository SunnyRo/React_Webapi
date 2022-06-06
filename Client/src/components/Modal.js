import React from "react";
import "./css/Modal.css";
import { useState } from "react";
function Modal({ setOpenModal, createRole }) {
    const [role, setRole] = useState();
    const onRoleChanged = (e) => setRole(e.target.value);
    const submit = () => {
        createRole(role);
        setOpenModal(false);
    };
    return (
        <div className="modal">
            <div className="modal_content">
                <span
                    className="close"
                    onClick={() => {
                        setOpenModal(false);
                    }}
                >
                    &times;
                </span>
                <div className="heading">Add Role</div>
                <label className="label_container">
                    <div className="role">Name:</div>
                    <input
                        className="role_input"
                        type="text"
                        required
                        name="Role Name"
                        value={role}
                        onChange={onRoleChanged}
                    />
                </label>
                <br />
                <br />
                <input
                    className="submit_input"
                    type="submit"
                    onClick={() => submit()}
                />
            </div>
        </div>
    );
}

export default Modal;
