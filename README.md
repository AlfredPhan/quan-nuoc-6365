# 6365 Trà & Nước

Website order nhanh cho quán 6365 Trà & Nước, dùng Next.js App Router, TypeScript và Tailwind CSS.

## Chạy local

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

## Cấu hình Telegram

Tạo file `.env.local` từ `.env.example`:

```bash
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Không commit `.env.local` lên git.

## Cấu hình SEO

Website dùng `NEXT_PUBLIC_SITE_URL` để tạo canonical URL, Open Graph URL, `sitemap.xml`, `robots.txt` và JSON-LD. Khi deploy public, hãy set biến này trên Vercel bằng domain chính thức, ví dụ:

```bash
NEXT_PUBLIC_SITE_URL=https://ten-domain-cua-quan.vn
```

Nếu chưa có domain chính thức, có thể dùng domain Vercel tạm thời. Không để fallback `http://localhost:3000` cho bản production.

Ảnh chia sẻ mạng xã hội đang dùng `public/products/menu-4-mon.jpg`. Nên chuẩn bị ảnh OG riêng kích thước khoảng 1200x630 tại `public/og-image.jpg` rồi cập nhật `ogImagePath` trong `src/lib/site.ts` nếu muốn ảnh preview đẹp hơn trên Facebook, Zalo và Messenger.

## Sửa menu

Thêm hoặc sửa món trong `src/lib/menu.ts`.

## Kiểm tra

```bash
npm run lint
npm run build
```

## Deploy lên Vercel

### 1. Push code lên GitHub

```bash
git status
git add .
git commit -m "Prepare Vercel deploy"
git push origin main
```

Không commit `.env.local`. File này đã được bỏ qua trong `.gitignore`; chỉ commit `.env.example`.

### 2. Import project vào Vercel

1. Đăng nhập Vercel.
2. Chọn **Add New...** -> **Project**.
3. Chọn repository GitHub của project.
4. Giữ framework là **Next.js**.
5. Build command dùng mặc định: `npm run build`.
6. Install command dùng mặc định: `npm install`.

### 3. Thêm Environment Variables

Trong Vercel project, vào **Settings** -> **Environment Variables** và thêm:

```bash
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
NEXT_PUBLIC_SITE_URL=
```

Dán giá trị thật vào Vercel. `TELEGRAM_BOT_TOKEN` và `TELEGRAM_CHAT_ID` là biến server-side, không đưa token vào code, README, commit hoặc biến `NEXT_PUBLIC_*`. `NEXT_PUBLIC_SITE_URL` là URL public của website, không chứa secret.

### 4. Deploy và test

1. Bấm **Deploy** hoặc push commit mới để Vercel tự deploy.
2. Mở domain Vercel sau khi deploy xong.
3. Thêm món vào giỏ, nhập tên, số điện thoại, hình thức nhận hàng.
4. Gửi đơn thử và kiểm tra tin nhắn đến đúng Telegram chat.
5. Nếu website báo chưa cấu hình Telegram, kiểm tra lại `TELEGRAM_BOT_TOKEN` và `TELEGRAM_CHAT_ID` trong Vercel rồi redeploy.
