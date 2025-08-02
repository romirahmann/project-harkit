const { execSync } = require("child_process");

function run(cmd) {
  console.log(`\n>>> Running: ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

// 1. Hapus semua file .mdb dari riwayat commit
run(
  `git filter-branch --force --index-filter "git rm --cached --ignore-unmatch *.mdb" --prune-empty --tag-name-filter cat -- --all`
);

// 2. Bersihkan object yang sudah tidak terpakai
run(`git reflog expire --expire=now --all`);
run(`git gc --prune=now --aggressive`);

console.log("\n✅ Cleanup selesai! Sekarang push ulang pakai:");
console.log("   git push origin main --force");
