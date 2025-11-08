import { loadData, saveData } from '../utils/fileStore.js';

const users = new Map();

export async function initUsers() {
  const loaded = await loadData();
  for (const u of loaded) users.set(u.username, u);
}

export function getUser(username) {
  return users.get(username);
}

export function getAllUsers() {
  return Array.from(users.values());
}

export async function addUser(user) {
  users.set(user.username, user);
  await saveData(getAllUsers());
}

export async function updateUser(username, updatedData) {
  const existing = users.get(username);
  if (existing) {
    users.set(username, { ...existing, ...updatedData });
    await saveData(getAllUsers());
  }
}

export const sanitizeUser = (u) => ({
  id: u.id,
  username: u.username,
  name: u.name,
});
