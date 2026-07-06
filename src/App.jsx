import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Banknote,
  BedDouble,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Database,
  DoorOpen,
  Download,
  Eye,
  FileText,
  GraduationCap,
  Home,
  Image,
  LayoutDashboard,
  LogOut,
  Plus,
  ReceiptText,
  RefreshCw,
  Save,
  Search,
  Settings,
  ShieldAlert,
  Smartphone,
  Star,
  UploadCloud,
  UserRound,
  UsersRound,
  XCircle,
} from "lucide-react";
import {
  fetchCollection,
  firebaseProjectId,
  hasFirebaseConfig,
  loginWithPassword,
  logoutAuth,
  patchRecord,
  saveRecord,
  seedFirestore,
} from "./firebase";
import { sampleData } from "./sampleData";

const STORAGE_DATA = "hzu-dorm-data-v1";
const STORAGE_USER = "hzu-dorm-user-v1";
const collections = Object.keys(sampleData);
const samplePhones = [
  "0877992992",
  "07.07.07.07.07",
  "08.23456789",
  "0877866688",
  "0825666662",
  "0826588885",
  "0844997997",
  "0845911999",
  "0913.99999",
  "08.5555.5555",
  "0828353555",
  "0856600006",
  "0829666656",
  "0819999923",
  "03.5555.5555",
  "091.3333333",
];
const UMT_BANK_OWNER = "TRUONG DAI HOC QUAN LY & CONG NGHE THANH PHO HO CHI MINH";
const UMT_BANK_ACCOUNT = "1028955109";
const SYSTEM_RULES = [
  "Điều 1: Đối tượng áp dụng",
  "Nội quy này áp dụng cho tất cả sinh viên được xét duyệt vào ở kí túc xá (KTX) Trường Đại học Quản Lí & Công Nghệ Thành Phố Hồ Chí Minh.",
  "",
  "Điều 2: Quy định chung",
  "Sinh viên được cấp thẻ KTX. Thẻ KTX có giá trị sử dụng trong khu vực KTX theo thời gian quy định.",
  "Không đưa người ngoài vào KTX.",
  "Phải tuân theo sự quản lý, điều động, sắp xếp chỗ ở của Ban Quản lý KTX.",
  "Sinh viên ở KTX trong vòng 1 tuần đầu phải đăng ký hộ khẩu tạm trú ở Công an địa phương và đóng lệ phí theo quy định của công an.",
  "",
  "Điều 3: Quy định về sinh hoạt",
  "Người ở ký túc xá khi ra vào ký túc xá phải xuất trình thẻ sinh viên với nhân viên trực bảo vệ ký túc xá. Từ 23h ngày hôm trước đến 5h ngày hôm sau, nghiêm cấm người ở ký túc xá ra vào ký túc xá, trừ trường hợp có lý do chính đáng.",
  "Phải giữ gìn phòng ở sạch sẽ, có ý thức giữ gìn vệ sinh bên ngoài phòng.",
  "Nghiêm cấm sinh viên lập bàn thờ, thắp hương trong KTX.",
  "Không gây ồn ào, mất trật tự dưới mọi hình thức: la hét, gõ, đập, mở các thiết bị phát thanh, phát hình với âm lượng lớn.",
  "",
  "Phần 2: Các quy định bổ sung",
  "Về nấu ăn và thiết bị điện: Nghiêm cấm đun nấu trong phòng ở, ban công, hành lang; nghiêm cấm tự ý sử dụng các thiết bị điện công suất lớn như bếp điện, bàn là, lò vi sóng khi chưa được phép.",
  "Về tài chính và hành chính: Đóng đầy đủ các khoản phí đúng hạn; chấp hành nghiêm chỉnh các quy định về phòng cháy chữa cháy, an ninh trật tự.",
  "Các hành vi cấm khác: Tự ý chuyển phòng hoặc giường; đón tiếp người thân, khách trong phòng ở; tàng trữ hàng cấm, vũ khí; tổ chức đánh bạc, uống rượu bia; nuôi thú cưng trong KTX.",
  "Quy định tiếp khách: Khách đến thăm phải xuất trình giấy tờ tùy thân tại bàn bảo vệ, chỉ được tiếp khách tại phòng khách trong khung giờ quy định: sáng 7h30 - 11h30, chiều 13h30 - 21h00.",
].join("\n");

const adminNavItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "settings", label: "Cài đặt", icon: Settings },
  { id: "students", label: "Sinh viên", icon: GraduationCap },
  { id: "accounts", label: "Tài khoản SV", icon: UsersRound },
  { id: "dorm", label: "Quản lý KTX", icon: Building2 },
  { id: "applications", label: "Đăng ký KTX", icon: ClipboardList },
  { id: "contracts", label: "Hợp đồng", icon: FileText },
  { id: "invoices", label: "Hóa đơn", icon: ReceiptText },
  { id: "violations", label: "Vi phạm", icon: ShieldAlert },
  { id: "notifications", label: "Thông báo", icon: Bell },
  { id: "reviews", label: "Đánh giá phòng", icon: Star },
];

const studentNavItems = [
  { id: "student-home", label: "Tổng quan", icon: Home },
  { id: "student-register", label: "Đăng ký KTX", icon: ClipboardList },
  { id: "student-room", label: "Phòng ở", icon: BedDouble },
  { id: "student-bills", label: "Hóa đơn", icon: ReceiptText },
  { id: "student-notices", label: "Thông báo", icon: Bell },
  { id: "student-contract", label: "Hợp đồng", icon: FileText },
  { id: "student-feedback", label: "Phản ánh", icon: Star },
  { id: "student-about", label: "Giới thiệu KTX", icon: Building2 },
];

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

function today() {
  return new Date().toISOString().slice(0, 10);
}

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function loadInitialStore() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_DATA) || "{}");
    return collections.reduce((next, key) => {
      next[key] = Array.isArray(saved[key]) ? saved[key] : sampleData[key];
      return next;
    }, {});
  } catch {
    return sampleData;
  }
}

function loadInitialUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USER) || "null");
  } catch {
    return null;
  }
}

function statusTone(status = "") {
  if (status.includes("Đã") || status.includes("Hiệu lực") || status.includes("Hoạt động")) return "success";
  if (status.includes("Chờ") || status.includes("Chưa") || status.includes("Mới")) return "warning";
  if (status.includes("Đầy") || status.includes("Khóa")) return "danger";
  return "info";
}

function isPaidStatus(status = "") {
  const value = String(status).toLowerCase();
  return value.includes("đã thanh toán") || value.includes("thanh toÃ¡n") || value.includes("thanh toán");
}

function isPendingStatus(status = "") {
  const value = String(status).toLowerCase();
  return value.includes("chờ duyệt") || value.includes("chá» duyá»‡t");
}

function calcTotal(form) {
  return ["roomFee", "electricity", "water", "service"].reduce((sum, key) => sum + Number(form[key] || 0), 0);
}

