import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";

const CrisisManagementPage: React.FC = () => {
  const [tools, setTools] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchTools = async () => {
    if (!user) return;
    setLoading(true);
    const q = query(collection(db, "crisis_tools"), where("userId", "==", user.uid));
    const snapshot = await getDocs(q);
    setTools(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    await addDoc(collection(db, "crisis_tools"), {
      userId: user.uid,
      title,
      description,
      link,
      createdAt: new Date().toISOString()
    });
    setTitle("");
    setDescription("");
    setLink("");
    await fetchTools();
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-red-700">Crisis Management Tools</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8 space-y-4">
        <input
          type="text"
          placeholder="Tool Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />
        <input
          type="url"
          placeholder="Helpful Link (optional)"
          value={link}
          onChange={e => setLink(e.target.value)}
          className="w-full p-3 border rounded"
        />
        <button type="submit" className="bg-red-600 text-white font-bold py-2 px-6 rounded shadow" disabled={loading}>
          {loading ? "Saving..." : "Add Tool"}
        </button>
      </form>
      <div>
        <h2 className="text-xl font-bold mb-4 text-red-600">Your Uploaded Crisis Tools</h2>
        {tools.length === 0 ? (
          <p className="text-gray-500">No tools uploaded yet.</p>
        ) : (
          <ul className="space-y-4">
            {tools.map(tool => (
              <li key={tool.id} className="bg-red-50 p-4 rounded shadow">
                <h3 className="font-bold text-lg text-red-800">{tool.title}</h3>
                <p className="text-gray-700 mb-2">{tool.description}</p>
                {tool.link && (
                  <a href={tool.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Helpful Link</a>
                )}
                <p className="text-xs text-gray-400 mt-2">Uploaded: {new Date(tool.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CrisisManagementPage;
