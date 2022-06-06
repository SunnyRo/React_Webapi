import { Link } from "react-router-dom";
import Roles from "./Roles";
import UserRoles from "./UserRoles";
const Admin = () => {
    return (
        <section>
            <h1>Admins Page</h1>
            <br />
            <Roles />
            <UserRoles />

            <br />
            <div className="flexGrow">
                <Link to="/">Home</Link>
            </div>
        </section>
    );
};

export default Admin;
