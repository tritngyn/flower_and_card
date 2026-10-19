# Thiệp khu vườn dành tặng Thư

Thiệp web tĩnh gồm nguyên cảnh hoa nở của Flower-animation, thao tác chạm toàn màn hình, chuyển cảnh fade, nền botanical–bokeh và thiệp đôi mở phẳng bằng CSS 3D. Không có dependency, build step hay autoplay audio.

Trang ảnh đang dùng placeholder. Khi có ảnh thật, thay `.photo-placeholder` trong `dist/index.html` bằng:

```html
<img class="girlfriend-photo" src="./assets/thu.jpg" alt="Ảnh của Thư" />
```

## Chạy thử

Phục vụ thư mục `dist` bằng một static server, ví dụ:

```powershell
python -m http.server 4173 --directory dist
```

Kiểm tra cấu trúc và asset:

```powershell
node scripts/verify.mjs
node --check dist/assets/card.js
```

## Deployment

Deployment Vercel sẽ được cấu hình sau khi bản localhost được duyệt.

HTML, CSS keyframes và JavaScript khởi động animation hoa được copy từ [gmpsankalpa/Flower-animation](https://github.com/gmpsankalpa/Flower-animation) theo giấy phép MIT. Bản sao giấy phép nằm tại `dist/licenses/Flower-animation-MIT.txt`.

`dist/assets/popup-card.css` giữ nguyên snippet MIT [CSS 3D Lab — Pop-up greeting card](https://css3dlab.edgarasneverdauskas.com/models/greeting/) làm nền cho bản lề, perspective và bóng. Bản tùy biến bỏ trái tim pop-up, phóng lớn và đưa hai trang về chính diện trong `dist/assets/card.css`. Thông báo giấy phép nằm tại `dist/licenses/CSS-3D-Lab-MIT.txt`.
