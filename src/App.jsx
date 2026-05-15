import { useState, useEffect, useRef } from "react";

const STATUS_OPTIONS = [
  { value: "not_started", label: "未开始", color: "#94a3b8", bg: "#f1f5f9" },
  { value: "in_progress", label: "进行中", color: "#f59e0b", bg: "#fef9c3" },
  { value: "completed", label: "已完成", color: "#22c55e", bg: "#dcfce7" },
  { value: "delayed", label: "已延期", color: "#ef4444", bg: "#fee2e2" },
];

const PRIORITY_OPTIONS = [
  { value: "high", label: "高", color: "#ef4444" },
  { value: "medium", label: "中", color: "#f59e0b" },
  { value: "low", label: "低", color: "#3b82f6" },
];

const PROJECT_COLORS = [
  "#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#14b8a6", "#6366f1", "#e11d48", "#0891b2",
];

let _ctr = 200;
const uid = () => `u${++_ctr}_${Date.now()}`;

const makeDefaultMilestones = () => [
  {
    id: uid(), phase: "阶段一：规划",
    tasks: [
      { id: uid(), name: "需求分析与调研", start: "2026-05-18", end: "2026-05-24", status: "not_started", priority: "high", owner: "" },
      { id: uid(), name: "制定项目计划", start: "2026-05-25", end: "2026-05-31", status: "not_started", priority: "high", owner: "" },
    ],
  },
  {
    id: uid(), phase: "阶段二：设计",
    tasks: [
      { id: uid(), name: "系统架构设计", start: "2026-06-01", end: "2026-06-14", status: "not_started", priority: "medium", owner: "" },
      { id: uid(), name: "UI/UX 原型设计", start: "2026-06-08", end: "2026-06-21", status: "not_started", priority: "medium", owner: "" },
    ],
  },
  {
    id: uid(), phase: "阶段三：开发",
    tasks: [
      { id: uid(), name: "核心功能开发", start: "2026-06-22", end: "2026-07-19", status: "not_started", priority: "high", owner: "" },
      { id: uid(), name: "集成测试", start: "2026-07-13", end: "2026-07-26", status: "not_started", priority: "medium", owner: "" },
    ],
  },
  {
    id: uid(), phase: "阶段四：上线",
    tasks: [
      { id: uid(), name: "用户验收测试", start: "2026-07-27", end: "2026-08-02", status: "not_started", priority: "high", owner: "" },
      { id: uid(), name: "部署上线", start: "2026-08-03", end: "2026-08-09", status: "not_started", priority: "high", owner: "" },
    ],
  },
];

const defaultProjects = [
  { id: "p1", name: "项目 A", color: PROJECT_COLORS[0], milestones: makeDefaultMilestones() },
  { id: "p2", name: "项目 B", color: PROJECT_COLORS[1], milestones: [
    { id: uid(), phase: "阶段一：调研", tasks: [
      { id: uid(), name: "市场调研", start: "", end: "", status: "not_started", priority: "medium", owner: "" },
    ]},
  ]},
];

function EditableCell({ value, onChange, type = "text", style = {} }) {
  const [editing, setEditing] = useState(false);
  const ref = useRef(null);
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);

  if (editing) {
    return (
      <input ref={ref} type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
        style={{ border: "1px solid #cbd5e1", borderRadius: 6, padding: "4px 8px", fontSize: 13, width: "100%", outline: "none", background: "#fff", boxSizing: "border-box", ...style }}
      />
    );
  }
  return (
    <span onClick={() => setEditing(true)}
      style={{ cursor: "text", padding: "4px 8px", borderRadius: 6, display: "inline-block", minWidth: 40, minHeight: 22, transition: "background 0.15s", ...style }}
      onMouseEnter={(e) => (e.target.style.background = "#f1f5f9")}
      onMouseLeave={(e) => (e.target.style.background = "transparent")}
    >
      {value || <span style={{ color: "#cbd5e1" }}>点击编辑</span>}
    </span>
  );
}

