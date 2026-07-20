import { useEffect, useMemo, useRef, useState } from 'react'
import {
  activitySeed,
  initialAgents,
  officeName,
  officeTagline,
  statusLabel,
  taskPool,
  type Activity,
  type Agent,
  type AgentStatus,
} from './data/office'

function nowLabel() {
  return new Date().toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function avatarColor(hue: number) {
  return `hsl(${hue} 55% 62%)`
}

function nextStatus(current: AgentStatus): AgentStatus {
  const cycle: AgentStatus[] = ['working', 'meeting', 'idle', 'working', 'away']
  const i = cycle.indexOf(current)
  return cycle[(i + 1) % cycle.length]
}

const desks = [
  { left: '14%', top: '22%' },
  { left: '74%', top: '24%' },
  { left: '16%', top: '62%' },
  { left: '68%', top: '60%' },
  { left: '44%', top: '20%' },
]

const plants = [
  { left: '8%', top: '12%' },
  { left: '90%', top: '14%' },
  { left: '92%', top: '78%' },
  { left: '6%', top: '80%' },
]

export default function App() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const [selectedId, setSelectedId] = useState<string>('trinh')
  const [activities, setActivities] = useState<Activity[]>(() =>
    activitySeed.map((item, index) => ({
      ...item,
      id: `seed-${index}`,
      time: nowLabel(),
    })),
  )
  const tickRef = useRef(0)

  const selected = useMemo(
    () => agents.find((a) => a.id === selectedId) ?? agents[0],
    [agents, selectedId],
  )

  const workingCount = agents.filter((a) => a.status === 'working').length
  const readyCount = agents.filter((a) => a.status === 'idle').length

  useEffect(() => {
    const id = window.setInterval(() => {
      setAgents((prev) => {
        const target = prev[tickRef.current % prev.length]
        tickRef.current += 1
        if (!target) return prev

        const status = Math.random() > 0.55 ? nextStatus(target.status) : target.status
        const task = taskPool[Math.floor(Math.random() * taskPool.length)]
        const driftX = Math.max(12, Math.min(88, target.x + (Math.random() * 8 - 4)))
        const driftY = Math.max(18, Math.min(82, target.y + (Math.random() * 8 - 4)))

        const updated = prev.map((agent) =>
          agent.id === target.id
            ? {
                ...agent,
                status,
                task,
                x: status === 'meeting' ? 50 : driftX,
                y: status === 'meeting' ? 48 : driftY,
              }
            : agent,
        )

        setActivities((list) => {
          const entry: Activity = {
            id: `${Date.now()}-${target.id}`,
            agentId: target.id,
            agentName: target.name,
            text:
              status === 'working'
                ? `Bắt đầu: ${task}`
                : status === 'meeting'
                  ? 'Đang họp tại bàn trung tâm để đồng bộ tiến độ.'
                  : status === 'away'
                    ? 'Đi tuần tra hệ thống / kiểm tra gateway.'
                    : 'Hoàn thành task, chuyển trạng thái sẵn sàng.',
            time: nowLabel(),
          }
          return [entry, ...list].slice(0, 12)
        })

        return updated
      })
    }, 4200)

    return () => window.clearInterval(id)
  }, [])

  function assignTask() {
    const task = taskPool[Math.floor(Math.random() * taskPool.length)]
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === selected.id
          ? { ...agent, status: 'working', task }
          : agent,
      ),
    )
    setActivities((list) => [
      {
        id: `${Date.now()}-assign`,
        agentId: selected.id,
        agentName: selected.name,
        text: `Được giao nhiệm vụ mới: ${task}`,
        time: nowLabel(),
      },
      ...list,
    ].slice(0, 12))
  }

  function callMeeting() {
    setAgents((prev) =>
      prev.map((agent) => ({
        ...agent,
        status: 'meeting' as const,
        task: 'Họp nhanh toàn văn phòng',
        x: 42 + (Math.random() * 16 - 8),
        y: 44 + (Math.random() * 10 - 5),
      })),
    )
    setActivities((list) => [
      {
        id: `${Date.now()}-meeting`,
        agentId: 'trinh',
        agentName: 'Trịnh',
        text: 'Triệu tập họp nhanh — toàn bộ agent tập trung bàn trung tâm.',
        time: nowLabel(),
      },
      ...list,
    ].slice(0, 12))
  }

  return (
    <div className="app">
      <div className="shell">
        <header className="topbar">
          <div className="brand">
            <div className="brand-mark">
              <span className="claw" aria-hidden="true" />
              <h1>{officeName}</h1>
            </div>
            <p>{officeTagline}</p>
          </div>
          <div className="live-pill" aria-live="polite">
            <span className="live-dot" />
            Gateway OpenClaw · trực tuyến
          </div>
        </header>

        <div className="layout">
          <section className="office-panel" aria-label="Sàn văn phòng ảo">
            <div className="office-sky" />
            <div className="room-label">Tầng điều hành · OpenClaw</div>
            <div className="office-floor">
              <div className="furniture meeting-table" />
              {desks.map((desk, i) => (
                <div
                  key={`desk-${i}`}
                  className="furniture desk"
                  style={{ left: desk.left, top: desk.top }}
                />
              ))}
              {plants.map((plant, i) => (
                <div
                  key={`plant-${i}`}
                  className="furniture plant"
                  style={{ left: plant.left, top: plant.top }}
                />
              ))}
              <div className="furniture coffee" style={{ left: '48%', top: '78%' }} />

              {agents.map((agent, index) => (
                <button
                  key={agent.id}
                  type="button"
                  className={[
                    'agent',
                    agent.status === 'working' ? 'is-working' : '',
                    agent.id === selectedId ? 'is-selected' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  data-status={agent.status}
                  style={{
                    left: `${agent.x}%`,
                    top: `${agent.y}%`,
                    animationDelay: `${index * 0.06}s`,
                  }}
                  onClick={() => setSelectedId(agent.id)}
                  aria-label={`${agent.name} — ${statusLabel[agent.status]}`}
                >
                  <span className="agent-bubble">{agent.task}</span>
                  <span
                    className="agent-avatar"
                    style={{ background: avatarColor(agent.hue) }}
                  >
                    {agent.name.slice(0, 1)}
                  </span>
                  <span className="agent-name">{agent.name}</span>
                </button>
              ))}
            </div>
          </section>

          <aside className="side">
            <section className="panel">
              <h2>Tình trạng ca làm</h2>
              <div className="stats">
                <div className="stat">
                  <strong>{agents.length}</strong>
                  <span>Agent</span>
                </div>
                <div className="stat">
                  <strong>{workingCount}</strong>
                  <span>Đang làm</span>
                </div>
                <div className="stat">
                  <strong>{readyCount}</strong>
                  <span>Sẵn sàng</span>
                </div>
              </div>
            </section>

            <section className="panel">
              <h2>Đội OpenClaw</h2>
              <div className="agent-list">
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    type="button"
                    className={`agent-row${agent.id === selectedId ? ' is-active' : ''}`}
                    onClick={() => setSelectedId(agent.id)}
                  >
                    <span
                      className="dot"
                      style={{ background: avatarColor(agent.hue) }}
                    >
                      {agent.name.slice(0, 1)}
                    </span>
                    <span className="meta">
                      <strong>
                        {agent.name} · {agent.role}
                      </strong>
                      <span>{agent.task}</span>
                    </span>
                    <span className="badge">{statusLabel[agent.status]}</span>
                  </button>
                ))}
              </div>
              <div className="actions" style={{ marginTop: '0.85rem' }}>
                <button type="button" className="btn primary" onClick={assignTask}>
                  Giao việc cho {selected.name}
                </button>
                <button type="button" className="btn" onClick={callMeeting}>
                  Họp nhanh
                </button>
              </div>
            </section>

            <section className="panel">
              <h2>Nhật ký hoạt động</h2>
              <div className="feed" aria-live="polite">
                {activities.map((item) => (
                  <article key={item.id} className="feed-item">
                    <div className="who">
                      <span>{item.agentName}</span>
                      <span>{item.time}</span>
                    </div>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <p className="footer-note">
          Văn phòng số Trịnh · OpenClaw — mô phỏng đội AI agent. Kết nối gateway thật qua
          WebSocket khi triển khai production.
        </p>
      </div>
    </div>
  )
}
