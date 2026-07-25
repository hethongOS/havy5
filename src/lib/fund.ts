/** Core “Quỹ có phanh” — capital brakes & approval gates. */

export type ApprovalKind = 'product' | 'budget' | 'exception'

export type LedgerKind =
  | 'deposit'
  | 'ads'
  | 'purchase'
  | 'refund'
  | 'sale'
  | 'blocked_transfer'
  | 'blocked_ads'

export type LedgerEntry = {
  id: string
  kind: LedgerKind
  amount: number
  note: string
  at: string
  agentId?: string
}

export type FundConfig = {
  initialCapital: number
  dailySpendCeiling: number
  adsDailyCeiling: number
  refundDailyCeiling: number
  maxDiscountPercent: number
  minMarginPercent: number
  allowAutoTransfer: boolean
  allowAutoAdsIncrease: boolean
}

export type FundState = {
  balance: number
  spentToday: number
  adsSpentToday: number
  refundsToday: number
  salesToday: number
  dayKey: string
  ledger: LedgerEntry[]
}

export type SpendRequest = {
  kind: 'ads' | 'purchase' | 'refund'
  amount: number
  note: string
  agentId: string
  /** True if this would raise ads budget beyond previously approved daily ads ceiling usage pattern */
  increaseAdsBudget?: boolean
}

export type SpendResult =
  | { ok: true; state: FundState; entry: LedgerEntry }
  | { ok: false; reason: string; code: 'TRANSFER_FORBIDDEN' | 'ADS_INCREASE_FORBIDDEN' | 'DAILY_CEILING' | 'ADS_CEILING' | 'REFUND_CEILING' | 'INSUFFICIENT'; state: FundState }

export type SaleRequest = {
  amount: number
  discountPercent: number
  marginPercent: number
  note: string
  agentId: string
}

export type SaleResult =
  | { ok: true; state: FundState; entry: LedgerEntry }
  | { ok: false; reason: string; code: 'DISCOUNT_LIMIT' | 'MARGIN_LIMIT'; needsApproval: ApprovalKind; state: FundState }

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

function entryId() {
  return `led-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function createFund(config: FundConfig, at = new Date()): FundState {
  const deposit: LedgerEntry = {
    id: entryId(),
    kind: 'deposit',
    amount: config.initialCapital,
    note: 'Nạp vốn thử nghiệm (R&D)',
    at: at.toISOString(),
  }
  return {
    balance: config.initialCapital,
    spentToday: 0,
    adsSpentToday: 0,
    refundsToday: 0,
    salesToday: 0,
    dayKey: todayKey(at),
    ledger: [deposit],
  }
}

/** Reset daily counters when the calendar day changes. */
export function rollDay(state: FundState, at = new Date()): FundState {
  const key = todayKey(at)
  if (state.dayKey === key) return state
  return {
    ...state,
    dayKey: key,
    spentToday: 0,
    adsSpentToday: 0,
    refundsToday: 0,
    salesToday: 0,
  }
}

/**
 * Attempt a spend. Hard brakes:
 * - never auto bank transfer
 * - never auto-increase ads beyond policy
 * - enforce daily ceilings
 */
export function attemptSpend(
  state: FundState,
  config: FundConfig,
  req: SpendRequest,
  at = new Date(),
): SpendResult {
  const rolled = rollDay(state, at)

  if (!config.allowAutoTransfer && req.kind === 'purchase' && req.note.toLowerCase().includes('chuyển khoản')) {
    const blocked: LedgerEntry = {
      id: entryId(),
      kind: 'blocked_transfer',
      amount: req.amount,
      note: `CHẶN: ${req.note}`,
      at: at.toISOString(),
      agentId: req.agentId,
    }
    return {
      ok: false,
      code: 'TRANSFER_FORBIDDEN',
      reason: 'Cấm agent tự chuyển khoản. Việc này phải do chủ quỹ thực hiện tay.',
      state: { ...rolled, ledger: [blocked, ...rolled.ledger] },
    }
  }

  if (req.increaseAdsBudget && !config.allowAutoAdsIncrease) {
    const blocked: LedgerEntry = {
      id: entryId(),
      kind: 'blocked_ads',
      amount: req.amount,
      note: `CHẶN tăng ads: ${req.note}`,
      at: at.toISOString(),
      agentId: req.agentId,
    }
    return {
      ok: false,
      code: 'ADS_INCREASE_FORBIDDEN',
      reason: 'Cấm tự tăng ngân sách ads. Cần duyệt ngân sách (điểm duyệt #2).',
      state: { ...rolled, ledger: [blocked, ...rolled.ledger] },
    }
  }

  if (req.amount > rolled.balance) {
    return {
      ok: false,
      code: 'INSUFFICIENT',
      reason: 'Số dư quỹ không đủ.',
      state: rolled,
    }
  }

  if (req.kind === 'ads' && rolled.adsSpentToday + req.amount > config.adsDailyCeiling) {
    return {
      ok: false,
      code: 'ADS_CEILING',
      reason: `Vượt trần ads/ngày (${config.adsDailyCeiling.toLocaleString('vi-VN')}đ). Cần duyệt ngân sách.`,
      state: rolled,
    }
  }

  if (req.kind === 'refund' && rolled.refundsToday + req.amount > config.refundDailyCeiling) {
    return {
      ok: false,
      code: 'REFUND_CEILING',
      reason: `Vượt trần hoàn tiền/ngày. Cần duyệt ngoại lệ (điểm duyệt #3).`,
      state: rolled,
    }
  }

  const spendKinds = req.kind === 'ads' || req.kind === 'purchase' || req.kind === 'refund'
  if (spendKinds && rolled.spentToday + req.amount > config.dailySpendCeiling) {
    return {
      ok: false,
      code: 'DAILY_CEILING',
      reason: `Vượt trần chi/ngày (${config.dailySpendCeiling.toLocaleString('vi-VN')}đ). Cần chủ quỹ nới hạn mức.`,
      state: rolled,
    }
  }

  const entry: LedgerEntry = {
    id: entryId(),
    kind: req.kind,
    amount: req.amount,
    note: req.note,
    at: at.toISOString(),
    agentId: req.agentId,
  }

  return {
    ok: true,
    entry,
    state: {
      ...rolled,
      balance: rolled.balance - req.amount,
      spentToday: rolled.spentToday + req.amount,
      adsSpentToday: req.kind === 'ads' ? rolled.adsSpentToday + req.amount : rolled.adsSpentToday,
      refundsToday: req.kind === 'refund' ? rolled.refundsToday + req.amount : rolled.refundsToday,
      ledger: [entry, ...rolled.ledger],
    },
  }
}

