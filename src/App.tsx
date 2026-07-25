import { useCompany } from './useCompany'
import { ledgerLabel, scoreLabel, timeLabel } from './data/company'

export default function App() {
  const c = useCompany()
  const f = c.fundConfig

  return (
    <div className="app">
      <div className="shell">
        <header className="topbar">
          <div className="brand">
            <div className="brand-mark">
              <span className="mark" aria-hidden="true" />
              <h1>{c.companyMeta.name}</h1>
            </div>
            <p>{c.companyMeta.tagline}</p>
          </div>
          <div className="pills">
            <span className="pill niche">{c.companyMeta.niche.label}</span>
            <span className="pill live">
              <span className="dot" />
              Quỹ có phanh · bật
            </span>
          </div>
        </header>

        <section className="hero-fund" aria-label="Tình trạng quỹ">
          <div className="metric">
            <span className="label">Số dư quỹ</span>
            <strong>{c.money(c.fund.balance)}</strong>
          </div>
          <div className="metric">
            <span className="label">Bán hôm nay</span>
            <strong className="ok">+{c.money(c.report.salesToday)}</strong>
          </div>
          <div className="metric">
            <span className="label">Chi hôm nay</span>
            <strong className="warn">−{c.money(c.report.spentToday)}</strong>
          </div>
          <div className="metric">
            <span className="label">Chờ duyệt</span>
            <strong>{c.pending.length}</strong>
          </div>
          <div className="metric ceilings">
            <span className="label">Phanh ngày</span>
            <p>
              Chi ≤ {c.money(f.dailySpendCeiling)} · Ads ≤ {c.money(f.adsDailyCeiling)} · Hoàn ≤{' '}
              {c.money(f.refundDailyCeiling)}
            </p>
            <p className="muted">
              Tự CK: {f.allowAutoTransfer ? 'có' : 'cấm'} · Tự tăng ads:{' '}
              {f.allowAutoAdsIncrease ? 'có' : 'cấm'} · Giảm giá max {f.maxDiscountPercent}%
            </p>
          </div>
        </section>

        <div className="grid">
          <section className="panel agents-panel" aria-label="Đội AI">
            <header className="panel-head">
              <h2>Đội AI tự vận hành</h2>
              <span>1 điều phối + 3 chuyên môn</span>
            </header>
            <ul className="agent-list">
              {c.agents.map((a) => (
                <li key={a.id} className={`agent status-${a.status}`}>
                  <div className="agent-top">
                    <strong>{a.name}</strong>
                    <span className={`badge ${a.status}`}>
                      {a.status === 'working'
                        ? 'Đang làm'
                        : a.status === 'blocked'
                          ? 'Bị phanh'
                          : 'Chờ'}
                    </span>
                  </div>
                  <p className="role">{a.role}</p>
                  <p className="task">{a.currentTask}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel approvals-panel" aria-label="Ba điểm duyệt">
            <header className="panel-head">
              <h2>3 điểm duyệt của Chủ quỹ</h2>
              <span>Sản phẩm · Ngân sách · Ngoại lệ</span>
            </header>
            {c.pending.length === 0 ? (
              <p className="empty">Không có việc chờ — AI đang chạy trong luật.</p>
            ) : (
              <ul className="approval-list">
                {c.pending.map((item) => (
                  <li key={item.id}>
                    <div className="ap-top">
                      <span className={`kind kind-${item.kind}`}>
                        {c.approvalLabel[item.kind]}
                      </span>
                      <span className="who">{item.agentName}</span>
                    </div>
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                    {item.amount != null && (
                      <p className="amount">{c.money(item.amount)}</p>
                    )}
                    <div className="actions">
                      <button type="button" className="btn primary" onClick={() => c.approve(item.id)}>
                        Đồng ý
                      </button>
                      <button type="button" className="btn ghost" onClick={() => c.reject(item.id)}>
                        Từ chối
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="panel products-panel" aria-label="Đề xuất sản phẩm">
            <header className="panel-head">
              <h2>AI Sản phẩm đề xuất</h2>
              <span>Bạn chốt 1 — không để AI tự nhập catalog</span>
            </header>
            <ul className="product-list">
              {c.products.map((p) => (
                <li key={p.id} className={`product ${p.status}`}>
                  <div className="product-top">
                    <strong>{p.name}</strong>
                    <span>{p.status === 'selling' ? 'Đang bán' : p.status === 'proposed' ? 'Chờ chọn' : p.status === 'approved' ? 'Đã duyệt' : 'Loại'}</span>
                  </div>
                  <p>
                    {p.category} · {c.money(p.price)} · biên {p.marginPercent}% · {p.channel}
                  </p>
                  <p className="risk">Rủi ro: {p.risk}</p>
                  {p.status === 'proposed' && (
                    <button
                      type="button"
                      className="btn primary"
                      onClick={() => c.approveProduct(p.id)}
                    >
                      Chọn bán sản phẩm này
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="panel leads-panel" aria-label="Lead khách">
            <header className="panel-head">
              <h2>AI Khách — lead & tin nháp</h2>
              <span>Gửi sau khi duyệt mẫu</span>
            </header>
            <ul className="lead-list">
              {c.leads.map((l) => (
                <li key={l.id}>
                  <div className="lead-top">
                    <strong>{l.name}</strong>
                    <span className={`score ${l.score}`}>{scoreLabel[l.score]}</span>
                  </div>
                  <p className="muted">
                    {l.source} · {l.note}
                  </p>
                  <blockquote>{l.messageDraft}</blockquote>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel sim-panel" aria-label="Mô phỏng vận hành">
            <header className="panel-head">
              <h2>Mô phỏng vòng tự kinh doanh</h2>
              <span>Thử phanh & chốt đơn</span>
            </header>
            <div className="sim-actions">
              <button type="button" className="btn primary" onClick={c.simulateSale}>
                AI Bán: chốt 1 đơn (trong luật)
              </button>
              <button type="button" className="btn" onClick={c.simulateDeepDiscount}>
                AI Bán: giảm 50% (phải hỏi)
              </button>
              <button type="button" className="btn danger" onClick={c.tryIllegalTransfer}>
                AI Sản phẩm: tự chuyển khoản (phải chặn)
              </button>
              <button type="button" className="btn danger" onClick={c.tryAdsIncrease}>
                AI Khách: tự tăng ads (phải chặn)
              </button>
              <button type="button" className="btn ghost" onClick={c.runMorningReport}>
                Gửi báo cáo ngày
              </button>
            </div>
            <div className="report-box">
              <h3>Báo cáo ngày</h3>
              <p>{c.report.summary}</p>
            </div>
          </section>

          <section className="panel ledger-panel" aria-label="Sổ quỹ">
            <header className="panel-head">
              <h2>Sổ quỹ & phanh</h2>
              <span>Mọi dòng tiền đều ghi lại</span>
            </header>
            <ul className="ledger">
              {c.fund.ledger.slice(0, 12).map((e) => (
                <li key={e.id} className={e.kind.startsWith('blocked') ? 'blocked' : ''}>
                  <div>
                    <strong>{ledgerLabel(e.kind)}</strong>
                    <span>{timeLabel(e.at)}</span>
                  </div>
                  <p>{e.note}</p>
                  <em>
                    {e.kind === 'sale' || e.kind === 'deposit' ? '+' : '−'}
                    {c.money(e.amount)}
                  </em>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel activity-panel" aria-label="Nhật ký">
            <header className="panel-head">
              <h2>Nhật ký hoạt động</h2>
              <span>Luồng dữ liệu realtime (mô phỏng)</span>
            </header>
            <ul className="activity">
              {c.activities.map((a) => (
                <li key={a.id}>
                  <span className="t">{a.time}</span>
                  <strong>{a.agentName}</strong>
                  <p>{a.text}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <footer className="foot">
          <p>
            Mô hình: bạn bỏ vốn · AI tự tìm sản phẩm / khách / bán — nhưng{' '}
            <strong>có phanh</strong>. Không phải “bỏ tiền rồi ngủ”.
          </p>
          <p className="muted">
            Hồ sơ agent OpenClaw nằm trong thư mục <code>agents/</code> · cấu hình quỹ trong{' '}
            <code>config/company.json</code>
          </p>
        </footer>
      </div>

      {c.toast && (
        <div className="toast" role="status">
          {c.toast}
        </div>
      )}
    </div>
  )
}
