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
    router.push('/login'); 
  };

const totalUsersOptions: ApexOptions = {
  chart: { type: 'bar', height: 100, toolbar: { show: false } },
  xaxis: { categories: ['Users'] },
  yaxis: { title: { text: 'Count' } },
  colors: ['#2563eb'],
  plotOptions: { bar: { borderRadius: 6 } },
  dataLabels: { enabled: false },
};

const totalPostsOptions: ApexOptions = {
  chart: { type: 'bar', height: 100, toolbar: { show: false } },
  xaxis: { categories: ['Posts'] },
  yaxis: { title: { text: 'Count' } },
  colors: ['#059669'],
  plotOptions: { bar: { borderRadius: 6 } },
  dataLabels: { enabled: false },
};

const totalCommentsOptions: ApexOptions = {
  chart: { type: 'bar', height: 100, toolbar: { show: false } },
  xaxis: { categories: ['Comments'] },
  yaxis: { title: { text: 'Count' } },
  colors: ['#f59e42'],
  plotOptions: { bar: { borderRadius: 6 } },
  dataLabels: { enabled: false },
};

  const totalUsersSeries = [{ name: 'Total Users', data: [users.length] }];
  const totalPostsSeries = [{ name: 'Total Posts', data: [posts.length] }];
  const totalCommentsSeries = [{ name: 'Total Comments', data: [postComments.length] }];

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading users and posts...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">Error: {error}</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-br from-blue-50 to-blue-200 p-8">
      <button
        onClick={handleLogout}
        className="mb-8 px-6 py-2 bg-red-500 text-white rounded-lg font-semibold shadow hover:bg-red-600 transition"
      >
        Logout
      </button>

      <div className="mt-8 flex flex-wrap justify-around w-full max-w-5xl gap-4">
        <div className="w-full md:w-1/3 p-4">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <ReactApexChart options={totalUsersOptions} series={totalUsersSeries} type="bar" height={100} />
            <div className="text-center font-semibold text-blue-700 mt-2">Total Users</div>
          </div>
        </div>
        <div className="w-full md:w-1/3 p-4">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <ReactApexChart options={totalPostsOptions} series={totalPostsSeries} type="bar" height={100} />
            <div className="text-center font-semibold text-green-700 mt-2">Total Posts</div>
          </div>
        </div>
        <div className="w-full md:w-1/3 p-4">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <ReactApexChart options={totalCommentsOptions} series={totalCommentsSeries} type="bar" height={100} />
            <div className="text-center font-semibold text-yellow-700 mt-2">Total Comments</div>
          </div>
        </div>
      </div>

      <div className="mt-8 w-full max-w-6xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">Users</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-4 border rounded-xl shadow-md bg-white text-center cursor-pointer hover:shadow-lg transition"
              onClick={() => handleUserClick(user)}
            >
              <h3 className="font-bold text-lg text-blue-700">{user.name}</h3>
              <p className="text-gray-600">({user.username})</p>
            </div>
          ))}
        </div>

        {selectedUser && (
          <div className="mt-8 p-6 border rounded-xl shadow-md bg-white">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">User Details</h2>
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
            <h3 className="text-lg font-bold mt-4 text-blue-700">Location on Google Map</h3>
            <iframe
              title="Google Map"
              src={`https://www.google.com/maps?q=${selectedUser.address.geo.lat},${selectedUser.address.geo.lng}&z=15&output=embed`}
              width="100%"
              height="300"
              className="rounded-xl border"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        )}
      </div>

      <div className="mt-8 w-full max-w-6xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-700">Posts</h2>
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-6 border rounded-xl shadow-md bg-white cursor-pointer hover:shadow-lg transition"
              onClick={() => handlePostClick(post)}
            >
              <h3 className="font-bold text-lg mb-2 text-green-700">{post.title}</h3>
              <p className="text-gray-700">{post.body}</p>
            </div>
          ))}
        </div>

        {selectedPost && (
          <div className="mt-8 p-6 border rounded-xl shadow-md bg-white">
            <h3 className="text-xl font-bold mb-2 text-green-700">{selectedPost.title}</h3>
            <p className="mb-4">{selectedPost.body}</p>
            <h4 className="text-lg font-bold mb-2 text-yellow-700">Comments</h4>
            {postComments.length > 0 ? (
              <ul className="space-y-4">
                {postComments.map((comment) => (
                  <li key={comment.id} className="p-4 border rounded bg-gray-100">
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