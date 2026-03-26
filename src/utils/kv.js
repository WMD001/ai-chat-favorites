import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: import.meta.env.VITE_KV_REST_API_URL,
  token: import.meta.env.VITE_KV_REST_API_TOKEN,
});

export const getChats = async () => {
  try {
    const chats = await redis.get('chats');
    return chats || [];
  } catch (error) {
    console.error('Failed to get chats:', error);
    return [];
  }
};

export const addChat = async (chat) => {
  try {
    const chats = await getChats();
    const newChat = {
      id: Date.now().toString(),
      ...chat,
      createdAt: new Date().toISOString(),
    };
    await redis.set('chats', [...chats, newChat]);
    return newChat;
  } catch (error) {
    console.error('Failed to add chat:', error);
    throw error;
  }
};

export const deleteChat = async (id) => {
  try {
    const chats = await getChats();
    const filtered = chats.filter((c) => c.id !== id);
    await redis.set('chats', filtered);
    return true;
  } catch (error) {
    console.error('Failed to delete chat:', error);
    throw error;
  }
};

export default redis;