function escapeCell(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeUmtEmail(email = "") {
  return String(email).replace(/@hzu\.edu\.vn$/i, "@umt.edu.vn");
}

function formatRoomBed(room = "", bed = "") {
  const bedNumber = String(bed).match(/(\d+)$/)?.[1] || bed;
  return `${room || "-"} - giường ${bedNumber}`;
}

function getRoomResidents(room, students) {
  if (!room) return [];
  const buildingIndex = Math.max(0, room.building.charCodeAt(0) - 65);
  const roomNumber = Number(room.code.replace(/\D/g, "")) || 0;
  const phoneOffset = (buildingIndex * 40 + roomNumber) % samplePhones.length;
  const realResidents = students.filter((student) => student.room === room.code);
  if (realResidents.length) {
    return realResidents.map((student, index) => ({
      ...student,
      phone: samplePhones[(phoneOffset + index) % samplePhones.length],
    }));
  }

  const names = [
    "Nguyễn Hoàng Nam",
    "Trần Gia Hân",
    "Lê Minh Khang",
    "Phạm Tuấn Kiệt",
    "Võ Thảo Nguyên",
    "Đặng Quốc Bảo",
    "Bùi Anh Duy",
    "Hoàng Mỹ Linh",
    "Đỗ Minh Quân",
    "Ngô Khánh Vy",
    "Phan Đức Anh",
    "Mai Thanh Trúc",
    "Đinh Gia Bảo",
    "Trương Minh Nhật",
    "Vũ Hải Yến",
    "Cao Quốc Huy",
    "Lâm Thu Hà",
    "Tạ Hoàng Phúc",
    "Nguyễn Minh Châu",
    "Trần Đức Long",
    "Lê Bảo Châu",
    "Phạm Khánh Duy",
    "Võ Nhật Minh",
    "Đặng Anh Thư",
    "Bùi Quang Vinh",
    "Hoàng Gia Huy",
    "Đỗ Thanh Tâm",
    "Ngô Minh Tâm",
    "Phan Nhật Hạ",
    "Mai Gia Linh",
    "Đinh Hữu Phước",
    "Trương Hải Đăng",
    "Vũ Ngọc Anh",
    "Cao Minh Đức",
    "Lâm Bảo Ngọc",
    "Tạ Quốc Thịnh",
    "Nguyễn Tuấn Anh",
    "Trần Ngọc Mai",
    "Lê Đức Huy",
    "Phạm Hoài An",
    "Võ Minh Trí",
    "Đặng Thanh Vy",
    "Bùi Hải Nam",
    "Hoàng Yến Nhi",
    "Đỗ Gia Khang",
    "Ngô Thùy Dương",
    "Phan Quang Huy",
    "Mai Đức Anh",
    "Đinh Khánh Linh",
    "Trương Quốc Việt",
    "Vũ Thanh Hằng",
    "Cao Anh Khoa",
    "Lâm Minh Quân",
    "Tạ Bảo Trân",
    "Nguyễn Gia Bảo",
    "Trần Minh Tú",
    "Lê Khánh Ngọc",
    "Phạm Anh Kiệt",
    "Võ Bảo Anh",
    "Đặng Minh Khoa",
    "Bùi Thanh Phong",
    "Hoàng Ngọc Hân",
    "Đỗ Quang Minh",
    "Ngô Bảo Vy",
    "Phan Thành Đạt",
    "Mai Hoàng Long",
    "Đinh Minh Anh",
    "Trương Khánh Hòa",
    "Vũ Gia Phúc",
    "Cao Thảo My",
    "Lâm Quốc An",
    "Tạ Minh Chí",
    "Nguyễn Đức Tài",
    "Trần Phương Linh",
    "Lê Anh Khoa",
    "Phạm Minh Hải",
    "Võ Thanh Bình",
    "Đặng Kim Ngân",
    "Bùi Minh Hiếu",
    "Hoàng Tuấn Kiệt",
    "Đỗ Ngọc Trâm",
    "Ngô Gia Hưng",
    "Phan Minh Nhật",
    "Mai Khánh An",
    "Đinh Bảo Long",
    "Trương Anh Thư",
    "Vũ Minh Triết",
    "Cao Gia Nghi",
    "Lâm Đức Phúc",
    "Tạ Minh Tâm",
    "Nguyễn Hồng Phúc",
    "Trần Hải Yến",
    "Lê Gia Tuấn",
    "Phạm Ngọc Duy",
  ];
  const nameOffset = buildingIndex * 30 + (roomNumber % 100) * 6;

  return Array.from({ length: Number(room.occupied || 0) }).map((_, index) => ({
    code: `${room.code}-SV${String(index + 1).padStart(2, "0")}`,
    name: names[nameOffset + index] || `Sinh viên ${room.code}-${String(index + 1).padStart(2, "0")}`,
    phone: samplePhones[(phoneOffset + index) % samplePhones.length],
    bed: `${room.code}-${String(index + 1).padStart(2, "0")}`,
  }));
}

function getContractPhone(contract) {
  const numericCode = Number(String(contract.studentCode || "").replace(/\D/g, "")) || 1;
  return samplePhones[(numericCode - 1) % samplePhones.length];
}

function setBrowserPath(path) {
  const basePath = import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL.replace(/\/$/, "");
  const nextPath = `${basePath}${path}`;
  if (window.location.pathname !== nextPath) {
    window.history.replaceState({}, "", nextPath);
  }
}

function assetPath(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

export default function App() {
  const [store, setStore] = useState(loadInitialStore);
  const [user, setUser] = useState(loadInitialUser);
  const [activePage, setActivePage] = useState("dashboard");
  const [syncMessage, setSyncMessage] = useState(
    hasFirebaseConfig ? `Firebase: ${firebaseProjectId}` : "Chạy dữ liệu mẫu",
  );
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_DATA, JSON.stringify(store));
  }, [store]);

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_USER);
  }, [user]);

  useEffect(() => {
    if (!user) {
      setBrowserPath("/login");
      return;
    }
    if (window.location.pathname === "/login" || window.location.pathname === "/") {
      setBrowserPath(user.role === "student" ? "/student" : "/dashboard");
    }
  }, [user]);

  useEffect(() => {
    if (!hasFirebaseConfig) return;

    let mounted = true;
    async function loadFirebase() {
      setIsSyncing(true);
      try {
        const entries = await Promise.all(collections.map(async (name) => [name, await fetchCollection(name)]));
        if (!mounted) return;
        setStore((prev) =>
          entries.reduce((next, [name, rows]) => {
            next[name] = rows.length ? rows : prev[name];
            return next;
          }, { ...prev }),
        );
        setSyncMessage("Đã tải Firestore");
      } catch (error) {
        setSyncMessage(`Firestore lỗi: ${error.message}`);
      } finally {
        if (mounted) setIsSyncing(false);
      }
    }

    loadFirebase();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const navigation = user.role === "student" ? studentNavItems : adminNavItems;
    const defaultPage = user.role === "student" ? "student-home" : "dashboard";
    if (!navigation.some((item) => item.id === activePage)) {
      setActivePage(defaultPage);
    }
  }, [activePage, user]);

  const stats = useMemo(() => {
    const unpaid = store.invoices.filter((invoice) => !isPaidStatus(invoice.status)).length;
    return {
      students: store.students.length,
      buildings: store.buildings.length,
      unpaid,
      pending: store.applications.filter((item) => isPendingStatus(item.status)).length,
      rooms: store.rooms.length,
      beds: store.rooms.reduce((sum, room) => sum + Number(room.bedCount || 0), 0),
      revenue: store.invoices
        .filter((invoice) => isPaidStatus(invoice.status))
        .reduce((sum, invoice) => sum + Number(invoice.total || 0), 0),
    };
  }, [store]);

  async function upsert(collectionName, record) {
    const row = { ...record, id: record.id || uid(collectionName) };
    setStore((prev) => ({
      ...prev,
      [collectionName]: prev[collectionName].some((item) => item.id === row.id)
        ? prev[collectionName].map((item) => (item.id === row.id ? row : item))
        : [row, ...prev[collectionName]],
    }));

    try {
      await saveRecord(collectionName, row);
      setSyncMessage(hasFirebaseConfig ? `Đã lưu ${collectionName}` : "Đã lưu cục bộ");
    } catch (error) {
      setSyncMessage(`Lưu lỗi: ${error.message}`);
    }

    return row;
  }

  async function patch(collectionName, id, values) {
    setStore((prev) => ({
      ...prev,
      [collectionName]: prev[collectionName].map((item) => (item.id === id ? { ...item, ...values } : item)),
    }));

    try {
      await patchRecord(collectionName, id, values);
      setSyncMessage(hasFirebaseConfig ? `Đã cập nhật ${collectionName}` : "Đã cập nhật cục bộ");
    } catch (error) {
      setSyncMessage(`Cập nhật lỗi: ${error.message}`);
    }
  }

  async function handleSeedFirestore() {
    setIsSyncing(true);
    try {
      await seedFirestore(store);
      setSyncMessage("Đã đồng bộ dữ liệu lên Firestore");
    } catch (error) {
      setSyncMessage(hasFirebaseConfig ? `Đồng bộ lỗi: ${error.message}` : "Chưa có cấu hình Firebase");
    } finally {
      setIsSyncing(false);
    }
  }

  async function handleLogin(loginUser) {
    const normalizedEmail = normalizeUmtEmail(loginUser.email);
    if (hasFirebaseConfig) {
      await loginWithPassword(normalizedEmail, loginUser.password);
    }
    const session = {
      ...loginUser,
      email: normalizedEmail,
      password: "",
      id: normalizedEmail || uid("user"),
      name: loginUser.role === "admin" ? "Quản trị KTX" : normalizedEmail.split("@")[0],
      lastLoginAt: today(),
      status: "Hoạt động",
    };
    setUser(session);
    setActivePage(session.role === "student" ? "student-home" : "dashboard");
    setBrowserPath(session.role === "student" ? "/student" : "/dashboard");
    await upsert("users", {
      id: session.email.replace(/[.#$/[\]]/g, "-"),
      name: session.name,
      email: session.email,
      role: session.role,
      studentCode: session.studentCode || "",
      status: "Hoạt động",
      lastLoginAt: session.lastLoginAt,
    });
  }

  function handleLogout() {
    logoutAuth().catch(() => {});
    setUser(null);
    setActivePage("dashboard");
    setBrowserPath("/login");
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const isStudent = user.role === "student";
  const navigation = isStudent ? studentNavItems : adminNavItems;
  const pageTitle = navigation.find((item) => item.id === activePage)?.label || (isStudent ? "Tổng quan" : "Dashboard");
  const settings = {
    ...(store.settings[0] || sampleData.settings[0]),
    dormName: "KTX UMT",
    bankAccount: UMT_BANK_ACCOUNT,
    bankOwner: UMT_BANK_OWNER,
    paymentNote: "<MASV><HOVATEN><THANH TOAN KTX>",
    rules: SYSTEM_RULES,
    email: "ktx@umt.edu.vn",
  };

  return (
    <div className={`app-shell ${isStudent ? "student-app" : "admin-app"}`}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">UMT</div>
          <div>
            <strong>KTX UMT</strong>
            <span>{isStudent ? "Cổng sinh viên" : "Admin console"}</span>
          </div>
        </div>

        <nav className="nav-list" aria-label={isStudent ? "Điều hướng sinh viên" : "Điều hướng quản trị"}>
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activePage === item.id ? "active" : ""}`}
                onClick={() => setActivePage(item.id)}
                title={item.label}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {!isStudent && (
            <div className="sync-line">
              <Database size={16} />
              <span>{isSyncing ? "Đang đồng bộ..." : syncMessage}</span>
            </div>
          )}
          <button className="ghost-button" onClick={handleLogout} title="Đăng xuất">
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <p>{settings.dormName}</p>
            <h1>{pageTitle}</h1>
          </div>
          {!isStudent && (
            <div className="user-chip">
              <UserRound size={18} />
              <span>{user.name}</span>
            </div>
          )}
        </header>

        {isStudent ? (
          <StudentPortal activePage={activePage} store={store} settings={settings} user={user} upsert={upsert} />
        ) : (
          <>
            {activePage === "dashboard" && <Dashboard stats={stats} store={store} setActivePage={setActivePage} />}
            {activePage === "settings" && (
              <SettingsPage settings={settings} upsert={upsert} onSeed={handleSeedFirestore} isSyncing={isSyncing} />
            )}
            {activePage === "students" && <StudentsPage store={store} upsert={upsert} />}
            {activePage === "accounts" && <AccountsPage users={store.users} students={store.students} upsert={upsert} />}
            {activePage === "dorm" && <DormPage store={store} />}
            {activePage === "applications" && <ApplicationsPage applications={store.applications} patch={patch} />}
            {activePage === "contracts" && <ContractsPage contracts={store.contracts} />}
            {activePage === "invoices" && <InvoicesPage store={store} upsert={upsert} patch={patch} />}
            {activePage === "violations" && <ViolationsPage violations={store.violations} upsert={upsert} />}
            {activePage === "notifications" && <NotificationsPage notifications={store.notifications} upsert={upsert} />}
            {activePage === "reviews" && <ReviewsPage reviews={store.reviews} patch={patch} />}
          </>
        )}
      </main>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "admin",
    studentCode: "",
  });
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoginError("");
    setIsSubmitting(true);
    try {
      await onLogin(form);
    } catch (error) {
      setLoginError("Email hoặc mật khẩu không đúng.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-screen">
      <section className="login-panel">
        <div className="login-copy">
          <div className="login-visual">
            <img className="login-campus-image" src={assetPath("/umt-building.png")} alt="Tòa nhà UMT" />
            <div className="login-title-overlay">
              <strong>KTX UMT</strong>
            </div>
          </div>
        </div>

        <form className="login-form" onSubmit={submit}>
          <div>
            <p className="eyebrow">Đăng nhập</p>
            <h1>KTX UMT</h1>
          </div>

          <label>
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </label>

          <label>
            Mật khẩu
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
          </label>

          <label>
            Vai trò
            <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
              <option value="admin">Quản trị</option>
              <option value="student">Sinh viên</option>
            </select>
          </label>

          {form.role === "student" && (
            <label>
              Mã sinh viên
              <input
                value={form.studentCode}
                onChange={(event) => setForm({ ...form, studentCode: event.target.value })}
              />
            </label>
          )}

          <button className="primary-button" type="submit">
            <DoorOpen size={18} />
            <span>{isSubmitting ? "Đang đăng nhập..." : "Vào hệ thống"}</span>
          </button>

          {loginError && <div className="login-note error">{loginError}</div>}

        </form>
      </section>
    </div>
  );
}

function Dashboard({ stats, store, setActivePage }) {
  const paidInvoices = store.invoices
    .filter((invoice) => isPaidStatus(invoice.status))
    .map((invoice) => {
      const student = store.students.find((item) => item.code === invoice.studentCode);
      return {
        ...invoice,
        displayName: student?.name || invoice.studentName,
        displayRoom: student?.room || invoice.room,
      };
    });
  const latestApplications = store.applications.slice(0, 4);

  return (
    <div className="page-stack">
      <section className="stat-grid">
        <StatCard icon={GraduationCap} label="Sinh viên đăng ký" value={stats.students} tone="blue" />
        <StatCard icon={Building2} label="Tòa nhà" value={stats.buildings} tone="green" />
        <StatCard icon={ReceiptText} label="Hóa đơn chưa thanh toán" value={stats.unpaid} tone="orange" />
        <StatCard icon={ClipboardList} label="Đơn chờ duyệt" value={stats.pending} tone="red" />
        <StatCard icon={Home} label="Phòng" value={stats.rooms} tone="violet" />
        <StatCard icon={BedDouble} label="Giường" value={stats.beds} tone="teal" />
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <PanelTitle icon={Eye} title="Quản lý tòa nhà" action="Xem quản lý KTX" onAction={() => setActivePage("dorm")} />
          <div className="building-summary-list">
            {store.buildings.map((building) => {
              const rooms = store.rooms.filter((room) => room.building === building.code);
              const occupied = rooms.reduce((sum, room) => sum + Number(room.occupied || 0), 0);
              const beds = rooms.reduce((sum, room) => sum + Number(room.bedCount || 0), 0);
              return (
                <button className="building-summary-card" key={building.id} onClick={() => setActivePage("dorm")}>
                  <div>
                    <strong>Tòa {building.code}</strong>
                    <span>{building.name}</span>
                  </div>
                  <div>
                    <small>Người quản lý</small>
                    <b>{building.manager}</b>
                  </div>
                  <em>
                    {rooms.length} phòng - {occupied}/{beds} giường
                  </em>
                </button>
              );
            })}
          </div>
        </div>

        <div className="panel">
          <PanelTitle icon={Banknote} title="Doanh thu đã thu" action="Mở hóa đơn" onAction={() => setActivePage("invoices")} />
          <div className="revenue-block">
            <strong>{currency.format(stats.revenue)}</strong>
            <span>Tháng 07/2026</span>
          </div>
          <div className="mini-list revenue-list">
            {paidInvoices.map((invoice) => (
              <div key={invoice.id}>
                <span>
                  {invoice.displayName}
                  <small>
                    {invoice.studentCode} - {invoice.displayRoom} - {invoice.month}
                  </small>
                </span>
                <strong>{currency.format(invoice.total)}</strong>
              </div>
            ))}
            {!paidInvoices.length && <p className="empty-text">Chưa có doanh thu đã thu.</p>}
          </div>
        </div>

        <div className="panel wide">
          <PanelTitle
            icon={ClipboardList}
            title="Đăng ký KTX chờ duyệt"
            action="Xử lý"
            onAction={() => setActivePage("applications")}
          />
          <Table
            headers={["Mã SV", "Sinh viên", "Phòng chọn", "Ngày gửi", "Trạng thái"]}
            rows={latestApplications.map((item) => [
              item.studentCode,
              item.studentName,
              item.requestedRoom,
              item.createdAt,
              <Badge key={item.id} status={item.status} />,
            ])}
          />
        </div>
      </section>
    </div>
  );
}

function SettingsPage({ settings, upsert, onSeed, isSyncing }) {
  const [form, setForm] = useState(settings);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <PanelTitle icon={Settings} title="Cài đặt hệ thống" />
        <div className="form-grid two">
          <label>
            Tên ký túc xá
            <input value={form.dormName || ""} onChange={(event) => update("dormName", event.target.value)} />
          </label>
          <label>
            Hotline
            <input value={form.hotline || ""} onChange={(event) => update("hotline", event.target.value)} />
          </label>
          <label className="span-two">
            Giới thiệu KTX
            <textarea value={form.introduction || ""} onChange={(event) => update("introduction", event.target.value)} />
          </label>
          <label className="span-two">
            Nội quy
            <textarea value={form.rules || ""} onChange={(event) => update("rules", event.target.value)} />
          </label>
          <label>
            Email liên hệ
            <input value={form.email || ""} onChange={(event) => update("email", event.target.value)} />
          </label>
          <label>
            Địa chỉ
            <input value={form.address || ""} onChange={(event) => update("address", event.target.value)} />
          </label>
          <label>
            Hình thức thanh toán
            <input value={form.paymentMethod || ""} onChange={(event) => update("paymentMethod", event.target.value)} />
          </label>
          <label>
            Ngân hàng
            <input value={form.bankName || ""} onChange={(event) => update("bankName", event.target.value)} />
          </label>
          <label>
            Số tài khoản
            <input value={form.bankAccount || ""} onChange={(event) => update("bankAccount", event.target.value)} />
          </label>
          <label>
            Chủ tài khoản
            <input value={form.bankOwner || ""} onChange={(event) => update("bankOwner", event.target.value)} />
          </label>
          <label className="span-two">
            Nội dung chuyển khoản
            <input value={form.paymentNote || ""} onChange={(event) => update("paymentNote", event.target.value)} />
          </label>
        </div>
        <div className="button-row">
          <button className="primary-button" onClick={() => upsert("settings", { ...form, id: "system" })}>
            <Save size={18} />
            <span>Lưu cài đặt</span>
          </button>
          <button className="secondary-button" onClick={onSeed} disabled={isSyncing}>
            <RefreshCw size={18} />
            <span>Đồng bộ Firestore</span>
          </button>
        </div>
      </section>
    </div>
  );
}

function StudentsPage({ store, upsert }) {
  const [selectedId, setSelectedId] = useState(store.students[0]?.id);
  const [form, setForm] = useState({
    code: "",
    name: "",
    gender: "Nam",
    className: "",
    phone: "",
    email: "",
    building: "A",
    room: "A104",
    bed: "",
    status: "Đang ở",
    registeredAt: today(),
    address: "",
  });

  const selected = store.students.find((student) => student.id === selectedId) || store.students[0];

  function submit(event) {
    event.preventDefault();
    upsert("students", { ...form, email: normalizeUmtEmail(form.email), id: uid("sv") });
    setForm({
      code: "",
      name: "",
      gender: "Nam",
      className: "",
      phone: "",
      email: "",
      building: "A",
      room: "A104",
      bed: "",
      status: "Đang ở",
      registeredAt: today(),
      address: "",
    });
  }

  return (
    <div className="split-layout">
      <section className="panel">
        <PanelTitle icon={GraduationCap} title="Danh sách sinh viên" />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Mã SV</th>
                <th>Họ tên</th>
                <th>Lớp</th>
                <th>Phòng</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {store.students.map((student) => (
                <tr
                  key={student.id}
                  className={selected?.id === student.id ? "selected-row" : ""}
                  onClick={() => setSelectedId(student.id)}
                >
                  <td>{student.code}</td>
                  <td>{student.name}</td>
                  <td>{student.className}</td>
                  <td>{student.room}</td>
                  <td>
                    <Badge status={student.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="side-stack">
        {selected && (
          <section className="panel">
            <PanelTitle icon={UserRound} title="Chi tiết sinh viên" />
            <div className="detail-list">
              <Detail label="Mã sinh viên" value={selected.code} />
              <Detail label="Họ tên" value={selected.name} />
              <Detail label="Liên hệ" value={selected.phone} />
              <Detail label="Email" value={normalizeUmtEmail(selected.email)} />
              <Detail label="Phòng/Giường" value={formatRoomBed(selected.room, selected.bed)} />
              <Detail label="Địa chỉ" value={selected.address} />
            </div>
          </section>
        )}

        <section className="panel">
          <PanelTitle icon={Plus} title="Thêm sinh viên" />
          <form className="form-grid" onSubmit={submit}>
            <input placeholder="Mã SV" value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} required />
            <input placeholder="Họ tên" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            <input placeholder="Lớp" value={form.className} onChange={(event) => setForm({ ...form, className: event.target.value })} />
            <input placeholder="SĐT" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            <input placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: normalizeUmtEmail(event.target.value) })} />
            <select value={form.room} onChange={(event) => setForm({ ...form, room: event.target.value })}>
              {store.rooms.map((room) => (
                <option key={room.id} value={room.code}>
                  {room.code}
                </option>
              ))}
            </select>
            <button className="primary-button span-two" type="submit">
              <Plus size={18} />
              <span>Lưu sinh viên</span>
            </button>
          </form>
        </section>
      </aside>
    </div>
  );
}

function AccountsPage({ users, students, upsert }) {
  const [showAllStaff, setShowAllStaff] = useState(false);
  const [showAllStudents, setShowAllStudents] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "student",
    studentCode: "",
    status: "Hoạt động",
    lastLoginAt: "",
  });

  function submit(event) {
    event.preventDefault();
    const email = normalizeUmtEmail(form.email);
    upsert("users", { ...form, email, id: email.replace(/[.#$/[\]]/g, "-") });
    setForm({ name: "", email: "", role: "student", studentCode: "", status: "Hoạt động", lastLoginAt: "" });
  }

  const staffAccounts = [
    { id: "staff-01", name: "Nguyễn Thanh Hùng", email: "hung.nt@umt.edu.vn", role: "Quản lý KTX", phone: "0877992992", area: "Tòa A", status: "Hoạt động" },
    { id: "staff-02", name: "Trần Mỹ Duyên", email: "duyen.tm@umt.edu.vn", role: "Kế toán", phone: "07.07.07.07.07", area: "Hóa đơn", status: "Hoạt động" },
    { id: "staff-03", name: "Lê Quốc Thịnh", email: "thind.lq@umt.edu.vn", role: "Quản lý phòng", phone: "08.23456789", area: "Tòa B", status: "Hoạt động" },
    { id: "staff-04", name: "Phạm Hoài Nam", email: "nam.ph@umt.edu.vn", role: "Bảo vệ", phone: "0877866688", area: "Cổng chính", status: "Hoạt động" },
    { id: "staff-05", name: "Võ Ngọc Hân", email: "han.vn@umt.edu.vn", role: "Hỗ trợ sinh viên", phone: "0825666662", area: "Tòa C", status: "Hoạt động" },
    { id: "staff-06", name: "Đặng Minh Khoa", email: "khoa.dm@umt.edu.vn", role: "Kỹ thuật", phone: "0826588885", area: "Điện nước", status: "Hoạt động" },
    { id: "staff-07", name: "Bùi Khánh Linh", email: "linh.bk@umt.edu.vn", role: "Hành chính", phone: "0844997997", area: "Hợp đồng", status: "Hoạt động" },
    { id: "staff-08", name: "Hoàng Đức Anh", email: "anh.hd@umt.edu.vn", role: "Quản trị hệ thống", phone: "0845911999", area: "Tài khoản", status: "Hoạt động" },
  ];
  const visibleStaff = showAllStaff ? staffAccounts : staffAccounts.slice(0, 3);
  const studentAccounts = students.map((student) => {
    const account = users.find((item) => item.studentCode === student.code || item.email === student.email);
    return {
      id: account?.id || `account-${student.code}`,
      name: student.name,
      email: normalizeUmtEmail(account?.email || student.email),
      studentCode: student.code,
      className: student.className,
      room: student.room,
      status: account?.status || "Hoạt động",
      lastLoginAt: account?.lastLoginAt || "2026-07-05",
    };
  });
  const visibleStudentAccounts = showAllStudents ? studentAccounts : studentAccounts.slice(0, 3);

  return (
    <div className="page-stack">
      <section className="panel">
        <PanelTitle
          icon={UsersRound}
          title="Tài khoản nhân viên"
          action={showAllStaff ? "Xem gọn" : "Xem thêm"}
          onAction={() => setShowAllStaff((value) => !value)}
        />
        <Table
          headers={["Tên nhân viên", "Email", "Vai trò", "Phụ trách", "Số điện thoại", "Trạng thái"]}
          rows={visibleStaff.map((item) => [
            item.name,
            item.email,
            item.role,
            item.area,
            item.phone,
            <Badge key={item.id} status={item.status} />,
          ])}
        />
      </section>

      <section className="panel">
        <PanelTitle
          icon={UsersRound}
          title="Tài khoản sinh viên"
          action={showAllStudents ? "Xem gọn" : "Xem thêm"}
          onAction={() => setShowAllStudents((value) => !value)}
        />
        <Table
          headers={["Tên", "Email", "Mã SV", "Lớp", "Phòng", "Trạng thái", "Lần đăng nhập"]}
          rows={visibleStudentAccounts.map((item) => [
            item.name,
            normalizeUmtEmail(item.email),
            item.studentCode || "-",
            item.className,
            item.room,
            <Badge key={item.id} status={item.status} />,
            item.lastLoginAt || "-",
          ])}
        />
      </section>

      <section className="panel">
        <PanelTitle icon={Plus} title="Thêm tài khoản không mật khẩu" />
        <form className="form-grid five" onSubmit={submit}>
          <input placeholder="Họ tên" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <input type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <select value={form.studentCode} onChange={(event) => setForm({ ...form, studentCode: event.target.value })}>
            <option value="">Không gắn SV</option>
            {students.map((student) => (
              <option key={student.id} value={student.code}>
                {student.code} - {student.name}
              </option>
            ))}
          </select>
          <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option value="student">Sinh viên</option>
            <option value="admin">Quản trị</option>
          </select>
          <button className="primary-button" type="submit">
            <Save size={18} />
            <span>Lưu</span>
          </button>
        </form>
      </section>
    </div>
  );
}

function DormPage({ store }) {
  const [openBuilding, setOpenBuilding] = useState("A");
  const [selectedRoomCode, setSelectedRoomCode] = useState("A101");
  const selectedBuilding = store.buildings.find((building) => building.code === openBuilding);
  const selectedRooms = store.rooms.filter((room) => room.building === openBuilding);
  const selectedRoom = selectedRooms.find((room) => room.code === selectedRoomCode) || selectedRooms[0];
  const selectedRoomResidents = getRoomResidents(selectedRoom, store.students);

  return (
    <div className="page-stack">
      <section className="building-grid">
        {store.buildings.map((building) => (
          <button
            className={`building-tile ${openBuilding === building.code ? "active" : ""}`}
            key={building.id}
            onClick={() => {
              setOpenBuilding((current) => (current === building.code ? "" : building.code));
              const firstRoom = store.rooms.find((room) => room.building === building.code);
              setSelectedRoomCode(firstRoom?.code || "");
            }}
            type="button"
          >
            <div>
              <Building2 size={22} />
              <strong>{building.name}</strong>
            </div>
            <dl>
              <Detail label="Tầng" value={building.floors} compact />
              <Detail label="Phòng" value={building.rooms} compact />
              <Detail label="Giường" value={building.beds} compact />
              <Detail label="Quản lý" value={building.manager} compact />
            </dl>
          </button>
        ))}
      </section>

      {openBuilding && (
        <section className="panel">
          <PanelTitle icon={Home} title={`Danh sách phòng ${selectedBuilding?.name || `Tòa ${openBuilding}`}`} />
          <div className="room-card-grid">
            {selectedRooms.map((room) => (
              <button
                className={`room-card ${selectedRoom?.code === room.code ? "active" : ""}`}
                key={room.id}
                onClick={() => setSelectedRoomCode(room.code)}
                type="button"
              >
                <div>
                  <Home size={18} />
                  <strong>{room.code}</strong>
                </div>
                <span>{room.type}</span>
                <small>{room.occupied}/{room.bedCount} giường</small>
                <Badge status={room.status} />
              </button>
            ))}
          </div>
        </section>
      )}

      {openBuilding && selectedRoom && (
        <section className="panel">
          <PanelTitle icon={BedDouble} title={`Sơ đồ phòng ${selectedRoom.code}`} />
          <div className="room-detail-grid">
            <div className="floor-plan">
              <div className="floor-window top">Cửa sổ</div>
              <div className="floor-door">Cửa chính</div>
              {Array.from({ length: selectedRoom.bedCount }).map((_, index) => {
                const bedCode = `${selectedRoom.code}-${String(index + 1).padStart(2, "0")}`;
                const bedNumber = String(index + 1).padStart(2, "0");
                const resident = selectedRoomResidents.find((item) => item.bed === bedCode);
                return (
                  <div key={bedCode} className={resident ? "plan-bed used" : "plan-bed"}>
                    <BedDouble size={22} />
                    <strong>Giường {bedNumber}</strong>
                    <span>{resident ? resident.name : "Chưa có sinh viên"}</span>
                    <small>{resident ? "Đang ở" : "Trống"}</small>
                  </div>
                );
              })}
            </div>
            <div className="detail-list">
              {selectedRoomResidents.map((resident) => (
                <Detail
                  key={`${resident.bed}-${resident.code}`}
                  label={resident.bed}
                  value={`${resident.name} - ${resident.phone || "Chưa có SĐT"}`}
                />
              ))}
              <Detail label="Giường trống" value={`${selectedRoom.bedCount - selectedRoomResidents.length} giường`} />
            </div>
          </div>
        </section>
      )}

      <section className="panel">
        <PanelTitle icon={Home} title="Danh sách phòng" />
        <Table
          headers={["Phòng", "Tòa", "Tầng", "Loại", "Đã ở", "Giá", "Trạng thái"]}
          rows={store.rooms.map((room) => [
            room.code,
            room.building,
            room.floor,
            room.type,
            `${room.occupied}/${room.bedCount}`,
            currency.format(room.price),
            <Badge key={room.id} status={room.status} />,
          ])}
        />
      </section>
    </div>
  );
}

function ApplicationsPage({ applications, patch }) {
  return (
    <section className="panel">
      <PanelTitle icon={ClipboardList} title="Quản lý đăng ký KTX" />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Mã SV</th>
              <th>Họ tên</th>
              <th>Giới tính</th>
              <th>Phòng chọn</th>
              <th>Ngày gửi</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((item) => (
              <tr key={item.id}>
                <td>{item.studentCode}</td>
                <td>{item.studentName}</td>
                <td>{item.gender}</td>
                <td>{item.requestedRoom}</td>
                <td>{item.createdAt}</td>
                <td>
                  <Badge status={item.status} />
                </td>
                <td>
                  <div className="row-actions">
                    <button title="Duyệt" onClick={() => patch("applications", item.id, { status: "Đã duyệt" })}>
                      <CheckCircle2 size={17} />
                    </button>
                    <button title="Từ chối" onClick={() => patch("applications", item.id, { status: "Từ chối" })}>
                      <XCircle size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ContractsPage({ contracts }) {
  const [showAllContracts, setShowAllContracts] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const demoContracts = [
    ...contracts,
    { id: "contract-005", code: "HD005", studentCode: "SV005", studentName: "Nguyễn Minh Châu", room: "A101", startDate: "2026-07-05", endDate: "2027-01-05", deposit: 1000000, status: "Hiệu lực" },
    { id: "contract-006", code: "HD006", studentCode: "SV006", studentName: "Trần Đức Long", room: "A102", startDate: "2026-07-06", endDate: "2027-01-06", deposit: 1000000, status: "Hiệu lực" },
    { id: "contract-007", code: "HD007", studentCode: "SV007", studentName: "Lê Bảo Châu", room: "A103", startDate: "2026-07-07", endDate: "2027-01-07", deposit: 1000000, status: "Hiệu lực" },
    { id: "contract-008", code: "HD008", studentCode: "SV008", studentName: "Hoàng Mỹ Linh", room: "B201", startDate: "2026-07-08", endDate: "2027-01-08", deposit: 950000, status: "Hiệu lực" },
    { id: "contract-009", code: "HD009", studentCode: "SV009", studentName: "Đỗ Quang Minh", room: "B204", startDate: "2026-07-09", endDate: "2027-01-09", deposit: 950000, status: "Hiệu lực" },
    { id: "contract-010", code: "HD010", studentCode: "SV010", studentName: "Ngô Bảo Vy", room: "C303", startDate: "2026-07-10", endDate: "2027-01-10", deposit: 900000, status: "Hiệu lực" },
    { id: "contract-011", code: "HD011", studentCode: "SV011", studentName: "Phan Thành Đạt", room: "C304", startDate: "2026-07-11", endDate: "2027-01-11", deposit: 900000, status: "Hiệu lực" },
    { id: "contract-012", code: "HD012", studentCode: "SV012", studentName: "Mai Hoàng Long", room: "C305", startDate: "2026-07-12", endDate: "2027-01-12", deposit: 900000, status: "Hiệu lực" },
  ];
  const visibleContracts = showAllContracts ? demoContracts : demoContracts.slice(0, 4);

  return (
    <section className="panel">
      <PanelTitle
        icon={FileText}
        title="Hợp đồng ký túc xá"
        action={showAllContracts ? "Xem gọn" : "Xem thêm"}
        onAction={() => setShowAllContracts((value) => !value)}
      />
      <Table
        headers={["Mã HĐ", "Sinh viên", "Mã SV", "Phòng", "Bắt đầu", "Kết thúc", "Cọc", "Trạng thái"]}
        rows={visibleContracts.map((item) => [
          item.code,
          <button key={`${item.id}-open`} className="link-button" onClick={() => setSelectedContract(item)}>
            {item.studentName}
          </button>,
          item.studentCode,
          item.room,
          item.startDate,
          item.endDate,
          currency.format(item.deposit),
          <Badge key={item.id} status={item.status} />,
        ])}
      />
      {selectedContract && <ContractModal contract={selectedContract} onClose={() => setSelectedContract(null)} />}
    </section>
  );
}

function ContractModal({ contract, onClose }) {
  const phone = getContractPhone(contract);
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <article className="contract-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <strong>Hợp đồng thuê nhà ở</strong>
          <button className="status-button" onClick={onClose}>Đóng</button>
        </div>
        <div className="contract-document">
          <div className="contract-center">
            <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong>
            <span>Độc lập - Tự do - Hạnh phúc</span>
            <em>________________________</em>
          </div>
          <p className="contract-right">TP.HCM, ngày {contract.startDate.slice(8, 10)} tháng {contract.startDate.slice(5, 7)} năm {contract.startDate.slice(0, 4)}</p>
          <h2>HỢP ĐỒNG THUÊ NHÀ Ở</h2>
          <p className="contract-center">Số {contract.code}/KTX-UMT</p>
          <p>Căn cứ Bộ luật Dân sự ngày 24 tháng 11 năm 2015;</p>
          <p>Căn cứ Luật Kinh doanh bất động sản ngày 28 tháng 11 năm 2023;</p>
          <p>Căn cứ hồ sơ pháp lý và nội quy quản lý vận hành KTX UMT.</p>
          <h3>Hai bên chúng tôi gồm:</h3>
          <h4>I. BÊN CHO THUÊ NHÀ Ở</h4>
          <p>- Tên tổ chức: KTX UMT.</p>
          <p>- Người đại diện: Ban quản lý KTX UMT. Chức vụ: Quản lý ký túc xá.</p>
          <p>- Địa chỉ: Số 8 Nguyễn Văn Tráng, Quận 1, TP.HCM.</p>
          <p>- Điện thoại liên hệ: 028 7300 6868.</p>
          <h4>II. BÊN THUÊ NHÀ Ở</h4>
          <p>- Họ tên sinh viên: <strong>{contract.studentName}</strong>.</p>
          <p>- Mã sinh viên: <strong>{contract.studentCode}</strong>.</p>
          <p>- Phòng thuê: <strong>{contract.room}</strong>.</p>
          <p>- Điện thoại liên hệ: <strong>{phone}</strong>.</p>
          <h4>Điều 1. Các thông tin về nhà ở cho thuê</h4>
          <p>Loại nhà ở: Phòng ở ký túc xá sinh viên. Vị trí: Phòng {contract.room}, thuộc KTX UMT.</p>
          <p>Hiện trạng: Phòng ở được bàn giao đúng tiêu chuẩn sinh hoạt, có giường, khu sinh hoạt chung và trang thiết bị cơ bản.</p>
          <h4>Điều 2. Giá thuê nhà ở</h4>
          <p>Tiền đặt cọc: <strong>{currency.format(contract.deposit)}</strong>. Tiền phòng, điện, nước và dịch vụ được thanh toán theo hóa đơn từng tháng.</p>
          <h4>Điều 3. Phương thức và thời hạn thanh toán</h4>
          <p>Thanh toán bằng tiền Việt Nam qua chuyển khoản ngân hàng hoặc hình thức khác do Ban quản lý KTX thông báo.</p>
          <h4>Điều 4. Thời hạn cho thuê</h4>
          <p>Thời hạn thuê từ ngày <strong>{contract.startDate}</strong> đến ngày <strong>{contract.endDate}</strong>.</p>
          <h4>Điều 5. Sử dụng nhà ở thuê</h4>
          <p>Bên thuê sử dụng phòng đúng mục đích lưu trú sinh viên, tuân thủ nội quy KTX, giữ gìn tài sản chung, không tự ý thay đổi kết cấu phòng.</p>
          <h4>Điều 6. Quyền và nghĩa vụ của bên cho thuê</h4>
          <p>Bên cho thuê giao phòng đúng thỏa thuận, bảo đảm điều kiện sinh hoạt ổn định, bảo trì và hỗ trợ xử lý sự cố theo quy định.</p>
          <h4>Điều 7. Quyền và nghĩa vụ của bên thuê</h4>
          <p>Bên thuê thanh toán đầy đủ chi phí, bảo quản tài sản, sử dụng phòng đúng mục đích và trả phòng khi hết hạn hợp đồng.</p>
          <h4>Điều 8. Trách nhiệm do vi phạm hợp đồng</h4>
          <p>Bên vi phạm hợp đồng phải chịu trách nhiệm theo nội quy KTX và quy định pháp luật hiện hành.</p>
          <h4>Điều 9. Chấm dứt hợp đồng</h4>
          <p>Hợp đồng chấm dứt khi hết hạn, khi hai bên thỏa thuận hoặc khi một bên vi phạm nghĩa vụ đã cam kết.</p>
          <h4>Điều 10. Hiệu lực hợp đồng</h4>
          <p>Hợp đồng có hiệu lực kể từ ngày ký, được lập thành 02 bản có giá trị pháp lý như nhau.</p>
          <div className="signature-grid">
            <div>
              <strong>BÊN THUÊ</strong>
              <span>(Ký, ghi rõ họ tên)</span>
              <em className="signature-name">{contract.studentName}</em>
            </div>
            <div>
              <strong>BÊN CHO THUÊ</strong>
              <span>(Ký, ghi rõ họ tên, chức vụ)</span>
              <em className="signature-name">Ban quản lý KTX UMT</em>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

function InvoicesPage({ store, upsert, patch }) {
  const [month, setMonth] = useState("2026-07");
  const [student, setStudent] = useState("");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({
    studentCode: "SV001",
    month: "2026-07",
    roomFee: 750000,
    electricity: 0,
    water: 0,
    service: 30000,
    imageUrl: "",
  });

  const filtered = useMemo(() => {
    return store.invoices.filter((invoice) => {
      const matchMonth = month ? invoice.month === month : true;
      const matchStudent = student ? invoice.studentCode === student : true;
      const haystack = `${invoice.studentCode} ${invoice.studentName} ${invoice.room}`.toLowerCase();
      const matchQuery = query ? haystack.includes(query.toLowerCase()) : true;
      return matchMonth && matchStudent && matchQuery;
    });
  }, [store.invoices, month, student, query]);

  const totalPreview = calcTotal(form);

  async function submit(event) {
    event.preventDefault();
    const target = store.students.find((item) => item.code === form.studentCode);
    await upsert("invoices", {
      id: uid("invoice"),
      code: `INV-${form.month}-${String(store.invoices.length + 1).padStart(3, "0")}`,
      studentCode: form.studentCode,
      studentName: target?.name || "Sinh viên",
      room: target?.room || "A104",
      month: form.month,
      roomFee: Number(form.roomFee || 0),
      electricity: Number(form.electricity || 0),
      water: Number(form.water || 0),
      service: Number(form.service || 0),
      total: totalPreview,
      status: "Chưa thanh toán",
      imageUrl: form.imageUrl,
      paidAt: "",
    });
  }

  async function generateBulk() {
    const monthKey = currentMonth();
    const existing = new Set(store.invoices.filter((invoice) => invoice.month === monthKey).map((invoice) => invoice.studentCode));
    const targets = store.students.filter((item) => !existing.has(item.code));
    await Promise.all(
      targets.map((item, index) =>
        upsert("invoices", {
          id: uid("invoice"),
          code: `INV-${monthKey}-AUTO-${index + 1}`,
          studentCode: item.code,
          studentName: item.name,
          room: item.room,
          month: monthKey,
          roomFee: 750000,
          electricity: 50000,
          water: 25000,
          service: 30000,
          total: 855000,
          status: "Chưa thanh toán",
          imageUrl: "",
          paidAt: "",
        }),
      ),
    );
    setMonth(monthKey);
  }

  function exportExcel() {
    const rows = filtered.map((invoice) => ({
      "Mã hóa đơn": invoice.code,
      "Mã SV": invoice.studentCode,
      "Sinh viên": invoice.studentName,
      Phòng: invoice.room,
      Tháng: invoice.month,
      "Tiền phòng": invoice.roomFee,
      Điện: invoice.electricity,
      Nước: invoice.water,
      "Dịch vụ": invoice.service,
      Tổng: invoice.total,
      "Trạng thái": invoice.status,
    }));
    const headers = Object.keys(rows[0] || { "Mã hóa đơn": "", "Mã SV": "", "Sinh viên": "", Tổng: "" });
    const html = `
      <html>
        <head><meta charset="UTF-8" /></head>
        <body>
          <table>
            <thead><tr>${headers.map((header) => `<th>${escapeCell(header)}</th>`).join("")}</tr></thead>
            <tbody>
              ${rows
                .map((row) => `<tr>${headers.map((header) => `<td>${escapeCell(row[header])}</td>`).join("")}</tr>`)
                .join("")}
            </tbody>
          </table>
        </body>
      </html>`;
    const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `hoa-don-${month || "tat-ca"}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function uploadImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, imageUrl: reader.result }));
    reader.readAsDataURL(file);
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <PanelTitle icon={ReceiptText} title="Quản lý hóa đơn" />
        <div className="toolbar">
          <label className="toolbar-field">
            <CalendarDays size={17} />
            <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
          </label>
          <label className="toolbar-field">
            <UserRound size={17} />
            <select value={student} onChange={(event) => setStudent(event.target.value)}>
              <option value="">Tất cả sinh viên</option>
              {store.students.map((item) => (
                <option key={item.id} value={item.code}>
                  {item.code} - {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="toolbar-field grow">
            <Search size={17} />
            <input placeholder="Tìm mã SV, tên, phòng" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <button className="secondary-button" onClick={generateBulk}>
            <RefreshCw size={18} />
            <span>Tạo hàng loạt</span>
          </button>
          <button className="primary-button" onClick={exportExcel}>
            <Download size={18} />
            <span>Xuất Excel</span>
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Mã HĐ</th>
                <th>Sinh viên</th>
                <th>Tháng</th>
                <th>Phòng</th>
                <th>Tổng tiền</th>
                <th>Ảnh</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.code}</td>
                  <td>
                    <strong>{invoice.studentName}</strong>
                    <small>{invoice.studentCode}</small>
                  </td>
                  <td>{invoice.month}</td>
                  <td>{invoice.room}</td>
                  <td>{currency.format(invoice.total)}</td>
                  <td>
                    {invoice.imageUrl ? (
                      <a href={invoice.imageUrl} target="_blank" rel="noreferrer" className="image-link">
                        <Image size={16} />
                        <span>Xem</span>
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <Badge status={invoice.status} />
                  </td>
                  <td>
                    <button
                      className="status-button"
                      onClick={() =>
                        patch("invoices", invoice.id, {
                          status: invoice.status === "Đã thanh toán" ? "Chưa thanh toán" : "Đã thanh toán",
                          paidAt: invoice.status === "Đã thanh toán" ? "" : today(),
                        })
                      }
                    >
                      <CreditCard size={16} />
                      <span>{invoice.status === "Đã thanh toán" ? "Đổi chưa TT" : "Thanh toán"}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <PanelTitle icon={Plus} title="Thêm hóa đơn" />
        <form className="form-grid invoice-form" onSubmit={submit}>
          <select value={form.studentCode} onChange={(event) => setForm({ ...form, studentCode: event.target.value })}>
            {store.students.map((item) => (
              <option key={item.id} value={item.code}>
                {item.code} - {item.name}
              </option>
            ))}
          </select>
          <input type="month" value={form.month} onChange={(event) => setForm({ ...form, month: event.target.value })} />
          <input type="number" placeholder="Tiền phòng" value={form.roomFee} onChange={(event) => setForm({ ...form, roomFee: event.target.value })} />
          <input type="number" placeholder="Tiền điện" value={form.electricity} onChange={(event) => setForm({ ...form, electricity: event.target.value })} />
          <input type="number" placeholder="Tiền nước" value={form.water} onChange={(event) => setForm({ ...form, water: event.target.value })} />
          <input type="number" placeholder="Dịch vụ" value={form.service} onChange={(event) => setForm({ ...form, service: event.target.value })} />
          <input placeholder="URL ảnh hóa đơn" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} />
          <label className="file-button">
            <UploadCloud size={17} />
            <span>Chọn ảnh</span>
            <input type="file" accept="image/*" onChange={uploadImage} />
          </label>
          <div className="total-pill">{currency.format(totalPreview)}</div>
          <button className="primary-button" type="submit">
            <Plus size={18} />
            <span>Thêm</span>
          </button>
        </form>
      </section>
    </div>
  );
}

function ViolationsPage({ violations, upsert }) {
  const [form, setForm] = useState({
    studentCode: "",
    studentName: "",
    room: "",
    level: "Nhắc nhở",
    reason: "",
    date: today(),
    status: "Đang theo dõi",
  });

  function submit(event) {
    event.preventDefault();
    upsert("violations", { ...form, id: uid("vio") });
    setForm({ studentCode: "", studentName: "", room: "", level: "Nhắc nhở", reason: "", date: today(), status: "Đang theo dõi" });
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <PanelTitle icon={ShieldAlert} title="Xử lý vi phạm" />
        <Table
          headers={["Mã SV", "Sinh viên", "Phòng", "Mức", "Lý do", "Ngày", "Trạng thái"]}
          rows={violations.map((item) => [
            item.studentCode,
            item.studentName,
            item.room,
            item.level,
            item.reason,
            item.date,
            <Badge key={item.id} status={item.status} />,
          ])}
        />
      </section>
      <section className="panel">
        <PanelTitle icon={Plus} title="Ghi nhận vi phạm" />
        <form className="form-grid five" onSubmit={submit}>
          <input placeholder="Mã SV" value={form.studentCode} onChange={(event) => setForm({ ...form, studentCode: event.target.value })} />
          <input placeholder="Sinh viên" value={form.studentName} onChange={(event) => setForm({ ...form, studentName: event.target.value })} />
          <input placeholder="Phòng" value={form.room} onChange={(event) => setForm({ ...form, room: event.target.value })} />
          <input placeholder="Lý do" value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} />
          <button className="primary-button" type="submit">
            <Save size={18} />
            <span>Lưu</span>
          </button>
        </form>
      </section>
    </div>
  );
}

function NotificationsPage({ notifications, upsert }) {
  const [form, setForm] = useState({
    title: "",
    body: "",
    target: "Tất cả",
    type: "Vận hành",
    createdAt: today(),
  });

  function submit(event) {
    event.preventDefault();
    upsert("notifications", { ...form, id: uid("noti") });
    setForm({ title: "", body: "", target: "Tất cả", type: "Vận hành", createdAt: today() });
  }

  return (
    <div className="split-layout">
      <section className="panel">
        <PanelTitle icon={Bell} title="Thông báo" />
        <div className="notice-list">
          {notifications.map((item) => (
            <article key={item.id} className="notice-item">
              <div>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </div>
              <div>
                <Badge status={item.type} />
                <small>{item.createdAt}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <PanelTitle icon={Plus} title="Tạo thông báo" />
        <form className="form-grid" onSubmit={submit}>
          <input placeholder="Tiêu đề" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
          <textarea placeholder="Nội dung" value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} required />
          <select value={form.target} onChange={(event) => setForm({ ...form, target: event.target.value })}>
            <option>Tất cả</option>
            <option>Tòa A</option>
            <option>Tòa B</option>
            <option>Tòa C</option>
          </select>
          <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
            <option>Vận hành</option>
            <option>Tài chính</option>
            <option>Nội quy</option>
          </select>
          <button className="primary-button span-two" type="submit">
            <Bell size={18} />
            <span>Gửi thông báo</span>
          </button>
        </form>
      </section>
    </div>
  );
}

function ReviewsPage({ reviews, patch }) {
  const [replyId, setReplyId] = useState("");
  const [replyText, setReplyText] = useState("");

  async function submitReply(event, item) {
    event.preventDefault();
    await patch("reviews", item.id, {
      status: "Đã sửa xong",
      adminReply: replyText || "Ban quản lý đã kiểm tra và sửa chữa xong.",
      repliedAt: today(),
    });
    setReplyId("");
    setReplyText("");
  }

  return (
    <section className="panel">
      <PanelTitle icon={Star} title="Đánh giá phòng" />
      <div className="review-grid">
        {reviews.map((item) => (
          <article key={item.id} className="review-card">
            <div className="review-head">
              <div>
                <strong>{item.room}</strong>
                <span>{item.studentName}</span>
              </div>
              <div className="stars">{Array.from({ length: item.rating }).map((_, index) => "★").join("")}</div>
            </div>
            <p>{item.content}</p>
            {item.adminReply && (
              <div className="admin-reply">
                <strong>Phản hồi quản trị</strong>
                <span>{item.adminReply}</span>
              </div>
            )}
            {replyId === item.id && (
              <form className="reply-form" onSubmit={(event) => submitReply(event, item)}>
                <textarea
                  placeholder="Nhập nội dung phản hồi sau khi đã sửa chữa xong..."
                  value={replyText}
                  onChange={(event) => setReplyText(event.target.value)}
                />
                <div className="button-row compact">
                  <button className="primary-button" type="submit">
                    <CheckCircle2 size={16} />
                    <span>Gửi phản hồi</span>
                  </button>
                  <button className="secondary-button" type="button" onClick={() => setReplyId("")}>
                    <XCircle size={16} />
                    <span>Hủy</span>
                  </button>
                </div>
              </form>
            )}
            <div className="review-foot">
              <Badge status={item.status} />
              <button
                className="status-button"
                onClick={() => {
                  setReplyId(item.id);
                  setReplyText(item.adminReply || "Ban quản lý đã kiểm tra và sửa chữa xong.");
                }}
              >
                <CheckCircle2 size={16} />
                <span>Phản hồi</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function StudentPortal({ activePage, store, settings, user, upsert }) {
  const student =
    store.students.find((item) => item.code === user.studentCode) ||
    store.students.find((item) => item.email === user.email) ||
    store.students[0];
  const room = store.rooms.find((item) => item.code === student?.room) || store.rooms.find((item) => item.code === "A104");
  const roommates = store.students.filter((item) => item.room === student?.room);
  const invoices = store.invoices.filter((item) => item.studentCode === student?.code);
  const contract = store.contracts.find((item) => item.studentCode === student?.code);

  if (!student) {
    return (
      <section className="student-hero">
        <AlertCircle size={28} />
        <h2>Chưa tìm thấy hồ sơ sinh viên</h2>
        <p>Vui lòng đăng nhập bằng mã sinh viên đã có trong danh sách sinh viên.</p>
      </section>
    );
  }

  return (
    <div className="student-shell">
      {activePage === "student-home" && (
        <StudentHome student={student} room={room} invoices={invoices} notifications={store.notifications} settings={settings} />
      )}
      {activePage === "student-register" && <StudentRegisterPage student={student} rooms={store.rooms} upsert={upsert} />}
      {activePage === "student-room" && <StudentRoomPage student={student} room={room} roommates={roommates} />}
      {activePage === "student-bills" && <StudentBillsPage invoices={invoices} settings={settings} />}
      {activePage === "student-notices" && <StudentNoticesPage notifications={store.notifications} />}
      {activePage === "student-contract" && <StudentContractPage contract={contract} student={student} />}
      {activePage === "student-feedback" && <StudentFeedbackPage student={student} upsert={upsert} />}
      {activePage === "student-about" && <StudentAboutPage settings={settings} />}
    </div>
  );
}

function StudentHome({ student, room, invoices, notifications, settings }) {
  const unpaid = invoices.filter((invoice) => invoice.status !== "Đã thanh toán");
  return (
    <div className="student-stack">
      <section className="student-hero">
        <div>
          <p>Xin chào, {student.name}</p>
          <h2>{settings.dormName}</h2>
          <span>{student.className} - {student.code}</span>
        </div>
        <div className="student-room-pill">
          <BedDouble size={24} />
          <strong>{student.room}</strong>
          <span>{room?.occupied || 0}/{room?.bedCount || 0} giường</span>
        </div>
      </section>

      <section className="student-card-grid">
        <StudentFeature icon={ClipboardList} title="Đăng ký ở KTX" value="Chọn tòa, chọn phòng, gửi đơn chờ duyệt" />
        <StudentFeature icon={ReceiptText} title="Hóa đơn cần xử lý" value={`${unpaid.length} hóa đơn chưa thanh toán`} />
        <StudentFeature icon={Bell} title="Thông báo mới" value={`${notifications.length} tin từ ban quản lý`} />
      </section>

      <section className="panel blue-panel">
        <PanelTitle icon={CreditCard} title="Thanh toán" />
        <div className="detail-list">
          <Detail label="Ngân hàng" value={settings.bankName} />
          <Detail label="Số tài khoản" value={settings.bankAccount} />
          <Detail label="Chủ tài khoản" value={settings.bankOwner} />
          <Detail label="Nội dung" value={`<${student.code}><${student.name.toUpperCase()}><THANH TOAN KTX>`} />
        </div>
      </section>
    </div>
  );
}

function StudentRegisterPage({ student, rooms, upsert }) {
  const [form, setForm] = useState({
    building: student.building || "A",
    requestedRoom: student.room || "A104",
    note: "",
  });

  const availableRooms = rooms.filter((room) => room.building === form.building);

  async function submit(event) {
    event.preventDefault();
    await upsert("applications", {
      id: uid("app"),
      studentName: student.name,
      studentCode: student.code,
      gender: student.gender,
      requestedRoom: form.requestedRoom,
      note: form.note,
      status: "Chờ duyệt",
      createdAt: today(),
    });
    setForm((prev) => ({ ...prev, note: "" }));
  }

  return (
    <section className="panel blue-panel">
      <PanelTitle icon={ClipboardList} title="Đăng ký ở ký túc xá" />
      <form className="form-grid two" onSubmit={submit}>
        <label>
          Chọn tòa
          <select
            value={form.building}
            onChange={(event) => {
              const building = event.target.value;
              const nextRoom = rooms.find((room) => room.building === building)?.code || "";
              setForm({ ...form, building, requestedRoom: nextRoom });
            }}
          >
            <option value="A">Tòa A</option>
            <option value="B">Tòa B</option>
            <option value="C">Tòa C</option>
          </select>
        </label>
        <label>
          Chọn phòng
          <select value={form.requestedRoom} onChange={(event) => setForm({ ...form, requestedRoom: event.target.value })}>
            {availableRooms.map((room) => (
              <option key={room.id} value={room.code}>
                {room.code} - {room.status} - {room.occupied}/{room.bedCount} giường
              </option>
            ))}
          </select>
        </label>
        <label className="span-two">
          Ghi chú
          <textarea
            placeholder="Nhu cầu ở, mong muốn ghép phòng, ghi chú sức khỏe..."
            value={form.note}
            onChange={(event) => setForm({ ...form, note: event.target.value })}
          />
        </label>
        <button className="primary-button" type="submit">
          <Save size={18} />
          <span>Gửi đơn đăng ký</span>
        </button>
      </form>
    </section>
  );
}

function StudentRoomPage({ student, room, roommates }) {
  return (
    <div className="student-stack">
      <section className="panel blue-panel">
        <PanelTitle icon={BedDouble} title="Thông tin phòng ở" />
        <div className="room-detail-grid">
          <div className="room-map">
            {Array.from({ length: room?.bedCount || 0 }).map((_, index) => (
              <div key={index} className={index < roommates.length ? "bed used" : "bed"}>
                <BedDouble size={22} />
                <span>{`${student.room}-${String(index + 1).padStart(2, "0")}`}</span>
              </div>
            ))}
          </div>
          <div className="detail-list">
            <Detail label="Phòng" value={student.room} />
            <Detail label="Tòa" value={room?.building} />
            <Detail label="Loại phòng" value={room?.type} />
            <Detail label="Giá phòng" value={currency.format(room?.price || 0)} />
          </div>
        </div>
      </section>

      <section className="panel">
        <PanelTitle icon={UsersRound} title="Thành viên trong phòng" />
        <Table
          headers={["Mã SV", "Họ tên", "Lớp", "Giường", "Liên hệ"]}
          rows={roommates.map((item) => [item.code, item.name, item.className, item.bed, item.phone])}
        />
      </section>
    </div>
  );
}

function StudentBillsPage({ invoices, settings }) {
  return (
    <div className="student-stack">
      <section className="panel">
        <PanelTitle icon={ReceiptText} title="Lịch sử hóa đơn" />
        <Table
          headers={["Mã hóa đơn", "Tháng", "Tiền phòng", "Điện", "Nước", "Tổng tiền", "Trạng thái"]}
          rows={invoices.map((invoice) => [
            invoice.code,
            invoice.month,
            currency.format(invoice.roomFee),
            currency.format(invoice.electricity),
            currency.format(invoice.water),
            currency.format(invoice.total),
            <Badge key={invoice.id} status={invoice.status} />,
          ])}
        />
      </section>

      <section className="panel blue-panel">
        <PanelTitle icon={Banknote} title="Thông tin thanh toán" />
        <div className="detail-list">
          <Detail label="Hình thức" value={settings.paymentMethod} />
          <Detail label="Ngân hàng" value={settings.bankName} />
          <Detail label="Số tài khoản" value={settings.bankAccount} />
          <Detail label="Ghi chú" value={settings.paymentNote} />
        </div>
      </section>
    </div>
  );
}

function StudentNoticesPage({ notifications }) {
  return (
    <section className="panel">
      <PanelTitle icon={Bell} title="Thông báo từ ban quản lý" />
      <div className="notice-list">
        {notifications.map((item) => (
          <article key={item.id} className="notice-item">
            <div>
              <strong>{item.title}</strong>
              <span>{item.body}</span>
            </div>
            <div>
              <Badge status={item.type} />
              <small>{item.createdAt}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function StudentContractPage({ contract, student }) {
  return (
    <section className="panel blue-panel">
      <PanelTitle icon={FileText} title="Hợp đồng của tôi" />
      {contract ? (
        <div className="detail-list">
          <Detail label="Mã hợp đồng" value={contract.code} />
          <Detail label="Sinh viên" value={`${student.name} - ${student.code}`} />
          <Detail label="Phòng" value={contract.room} />
          <Detail label="Thời hạn" value={`${contract.startDate} đến ${contract.endDate}`} />
          <Detail label="Tiền cọc" value={currency.format(contract.deposit)} />
          <Detail label="Trạng thái" value={contract.status} />
        </div>
      ) : (
        <p className="empty-text">Chưa có hợp đồng.</p>
      )}
    </section>
  );
}

function StudentFeedbackPage({ student, upsert }) {
  const [form, setForm] = useState({
    rating: 5,
    content: "",
    imageUrl: "",
  });

  function uploadImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, imageUrl: reader.result }));
    reader.readAsDataURL(file);
  }

  async function submit(event) {
    event.preventDefault();
    await upsert("reviews", {
      id: uid("review"),
      studentCode: student.code,
      studentName: student.name,
      room: student.room,
      rating: Number(form.rating),
      content: form.content,
      imageUrl: form.imageUrl,
      status: "Mới",
      createdAt: today(),
    });
    setForm({ rating: 5, content: "", imageUrl: "" });
  }

  return (
    <section className="panel">
      <PanelTitle icon={Star} title="Đánh giá / phản ánh" />
      <form className="form-grid two" onSubmit={submit}>
        <label>
          Mức đánh giá
          <select value={form.rating} onChange={(event) => setForm({ ...form, rating: event.target.value })}>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
        </label>
        <label className="file-button">
          <UploadCloud size={17} />
          <span>Đính kèm ảnh</span>
          <input type="file" accept="image/*" onChange={uploadImage} />
        </label>
        <label className="span-two">
          Nội dung phản ánh
          <textarea
            placeholder="Ví dụ: hỏng điện, nước, wifi, cơ sở vật chất..."
            value={form.content}
            onChange={(event) => setForm({ ...form, content: event.target.value })}
            required
          />
        </label>
        {form.imageUrl && (
          <a className="image-link" href={form.imageUrl} target="_blank" rel="noreferrer">
            <Image size={16} />
            <span>Xem ảnh đã chọn</span>
          </a>
        )}
        <button className="primary-button" type="submit">
          <Save size={18} />
          <span>Gửi phản ánh</span>
        </button>
      </form>
    </section>
  );
}

function StudentAboutPage({ settings }) {
  const [showMoreAbout, setShowMoreAbout] = useState(false);
  const aboutItems = [
    {
      title: "Khu phòng ở hiện đại",
      text: "Phòng ở gọn gàng, có giường riêng, khu sinh hoạt chung và bố trí thuận tiện cho sinh viên học tập, nghỉ ngơi.",
      image: assetPath("/about-room.png"),
    },
    {
      title: "Nhà ăn sinh viên",
      text: "Nhà ăn phục vụ bữa sáng, trưa, tối với không gian sạch sẽ, thoáng và phù hợp nhu cầu sinh hoạt hằng ngày.",
      image: assetPath("/about-dining.png"),
    },
    {
      title: "Phòng đọc sách",
      text: "Khu tự học yên tĩnh, có bàn đọc, ánh sáng tốt, phù hợp ôn bài, làm bài nhóm và học ngoài giờ.",
      image: assetPath("/about-library.png"),
    },
    {
      title: "Khu vệ sinh sạch sẽ",
      text: "Khu vệ sinh, phòng tắm được bố trí riêng, dễ sử dụng và được vệ sinh định kỳ để bảo đảm môi trường sống.",
      image: assetPath("/about-bathroom.png"),
    },
    {
      title: "An ninh và quản lý số hóa",
      text: "Sinh viên theo dõi thông báo, hóa đơn, hợp đồng, phản ánh sửa chữa ngay trên hệ thống KTX UMT.",
      image: assetPath("/umt-campus.png"),
    },
  ];

  return (
    <div className="student-stack">
      <section className="panel blue-panel">
        <PanelTitle
          icon={Building2}
          title="Giới thiệu KTX"
          action={showMoreAbout ? "Xem gọn" : "Xem thêm"}
          onAction={() => setShowMoreAbout((value) => !value)}
        />
        <div className="about-hero">
          <img src={assetPath("/umt-building.png")} alt="KTX UMT" />
          <div>
            <h3>Ký túc xá UMT hiện đại, tiện nghi</h3>
            <p>
              {settings.introduction ||
                "Khu nội trú dành cho sinh viên với 3 tòa nhà, phòng ở gọn gàng, khu sinh hoạt chung, nhà ăn, phòng đọc sách và hệ thống quản lý số hóa."}
            </p>
          </div>
        </div>
        {showMoreAbout && (
          <div className="about-feature-grid">
            {aboutItems.map((item) => (
              <article className="about-feature-card" key={item.title}>
                <img src={item.image} alt={item.title} />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="panel">
        <PanelTitle icon={ShieldAlert} title="Nội quy" />
        <p className="body-copy multiline-copy">{settings.rules}</p>
      </section>
      <section className="panel">
        <PanelTitle icon={Bell} title="Liên hệ" />
        <div className="detail-list">
          <Detail label="Đơn vị" value={settings.contactName} />
          <Detail label="Hotline" value={settings.hotline} />
          <Detail label="Email" value={settings.email} />
          <Detail label="Địa chỉ" value={settings.address} />
        </div>
      </section>
    </div>
  );
}

function StudentFeature({ icon: Icon, title, value }) {
  return (
    <article className="student-feature">
      <div>
        <Icon size={22} />
      </div>
      <strong>{title}</strong>
      <span>{value}</span>
    </article>
  );
}

function MobilePreview({ store, settings }) {
  const [tab, setTab] = useState("home");
  const student = store.students[0];
  const invoices = store.invoices.filter((item) => item.studentCode === student.code);
  const contract = store.contracts.find((item) => item.studentCode === student.code);

  const tabs = [
    { id: "home", label: "Tổng quan", icon: Home },
    { id: "room", label: "A104", icon: BedDouble },
    { id: "bills", label: "Hóa đơn", icon: ReceiptText },
    { id: "notices", label: "Tin báo", icon: Bell },
    { id: "contract", label: "HĐ", icon: FileText },
    { id: "profile", label: "SV", icon: UserRound },
  ];

  return (
    <div className="mobile-layout">
      <section className="panel">
        <PanelTitle icon={Smartphone} title="Ứng dụng sinh viên" />
        <div className="mobile-copy">
          <Detail label="Đăng ký ở KTX" value="Chọn tòa, chọn phòng, gửi đơn chờ duyệt" />
          <Detail label="Thanh toán" value={`${settings.bankName} - ${settings.bankAccount}`} />
          <Detail label="Thông báo" value={`${store.notifications.length} tin từ ban quản lý`} />
          <Detail label="Dữ liệu" value="students, rooms, invoices, contracts, notifications" />
        </div>
      </section>

      <section className="phone-frame" aria-label="Mobile app preview">
        <div className="phone-status">
          <span>9:41</span>
          <span>UMT</span>
        </div>
        <div className="phone-header">
          <div>
            <small>Xin chào</small>
            <strong>{student.name}</strong>
          </div>
          <div className="avatar">{student.name.charAt(0)}</div>
        </div>

        <div className="phone-body">
          {tab === "home" && (
            <>
              <div className="mobile-card blue">
                <span>Phòng hiện tại</span>
                <strong>A104</strong>
                <small>4 thành viên - còn 2 giường</small>
              </div>
              <div className="mobile-actions">
                <button>
                  <ClipboardList size={17} />
                  <span>Đăng ký</span>
                </button>
                <button>
                  <Building2 size={17} />
                  <span>Chọn tòa</span>
                </button>
                <button>
                  <CreditCard size={17} />
                  <span>Thanh toán</span>
                </button>
              </div>
              <div className="mobile-list">
                {store.notifications.slice(0, 2).map((item) => (
                  <div key={item.id}>
                    <Bell size={16} />
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "room" && (
            <>
              <div className="mobile-card green">
                <span>Phòng A104</span>
                <strong>4/6 giường</strong>
                <small>Tòa A - Tầng 1</small>
              </div>
              <div className="mobile-list">
                {store.students
                  .filter((item) => item.room === "A104")
                  .map((item) => (
                    <div key={item.id}>
                      <UserRound size={16} />
                      <span>{item.name}</span>
                    </div>
                  ))}
              </div>
            </>
          )}

          {tab === "bills" && (
            <>
              {invoices.map((invoice) => (
                <div key={invoice.id} className="mobile-card plain">
                  <span>{invoice.month}</span>
                  <strong>{currency.format(invoice.total)}</strong>
                  <small>{invoice.status}</small>
                </div>
              ))}
              <button className="mobile-pay">
                <CreditCard size={17} />
                <span>Thanh toán</span>
              </button>
            </>
          )}

          {tab === "notices" && (
            <div className="mobile-list tall">
              {store.notifications.map((item) => (
                <div key={item.id}>
                  <Bell size={16} />
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          )}

          {tab === "contract" && contract && (
            <div className="mobile-card plain">
              <span>{contract.code}</span>
              <strong>{contract.status}</strong>
              <small>
                {contract.startDate} - {contract.endDate}
              </small>
            </div>
          )}

          {tab === "profile" && (
            <div className="mobile-list tall">
              <div>
                <UserRound size={16} />
                <span>{student.code}</span>
              </div>
              <div>
                <Home size={16} />
                <span>{student.room}</span>
              </div>
              <div>
                <CreditCard size={16} />
                <span>{student.email}</span>
              </div>
            </div>
          )}
        </div>

        <nav className="phone-tabs">
          {tabs.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)} title={item.label}>
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <article className={`stat-card ${tone}`}>
      <div>
        <Icon size={22} />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function PanelTitle({ icon: Icon, title, action, onAction }) {
  return (
    <div className="panel-title">
      <div>
        <Icon size={20} />
        <h2>{title}</h2>
      </div>
      {action && (
        <button className="text-button" onClick={onAction}>
          <span>{action}</span>
        </button>
      )}
    </div>
  );
}

function Badge({ status }) {
  return <span className={`badge ${statusTone(status)}`}>{status}</span>;
}

function Detail({ label, value, compact = false }) {
  return (
    <div className={compact ? "detail compact" : "detail"}>
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

