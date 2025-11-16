import React, { useState, useContext, useMemo } from 'react';
import { PostContext } from '../../App';
import { PinContext } from '../../App';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import AdminPostForm from '../../components/admin/AdminPostForm';
import { Post, PinnedItem } from '../../types';
import { PlusCircle, Edit, Pin } from 'lucide-react';
import PinModal from '../../components/PinModal';

const AdminPostsPage: React.FC = () => {
    const { posts } = useContext(PostContext);
    const { pinnedItems } = useContext(PinContext);

    const adminPosts = useMemo(() => posts
        .filter(p => p.isAdminPost)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), 
    [posts]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [itemToPin, setItemToPin] = useState<{ item: Post, type: PinnedItem['itemType'] } | null>(null);

    const handleCreate = () => {
        setEditingPost(null);
        setIsModalOpen(true);
    };

    const handleEdit = (post: Post) => {
        setEditingPost(post);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPost(null);
    };

    const handlePinRequest = (post: Post) => {
      setItemToPin({ item: post, type: 'post' });
    };

    const isPinned = (postId: string) => {
      const now = new Date();
      return pinnedItems.some(p => {
        if (p.itemId !== `post-${postId}` || p.itemType !== 'post') return false;
        const start = new Date(p.startDate);
        const end = new Date(p.endDate);
        end.setHours(23, 59, 59, 999);
        return now >= start && now <= end;
      });
    }

    const statusPillClasses: Record<string, string> = {
      Active: 'bg-green-100 text-green-800',
      Archived: 'bg-gray-100 text-gray-800',
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-brand-dark">Admin Posts</h1>
                    <Button onClick={handleCreate}>
                        <PlusCircle size={18} className="mr-2" />
                        Create Post
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Range</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {adminPosts.map(post => (
                                <tr key={post.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 max-w-sm truncate" title={post.text}>{post.text}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusPillClasses[post.status || '']}`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {post.startDate ? new Date(post.startDate).toLocaleDateString() : 'N/A'} - {post.endDate ? new Date(post.endDate).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handlePinRequest(post)} title="Pin Post" className={isPinned(post.id) ? 'text-brand-accent' : ''}>
                                                <Pin size={16} />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(post)} title="Edit Post">
                                                <Edit size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingPost ? 'Edit Admin Post' : 'Create Admin Post'}>
                <AdminPostForm postToEdit={editingPost} onSave={handleCloseModal} onCancel={handleCloseModal} />
            </Modal>

            {itemToPin && (
              <PinModal
                isOpen={!!itemToPin}
                onClose={() => setItemToPin(null)}
                item={itemToPin.item}
                itemType={itemToPin.type}
              />
            )}
        </>
    );
};

export default AdminPostsPage;
