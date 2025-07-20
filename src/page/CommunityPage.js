import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

import Heading from "../components/heading";
import Footer from "../components/footer";
import "./CommunityPage.css";

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [topics, setTopics] = useState({});
  const [selectedTopic, setSelectedTopic] = useState("All Posts");
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "communityPosts"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const topicCounts = {};
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const topic = data.topic || "All Posts";
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      });
      setTopics(topicCounts);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let q = query(collection(db, "communityPosts"), orderBy("timestamp", "desc"));
    if (selectedTopic !== "All Posts") {
      q = query(collection(db, "communityPosts"), where("topic", "==", selectedTopic), orderBy("timestamp", "desc"));
    }
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [selectedTopic]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content || !topic) return;

    setLoading(true);

    await addDoc(collection(db, "communityPosts"), {
      name: auth.currentUser?.displayName || "🙍 Anonymous",
      content,
      tags: tags.split(",").map(tag => tag.trim()),
      topic,
      timestamp: serverTimestamp(),
    });

    setContent("");
    setTags("");
    setTopic("");
    setShowModal(false);
    setLoading(false);
  };

  return (
    <>
      <Heading />

      <div className="community-container">
        <aside className="left-sidebar animate-slide-in">
          <h2> Popular Topics</h2>
          <ul>
            <li
              className={selectedTopic === "All Posts" ? "active" : ""}
              onClick={() => setSelectedTopic("All Posts")}
            >
              <span>🌍 All Posts</span>
              <span className="count">{Object.values(topics).reduce((a, b) => a + b, 0)}</span>
            </li>
            {Object.entries(topics).map(([topic, count]) => (
              <li
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={selectedTopic === topic ? "active" : ""}
              >
                <span> {topic}</span>
                <span className="count">{count}</span>
              </li>
            ))}
          </ul>
        </aside>

        <main className="main-feed animate-fade-in">
          <section className="header">
            <div>
              <h1> Community</h1>
              <p> Share your wins, questions & tips to grow together!</p>
            </div>
            <button onClick={() => setShowModal(true)}>➕ Create Post</button>
          </section>

          <section className="post-list">
            {posts.length === 0 ? (
              <p className="no-posts"> No posts found for this topic</p>
            ) : (
              posts.slice(0, 5).map((post) => (
                <article key={post.id} className="post-card animate-pop-in">
                  <div className="post-header">
                    <strong> {post.name}</strong> •{" "}
                    <small> {post.timestamp?.seconds && new Date(post.timestamp.seconds * 1000).toLocaleString()}</small>
                  </div>
                  <div className="tags">
                    {post.tags?.map((tag, i) => (
                      <span key={i} className="tag"> #{tag}</span>
                    ))}
                  </div>
                  <p className="message"> {post.content}</p>
                </article>
              ))
            )}
          </section>
        </main>
      </div>

      {showModal && (
        <div className="modal-overlay fade-in">
          <div className="modal scale-up">
            <h2> Create a New Post</h2>
            <form onSubmit={handlePost}>
              <textarea
                placeholder="🗣️ Share your story or ask a question..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder=" Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <input
                type="text"
                placeholder=" Topic (e.g. Career Advice)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
              <div className="modal-actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Posting..." : " Post"}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="cancel"> Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
