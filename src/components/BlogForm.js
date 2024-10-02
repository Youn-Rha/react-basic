import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import propTypes from "prop-types";

const BlogFrom = ({ editing = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [body, setBody] = useState("");
  const [originalBody, setOriginalBody] = useState("");
  const [publish, setPublish] = useState(false);
  const [originalPublish, setOriginalPublish] = useState(false);

  useEffect(() => {
    if (editing) {
      axios.get(`http://155.230.34.239:3001/posts/${id}`).then((res) => {
        setTitle(res.data.title);
        setOriginalTitle(res.data.title);
        setBody(res.data.body);
        setOriginalBody(res.data.body);
        setPublish(res.data.publish);
        setOriginalPublish(res.data.publish);
      });
    }
  }, [id, editing]);

  const isEdited = () => {
    return (
      title !== originalTitle ||
      body !== originalBody ||
      publish !== originalPublish
    );
  };

  const goback = () => {
    if (editing) {
      navigate(`/blogs/${id}`);
    } else {
      navigate("/blogs");
    }
  };

  const onSubmit = () => {
    if (editing) {
      axios
        .put(`http://155.230.34.239:3001/posts/${id}`, {
          title,
          body,
          publish,
        })
        .then((res) => {
          navigate(`/blogs/${id}`);
        });
    } else {
      // fetch('http://155.230.34.239:3001/posts',{
      //   method: "POST",
      //   body: JSON.stringify({
      //     title,
      //     body
      //   })
      // }
      // )
      //   .then((response) => response.json())
      // //   .then((result) => console.log(result));
      // fetch('http://155.230.34.239:3001/posts')
      //   .then((response) => response.json())
      //   .then((result) => console.log(result));
      axios
        .post("http://155.230.34.239:3001/posts", {
          title,
          body,
          publish,
          createdAt: Date.now(),
        })
        .then(() => {
          navigate("/admin");
        });
      // axios.get('http://155.230.34.239:3001/posts')
      //   .then(function(response){
      //     console.log(response);
      //   })
    }
  };

  const onChangePublish = (e) => {
    setPublish(e.target.checked);
    //setOriginalPublish(e.target.checked);
  };

  return (
    <div>
      <h1>{editing ? "Edit" : "Create"} a blog post</h1>
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          className="form-control"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Body</label>
        <textarea
          className="form-control"
          value={body}
          onChange={(event) => {
            setBody(event.target.value);
          }}
          rows="10"
        />
      </div>
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          checked={publish}
          onChange={onChangePublish}
        />
        <label className="form-check-label">Publish</label>
      </div>
      <button
        className="btn btn-primary"
        onClick={onSubmit}
        disabled={editing && !isEdited()}
      >
        {editing ? "Edit" : "Post"}
      </button>
      <button className="btn btn-danger ms-2" onClick={goback}>
        Cancel
      </button>
    </div>
  );
};

BlogFrom.propTypes = {
  editing: propTypes.bool,
};

// BlogFrom.defaultProps = {
//   editing: false,
// };

export default BlogFrom;
