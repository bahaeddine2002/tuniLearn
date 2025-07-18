'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/test')
      .then(res => res.json())
      .then(data => setMsg(data.message))
      .catch(() => setMsg("Couldn't reach backend 😢"));
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold text-blue-600">TuniLearn Frontend</h1>
      <p className="mt-4 text-gray-700">Message from backend: {msg}</p>
    </main>
  );
}
