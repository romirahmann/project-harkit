// src/tools/fileUtils.js
import fg from "fast-glob";
import path from "path";

export async function countPdfFiles(
  dirPath = "\\\\192.168.9.251\\padaprima\\RSAB HARAPAN KITA"
) {
  try {
    const normalizedPath = dirPath.replace(/\\/g, "/").replace(/\/+$/, "");

    const pattern = `${normalizedPath}/**/*.pdf`;

    const files = await fg(pattern, {
      onlyFiles: true,
      unique: true,
      followSymbolicLinks: false,
      suppressErrors: true,
    });

    return files.length;
  } catch (err) {
    console.error(`Gagal membaca folder ${dirPath}: ${err.message}`);
    return 0;
  }
}
