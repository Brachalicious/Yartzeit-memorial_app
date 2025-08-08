import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("user", JSON.stringify(userCredential.user));
      navigate("/yahrzeit");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
    setLoading(false);
  };

  // Only show login UI, hide all app/dashboard content
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-2"
      style={{
        background: "url('/kotel_login.png') center center / cover no-repeat, linear-gradient(135deg, #1e3c72 0%, #f7b42c 100%)",
      }}
    >
      <div className="flex flex-col items-center mb-8 w-full">
        <img
          src="/mysticminded-logo no backround copy.png"
          alt="Mystic Minded"
          className="h-20 md:h-28 lg:h-32 object-contain mb-4 drop-shadow-xl"
        />
        <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-blue-700 to-yellow-400 bg-clip-text text-transparent mb-2">
          Yartzeit Memorial App
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-blue-700 via-yellow-400 to-blue-900 p-8 rounded-lg shadow-lg flex flex-col w-full max-w-md mx-auto"
        style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)" }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>
        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mb-4 p-3 rounded border border-blue-300 focus:outline-none w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mb-6 p-3 rounded border border-blue-300 focus:outline-none w-full"
          required
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-700 to-yellow-400 text-white font-bold py-2 rounded shadow w-full"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <button
          type="button"
          className="mt-4 bg-gradient-to-r from-yellow-400 to-blue-700 text-white font-bold py-2 rounded shadow w-full"
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
