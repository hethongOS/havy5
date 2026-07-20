export type AgentStatus = 'working' | 'idle' | 'meeting' | 'away'

export type Agent = {
  id: string
  name: string
  role: string
  status: AgentStatus
  task: string
  x: number
  y: number
  hue: number
}

export type Activity = {
  id: string
  agentId: string
  agentName: string
  text: string
  time: string
}

export const officeName = 'Văn phòng số Trịnh'
export const officeTagline = 'Đội OpenClaw đang vận hành 24/7'

export const initialAgents: Agent[] = [
  {
    id: 'trinh',
    name: 'Trịnh',
    role: 'Điều phối viên',
    status: 'working',
    task: 'Phân công nhiệm vụ cho đội AI',
    x: 48,
    y: 42,
    hue: 42,
  },
  {
    id: 'mai',
    name: 'Mai',
    role: 'Trợ lý nội dung',
    status: 'working',
    task: 'Soạn báo cáo tuần cho khách hàng',
    x: 18,
    y: 28,
    hue: 160,
  },
  {
    id: 'long',
    name: 'Long',
    role: 'Kỹ sư tự động hóa',
    status: 'meeting',
    task: 'Đồng bộ webhook Zalo & Telegram',
    x: 78,
    y: 30,
    hue: 200,
  },
  {
    id: 'an',
    name: 'An',
    role: 'Phân tích dữ liệu',
    status: 'idle',
    task: 'Chờ dữ liệu CRM mới',
    x: 22,
    y: 68,
    hue: 280,
  },
  {
    id: 'hue',
    name: 'Huệ',
    role: 'Chăm sóc khách hàng',
    status: 'working',
    task: 'Trả lời ticket hỗ trợ #4821',
    x: 72,
    y: 66,
    hue: 12,
  },
  {
    id: 'khoa',
    name: 'Khoa',
    role: 'Bảo mật & giám sát',
    status: 'away',
    task: 'Quét cổng gateway OpenClaw',
    x: 50,
    y: 78,
    hue: 90,
  },
]

export const statusLabel: Record<AgentStatus, string> = {
  working: 'Đang làm việc',
  idle: 'Sẵn sàng',
  meeting: 'Họp',
  away: 'Tuần tra',
}

export const taskPool = [
  'Tóm tắt hộp thư đến trong 15 phút qua',
  'Cập nhật lịch họp với đối tác',
  'Kiểm tra cron job nightly backup',
  'Soạn draft email xác nhận đơn hàng',
  'Đồng bộ file Drive vào thư mục dự án',
  'Phân loại ticket theo mức ưu tiên',
  'Chạy skill bảo mật Port Guard',
  'Chuẩn bị slide họp sáng mai',
  'Theo dõi phản hồi khách trên Zalo',
  'Ghi nhật ký hoạt động gateway',
]

export const activitySeed: Omit<Activity, 'id' | 'time'>[] = [
  {
    agentId: 'trinh',
    agentName: 'Trịnh',
    text: 'Khởi động phiên OpenClaw và phân công ca làm việc.',
  },
  {
    agentId: 'mai',
    agentName: 'Mai',
    text: 'Đã tạo bản nháp báo cáo tuần — chờ duyệt.',
  },
  {
    agentId: 'long',
    agentName: 'Long',
    text: 'Kết nối kênh Telegram thành công.',
  },
  {
    agentId: 'hue',
    agentName: 'Huệ',
    text: 'Đã trả lời 3 ticket hỗ trợ khách hàng.',
  },
]