function SelectCell({ value, options, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      style={{ border: "none", background: "transparent", fontSize: 13, cursor: "pointer", outline: "none", padding: "2px 0", color: "inherit", fontWeight: 600 }}
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function ProgressBar({ milestones, accentColor }) {
  const allTasks = milestones.flatMap((m) => m.tasks);
  const total = allTasks.length;
  const completed = allTasks.filter((t) => t.status === "completed").length;
  const inProgress = allTasks.filter((t) => t.status === "in_progress").length;
  const delayed = allTasks.filter((t) => t.status === "delayed").length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>整体进度</span>
        <span style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", fontFamily: "'DM Mono', monospace" }}>{pct}%</span>
      </div>
      <div style={{ height: 10, background: "#e2e8f0", borderRadius: 99, overflow: "hidden", display: "flex" }}>
        {completed > 0 && <div style={{ width: `${(completed / total) * 100}%`, background: "#22c55e", transition: "width 0.5s" }} />}
        {inProgress > 0 && <div style={{ width: `${(inProgress / total) * 100}%`, background: "#f59e0b", transition: "width 0.5s" }} />}
        {delayed > 0 && <div style={{ width: `${(delayed / total) * 100}%`, background: "#ef4444", transition: "width 0.5s" }} />}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12, color: "#94a3b8", flexWrap: "wrap" }}>
        <span>✅ 已完成 {completed}</span>
        <span>🔄 进行中 {inProgress}</span>
        <span>⏳ 未开始 {total - completed - inProgress - delayed}</span>
        <span>🚨 延期 {delayed}</span>
      </div>
    </div>
  );
}

