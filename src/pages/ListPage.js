import BlogList from "../components/BlogList";
import BlogList_ver2 from "../components/BlogList_ver2";

const ListPage = () => {
  return (
    <>
      <div>
        <div className="d-flex justify-content-between">
          <h1>Blogs</h1>
        </div>
        <BlogList_ver2 />
      </div>
    </>
  );
};

export default ListPage;
