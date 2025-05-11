'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { useRouter } from 'next/navigation';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Geo {
  lat: string;
  lng: string;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  address: Address;
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

export default function Home() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postComments, setPostComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
        const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
        const commentsResponse = await fetch('https://jsonplaceholder.typicode.com/comments');

        if (!usersResponse.ok || !postsResponse.ok || !commentsResponse.ok) {
          throw new Error('Failed network request.');
        }

        const usersData: User[] = await usersResponse.json();
        const postsData: Post[] = await postsResponse.json();
        const commentsData: Comment[] = await commentsResponse.json();

        setUsers(usersData);
        setPosts(postsData);
        setPostComments(commentsData);
        setLoading(false);
      } catch (e) {
        setError('Failed to fetch data.');
        setLoading(false);
        console.error('Fetch error:', e);
      }
    };

    fetchData();
  }, []);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handlePostClick = async (post: Post) => {
    setSelectedPost(post);
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const commentsData: Comment[] = await response.json();
      setPostComments(commentsData);
    } catch (e) {
      console.error('Failed to fetch comments:', e);
      setPostComments([]);
    }
  };

  const handleLogout = () => {
    router.push('/login'); // Redirect to the login page
  };

  const totalUsersOptions: ApexOptions = {
    chart: { type: 'bar', height: 100 },
    xaxis: { categories: ['Users'] },
    yaxis: { title: { text: 'Count' } },
  };

  const totalPostsOptions: ApexOptions = {
    chart: { type: 'bar', height: 100 },
    xaxis: { categories: ['Posts'] },
    yaxis: { title: { text: 'Count' } },
  };

  const totalCommentsOptions: ApexOptions = {
    chart: { type: 'bar', height: 100 },
    xaxis: { categories: ['Comments'] },
    yaxis: { title: { text: 'Count' } },
  };

  const totalUsersSeries = [{ name: 'Total Users', data: [users.length] }];
  const totalPostsSeries = [{ name: 'Total Posts', data: [posts.length] }];
  const totalCommentsSeries = [{ name: 'Total Comments', data: [postComments.length] }];

  if (loading) return <div>Loading users and posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button
        onClick={handleLogout} // Logout button
        className="mb-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>

      <div className="mt-8 flex flex-wrap justify-around w-full">
        <div className="w-full md:w-1/3 p-4">
          <ReactApexChart options={totalUsersOptions} series={totalUsersSeries} type="bar" height={100} />
        </div>
        <div className="w-full md:w-1/3 p-4">
          <ReactApexChart options={totalPostsOptions} series={totalPostsSeries} type="bar" height={100} />
        </div>
        <div className="w-full md:w-1/3 p-4">
          <ReactApexChart options={totalCommentsOptions} series={totalCommentsSeries} type="bar" height={100} />
        </div>
      </div>

      <div className="mt-8 flex flex-col md:flex-row">
        <div className="mr-8">
          <h2 className="text-2xl font-bold mb-4">Users</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id} className="cursor-pointer hover:underline" onClick={() => handleUserClick(user)}>
                {user.name} ({user.username})
              </li>
            ))}
          </ul>
        </div>

        {selectedUser && (
          <div className="mt-8 md:mt-0">
            <h2 className="text-2xl font-bold mb-4">User Details</h2>
            <p>
              <strong>Username:</strong> {selectedUser.username}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedUser.phone}
            </p>
            <p>
              <strong>Address:</strong> {`${selectedUser.address.street}, ${selectedUser.address.suite}, ${selectedUser.address.city}, ${selectedUser.address.zipcode}`}
            </p>
            <h3 className="text-lg font-bold mt-4">Location on Google Map</h3>
            <iframe
              title="Google Map"
              src={`https://www.google.com/maps?q=${selectedUser.address.geo.lat},${selectedUser.address.geo.lng}&z=15&output=embed`}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        )}
      </div>

      <div className="mt-8 w-full">
        <h2 className="text-2xl font-bold mb-4">Posts</h2>
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="cursor-pointer hover:underline mb-2" onClick={() => handlePostClick(post)}>
              {post.title}
            </li>
          ))}
        </ul>

        {selectedPost && (
          <div className="mt-8 p-4 border rounded">
            <h3 className="text-xl font-bold mb-2">{selectedPost.title}</h3>
            <p className="mb-4">{selectedPost.body}</p>
            <h4 className="text-lg font-bold mb-2">Comments</h4>
            {postComments.length > 0 ? (
              <ul>
                {postComments.map((comment) => (
                  <li key={comment.id} className="mb-2 border-b pb-2">
                    <p className="font-semibold">{comment.name} ({comment.email})</p>
                    <p className="text-sm">{comment.body}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No comments for this post.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}