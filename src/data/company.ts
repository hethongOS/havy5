import company from '../../config/company.json'
import {
  createFund,
  type FundConfig,
  type FundState,
  type LedgerEntry,
} from '../lib/fund'

export type ApprovalKind = 'product' | 'budget' | 'exception'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export type ApprovalItem = {
  id: string
  kind: ApprovalKind
  title: string
  detail: string
  amount?: number
  agentId: string
  agentName: string
  status: ApprovalStatus
  createdAt: string
}

export type ProductIdea = {
  id: string
  name: string
  category: string
  price: number
  marginPercent: number
  channel: string
  risk: string
  status: 'proposed' | 'approved' | 'rejected' | 'selling'
}

export type Lead = {
  id: string
  name: string
  source: string
  score: 'nong' | 'am' | 'lanh'
  note: string
  messageDraft: string
}

export type AgentView = {
  id: string
  name: string
  role: string
  mission: string
  status: 'working' | 'waiting' | 'blocked'
  currentTask: string
}

export type Activity = {
  id: string
  agentId: string
  agentName: string
  text: string
  time: string
}

export const companyMeta = company

export const fundConfig: FundConfig = {
  initialCapital: company.fund.initialCapital,
  dailySpendCeiling: company.fund.dailySpendCeiling,
  adsDailyCeiling: company.fund.adsDailyCeiling,
  refundDailyCeiling: company.fund.refundDailyCeiling,
  maxDiscountPercent: company.fund.maxDiscountPercent,
  minMarginPercent: company.fund.minMarginPercent,
  allowAutoTransfer: company.fund.allowAutoTransfer,
  allowAutoAdsIncrease: company.fund.allowAutoAdsIncrease,
}

export function initialFund(): FundState {
  return createFund(fundConfig)
}

export const initialAgents: AgentView[] = company.agents.map((a, i) => ({
  id: a.id,
  name: a.name,
  role: a.role,
  mission: a.mission,
  status: i === 0 ? 'working' : 'waiting',
  currentTask:
    a.id === 'dieu-phoi'
      ? 'Theo dõi quỹ và hàng duyệt'
      : a.id === 'san-pham'
        ? 'Chuẩn bị 3 đề xuất sản phẩm số'
        : a.id === 'khach-hang'
          ? 'Chờ sản phẩm được duyệt để săn lead'
          : 'Chờ catalog để chốt đơn',
}))

export const initialProducts: ProductIdea[] = [
  {
    id: 'p1',
    name: 'Notion OS cho shop nhỏ',
    category: 'template',
    price: 299_000,
    marginPercent: 92,
    channel: 'Landing + Zalo',
    risk: 'Cạnh tranh template miễn phí',
    status: 'proposed',
  },
  {
    id: 'p2',
    name: 'Pack 50 caption bán hàng Việt',
    category: 'content-pack',
    price: 149_000,
    marginPercent: 95,
    channel: 'Facebook group + email',
    risk: 'Dễ copy — cần update định kỳ',
    status: 'proposed',
  },
  {
    id: 'p3',
    name: 'Mini-tool tính giá dropship',
    category: 'tool-nho',
    price: 399_000,
    marginPercent: 88,
    channel: 'Product Hunt VN + Telegram',
    risk: 'Cần maintain nhẹ',
    status: 'proposed',
  },
]

export const initialLeads: Lead[] = [
  {
    id: 'l1',
    name: 'Chủ shop nội thất Q7',
    source: 'Group Facebook Seller',
    score: 'nong',
    note: 'Đang hỏi cách quản lý đơn Zalo',
    messageDraft:
      'Chào anh/chị, em thấy anh/chị đang tìm cách quản lý đơn. Bên em có Notion OS cho shop nhỏ — anh/chị muốn xem bản demo không ạ?',
  },
  {
    id: 'l2',
    name: 'Freelancer content Đà Nẵng',
    source: 'Telegram marketing',
    score: 'am',
    note: 'Cần caption bán hàng hàng tuần',
    messageDraft:
      'Chào bạn, mình có pack 50 caption bán hàng tiếng Việt — dùng được ngay. Bạn muốn xem 5 mẫu miễn phí không?',
  },
]

export const initialApprovals: ApprovalItem[] = [
  {
    id: 'a1',
    kind: 'product',
    title: 'Chốt sản phẩm mở bán đầu tiên',
    detail: 'AI Sản phẩm đề xuất 3 ý tưởng digital. Chọn 1 để đưa vào catalog.',
    agentId: 'san-pham',
    agentName: 'Sản phẩm',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a2',
    kind: 'budget',
    title: 'Duyệt mẫu tin outreach + ads 100.000đ/ngày',
    detail: 'Mẫu tin lead nóng/ấm. Ads chỉ chạy sau khi có sản phẩm duyệt.',
    amount: 100_000,
    agentId: 'khach-hang',
    agentName: 'Khách hàng',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
]

export const approvalLabel: Record<ApprovalKind, string> = {
  product: 'Sản phẩm',
  budget: 'Ngân sách',
  exception: 'Ngoại lệ',
}

export const scoreLabel = {
  nong: 'Nóng',
  am: 'Ấm',
  lanh: 'Lạnh',
} as const

export function money(n: number) {
  return `${n.toLocaleString('vi-VN')}đ`
}

export function timeLabel(iso?: string) {
  const d = iso ? new Date(iso) : new Date()
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

export function ledgerLabel(kind: LedgerEntry['kind']) {
  switch (kind) {
    case 'deposit':
      return 'Nạp vốn'
    case 'sale':
      return 'Bán hàng'
    case 'ads':
      return 'Ads'
    case 'purchase':
      return 'Chi mua'
    case 'refund':
      return 'Hoàn tiền'
    case 'blocked_transfer':
      return 'Chặn CK'
    case 'blocked_ads':
      return 'Chặn ads'
    default:
      return kind
  }
}
