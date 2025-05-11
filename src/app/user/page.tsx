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
    return <div>Loading...</div>;
  }

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <h2 className="text-xl font-semibold mt-6">Your Posts</h2>
      <ul className="list-disc pl-6">
        {posts.map((post) => (
          <li key={post.id} className="mb-4">
            <h3 className="font-bold">{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-6">Your Comments</h2>
      <ul className="list-disc pl-6">
        {comments.map((comment) => (
          <li key={comment.id} className="mb-4">
            <p>{comment.body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}