import { useCallback, useMemo, useState } from 'react'
import {
  approvalLabel,
  companyMeta,
  fundConfig,
  initialAgents,
  initialApprovals,
  initialLeads,
  initialProducts,
  initialFund,
  money,
  timeLabel,
  type Activity,
  type AgentView,
  type ApprovalItem,
  type Lead,
  type ProductIdea,
} from './data/company'
import {
  attemptSale,
  attemptSpend,
  buildDailyReport,
  type FundState,
} from './lib/fund'

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

export function useCompany() {
  const [fund, setFund] = useState<FundState>(() => initialFund())
  const [agents, setAgents] = useState<AgentView[]>(initialAgents)
  const [products, setProducts] = useState<ProductIdea[]>(initialProducts)
  const [leads] = useState<Lead[]>(initialLeads)
  const [approvals, setApprovals] = useState<ApprovalItem[]>(initialApprovals)
  const [activities, setActivities] = useState<Activity[]>(() => [
    {
      id: 'seed-1',
      agentId: 'dieu-phoi',
      agentName: 'Điều phối',
      text: 'Khởi động Quỹ có phanh — niche sản phẩm số, chờ Chủ quỹ duyệt.',
      time: timeLabel(),
    },
  ])
  const [toast, setToast] = useState<string | null>(null)

  const pushActivity = useCallback((agentId: string, agentName: string, text: string) => {
    setActivities((list) =>
      [
        { id: uid('act'), agentId, agentName, text, time: timeLabel() },
        ...list,
      ].slice(0, 20),
    )
  }, [])

  const flash = useCallback((msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 3200)
  }, [])

  const pending = useMemo(
    () => approvals.filter((a) => a.status === 'pending'),
    [approvals],
  )

  const report = useMemo(
    () => buildDailyReport(fund, pending.length),
    [fund, pending.length],
  )

  const approvedProduct = products.find((p) => p.status === 'approved' || p.status === 'selling')

  const approve = useCallback(
    (id: string) => {
      const item = approvals.find((a) => a.id === id)
      if (!item || item.status !== 'pending') return

      setApprovals((list) =>
        list.map((a) => (a.id === id ? { ...a, status: 'approved' as const } : a)),
      )

      if (item.kind === 'product') {
        // Approve first proposed product by default when bulk product gate is approved
        setProducts((list) => {
          const first = list.find((p) => p.status === 'proposed')
          if (!first) return list
          return list.map((p) =>
            p.id === first.id
              ? { ...p, status: 'selling' as const }
              : p.status === 'proposed'
                ? { ...p, status: 'rejected' as const }
                : p,
          )
        })
        setAgents((list) =>
          list.map((a) => {
            if (a.id === 'san-pham')
              return { ...a, status: 'waiting', currentTask: 'Theo dõi sản phẩm đã chốt' }
            if (a.id === 'khach-hang')
              return { ...a, status: 'working', currentTask: 'Săn lead cho sản phẩm đã duyệt' }
            if (a.id === 'ban-hang')
              return { ...a, status: 'waiting', currentTask: 'Chờ lead + mẫu tin duyệt' }
            return a
          }),
        )
        pushActivity('san-pham', 'Sản phẩm', 'Chủ quỹ đã chốt sản phẩm mở bán đầu tiên.')
        flash('Đã duyệt sản phẩm — AI Khách bắt đầu săn lead.')
      }

      if (item.kind === 'budget') {
        const spend = attemptSpend(fund, fundConfig, {
          kind: 'ads',
          amount: item.amount ?? 50_000,
          note: 'Ads theo ngân sách đã duyệt',
          agentId: 'khach-hang',
        })
        setFund(spend.state)
        setAgents((list) =>
          list.map((a) =>
            a.id === 'khach-hang' || a.id === 'ban-hang'
              ? {
                  ...a,
                  status: 'working' as const,
                  currentTask:
                    a.id === 'khach-hang'
                      ? 'Gửi outreach theo mẫu đã duyệt'
                      : 'Sẵn sàng chốt đơn trong hạn mức',
                }
              : a,
          ),
        )
        if (spend.ok) {
          pushActivity(
            'khach-hang',
            'Khách hàng',
            `Đã chạy ads ${money(item.amount ?? 0)} trong trần duyệt.`,
          )
          flash('Đã duyệt ngân sách — ads chạy trong hạn mức.')
        } else {
          pushActivity('dieu-phoi', 'Điều phối', `Phanh: ${spend.reason}`)
          flash(spend.reason)
        }
      }

      if (item.kind === 'exception') {
        pushActivity('dieu-phoi', 'Điều phối', `Chủ quỹ duyệt ngoại lệ: ${item.title}`)
        flash('Đã duyệt ngoại lệ.')
      }
    },
    [approvals, fund, flash, pushActivity],
  )

  const reject = useCallback(
    (id: string) => {
      const item = approvals.find((a) => a.id === id)
      if (!item || item.status !== 'pending') return
      setApprovals((list) =>
        list.map((a) => (a.id === id ? { ...a, status: 'rejected' as const } : a)),
      )
      pushActivity('dieu-phoi', 'Điều phối', `Từ chối: ${item.title}`)
      flash('Đã từ chối yêu cầu.')
    },
    [approvals, flash, pushActivity],
  )

  const approveProduct = useCallback(
    (productId: string) => {
      setProducts((list) =>
        list.map((p) =>
          p.id === productId
            ? { ...p, status: 'selling' as const }
            : p.status === 'proposed'
              ? { ...p, status: 'rejected' as const }
              : p,
        ),
      )
      setApprovals((list) =>
        list.map((a) =>
          a.kind === 'product' && a.status === 'pending'
            ? { ...a, status: 'approved' as const }
            : a,
        ),
      )
      setAgents((list) =>
        list.map((a) => {
          if (a.id === 'khach-hang')
            return { ...a, status: 'working', currentTask: 'Săn lead cho sản phẩm đã chọn' }
          if (a.id === 'san-pham')
            return { ...a, status: 'waiting', currentTask: 'Sản phẩm đã được chốt' }
          return a
        }),
      )
      const p = products.find((x) => x.id === productId)
      pushActivity('san-pham', 'Sản phẩm', `Chủ quỹ chọn bán: ${p?.name ?? productId}`)
      flash(`Đã chọn sản phẩm: ${p?.name ?? ''}`)
    },
    [products, flash, pushActivity],
  )

  /** Simulate agent trying forbidden transfer — must be blocked. */
  const tryIllegalTransfer = useCallback(() => {
    const result = attemptSpend(fund, fundConfig, {
      kind: 'purchase',
      amount: 500_000,
      note: 'Chuyển khoản NCC Alibaba tự động',
      agentId: 'san-pham',
    })
    setFund(result.state)
    setAgents((list) =>
      list.map((a) =>
        a.id === 'san-pham'
          ? { ...a, status: 'blocked' as const, currentTask: 'Bị phanh: cấm chuyển khoản' }
          : a,
      ),
    )
    if (!result.ok) {
      setApprovals((list) => [
        {
          id: uid('ap'),
          kind: 'exception',
          title: 'Agent muốn chuyển khoản NCC',
          detail: result.reason,
          amount: 500_000,
          agentId: 'san-pham',
          agentName: 'Sản phẩm',
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
        ...list,
      ])
      pushActivity('dieu-phoi', 'Điều phối', `PHANH: ${result.reason}`)
      flash('Phanh đã chặn chuyển khoản tự động.')
    }
  }, [fund, flash, pushActivity])

  const tryAdsIncrease = useCallback(() => {
    const result = attemptSpend(fund, fundConfig, {
      kind: 'ads',
      amount: 200_000,
      note: 'Tự tăng ads Facebook x2',
      agentId: 'khach-hang',
      increaseAdsBudget: true,
    })
    setFund(result.state)
    if (!result.ok) {
      setApprovals((list) => [
        {
          id: uid('ap'),
          kind: 'budget',
          title: 'Xin tăng ngân sách ads',
          detail: result.reason,
          amount: 200_000,
          agentId: 'khach-hang',
          agentName: 'Khách hàng',
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
        ...list,
      ])
      pushActivity('khach-hang', 'Khách hàng', `Bị chặn tăng ads — chờ duyệt ngân sách.`)
      flash('Phanh đã chặn tự tăng ads.')
    }
  }, [fund, flash, pushActivity])

  const simulateSale = useCallback(() => {
    if (!approvedProduct) {
      flash('Chưa có sản phẩm được duyệt — không thể bán.')
      setApprovals((list) => {
        if (list.some((a) => a.kind === 'product' && a.status === 'pending')) return list
        return [
          {
            id: uid('ap'),
            kind: 'product',
            title: 'Cần duyệt sản phẩm trước khi bán',
            detail: 'AI Bán hàng không được bán hàng ngoài catalog đã duyệt.',
            agentId: 'ban-hang',
            agentName: 'Bán hàng',
            status: 'pending',
            createdAt: new Date().toISOString(),
          },
          ...list,
        ]
      })
      return
    }

    const result = attemptSale(fund, fundConfig, {
      amount: approvedProduct.price,
      discountPercent: 10,
      marginPercent: approvedProduct.marginPercent,
      note: `Bán ${approvedProduct.name}`,
      agentId: 'ban-hang',
    })
    setFund(result.state)
    if (result.ok) {
      setAgents((list) =>
        list.map((a) =>
          a.id === 'ban-hang'
            ? { ...a, status: 'working', currentTask: `Vừa chốt đơn ${money(approvedProduct.price)}` }
            : a,
        ),
      )
      pushActivity(
        'ban-hang',
        'Bán hàng',
        `Chốt đơn ${approvedProduct.name} · +${money(approvedProduct.price)}`,
      )
      flash(`Đã bán +${money(approvedProduct.price)}`)
    } else {
      flash(result.reason)
    }
  }, [approvedProduct, fund, flash, pushActivity])

  const simulateDeepDiscount = useCallback(() => {
    if (!approvedProduct) {
      flash('Cần duyệt sản phẩm trước.')
      return
    }
    const result = attemptSale(fund, fundConfig, {
      amount: Math.round(approvedProduct.price * 0.5),
      discountPercent: 50,
      marginPercent: approvedProduct.marginPercent,
      note: `Flash sale 50% ${approvedProduct.name}`,
      agentId: 'ban-hang',
    })
    if (!result.ok) {
      setApprovals((list) => [
        {
          id: uid('ap'),
          kind: 'exception',
          title: 'Xin giảm giá 50% (vượt mức 15%)',
          detail: result.reason,
          amount: Math.round(approvedProduct.price * 0.5),
          agentId: 'ban-hang',
          agentName: 'Bán hàng',
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
        ...list,
      ])
      pushActivity('ban-hang', 'Bán hàng', 'Giảm giá 50% bị phanh — chờ duyệt ngoại lệ.')
      flash('Phanh: giảm giá vượt mức — cần duyệt ngoại lệ.')
    }
  }, [approvedProduct, fund, flash, pushActivity])

  const runMorningReport = useCallback(() => {
    const r = buildDailyReport(fund, pending.length)
    pushActivity('dieu-phoi', 'Điều phối', `Báo cáo ngày: ${r.summary}`)
    flash('Đã gửi báo cáo ngày.')
  }, [fund, pending.length, flash, pushActivity])

  return {
    companyMeta,
    fundConfig,
    fund,
    agents,
    products,
    leads,
    approvals,
    pending,
    activities,
    report,
    toast,
    approvedProduct,
    approve,
    reject,
    approveProduct,
    tryIllegalTransfer,
    tryAdsIncrease,
    simulateSale,
    simulateDeepDiscount,
    runMorningReport,
    approvalLabel,
    money,
  }
}
