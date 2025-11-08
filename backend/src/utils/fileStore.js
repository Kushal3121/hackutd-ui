import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a dedicated 'data' folder (if not exists)
const dataDir = path.join(__dirname, '../data');
const userFile = path.join(dataDir, 'users.json');

export async function loadData() {
  try {
    // Ensure folder exists before anything else
    await fs.ensureDir(dataDir);

    if (await fs.pathExists(userFile)) {
      const data = await fs.readJson(userFile);
      console.log(`Loaded ${data.length} user records`);
      return data;
    }

    console.log('No users.json found, creating empty file.');
    await fs.writeJson(userFile, [], { spaces: 2 });
    return [];
  } catch (err) {
    console.error('Failed to load users:', err);
    return [];
  }
}

export async function saveData(data) {
  try {
    await fs.ensureDir(dataDir);
    await fs.writeJson(userFile, data, { spaces: 2 });
    console.log('users.json saved successfully');
  } catch (err) {
    console.error('Failed to save users:', err);
  }
}