function MilestoneSection({ milestone, accentColor, onUpdate, onDelete }) {
  const [collapsed, setCollapsed] = useState(false);
  const pct = milestone.tasks.length
    ? Math.round((milestone.tasks.filter((t) => t.status === "completed").length / milestone.tasks.length) * 100) : 0;

  const updateTask = (taskId, field, value) => {
    onUpdate({ ...milestone, tasks: milestone.tasks.map((t) => t.id === taskId ? { ...t, [field]: value } : t) });
  };
  const addTask = () => {
    onUpdate({ ...milestone, tasks: [...milestone.tasks, { id: uid(), name: "新任务", start: "", end: "", status: "not_started", priority: "medium", owner: "" }] });
  };
  const deleteTask = (taskId) => {
    onUpdate({ ...milestone, tasks: milestone.tasks.filter((t) => t.id !== taskId) });
  };

  return (
    <div style={{ marginBottom: 16, border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
      <div onClick={() => setCollapsed(!collapsed)}
        style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", borderBottom: collapsed ? "none" : "1px solid #e2e8f0", cursor: "pointer", userSelect: "none" }}>
        <span style={{ fontSize: 14, transition: "transform 0.2s", transform: collapsed ? "rotate(-90deg)" : "rotate(0)", color: accentColor }}>▼</span>
        <div style={{ flex: 1 }} onClick={(e) => e.stopPropagation()}>
          <EditableCell value={milestone.phase} onChange={(v) => onUpdate({ ...milestone, phase: v })} style={{ fontWeight: 700, fontSize: 15 }} />
        </div>
        <span style={{ fontSize: 12, color: "#64748b", fontFamily: "'DM Mono', monospace" }}>{pct}%</span>
        <div style={{ width: 60, height: 6, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#22c55e" : accentColor, transition: "width 0.4s" }} />
        </div>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }}
          style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 16, padding: "2px 6px", borderRadius: 4 }} title="删除此阶段">✕</button>
      </div>

      {!collapsed && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#fafbfc" }}>
                {["任务名称", "开始日期", "结束日期", "优先级", "状态", "负责人", ""].map((h, i) => (
                  <th key={i} style={{ padding: "8px 12px", textAlign: "left", color: "#94a3b8", fontWeight: 500, fontSize: 12, borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {milestone.tasks.map((t) => (
                <tr key={t.id} style={{ borderBottom: "1px solid #f8fafc", transition: "background 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbfc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "6px 12px", minWidth: 160 }}><EditableCell value={t.name} onChange={(v) => updateTask(t.id, "name", v)} /></td>
                  <td style={{ padding: "6px 12px", minWidth: 120 }}><EditableCell value={t.start} onChange={(v) => updateTask(t.id, "start", v)} type="date" style={{ fontFamily: "'DM Mono', monospace", fontSize: 12 }} /></td>
                  <td style={{ padding: "6px 12px", minWidth: 120 }}><EditableCell value={t.end} onChange={(v) => updateTask(t.id, "end", v)} type="date" style={{ fontFamily: "'DM Mono', monospace", fontSize: 12 }} /></td>
                  <td style={{ padding: "6px 12px" }}><SelectCell value={t.priority} options={PRIORITY_OPTIONS} onChange={(v) => updateTask(t.id, "priority", v)} /></td>
                  <td style={{ padding: "6px 12px" }}><SelectCell value={t.status} options={STATUS_OPTIONS} onChange={(v) => updateTask(t.id, "status", v)} /></td>
                  <td style={{ padding: "6px 12px", minWidth: 80 }}><EditableCell value={t.owner} onChange={(v) => updateTask(t.id, "owner", v)} /></td>
                  <td style={{ padding: "6px 8px" }}>
                    <button onClick={() => deleteTask(t.id)}
                      style={{ background: "none", border: "none", color: "#cbd5e1", cursor: "pointer", fontSize: 14, padding: "2px 6px", borderRadius: 4 }}
                      onMouseEnter={(e) => (e.target.style.color = "#ef4444")} onMouseLeave={(e) => (e.target.style.color = "#cbd5e1")} title="删除任务">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "8px 12px" }}>
            <button onClick={addTask}
              style={{ background: "none", border: "1px dashed #cbd5e1", color: "#94a3b8", padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 500, transition: "all 0.15s" }}
              onMouseEnter={(e) => { e.target.style.borderColor = accentColor; e.target.style.color = accentColor; }}
              onMouseLeave={(e) => { e.target.style.borderColor = "#cbd5e1"; e.target.style.color = "#94a3b8"; }}>
              + 添加任务
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Overview Dashboard ─── */
function OverviewDashboard({ projects, onSelect }) {
  return (
    <div>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>所有项目概览，点击卡片进入详情</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {projects.map((p) => {
          const allTasks = p.milestones.flatMap((m) => m.tasks);
          const total = allTasks.length;
          const completed = allTasks.filter((t) => t.status === "completed").length;
          const inProgress = allTasks.filter((t) => t.status === "in_progress").length;
          const delayed = allTasks.filter((t) => t.status === "delayed").length;
          const pct = total ? Math.round((completed / total) * 100) : 0;
          return (
            <div key={p.id} onClick={() => onSelect(p.id)}
              style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 20, cursor: "pointer", background: "#fff", transition: "all 0.2s", borderLeft: `4px solid ${p.color}`, position: "relative", overflow: "hidden" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#0f172a" }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>{p.milestones.length} 个阶段 · {total} 个任务</div>
              <div style={{ height: 6, background: "#e2e8f0", borderRadius: 99, overflow: "hidden", display: "flex", marginBottom: 10 }}>
                {completed > 0 && <div style={{ width: `${(completed / total) * 100}%`, background: "#22c55e" }} />}
                {inProgress > 0 && <div style={{ width: `${(inProgress / total) * 100}%`, background: "#f59e0b" }} />}
                {delayed > 0 && <div style={{ width: `${(delayed / total) * 100}%`, background: "#ef4444" }} />}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: "#64748b" }}>进度 {pct}%</span>
                {delayed > 0 && <span style={{ color: "#ef4444", fontWeight: 600 }}>🚨 {delayed} 延期</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main App ─── */
export default function MultiProjectPlanner() {
  const [projects, setProjects] = useState(defaultProjects);
  const [activeProjectId, setActiveProjectId] = useState(null); // null = overview
  const [editingProjectName, setEditingProjectName] = useState(null);
  const nameRef = useRef(null);

  useEffect(() => { if (editingProjectName && nameRef.current) nameRef.current.focus(); }, [editingProjectName]);

  const activeProject = projects.find((p) => p.id === activeProjectId);

  const addProject = () => {
    const newP = {
      id: uid(),
      name: `新项目 ${projects.length + 1}`,
      color: PROJECT_COLORS[projects.length % PROJECT_COLORS.length],
      milestones: [{ id: uid(), phase: "阶段一：规划", tasks: [{ id: uid(), name: "新任务", start: "", end: "", status: "not_started", priority: "medium", owner: "" }] }],
    };
    setProjects((prev) => [...prev, newP]);
    setActiveProjectId(newP.id);
  };

  const deleteProject = (pid) => {
    setProjects((prev) => prev.filter((p) => p.id !== pid));
    if (activeProjectId === pid) setActiveProjectId(null);
  };

  const renameProject = (pid, name) => {
    setProjects((prev) => prev.map((p) => p.id === pid ? { ...p, name } : p));
  };

  const updateMilestone = (milestoneId, updated) => {
    setProjects((prev) => prev.map((p) =>
      p.id === activeProjectId ? { ...p, milestones: p.milestones.map((m) => m.id === milestoneId ? updated : m) } : p
    ));
  };

  const deleteMilestone = (milestoneId) => {
    setProjects((prev) => prev.map((p) =>
      p.id === activeProjectId ? { ...p, milestones: p.milestones.filter((m) => m.id !== milestoneId) } : p
    ));
  };

  const addMilestone = () => {
    const count = activeProject.milestones.length;
    setProjects((prev) => prev.map((p) =>
      p.id === activeProjectId ? { ...p, milestones: [...p.milestones, { id: uid(), phase: `阶段${count + 1}：新阶段`, tasks: [] }] } : p
    ));
  };

  return (
    <div style={{ fontFamily: "'Noto Sans SC', 'DM Sans', sans-serif", maxWidth: 1000, margin: "0 auto", padding: "24px 16px", color: "#0f172a", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@500&display=swap" rel="stylesheet" />

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: -0.5, flex: 1 }}>📋 多项目计划表</h1>
      </div>
      <p style={{ color: "#94a3b8", fontSize: 13, margin: "0 0 20px" }}>管理所有项目的里程碑与任务</p>

      {/* Project tabs */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24, alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: 12 }}>
        <button onClick={() => setActiveProjectId(null)}
          style={{
            padding: "7px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
            background: activeProjectId === null ? "#0f172a" : "#f1f5f9",
            color: activeProjectId === null ? "#fff" : "#64748b",
          }}>
          🏠 总览
        </button>

        {projects.map((p) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {editingProjectName === p.id ? (
              <input ref={nameRef} value={p.name}
                onChange={(e) => renameProject(p.id, e.target.value)}
                onBlur={() => setEditingProjectName(null)}
                onKeyDown={(e) => e.key === "Enter" && setEditingProjectName(null)}
                style={{ padding: "7px 12px", borderRadius: 8, border: `2px solid ${p.color}`, fontSize: 13, fontWeight: 600, outline: "none", width: 120 }}
              />
            ) : (
              <button
                onClick={() => setActiveProjectId(p.id)}
                onDoubleClick={(e) => { e.stopPropagation(); setEditingProjectName(p.id); }}
                style={{
                  padding: "7px 14px", borderRadius: "8px 0 0 8px", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                  background: activeProjectId === p.id ? p.color : "#f1f5f9",
                  color: activeProjectId === p.id ? "#fff" : "#64748b",
                  borderLeft: `3px solid ${p.color}`,
                }}>
                {p.name}
              </button>
            )}
            {editingProjectName !== p.id && (
              <button onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }}
                style={{
                  padding: "7px 8px", borderRadius: "0 8px 8px 0", border: "none", fontSize: 11, cursor: "pointer", transition: "all 0.15s",
                  background: activeProjectId === p.id ? p.color : "#f1f5f9",
                  color: activeProjectId === p.id ? "rgba(255,255,255,0.7)" : "#cbd5e1",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#ef4444")}
                onMouseLeave={(e) => (e.target.style.color = activeProjectId === p.id ? "rgba(255,255,255,0.7)" : "#cbd5e1")}
                title="删除项目">✕</button>
            )}
          </div>
        ))}

        <button onClick={addProject}
          style={{ padding: "7px 14px", borderRadius: 8, border: "1px dashed #cbd5e1", background: "transparent", color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
          onMouseEnter={(e) => { e.target.style.borderColor = "#3b82f6"; e.target.style.color = "#3b82f6"; }}
          onMouseLeave={(e) => { e.target.style.borderColor = "#cbd5e1"; e.target.style.color = "#94a3b8"; }}>
          + 新项目
        </button>
      </div>

      {/* Content */}
      {activeProjectId === null ? (
        <OverviewDashboard projects={projects} onSelect={setActiveProjectId} />
      ) : activeProject ? (
        <div>
          <ProgressBar milestones={activeProject.milestones} accentColor={activeProject.color} />

          {activeProject.milestones.map((m) => (
            <MilestoneSection key={m.id} milestone={m} accentColor={activeProject.color}
              onUpdate={(updated) => updateMilestone(m.id, updated)}
              onDelete={() => deleteMilestone(m.id)} />
          ))}

          <button onClick={addMilestone}
            style={{ width: "100%", padding: "14px", border: "2px dashed #cbd5e1", borderRadius: 12, background: "transparent", color: "#64748b", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.target.style.borderColor = activeProject.color; e.target.style.color = activeProject.color; e.target.style.background = "#f8fafc"; }}
            onMouseLeave={(e) => { e.target.style.borderColor = "#cbd5e1"; e.target.style.color = "#64748b"; e.target.style.background = "transparent"; }}>
            + 添加新阶段
          </button>
        </div>
      ) : null}
    </div>
  );
}
