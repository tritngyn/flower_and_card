# Thiệp khu vườn dành tặng Thư

Thiệp web tĩnh gồm animation hoa nở, thao tác chạm toàn màn hình, chuyển cảnh fade và thiệp đôi mở bằng CSS 3D. Không có dependency, build step hay autoplay audio.

Trang ảnh đang dùng placeholder. Khi có ảnh thật, thay `.photo-placeholder` trong `dist/index.html` bằng:

```html
<img class="girlfriend-photo" src="./assets/thu.jpg" alt="Ảnh của Thư" />
```

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

Chuyển động mở thiệp dùng CSS 3D thuần và tham khảo cơ chế bản lề của mẫu MIT [CSS 3D Lab — Pop-up greeting card](https://css3dlab.edgarasneverdauskas.com/models/greeting/).
