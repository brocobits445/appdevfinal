'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export default function UserPage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login'); 
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
          const commentsResponse = await fetch('https://jsonplaceholder.typicode.com/comments');

          if (!postsResponse.ok || !commentsResponse.ok) {
            throw new Error('Failed to fetch data.');
          }

          const postsData: Post[] = await postsResponse.json();
          const commentsData: Comment[] = await commentsResponse.json();

          setPosts(postsData.filter((post) => post.userId === user.id));
          setComments(commentsData.filter((comment) =>
            postsData.some((post) => post.id === comment.postId && post.userId === user.id)
          ));
        } catch (error) {
          console.error('Error fetching posts or comments:', error);
        }
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    router.push('/login'); 
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 p-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-blue-100 p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Welcome, {user.name}
          </h1>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold shadow hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Your Posts</h2>
          {posts.length > 0 ? (
            <ul className="space-y-4">
              {posts.map((post) => (
                <li key={post.id} className="p-4 border rounded-xl shadow bg-blue-50">
                  <h3 className="font-bold text-lg text-blue-700">{post.title}</h3>
                  <p className="text-gray-700">{post.body}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">You have no posts.</p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-green-700">Your Comments</h2>
          {comments.length > 0 ? (
            <ul className="space-y-4">
              {comments.map((comment) => (
                <li key={comment.id} className="p-4 border rounded-xl bg-green-50">
                  <p className="font-semibold text-green-700">{comment.body}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">You have no comments.</p>
          )}
        </div>
      </div>
    </main>
  );
}