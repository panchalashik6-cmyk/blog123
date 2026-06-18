import React, { useState, useEffect } from "react";

export default function BlogManager() {
  const [blog, setBlog] = useState({
    title: "",
    image: "",
    blog: "",
  });

  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    const savedData =
      JSON.parse(localStorage.getItem("blogs")) || [];
    setData(savedData);
  }, []);

  useEffect(() => {
    localStorage.setItem("blogs", JSON.stringify(data));
  }, [data]);

  const handleChange = (e) => {
    setBlog({
      ...blog,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!blog.title || !blog.image || !blog.blog) {
      alert("Please fill all fields");
      return;
    }

    if (editId) {
      const updatedData = data.map((item) =>
        item.id === editId
          ? { ...blog, id: editId }
          : item
      );

      setData(updatedData);
      setEditId(null);
    } else {
      const newBlog = {
        ...blog,
        id: Date.now(),
      };

      setData([...data, newBlog]);
    }

    setBlog({
      title: "",
      image: "",
      blog: "",
    });
  };

  const deleteBlog = (id) => {
    const updatedData = data.filter(
      (item) => item.id !== id
    );

    setData(updatedData);
  };

  const editBlog = (id) => {
    const selectedBlog = data.find(
      (item) => item.id === id
    );

    setBlog(selectedBlog);
    setEditId(id);
  };

  const filteredData = [...data]
    .filter((item) =>
      item.title
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "az") {
        return a.title.localeCompare(b.title);
      }

      if (sort === "za") {
        return b.title.localeCompare(a.title);
      }

      return 0;
    });

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "auto",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#333",
        }}
      >
        Blog Manager
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#f4f4f4",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          name="title"
          placeholder="Blog Title"
          value={blog.title}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={blog.image}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <textarea
          name="blog"
          rows="4"
          placeholder="Blog Content"
          value={blog.blog}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <button
          type="submit"
          style={{
            background: "#007bff",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {editId ? "Update Blog" : "Add Blog"}
        </button>
      </form>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search Blog..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "5px",
          }}
        />

        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
          style={{
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <option value="">Sort</option>
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
        </select>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        {filteredData.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />

            <h3>{item.title}</h3>

            <p>{item.blog}</p>

            <button
              onClick={() =>
                editBlog(item.id)
              }
              style={{
                background: "green",
                color: "white",
                border: "none",
                padding: "8px 12px",
                marginRight: "10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Edit
            </button>

            <button
              onClick={() =>
                deleteBlog(item.id)
              }
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <h2
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          No Blog Found
        </h2>
      )}
    </div>
  );
}