# 🏗️ Báo Giá Pro - Construction & Appliance Cost Tracker

**Báo Giá Pro** là một ứng dụng Web chuyên dụng được thiết kế để giúp các chủ nhà (hoặc nhà thầu) dễ dàng quản lý, đối chiếu và đàm phán các hạng mục báo giá trong quá trình xây dựng, hoàn thiện nội thất và mua sắm điện máy.

Được sức mạnh của **Google Gemini 2.5 Flash** và **Google Search Grounding** hậu thuẫn, hệ thống không chỉ đọc được báo giá từ ảnh chụp mà còn tự động lên mạng săn lùng giá thị trường thấp nhất theo thời gian thực để giúp bạn tiết kiệm hàng chục triệu đồng!

---

## 🌟 Tính Năng Nổi Bật

### 🤖 1. Trợ Lý AI Phân Tích Báo Giá (Gemini 2.5 Flash)
- **Đọc Ảnh Thông Minh:** Bạn chỉ cần quăng một bức ảnh chụp báo giá hoặc hóa đơn của nhà thầu vào, AI sẽ tự động đọc, trích xuất chính xác Tên sản phẩm, Thương hiệu, Số lượng và Đơn giá.
- **Săn Giá Thị Trường (Real-time Google Search):** Được tích hợp tính năng **Google Search Grounding**, AI sẽ tự động lướt web (Điện Máy Xanh, Shopee, Lazada...) để dò tìm mức giá bán lẻ rẻ nhất trên thị trường cho chính xác món đồ đó ở thời điểm hiện tại.
- **Đánh giá đắt/rẻ:** AI tự động đưa ra nhận xét bằng Tiếng Việt (Ví dụ: "Giá báo cao hơn thị trường 1.5 triệu, nên đàm phán lại").

### 📊 2. Dashboard Thống Kê Real-time
- **Tính toán chênh lệch:** Tự động so sánh "Đơn giá nhà thầu" vs "Giá thị trường" để tính ra số tiền chênh lệch (tiết kiệm hoặc lỗ).
- **Tổng tiền sau đàm phán:** Bảng theo dõi số tiền tổng cộng sẽ cập nhật **ngay lập tức (real-time)** mỗi khi bạn chốt "✅ Đã đồng ý" cho một món hàng.

### 💾 3. Quản Lý Dữ Liệu Mạnh Mẽ
- **Lưu trữ Cloud (Redis):** Dữ liệu được lưu trữ an toàn trên Upstash Redis thông qua Vercel Serverless Functions. Đăng nhập và xem dữ liệu trên mọi thiết bị.
- **Nhập/Xuất Dữ Liệu linh hoạt:**
  - Import bằng Code Snippet CSV nhanh chóng.
  - Export toàn bộ Database ra file `.json` để sao lưu backup offline.
- **Chức năng Xóa/Sửa:** Tùy chỉnh trạng thái từng món đồ (Đang đàm phán, Đã chốt, Chưa chốt) và có thể Xóa các món đồ dư thừa trực tiếp trên giao diện.

### 🔒 4. Bảo Mật & Phân Quyền
- Hệ thống sử dụng **Token-based Authentication**. Mọi thao tác lưu/tải dữ liệu và phân tích AI đều được kiểm tra phân quyền (Bearer Token), ngăn chặn hoàn toàn việc người ngoài truy cập trái phép.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

Hệ thống được thiết kế theo kiến trúc Tối Giản nhưng Tối Ưu Tốc Độ:
- **Frontend:** Pure HTML5, Vanilla CSS3 (Custom Design System, Glassmorphism), Vanilla JavaScript. Không sử dụng Framework nặng nề.
- **Backend:** Vercel Serverless Functions (`Node.js`).
- **Database:** Upstash Redis (KV Store).
- **AI Engine:** Google Gemini REST API (`gemini-2.5-flash`).
- **Deploy:** Vercel.

---

## 🚀 Hướng Dẫn Cài Đặt Dành Cho Lập Trình Viên

Nếu bạn muốn tự clone dự án này về và chạy trên máy chủ cá nhân, hãy làm theo các bước sau:

### Bước 1: Clone Repository
\`\`\`bash
git clone https://github.com/markdo27/baogia_stable.git
cd baogia_stable
\`\`\`

### Bước 2: Thiết Lập Biến Môi Trường (Environment Variables)
Tạo một file `.env` (nếu chạy local) hoặc thiết lập trực tiếp trên Vercel Dashboard các biến sau:
- \`ADMIN_PASSWORD\`: Mật khẩu dùng để truy cập vào hệ thống (Ví dụ: \`admin123\`).
- \`REDIS_URL\`: Đường dẫn kết nối đến Upstash Redis của bạn.
- \`GEMINI_API_KEY\`: API Key chính chủ từ **Google AI Studio** (để kích hoạt tính năng Đọc ảnh và Google Search).

### Bước 3: Deploy Lên Vercel
Dự án được cấu hình sẵn để tương thích 100% với Vercel. Bạn chỉ cần:
1. Đăng nhập Vercel.
2. Chọn "Add New Project" -> Import repository \`baogia_stable\`.
3. Điền các biến môi trường (Environment Variables) ở Bước 2.
4. Bấm **Deploy**.

---

## 📝 Cấu Trúc Thư Mục Chính

- \`index.html\`: Giao diện chính của Dashboard đàm phán.
- \`login.html\`: Cổng đăng nhập bảo mật của Admin.
- \`style.css\`: Hệ thống Design System và responsive layout.
- \`app.js\`: Chứa toàn bộ logic xử lý Frontend (Render bảng, tính toán Dashboard, giao tiếp API).
- \`api/\`: Thư mục chứa các API Serverless Backend:
  - \`api/auth/login.js\`: Xử lý đăng nhập và cấp phát Token.
  - \`api/analyze-image.js\`: Kết nối với Gemini 2.5 Flash, xử lý ảnh Base64 và gọi Google Search Grounding.
  - \`api/save.js\` / \`api/load.js\`: Xử lý lưu/tải dữ liệu từ Redis.

---

## 💡 Mẹo Sử Dụng (Pro Tips)
- Chức năng khảo giá bằng tay luôn có sẵn các nút **Shopee, Lazada, Google** ở cuối mỗi dòng. Bấm vào là hệ thống tự động chèn từ khóa tìm kiếm cho bạn.
- Nếu không thích dùng ảnh, bạn có thể chuyển báo giá của nhà thầu thành dạng file CSV (các cột cách nhau bởi dấu phẩy) và dán thẳng vào tab **Nhập File CSV** để đưa vào hệ thống trong 1 giây.

---
*Phát triển bởi đội ngũ Báo Giá Pro.*
