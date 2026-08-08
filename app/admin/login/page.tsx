"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    if (
      username === "admin" &&
      password === "admin123"
    ) {
      localStorage.setItem("admin", "true");
      router.push("/admin/dashboard");
    } else {
      alert("Invalid Username or Password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">

      <div className="bg-white p-8 rounded-xl shadow-xl w-[400px]">

        <h1 className="text-3xl font-bold text-center text-orange-600 mb-8">
          🔐 Admin Login
        </h1>

        <input
          className="border rounded-lg w-full p-3 mb-4"
          placeholder="Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />

        <input
          className="border rounded-lg w-full p-3 mb-6"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-lg p-3"
        >
          Login
        </button>

      </div>

    </div>
  );
}