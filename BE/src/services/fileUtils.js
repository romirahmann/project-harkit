import fg from "fast-glob";
import path from "path";

export async function countPdfFiles(
  dirPath = "\\\\192.168.9.251\\padaprima\\RSAB HARAPAN KITA"
) {
  try {
    const normalizedPath = dirPath.replace(/\\/g, "/").replace(/\/+$/, "");

    const pattern = `${normalizedPath}/**/*.pdf`;
    const folderPattern = `${normalizedPath}/**/`;

    const files = await fg(pattern, {
      onlyFiles: true,
      unique: true,
      followSymbolicLinks: false,
      suppressErrors: true,
    });

    const folders = await fg(folderPattern, {
      onlyDirectories: true,
      unique: true,
      followSymbolicLinks: false,
      suppressErrors: true,
    });

    // console.log("Jumlah folder ditemukan:", folders.length);
    // console.log("Jumlah file PDF ditemukan:", files.length);

    return {
      totalPdf: files.length,
      totalFolder: folders.length,
    };
  } catch (err) {
    console.error(`Gagal membaca folder ${dirPath}: ${err.message}`);
    return {
      totalPdf: 0,
      totalFolder: 0,
    };
  }
}
