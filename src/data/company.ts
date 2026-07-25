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
    name: 'AIVA Pro (năm) + Setup 90 phút',
    category: 'aiva-goi-chinh-chu',
    price: 6_500_000,
    marginPercent: 35,
    channel: 'Link AFF / đại lý chính chủ',
    risk: 'Hoa hồng phụ thuộc chính sách AIVA — cần xác nhận',
    status: 'proposed',
  },
  {
    id: 'p2',
    name: 'AIVA VIP (năm) + Đào tạo team 3 buổi',
    category: 'aiva-goi-chinh-chu',
    price: 13_500_000,
    marginPercent: 30,
    channel: 'Đại lý chính chủ + Zoom',
    risk: 'Chu kỳ chốt dài hơn; cần demo rõ ROI',
    status: 'proposed',
  },
  {
    id: 'p3',
    name: 'Gói Setup AIVA cho shop (không kèm license)',
    category: 'dich-vu-setup-aiva',
    price: 1_200_000,
    marginPercent: 85,
    channel: 'Zalo OA + upsell sau AFF',
    risk: 'Khách đã có sẵn AIVA mới mua — cần lead đủ ấm',
    status: 'proposed',
  },
]

export const initialLeads: Lead[] = [
  {
    id: 'l1',
    name: 'Chủ shop nội thất Q7',
    source: 'Group Facebook Seller',
    score: 'nong',
    note: 'Đang hỏi AI viết content + trả lời Zalo tự động',
    messageDraft:
      'Chào anh/chị, em thấy anh/chị đang tìm AI hỗ trợ bán hàng. Bên em triển khai AIVA chính chủ + setup sẵn kịch bản shop — anh/chị muốn xem demo 15 phút không ạ?',
  },
  {
    id: 'l2',
    name: 'Marketer agency nhỏ HN',
    source: 'Telegram marketing',
    score: 'am',
    note: 'Muốn giảm chi phí viết ads / SEO',
    messageDraft:
      'Chào bạn, mình hỗ trợ gói AIVA Pro chính chủ kèm setup workflow content. Bạn đang dùng tool nào và muốn tối ưu phần nào trước?',
  },
]

export const initialApprovals: ApprovalItem[] = [
  {
    id: 'a1',
    kind: 'product',
    title: 'Chốt SKU AIVA mở bán đầu tiên',
    detail:
      'AI đề xuất 3 SKU chính chủ (Pro+Setup / VIP+đào tạo / Setup thuần). Chọn 1. Cấm bán shared account.',
    agentId: 'san-pham',
    agentName: 'Sản phẩm',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a2',
    kind: 'budget',
    title: 'Duyệt mẫu tin AIVA + ads 100.000đ/ngày',
    detail: 'Mẫu tin lead shop/marketer. Chỉ nói AIVA chính chủ — không quảng cáo TK giá rẻ.',
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
