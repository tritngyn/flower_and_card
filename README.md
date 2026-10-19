# Thiệp 20/10 — Khu vườn nhỏ dành tặng em

Thiệp web tĩnh gồm animation hoa nở, thao tác mở thiệp, lời chúc và gấu bông CSS vẫy tay. Không có dependency, build step hay autoplay audio.

## Chạy thử

Phục vụ thư mục `dist` bằng một static server, ví dụ:

```powershell
npx serve dist
```

Kiểm tra cấu trúc và asset:

```powershell
node scripts/verify.mjs
node --check dist/assets/card.js
```

## Deploy GitHub Pages

Workflow `.github/workflows/deploy-pages.yml` tự động deploy nội dung trong `dist` khi push lên nhánh `main`. Trong repository GitHub, đặt **Settings → Pages → Source** thành **GitHub Actions**.

Animation hoa được chuyển thể từ [gmpsankalpa/Flower-animation](https://github.com/gmpsankalpa/Flower-animation) theo giấy phép MIT. Bản sao giấy phép nằm tại `dist/licenses/Flower-animation-MIT.txt`.
