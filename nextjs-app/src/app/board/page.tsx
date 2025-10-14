'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';

interface BoardViewer {
  postId: number;
  viewer: string;
}

interface BoardAttachment {
  id: number;
  name: string;
  localFileName: string;
  extension: string;
  username: string;
  postId: number;
  timeAdded: Date;
}

interface BoardPost {
  id: number;
  title: string;
  body: string;
  color: string;
  author: string;
  timeAdded: Date;
  timeEdited: Date;
  viewers: BoardViewer[];
  attachments: BoardAttachment[];
}

export default function BoardPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [editPost, setEditPost] = useState<BoardPost | null>(null);

  // New post form
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newColor, setNewColor] = useState('#3b82f6');
  const [selectedViewers, setSelectedViewers] = useState<string[]>(['All Administrators']);

  const [users, setUsers] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);

  useEffect(() => {
    loadPosts();
    loadUsersAndGroups();
  }, [search]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const response = await fetch(`/api/board?${params}`);
      const data = await response.json();

      if (data.success) {
        setPosts(data.data);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsersAndGroups = async () => {
    try {
      const [usersRes, groupsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/groups'),
      ]);

      const [usersData, groupsData] = await Promise.all([
        usersRes.json(),
        groupsRes.json(),
      ]);

      if (usersData.success) {
        setUsers(usersData.data.map((u: any) => u.username));
      }
      if (groupsData.success) {
        setGroups(groupsData.data.map((g: any) => g.groupName));
      }
    } catch (error) {
      console.error('Error loading users/groups:', error);
    }
  };

  const handleCreatePost = async () => {
    try {
      const response = await fetch('/api/board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          text: newBody,
          color: newColor,
          viewers: selectedViewers,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShowNewModal(false);
        setNewTitle('');
        setNewBody('');
        setNewColor('#3b82f6');
        setSelectedViewers(['All Administrators']);
        loadPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleUpdatePost = async () => {
    if (!editPost) return;

    try {
      const response = await fetch(`/api/board/${editPost.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          text: newBody,
          color: newColor,
          viewers: selectedViewers,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setEditPost(null);
        setNewTitle('');
        setNewBody('');
        setNewColor('#3b82f6');
        setSelectedViewers(['All Administrators']);
        loadPosts();
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/board/${postId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        loadPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const openEditModal = (post: BoardPost) => {
    setEditPost(post);
    setNewTitle(post.title);
    setNewBody(post.body);
    setNewColor(post.color);
    setSelectedViewers(post.viewers.map((v) => v.viewer));
  };

  const canEditPost = (post: BoardPost) => {
    return post.author === session?.user?.username || session?.user?.group?.toLowerCase().includes('admin');
  };

  const toggleViewer = (viewer: string) => {
    setSelectedViewers((prev) =>
      prev.includes(viewer)
        ? prev.filter((v) => v !== viewer)
        : [...prev, viewer]
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Announcements Board</h1>
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            New Post
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Posts */}
        {loading ? (
          <div className="text-white text-center">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-gray-400 text-center">No posts found</div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-lg p-6 relative"
                style={{ backgroundColor: post.color }}
              >
                {/* Edit/Delete buttons */}
                {canEditPost(post) && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => openEditModal(post)}
                      className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="px-3 py-1 bg-red-500/50 hover:bg-red-500/70 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}

                {/* Title */}
                <h2 className="text-2xl font-bold mb-2 text-white pr-32">
                  {post.title}
                </h2>

                {/* Body */}
                <div className="text-white/90 mb-4 whitespace-pre-wrap">
                  {post.body}
                </div>

                {/* Attachments */}
                {post.attachments.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm text-white/80 mb-2">Attachments:</div>
                    <div className="flex flex-wrap gap-2">
                      {post.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="px-3 py-1 bg-white/20 rounded text-sm text-white"
                        >
                          📎 {att.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meta info */}
                <div className="text-sm text-white/70">
                  Posted by {post.author} on{' '}
                  {format(new Date(post.timeAdded), 'MMM d, yyyy h:mm a')}
                  {post.timeEdited !== post.timeAdded && (
                    <span> (edited {format(new Date(post.timeEdited), 'MMM d, yyyy h:mm a')})</span>
                  )}
                </div>

                {/* Viewers */}
                <div className="text-xs text-white/60 mt-2">
                  Visible to: {post.viewers.map((v) => v.viewer).join(', ')}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New/Edit Post Modal */}
        {(showNewModal || editPost) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-4">
                {editPost ? 'Edit Post' : 'New Post'}
              </h2>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  placeholder="Post title"
                />
              </div>

              {/* Body */}
              <div className="mb-4">
                <label className="block text-sm text-gray-300 mb-2">Message</label>
                <textarea
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  placeholder="Post content"
                />
              </div>

              {/* Color */}
              <div className="mb-4">
                <label className="block text-sm text-gray-300 mb-2">Color</label>
                <div className="flex gap-2">
                  {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map(
                    (color) => (
                      <button
                        key={color}
                        onClick={() => setNewColor(color)}
                        className={`w-10 h-10 rounded border-2 ${
                          newColor === color ? 'border-white' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    )
                  )}
                  <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-10 h-10 rounded"
                  />
                </div>
              </div>

              {/* Viewers */}
              <div className="mb-6">
                <label className="block text-sm text-gray-300 mb-2">Viewers</label>

                {/* Special groups */}
                <div className="mb-2">
                  <div className="text-xs text-gray-400 mb-1">Special Groups:</div>
                  <div className="flex flex-wrap gap-2">
                    {['All Administrators', 'All Professors', 'All Users'].map((viewer) => (
                      <button
                        key={viewer}
                        onClick={() => toggleViewer(viewer)}
                        className={`px-3 py-1 rounded text-sm ${
                          selectedViewers.includes(viewer)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {viewer}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Groups */}
                {groups.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs text-gray-400 mb-1">Groups:</div>
                    <div className="flex flex-wrap gap-2">
                      {groups.map((group) => (
                        <button
                          key={group}
                          onClick={() => toggleViewer(group)}
                          className={`px-3 py-1 rounded text-sm ${
                            selectedViewers.includes(group)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {group}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Users */}
                {users.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Individual Users:</div>
                    <div className="max-h-40 overflow-y-auto border border-gray-700 rounded p-2">
                      <div className="flex flex-wrap gap-2">
                        {users.map((user) => (
                          <button
                            key={user}
                            onClick={() => toggleViewer(user)}
                            className={`px-3 py-1 rounded text-sm ${
                              selectedViewers.includes(user)
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300'
                            }`}
                          >
                            {user}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={editPost ? handleUpdatePost : handleCreatePost}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={!newTitle.trim() || selectedViewers.length === 0}
                >
                  {editPost ? 'Update' : 'Create'} Post
                </button>
                <button
                  onClick={() => {
                    setShowNewModal(false);
                    setEditPost(null);
                    setNewTitle('');
                    setNewBody('');
                    setNewColor('#3b82f6');
                    setSelectedViewers(['All Administrators']);
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
