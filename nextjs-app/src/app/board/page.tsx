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
    <div className="min-h-screen bg-gray-900 p-3 sm:p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header - Mobile first responsive */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Announcements Board</h1>
          <button
            onClick={() => setShowNewModal(true)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base"
          >
            + New Post
          </button>
        </div>

        {/* Search - Full width on mobile */}
        <div className="mb-4 sm:mb-6">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Posts - Mobile optimized cards */}
        {loading ? (
          <div className="text-white text-center py-8">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No posts found</div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-lg p-4 sm:p-6 relative"
                style={{ backgroundColor: post.color }}
              >
                {/* Edit/Delete buttons - Responsive positioning */}
                {canEditPost(post) && (
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-1 sm:gap-2">
                    <button
                      onClick={() => openEditModal(post)}
                      className="px-2 sm:px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs sm:text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="px-2 sm:px-3 py-1 bg-red-500/50 hover:bg-red-500/70 rounded text-xs sm:text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}

                {/* Title - Responsive sizing */}
                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white pr-20 sm:pr-32">
                  {post.title}
                </h2>

                {/* Body - Better line height for mobile */}
                <div className="text-sm sm:text-base text-white/90 mb-3 sm:mb-4 whitespace-pre-wrap leading-relaxed">
                  {post.body}
                </div>

                {/* Attachments - Responsive wrapping */}
                {post.attachments.length > 0 && (
                  <div className="mb-3 sm:mb-4">
                    <div className="text-xs sm:text-sm text-white/80 mb-2">Attachments:</div>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {post.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="px-2 sm:px-3 py-1 bg-white/20 rounded text-xs sm:text-sm text-white"
                        >
                          📎 {att.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meta info - Responsive text */}
                <div className="text-xs sm:text-sm text-white/70">
                  Posted by {post.author} on{' '}
                  {format(new Date(post.timeAdded), 'MMM d, yyyy h:mm a')}
                  {post.timeEdited !== post.timeAdded && (
                    <span className="block sm:inline"> (edited {format(new Date(post.timeEdited), 'MMM d, yyyy h:mm a')})</span>
                  )}
                </div>

                {/* Viewers - Scrollable on mobile if long */}
                <div className="text-xs text-white/60 mt-2 overflow-x-auto">
                  <span className="whitespace-nowrap">Visible to: {post.viewers.map((v) => v.viewer).join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New/Edit Post Modal - Mobile optimized */}
        {(showNewModal || editPost) && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
            <div className="bg-gray-800 rounded-t-lg sm:rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                {editPost ? 'Edit Post' : 'New Post'}
              </h2>

              {/* Title - Mobile optimized input */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-xs sm:text-sm text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  placeholder="Post title"
                />
              </div>

              {/* Body - Responsive textarea */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-xs sm:text-sm text-gray-300 mb-2">Message</label>
                <textarea
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500 resize-y"
                  placeholder="Post content"
                />
              </div>

              {/* Color - Touch-friendly on mobile */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-xs sm:text-sm text-gray-300 mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map(
                    (color) => (
                      <button
                        key={color}
                        onClick={() => setNewColor(color)}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded border-2 flex-shrink-0 ${
                          newColor === color ? 'border-white' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${color}`}
                      />
                    )
                  )}
                  <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded"
                    aria-label="Custom color picker"
                  />
                </div>
              </div>

              {/* Viewers - Mobile optimized selection */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm text-gray-300 mb-2">Viewers</label>

                {/* Special groups - Touch-friendly buttons */}
                <div className="mb-3">
                  <div className="text-xs text-gray-400 mb-1">Special Groups:</div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {['All Administrators', 'All Professors', 'All Users'].map((viewer) => (
                      <button
                        key={viewer}
                        onClick={() => toggleViewer(viewer)}
                        className={`px-2 sm:px-3 py-1.5 sm:py-1 rounded text-xs sm:text-sm ${
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
                  <div className="mb-3">
                    <div className="text-xs text-gray-400 mb-1">Groups:</div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {groups.map((group) => (
                        <button
                          key={group}
                          onClick={() => toggleViewer(group)}
                          className={`px-2 sm:px-3 py-1.5 sm:py-1 rounded text-xs sm:text-sm ${
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

                {/* Users - Scrollable with better mobile UX */}
                {users.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Individual Users:</div>
                    <div className="max-h-32 sm:max-h-40 overflow-y-auto border border-gray-700 rounded p-2">
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {users.map((user) => (
                          <button
                            key={user}
                            onClick={() => toggleViewer(user)}
                            className={`px-2 sm:px-3 py-1.5 sm:py-1 rounded text-xs sm:text-sm ${
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

              {/* Actions - Stacked on mobile */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <button
                  onClick={editPost ? handleUpdatePost : handleCreatePost}
                  className="w-full sm:flex-1 px-4 py-3 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="w-full sm:w-auto px-4 py-3 sm:py-2 text-sm sm:text-base bg-gray-700 text-white rounded hover:bg-gray-600"
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
