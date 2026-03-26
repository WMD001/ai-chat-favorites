import { deleteChat } from '../utils/kv';
import './ChatCard.css';

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

function ChatCard({ chat, onDelete }) {
  const platformColor = PLATFORM_COLORS[chat.platform] || '#95A5A6';

  const handleDelete = async () => {
    if (window.confirm('确定要删除这个收藏吗？')) {
      try {
        await deleteChat(chat.id);
        onDelete(chat.id);
      } catch (err) {
        alert('删除失败');
      }
    }
  };

  return (
    <div className="chat-card">
      <div className="card-header">
        <span
          className="platform-badge"
          style={{ background: platformColor }}
        >
          {chat.platform}
        </span>
        <button className="delete-btn" onClick={handleDelete}>
          删除
        </button>
      </div>
      <a
        href={chat.url}
        target="_blank"
        rel="noopener noreferrer"
        className="card-title"
      >
        {chat.title}
      </a>
      <p className="card-time">
        {new Date(chat.createdAt).toLocaleDateString('zh-CN')}
      </p>
    </div>
  );
}

export default ChatCard;