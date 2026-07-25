import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  attemptSale,
  attemptSpend,
  buildDailyReport,
  createFund,
  type FundConfig,
} from './fund.ts'

const config: FundConfig = {
  initialCapital: 5_000_000,
  dailySpendCeiling: 300_000,
  adsDailyCeiling: 150_000,
  refundDailyCeiling: 200_000,
  maxDiscountPercent: 15,
  minMarginPercent: 25,
  allowAutoTransfer: false,
  allowAutoAdsIncrease: false,
}

describe('Quỹ có phanh', () => {
  it('nạp vốn ban đầu', () => {
    const fund = createFund(config)
    assert.equal(fund.balance, 5_000_000)
    assert.equal(fund.ledger[0]?.kind, 'deposit')
  })

  it('chặn chuyển khoản tự động', () => {
    const fund = createFund(config)
    const result = attemptSpend(fund, config, {
      kind: 'purchase',
      amount: 100_000,
      note: 'Chuyển khoản nhà cung cấp XYZ',
      agentId: 'san-pham',
    })
    assert.equal(result.ok, false)
    if (!result.ok) assert.equal(result.code, 'TRANSFER_FORBIDDEN')
  })

  it('chặn tự tăng ads', () => {
    const fund = createFund(config)
    const result = attemptSpend(fund, config, {
      kind: 'ads',
      amount: 50_000,
      note: 'Tăng ngân sách Facebook',
      agentId: 'khach-hang',
      increaseAdsBudget: true,
    })
    assert.equal(result.ok, false)
    if (!result.ok) assert.equal(result.code, 'ADS_INCREASE_FORBIDDEN')
  })

  it('cho phép ads trong trần', () => {
    const fund = createFund(config)
    const result = attemptSpend(fund, config, {
      kind: 'ads',
      amount: 100_000,
      note: 'Ads mẫu đã duyệt',
      agentId: 'khach-hang',
    })
    assert.equal(result.ok, true)
    if (result.ok) {
      assert.equal(result.state.adsSpentToday, 100_000)
      assert.equal(result.state.balance, 4_900_000)
    }
  })

  it('chặn ads vượt trần ngày', () => {
    let fund = createFund(config)
    const first = attemptSpend(fund, config, {
      kind: 'ads',
      amount: 150_000,
      note: 'Ads full trần',
      agentId: 'khach-hang',
    })
    assert.equal(first.ok, true)
    if (first.ok) fund = first.state

    const second = attemptSpend(fund, config, {
      kind: 'ads',
      amount: 1,
      note: 'Ads thêm',
      agentId: 'khach-hang',
    })
    assert.equal(second.ok, false)
    if (!second.ok) assert.equal(second.code, 'ADS_CEILING')
  })

  it('bán trong luật thì cộng tiền', () => {
    const fund = createFund(config)
    const result = attemptSale(fund, config, {
      amount: 299_000,
      discountPercent: 10,
      marginPercent: 55,
      note: 'Bán template Notion pack',
      agentId: 'ban-hang',
    })
    assert.equal(result.ok, true)
    if (result.ok) assert.equal(result.state.salesToday, 299_000)
  })

  it('giảm giá quá mức → cần duyệt ngoại lệ', () => {
    const fund = createFund(config)
    const result = attemptSale(fund, config, {
      amount: 200_000,
      discountPercent: 30,
      marginPercent: 50,
      note: 'Flash sale',
      agentId: 'ban-hang',
    })
    assert.equal(result.ok, false)
    if (!result.ok) {
      assert.equal(result.code, 'DISCOUNT_LIMIT')
      assert.equal(result.needsApproval, 'exception')
    }
  })

  it('báo cáo ngày có tóm tắt tiếng Việt', () => {
    const fund = createFund(config)
    const report = buildDailyReport(fund, 2)
    assert.match(report.summary, /chờ duyệt/)
    assert.equal(report.pendingApprovals, 2)
  })
})
