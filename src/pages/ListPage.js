import BlogList from "../components/BlogList";
import BlogListVer2 from "../components/BlogListVer2";

const ListPage = () => {
  return (
    <>
      <div>
        <div className="d-flex justify-content-between">
          <h1>Blogs</h1>
        </div>
        <BlogListVer2 />
      </div>
    </>
  );
};

export default ListPage;
