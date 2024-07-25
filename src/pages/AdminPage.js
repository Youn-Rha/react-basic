import { Link } from "react-router-dom";
import BlogListVer2 from "../components/BlogListVer2";

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
        <BlogListVer2 isAdmin={true} />
      </div>
    </>
  );
};

export default AdminPage;
