import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import Card from "../components/Card";
import { useNavigate, useLocation } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";
import propTypes from "prop-types";
import Pagination from "./Pagination";
import { usePagination } from "../hooks/usePagination";

const BlogListVer2 = ({ isAdmin = false }) => {
  const limit = 5;

  const {
    currentPage,
    numberOfPages,
    setCurrentPage,
    handleClickPageButton,
    setNumberOfPosts,
  } = usePagination(limit);

  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const fetchPosts = () => {
    axios.get(`http://155.230.34.239:3001/posts`).then((res) => {
      isAdmin
        ? setNumberOfPosts(res.data.length)
        : setNumberOfPosts(res.data.filter((d) => d.publish).length);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const getPosts = useCallback(
    (page = 1) => {
      const adjustedPage = page - 1;
      let params = {
        page: adjustedPage,
        size: limit,
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
          console.log(res);
          setPosts(res.data);
          setLoading(false);
        });
    },
    [isAdmin, searchText]
  );

  useEffect(() => {
    getPosts(currentPage);
  }, [getPosts, currentPage]);

  const deleteBlog = (e, id) => {
    e.stopPropagation();
    axios.delete(`http://155.230.34.239:3001/posts/${id}`).then(() => {
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const renderBlogList = () => {
    return posts
      .filter((post) => {
        return isAdmin || post.publish;
      })
      .map((post) => {
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
              onClick={handleClickPageButton}
            />
          )}
        </>
      )}
    </div>
  );
};

BlogListVer2.propTypes = {
  isAdmin: propTypes.bool,
};

// BlogList.defaultProps = {
//   isAdmin: false,
// };

export default BlogListVer2;
