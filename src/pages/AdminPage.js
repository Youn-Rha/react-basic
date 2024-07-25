import { Link } from "react-router-dom";
import BlogList from "../components/BlogList";
import { useEffect } from "react";
import BlogList_ver2 from "../components/BlogList_ver2";

const AdminPage = () => {
  return (
    <>
      <div>
        <div className="d-flex justify-content-between">
          <h1>Admin</h1>
          <div>
            <Link to="/blogs/create" className="btn btn-success">
              Create New
            </Link>
          </div>
        </div>
        <BlogList_ver2 isAdmin={true} />
      </div>
    </>
  );
};

export default AdminPage;
