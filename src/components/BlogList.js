import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import Card from "../components/Card";
import { useNavigate, useLocation } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";
import propTypes from "prop-types";
import Pagination from "./Pagination";

const BlogList = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pageParam = new URLSearchParams(location.search).get("page");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfPosts, setNumberOfPosts] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [searchText, setSearchText] = useState("");

  const limit = 4;

  useEffect(() => {
    setNumberOfPages(Math.ceil(numberOfPosts / limit));
  }, [numberOfPosts]);

  const onClickPageButton = (page) => {
    navigate(`${location.pathname}?page=${page}`);
    setCurrentPage(page);
    getPosts(page);
  };

  const getPosts = useCallback(
    (page = 1) => {
      let params = {
        _page: page,
        _limit: limit,
        _sort: "id",
        _order: "asc",
        title_like: searchText,
      };

      if (!isAdmin) {
        params = { ...params, publish: true };
      }

      axios
        .get(`http://155.230.34.239:3001/posts`, {
          params,
        })
        .then((res) => {
          setNumberOfPosts(res.headers["x-total-count"]);
          setPosts(res.data);
          setLoading(false);
        });
    },
    [isAdmin, searchText]
  );

  const deleteBlog = (e, id) => {
    e.stopPropagation();
    axios.delete(`http://155.230.34.239:3001/posts/${id}`).then(() => {
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    });
  };

  useEffect(() => {
    setCurrentPage(parseInt(pageParam) || 1);
    getPosts(parseInt(pageParam) || 1);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const renderBlogList = () => {
    return posts.map((post) => {
      return (
        <Card
          key={post.id}
          title={post.title}
          onClick={() => navigate(`/blogs/${post.id}`)}
        >
          {isAdmin ? (
            <div>
              <button
                className="btn btn-danger btn-sm"
                onClick={(e) => {
                  deleteBlog(e, post.id);
                }}
              >
                Delete
              </button>
            </div>
          ) : null}
        </Card>
      );
    });
  };

  const onSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`${location.pathname}?page=1`);
      setCurrentPage(1);
      getPosts(1);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search.."
        className="form-control"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyUp={onSearch}
      />
      <hr />
      {posts.length === 0 ? (
        <div>No blog posts found</div>
      ) : (
        <>
          {renderBlogList()}
          {numberOfPages > 1 && (
            <Pagination
              currentPage={currentPage}
              numberOfPages={numberOfPages}
              onClick={onClickPageButton}
            />
          )}
        </>
      )}
    </div>
  );
};

BlogList.propTypes = {
  isAdmin: propTypes.bool,
};

// BlogList.defaultProps = {
//   isAdmin: false,
// };

export default BlogList;
