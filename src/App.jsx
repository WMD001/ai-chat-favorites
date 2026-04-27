import { useState, useEffect } from 'react';
import AddChatForm from './components/AddChatForm';
import { getChats, addChat, deleteChat } from './utils/kv';

const PLATFORM_COLORS = {
  DeepSeek: '#2E86DE',
  Doubao: '#E74C3C',
  ChatGPT: '#10A37F',
  Claude: '#D4A574',
  Gemini: '#4285F4',
  Kimi: '#7B68EE',
  通义千问: '#FF6B6B',
  文心一言: '#4CAF50',
  其他: '#95A5A6',
};

const DEFAULT_TAGS = ['生活', '学习', '旅游'];
const PASSWORD = import.meta.env.VITE_ACCESS_PASSWORD || '123456';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [editingChat, setEditingChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('全部');
  const [allTags, setAllTags] = useState(DEFAULT_TAGS);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
    }
    // 加载数据不需要登录
    loadChats();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      setError('');
      setShowPasswordModal(false);
      setPassword('');
      // 执行待处理的操作
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } else {
      setError('访问密码错误');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    setSelectedChat(null);
  };

  const requirePassword = (action) => {
    if (isLoggedIn) {
      action();
    } else {
      setPendingAction(() => action);
      setShowPasswordModal(true);
    }
  };

  const loadChats = async () => {
    try {
      const data = await getChats();
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setChats(sorted);
      const tags = new Set(DEFAULT_TAGS);
      sorted.forEach((chat) => {
        if (chat.tags && chat.tags.length > 0) {
          chat.tags.forEach((t) => tags.add(t));
        }
      });
      setAllTags(Array.from(tags));
    } catch (err) {
      console.error('Failed to load chats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChat = async (chatData) => {
    try {
      const newChat = await addChat(chatData);
      setChats([newChat, ...chats]);
      if (chatData.tags) {
        chatData.tags.forEach((t) => {
          if (!allTags.includes(t)) {
            setAllTags([...allTags, t]);
          }
        });
      }
      setShowModal(false);
      setSelectedChat(newChat);
    } catch (err) {
      alert('添加失败');
    }
  };

  const handleEditChat = async (chatData) => {
    try {
      await deleteChat(editingChat.id);
      const newChat = await addChat(chatData);
      const updatedChats = chats.filter((c) => c.id !== editingChat.id);
      setChats([newChat, ...updatedChats]);
      if (chatData.tags) {
        chatData.tags.forEach((t) => {
          if (!allTags.includes(t)) {
            setAllTags([...allTags, t]);
          }
        });
      }
      setShowEditModal(false);
      setEditingChat(null);
      if (selectedChat?.id === editingChat.id) {
        setSelectedChat(newChat);
      }
    } catch (err) {
      alert('编辑失败');
    }
  };

  const handleDeleteChat = async (id) => {
    if (!window.confirm('确定要删除这个收藏吗？')) return;
    try {
      await deleteChat(id);
      setChats(chats.filter((c) => c.id !== id));
      if (selectedChat?.id === id) {
        setSelectedChat(null);
      }
    } catch (err) {
      alert('删除失败');
    }
  };

  const openEditModal = (chat, e) => {
    e.stopPropagation();
    setEditingChat(chat);
    setShowEditModal(true);
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return '今天';
    if (days === 1) return '昨天';
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const filteredChats = selectedTag === '全部' 
    ? chats 
    : chats.filter((chat) => chat.tags && chat.tags.includes(selectedTag));

  const getTagCounts = () => {
    const counts = { 全部: chats.length };
    allTags.forEach((tag) => {
      counts[tag] = chats.filter((c) => c.tags && c.tags.includes(tag)).length;
    });
    return counts;
  };

  const tagCounts = getTagCounts();


  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">AI 对话收藏夹</h1>
        <div className="flex items-center gap-3">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            onClick={() => requirePassword(() => setShowModal(true))}
          >
            + 添加链接
          </button>
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
            >
              退出
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-100">
            <div className="text-xs font-medium text-gray-500 mb-2">标签筛选</div>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedTag === '全部'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedTag('全部')}
              >
                全部 ({tagCounts['全部']})
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedTag === tag
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag} ({tagCounts[tag] || 0})
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">收藏列表</span>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
              {filteredChats.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-400 text-sm">加载中...</div>
            ) : filteredChats.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">暂无收藏</div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedChat?.id === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="px-2 py-0.5 rounded text-white text-xs font-medium"
                        style={{ background: PLATFORM_COLORS[chat.platform] || '#95A5A6' }}
                      >
                        {chat.platform}
                      </span>
                      {chat.tags && chat.tags.map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 line-clamp-2 mb-1">{chat.title}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{formatTime(chat.createdAt)}</span>
                    <div className="flex gap-2">
                      <button
                        className="px-2 py-1 text-xs text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          requirePassword(() => openEditModal(chat, e));
                        }}
                      >
                        编辑
                      </button>
                      <button
                        className="px-2 py-1 text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          requirePassword(() => handleDeleteChat(chat.id));
                        }}
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        <section className="flex-1 bg-white">
          {selectedChat ? (
            <iframe
              src={selectedChat.url}
              title={selectedChat.title}
              className="w-full h-full border-0"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              选择一个收藏链接查看
            </div>
          )}
        </section>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">添加收藏链接</h2>
              <button
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setShowModal(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <AddChatForm onAdd={handleAddChat} existingTags={allTags} />
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowEditModal(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">编辑收藏链接</h2>
              <button
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setShowEditModal(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <AddChatForm
                onAdd={handleEditChat}
                existingTags={allTags}
                initialData={editingChat}
              />
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPasswordModal(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">需要密码验证</h2>
              <button
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setShowPasswordModal(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleLogin}>
                <input
                  type="password"
                  placeholder="请输入访问密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all mb-4"
                />
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  确认
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;