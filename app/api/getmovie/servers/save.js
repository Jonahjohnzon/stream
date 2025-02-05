import fs from 'fs';
import path from 'path';

// Utility function to save the m3u8 file
const saveM3U8File = (cacheKey, content) => {
  const filePath = path.join(process.cwd(), 'public', 'm3u8', `${cacheKey}.m3u8`);

  // Create the 'm3u8' folder if it doesn't exist
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  // Write content to the file
  fs.writeFileSync(filePath, content, 'utf8');
};

export default saveM3U8File;