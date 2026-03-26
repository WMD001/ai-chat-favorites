import { useState, useEffect } from 'react';

const PLATFORMS = [
  { name: 'DeepSeek', color: '#2E86DE' },
  { name: 'Doubao', color: '#E74C3C' },
  { name: 'ChatGPT', color: '#10A37F' },
  { name: 'Claude', color: '#D4A574' },
  { name: 'Gemini', color: '#4285F4' },
  { name: 'Kimi', color: '#7B68EE' },
  { name: '通义千问', color: '#FF6B6B' },
  { name: '文心一言', color: '#4CAF50' },
  { name: '其他', color: '#95A5A6' },
];

function AddChatForm({ onAdd, existingTags = [], initialData = null }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [url, setUrl] = useState(initialData?.url || '');
  const [platform, setPlatform] = useState(initialData?.platform || 'DeepSeek');
  const [tags, setTags] = useState(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setUrl(initialData.url || '');
      setPlatform(initialData.platform || 'DeepSeek');
      setTags(initialData.tags || []);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      setError('请填写标题和链接');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onAdd({
        title: title.trim(),
        url: url.trim(),
        platform,
        tags,
      });
      if (!initialData) {
        setTitle('');
        setUrl('');
        setTags([]);
      }
    } catch (err) {
      setError('添加失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const suggestedTags = existingTags.filter((t) => !tags.includes(t)).slice(0, 5);

  const buttonText = initialData ? '保存修改' : '添加收藏';
  const formTitle = initialData ? '编辑收藏链接' : '添加收藏链接';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="对话标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        />
      </div>
      <div>
        <input
          type="url"
          placeholder="对话链接"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        />
      </div>
      <div>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
        >
          {PLATFORMS.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-2">标签</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full"
            >
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-green-900">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="输入标签后按回车添加"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
        {suggestedTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-xs text-gray-400">推荐:</span>
            {suggestedTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addTag(tag)}
                className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              >
                + {tag}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? '处理中...' : buttonText}
      </button>
    </form>
  );
}

export default AddChatForm;