/** Record a sale; discount/margin outside policy → exception approval. */
export function attemptSale(
  state: FundState,
  config: FundConfig,
  req: SaleRequest,
  at = new Date(),
): SaleResult {
  const rolled = rollDay(state, at)

  if (req.discountPercent > config.maxDiscountPercent) {
    return {
      ok: false,
      code: 'DISCOUNT_LIMIT',
      reason: `Giảm giá ${req.discountPercent}% vượt mức tối đa ${config.maxDiscountPercent}%. Cần duyệt ngoại lệ.`,
      needsApproval: 'exception',
      state: rolled,
    }
  }

  if (req.marginPercent < config.minMarginPercent) {
    return {
      ok: false,
      code: 'MARGIN_LIMIT',
      reason: `Biên lời ${req.marginPercent}% dưới sàn ${config.minMarginPercent}%. Cần duyệt ngoại lệ.`,
      needsApproval: 'exception',
      state: rolled,
    }
  }

  const entry: LedgerEntry = {
    id: entryId(),
    kind: 'sale',
    amount: req.amount,
    note: req.note,
    at: at.toISOString(),
    agentId: req.agentId,
  }

  return {
    ok: true,
    entry,
    state: {
      ...rolled,
      balance: rolled.balance + req.amount,
      salesToday: rolled.salesToday + req.amount,
      ledger: [entry, ...rolled.ledger],
    },
  }
}

export type DailyReport = {
  dayKey: string
  balance: number
  salesToday: number
  spentToday: number
  adsSpentToday: number
  refundsToday: number
  netToday: number
  pendingApprovals: number
  blockedEvents: number
  summary: string
}

export function buildDailyReport(
  state: FundState,
  pendingApprovals: number,
): DailyReport {
  const blockedEvents = state.ledger.filter(
    (e) => e.kind === 'blocked_transfer' || e.kind === 'blocked_ads',
  ).length
  const netToday = state.salesToday - state.spentToday
  const summary = [
    `Ngày ${state.dayKey}`,
    `Số dư ${state.balance.toLocaleString('vi-VN')}đ`,
    `Bán +${state.salesToday.toLocaleString('vi-VN')}đ`,
    `Chi -${state.spentToday.toLocaleString('vi-VN')}đ`,
    `Ròng ${netToday.toLocaleString('vi-VN')}đ`,
    pendingApprovals > 0 ? `${pendingApprovals} việc chờ duyệt` : 'Không việc chờ duyệt',
    blockedEvents > 0 ? `${blockedEvents} lần phanh chặn` : 'Phanh ổn',
  ].join(' · ')

  return {
    dayKey: state.dayKey,
    balance: state.balance,
    salesToday: state.salesToday,
    spentToday: state.spentToday,
    adsSpentToday: state.adsSpentToday,
    refundsToday: state.refundsToday,
    netToday,
    pendingApprovals,
    blockedEvents,
    summary,
  }
}
