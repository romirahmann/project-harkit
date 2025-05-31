// src/tools/fileUtils.js
import fs from "fs/promises";
import path from "path";

export async function countPdfFiles(
  dirPath = "\\\\192.168.9.251\\padaprima\\RSAB HARAPAN KITA",
  depth = 0,
  maxDepth = 10
) {
  if (depth > maxDepth) return 0;

  try {
    const items = await fs.readdir(dirPath);
    let count = 0;

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      let stat;

      try {
        stat = await fs.lstat(fullPath);
      } catch (err) {
        console.warn(`Gagal membaca item: ${fullPath} - ${err.message}`);
        continue;
      }

      if (stat.isSymbolicLink()) continue;

      if (stat.isDirectory()) {
        count += await countPdfFiles(fullPath, depth + 1, maxDepth);
      } else if (path.extname(item).toLowerCase() === ".pdf") {
        count++;
      }
    }

    return count;
  } catch (err) {
    console.error(`Gagal membaca folder ${dirPath}: ${err.message}`);
    return 0;
  }
}
