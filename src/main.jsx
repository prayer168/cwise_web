import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Database,
  Download,
  FileDown,
  FlaskConical,
  Gauge,
  ImageUp,
  Leaf,
  Map,
  Microscope,
  Plus,
  Presentation,
  RefreshCcw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Sprout,
  Table2,
  Users,
} from "lucide-react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import "./styles.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend);

const STORAGE_KEY = "eco-detective-state-v1";
const CLASSROOM_KEY = "eco-detective-classroom-v2";

const missions = [
  {
    id: "adaptation",
    title: "發現適應密碼",
    time: "09:30-11:00",
    icon: Search,
    focus: "辨識生物、適應特徵與環境壓力的關聯",
  },
  {
    id: "tools",
    title: "測量工具訓練",
    time: "11:20-12:10",
    icon: Microscope,
    focus: "練習溫度、照度、濕度與長度測量",
  },
  {
    id: "habitat",
    title: "微棲地調查",
    time: "13:00-13:45",
    icon: Map,
    focus: "分組觀察校園微棲地並記錄生物與環境資料",
  },
  {
    id: "analysis",
    title: "證據會說話",
    time: "13:45-14:30",
    icon: BarChart3,
    focus: "整理資料、製作圖表、提出證據推論",
  },
  {
    id: "creature",
    title: "最強適應生物",
    time: "14:50-15:40",
    icon: Sparkles,
    focus: "依環境壓力設計具證據支持的新生物",
  },
  {
    id: "expo",
    title: "成果發布會",
    time: "15:40-16:20",
    icon: Presentation,
    focus: "發表調查發現、回答提問、完成互評與自評",
  },
];

const habitats = ["陽光草地", "樹蔭下", "花圃", "生態池旁", "牆角", "落葉堆"];
const roles = ["觀察員", "測量員", "紀錄員", "攝影員"];
const environmentCards = ["強風乾燥屋頂", "潮濕陰暗牆角", "污染水域", "烈日草地", "低溫高山"];
const rubricItems = [
  ["measurement", "測量紀錄", "工具、單位與重複測量清楚"],
  ["evidence", "證據推論", "能用資料支持解釋並說明限制"],
  ["collaboration", "合作分工", "角色分工明確並能互相支援"],
  ["creativity", "創作應用", "適應生物合理、有創意且連結證據"],
];

const classroomSamples = [
  {
    groupCode: "B02",
    habitat: "樹蔭下",
    measurements: [
      { site: "樹蔭下", temperature: 27, light: 260, humidity: 55, speciesCount: 9, note: "落葉層潮濕，有小型節肢動物" },
      { site: "牆角", temperature: 28, light: 190, humidity: 51, speciesCount: 6, note: "牆縫附近有苔蘚" },
    ],
    inference: "樹蔭區濕度較高，生物種類也較多，但需要比較不同時間點。",
    creature: { name: "苔影守衛", card: "潮濕陰暗牆角" },
    rubric: { measurement: 4, evidence: 3, collaboration: 4, creativity: 4 },
  },
  {
    groupCode: "C03",
    habitat: "生態池旁",
    measurements: [
      { site: "生態池旁", temperature: 30, light: 610, humidity: 63, speciesCount: 10, note: "水邊昆蟲與植物種類多" },
      { site: "花圃", temperature: 29, light: 520, humidity: 43, speciesCount: 7, note: "訪花昆蟲較明顯" },
    ],
    inference: "水域附近濕度高，可能提供更多棲地與食物來源。",
    creature: { name: "濕地滑翔者", card: "污染水域" },
    rubric: { measurement: 3, evidence: 4, collaboration: 3, creativity: 5 },
  },
];

const starterState = {
  groupCode: "A01",
  habitat: "陽光草地",
  roles: {
    觀察員: "",
    測量員: "",
    紀錄員: "",
    攝影員: "",
  },
  adaptation: [
    { organism: "仙人掌", feature: "厚莖儲水、葉退化成刺", pressure: "乾燥與強光", functionText: "減少水分散失並儲存水分" },
    { organism: "水黽", feature: "細長腳與防水細毛", pressure: "水面移動", functionText: "分散重量，在水面活動" },
    { organism: "蚯蚓", feature: "濕潤皮膚與鑽土行為", pressure: "乾燥與土壤環境", functionText: "維持呼吸並躲避強光" },
  ],
  measurements: [
    { site: "陽光草地", temperature: 31, light: 820, humidity: 34, speciesCount: 5, note: "草叢中有螞蟻與小型飛蟲" },
    { site: "樹蔭下", temperature: 28, light: 310, humidity: 48, speciesCount: 7, note: "落葉下看到蚯蚓痕跡" },
    { site: "花圃", temperature: 29, light: 540, humidity: 42, speciesCount: 8, note: "蝴蝶與蜜蜂停留花朵" },
  ],
  observations: [
    { name: "螞蟻", aiName: "蟻科昆蟲", count: 12, feature: "群體移動，沿草地邊緣覓食", evidence: "陽光區溫度較高，仍可在地表快速移動" },
  ],
  inference: "花圃的生物種類較多，可能和開花植物提供食物、照度適中有關；但需要更多時間與重複測量。",
  creature: {
    card: "潮濕陰暗牆角",
    name: "陰影滑行獸",
    image: "",
    traits: [
      { structure: "薄而濕潤的皮膚", functionText: "在潮濕角落維持水分交換", evidence: "樹蔭與落葉堆濕度較高時，常見潮濕偏好的生物痕跡" },
      { structure: "扁平身體", functionText: "能躲入牆縫與落葉下", evidence: "微棲地遮蔽物多，能降低被發現機會" },
      { structure: "夜間活動", functionText: "避開白天高溫與強光", evidence: "陰暗區照度低，適合弱光活動策略" },
    ],
  },
  peerReview: "證據清楚，但可以再補充測量次數與對照地點。",
  missionStatus: {
    adaptation: true,
    tools: true,
    habitat: true,
    analysis: false,
    creature: false,
    expo: false,
  },
  rubric: {
    measurement: 3,
    evidence: 3,
    collaboration: 4,
    creativity: 4,
  },
  selfReview: {
    strength: "我能把觀察結果整理成圖表。",
    improve: "我需要更注意測量單位與同一高度。",
    action: "我願意提醒同學觀察後恢復場地原狀。",
  },
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return normalizeState(saved ? { ...starterState, ...JSON.parse(saved) } : starterState);
  } catch {
    return starterState;
  }
}

function normalizeState(value) {
  return {
    ...starterState,
    ...value,
    roles: { ...starterState.roles, ...(value.roles || {}) },
    creature: { ...starterState.creature, ...(value.creature || {}) },
    missionStatus: { ...starterState.missionStatus, ...(value.missionStatus || {}) },
    rubric: { ...starterState.rubric, ...(value.rubric || {}) },
    selfReview: { ...starterState.selfReview, ...(value.selfReview || {}) },
  };
}

function loadClassroomData() {
  try {
    const saved = localStorage.getItem(CLASSROOM_KEY);
    return saved ? JSON.parse(saved) : classroomSamples;
  } catch {
    return classroomSamples;
  }
}

function App() {
  const [activeView, setActiveView] = useState("mission");
  const [state, setState] = useState(loadState);
  const [classroomData, setClassroomData] = useState(loadClassroomData);
  const [savedAt, setSavedAt] = useState("");

  const update = (patch) => setState((current) => ({ ...current, ...patch }));
  const completedMissions = Object.values(state.missionStatus).filter(Boolean).length;
  const progressPercent = Math.round((completedMissions / missions.length) * 100);

  const saveData = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setSavedAt(`${new Date().toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })} 已儲存`);
  };

  const resetData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(starterState);
    setSavedAt("");
  };

  const saveToClassroom = () => {
    setClassroomData((current) => {
      const next = [state, ...current.filter((group) => group.groupCode !== state.groupCode)];
      localStorage.setItem(CLASSROOM_KEY, JSON.stringify(next));
      return next;
    });
  };

  const importWorkbook = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const xlsx = await loadXlsx();
      const imported = workbookToState(await file.arrayBuffer(), xlsx);
      setState(imported);
      setClassroomData((current) => {
        const next = [imported, ...current.filter((group) => group.groupCode !== imported.groupCode)];
        localStorage.setItem(CLASSROOM_KEY, JSON.stringify(next));
        return next;
      });
      setSavedAt("Excel 已匯入");
    } catch {
      setSavedAt("匯入失敗");
    } finally {
      event.target.value = "";
    }
  };

  const exportWorkbook = () => {
    loadXlsx().then((xlsx) => {
      const workbook = stateToWorkbook(state, xlsx);
      const content = xlsx.write(workbook, { bookType: "xlsx", type: "array", compression: true });
      downloadFile(`eco-detective-${state.groupCode}.xlsx`, content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      setSavedAt("Excel 已匯出");
    });
  };

  const exportCsv = () => {
    const rows = [
      ["group", "site", "temperature", "light", "humidity", "speciesCount", "note"],
      ...state.measurements.map((row) => [
        state.groupCode,
        row.site,
        row.temperature,
        row.light,
        row.humidity,
        row.speciesCount,
        row.note,
      ]),
    ];
    downloadFile(`eco-detective-${state.groupCode}.csv`, rows.map((row) => row.map(csvCell).join(",")).join("\n"), "text/csv;charset=utf-8");
  };

  const chartData = useMemo(() => buildChartData(state.measurements), [state.measurements]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">CWISE 生態探究課程</p>
          <h1>生態探員任務</h1>
        </div>
        <div className="top-actions">
          <label className="icon-button file-action" title="匯入小組 Excel">
            <Table2 size={20} />
            <input type="file" accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={importWorkbook} />
          </label>
          <button className="icon-button" onClick={saveToClassroom} title="加入班級展示">
            <Database size={20} />
          </button>
          <button className="icon-button" onClick={saveData} title="儲存">
            <Save size={20} />
          </button>
          <button className="icon-button" onClick={exportWorkbook} title="匯出 Excel">
            <Download size={20} />
          </button>
          <button className="icon-button" onClick={exportCsv} title="匯出 CSV">
            <FileDown size={20} />
          </button>
          <button className="icon-button caution" onClick={resetData} title="重設資料">
            <RefreshCcw size={20} />
          </button>
        </div>
      </header>

      <section className="status-strip">
        <div>
          <span>組別</span>
          <strong>{state.groupCode || "未設定"}</strong>
        </div>
        <div>
          <span>調查地點</span>
          <strong>{state.habitat}</strong>
        </div>
        <div>
          <span>紀錄筆數</span>
          <strong>{state.measurements.length + state.observations.length}</strong>
        </div>
        <div>
          <span>任務進度</span>
          <strong>{progressPercent}%</strong>
        </div>
        <div>
          <span>儲存狀態</span>
          <strong>{savedAt || "尚未儲存"}</strong>
        </div>
      </section>

      <nav className="view-tabs" aria-label="主要頁面">
        {[
          ["mission", "任務總覽", Leaf],
          ["student", "學生任務", ClipboardCheck],
          ["data", "資料分析", BarChart3],
          ["portfolio", "成果頁", Presentation],
          ["teacher", "教師展示", ShieldCheck],
        ].map(([id, label, Icon]) => (
          <button key={id} className={activeView === id ? "active" : ""} onClick={() => setActiveView(id)}>
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {activeView === "mission" && <MissionOverview state={state} update={update} progressPercent={progressPercent} />}
      {activeView === "student" && <StudentTasks state={state} update={update} />}
      {activeView === "data" && <DataDashboard state={state} update={update} chartData={chartData} />}
      {activeView === "portfolio" && <Portfolio state={state} />}
      {activeView === "teacher" && <TeacherDisplay state={state} classroomData={classroomData} setClassroomData={setClassroomData} />}
    </main>
  );
}

function MissionOverview({ state, update, progressPercent }) {
  const toggleMission = (id) => {
    update({ missionStatus: { ...state.missionStatus, [id]: !state.missionStatus[id] } });
  };

  return (
    <section className="page-grid mission-layout">
      <div className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">用測量證據解開生物適應密碼</p>
          <h2>從校園微棲地出發，完成一場有證據的生態調查。</h2>
          <div className="progress-block">
            <div>
              <span>任務完成度</span>
              <strong>{progressPercent}%</strong>
            </div>
            <div className="progress-track" aria-label="任務完成度">
              <i style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
          <div className="entry-row">
            <label>
              <span>組別代碼</span>
              <input value={state.groupCode} onChange={(event) => update({ groupCode: event.target.value.toUpperCase() })} />
            </label>
            <label>
              <span>調查地點</span>
              <select value={state.habitat} onChange={(event) => update({ habitat: event.target.value })}>
                {habitats.map((site) => (
                  <option key={site}>{site}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className="specimen-board">
          <Leaf size={52} />
          <p>觀察</p>
          <p>測量</p>
          <p>推論</p>
          <p>發表</p>
        </div>
      </div>

      <div className="mission-track">
        {missions.map((mission, index) => {
          const Icon = mission.icon;
          const done = Boolean(state.missionStatus[mission.id]);
          return (
            <article className={`mission-card ${done ? "done" : ""}`} key={mission.id}>
              <div className="mission-index">{String(index + 1).padStart(2, "0")}</div>
              <Icon size={24} />
              <div>
                <div className="mission-heading">
                  <h3>{mission.title}</h3>
                  <button className="check-button" onClick={() => toggleMission(mission.id)} title={done ? "標記未完成" : "標記完成"}>
                    {done ? <CheckCircle2 size={20} /> : <Plus size={20} />}
                  </button>
                </div>
                <p>{mission.time}</p>
                <span>{mission.focus}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function StudentTasks({ state, update }) {
  return (
    <section className="page-grid two-columns">
      <div className="panel">
        <PanelTitle icon={Users} title="小組分工" />
        <div className="role-grid">
          {roles.map((role) => (
            <label key={role}>
              <span>{role}</span>
              <input
                value={state.roles[role] || ""}
                onChange={(event) => update({ roles: { ...state.roles, [role]: event.target.value } })}
                placeholder="姓名"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="panel">
        <PanelTitle icon={ShieldCheck} title="生態探員守則" />
        <div className="rule-list">
          <span>不捕捉</span>
          <span>不破壞</span>
          <span>不驚擾</span>
          <span>拍照取代採集</span>
          <span>AI 辨識需查證</span>
        </div>
      </div>

      <div className="panel wide">
        <PanelTitle icon={Sprout} title="生物適應配對" />
        <EditableRows
          rows={state.adaptation}
          fields={[
            ["organism", "生物"],
            ["feature", "構造或行為"],
            ["pressure", "環境壓力"],
            ["functionText", "功能"],
          ]}
          onChange={(rows) => update({ adaptation: rows })}
          emptyRow={{ organism: "", feature: "", pressure: "", functionText: "" }}
        />
      </div>

      <div className="panel wide">
        <PanelTitle icon={FlaskConical} title="測量與觀察紀錄" />
        <MeasurementEditor state={state} update={update} />
      </div>

      <div className="panel wide">
        <PanelTitle icon={Sparkles} title="最強適應生物設計" />
        <CreatureDesigner state={state} update={update} />
      </div>

      <div className="panel wide">
        <PanelTitle icon={ClipboardCheck} title="評量與反思" />
        <AssessmentPanel state={state} update={update} />
      </div>
    </section>
  );
}

function CreatureDesigner({ state, update }) {
  const creature = state.creature;
  const updateCreature = (patch) => update({ creature: { ...creature, ...patch } });
  const changeTrait = (index, field, value) => {
    updateCreature({
      traits: creature.traits.map((trait, traitIndex) => (traitIndex === index ? { ...trait, [field]: value } : trait)),
    });
  };
  const addTrait = () => updateCreature({ traits: [...creature.traits, { structure: "", functionText: "", evidence: "" }] });
  const removeTrait = (index) => updateCreature({ traits: creature.traits.filter((_, traitIndex) => traitIndex !== index) });
  const handleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateCreature({ image: reader.result });
    reader.readAsDataURL(file);
  };

  return (
    <div className="creature-editor">
      <div className="creature-form">
        <label>
          <span>環境卡</span>
          <select value={creature.card} onChange={(event) => updateCreature({ card: event.target.value })}>
            {environmentCards.map((card) => (
              <option key={card}>{card}</option>
            ))}
          </select>
        </label>
        <label>
          <span>生物名稱</span>
          <input value={creature.name} onChange={(event) => updateCreature({ name: event.target.value })} />
        </label>
      </div>
      <div className="creature-workspace">
        <div className="image-drop">
          {creature.image ? <img src={creature.image} alt="最強適應生物作品" /> : <ImageUp size={44} />}
          <label className="upload-button">
            <span>上傳作品圖</span>
            <input type="file" accept="image/*" onChange={handleImage} />
          </label>
        </div>
        <div className="trait-editor">
          {creature.traits.map((trait, index) => (
            <div className="trait-row" key={index}>
              <input value={trait.structure} onChange={(event) => changeTrait(index, "structure", event.target.value)} placeholder="構造或行為" />
              <input value={trait.functionText} onChange={(event) => changeTrait(index, "functionText", event.target.value)} placeholder="功能" />
              <input value={trait.evidence} onChange={(event) => changeTrait(index, "evidence", event.target.value)} placeholder="證據" />
              <button className="small-button" onClick={() => removeTrait(index)}>刪除</button>
            </div>
          ))}
          <button className="add-button" onClick={addTrait}>新增適應特徵</button>
        </div>
      </div>
    </div>
  );
}

function AssessmentPanel({ state, update }) {
  const updateRubric = (key, value) => update({ rubric: { ...state.rubric, [key]: Number(value) } });
  return (
    <div className="assessment-grid">
      <div className="rubric-sliders">
        {rubricItems.map(([key, label, description]) => (
          <label key={key}>
            <span>{label}：{state.rubric[key]} 分</span>
            <input type="range" min="1" max="5" value={state.rubric[key]} onChange={(event) => updateRubric(key, event.target.value)} />
            <small>{description}</small>
          </label>
        ))}
      </div>
      <div className="reflection-editor">
        <label>
          <span>同儕回饋</span>
          <textarea value={state.peerReview} onChange={(event) => update({ peerReview: event.target.value })} rows={4} />
        </label>
        <label>
          <span>我最會的探究能力</span>
          <input value={state.selfReview.strength} onChange={(event) => update({ selfReview: { ...state.selfReview, strength: event.target.value } })} />
        </label>
        <label>
          <span>我需要改進的測量技能</span>
          <input value={state.selfReview.improve} onChange={(event) => update({ selfReview: { ...state.selfReview, improve: event.target.value } })} />
        </label>
        <label>
          <span>我願意為校園生態做的一件事</span>
          <input value={state.selfReview.action} onChange={(event) => update({ selfReview: { ...state.selfReview, action: event.target.value } })} />
        </label>
      </div>
    </div>
  );
}

function MeasurementEditor({ state, update }) {
  const changeRow = (index, field, value) => {
    const rows = state.measurements.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row));
    update({ measurements: rows });
  };
  const addRow = () => update({ measurements: [...state.measurements, { site: state.habitat, temperature: "", light: "", humidity: "", speciesCount: "", note: "" }] });
  const removeRow = (index) => update({ measurements: state.measurements.filter((_, rowIndex) => rowIndex !== index) });

  return (
    <div className="table-editor">
      <div className="data-row header-row">
        <span>地點</span>
        <span>溫度</span>
        <span>照度</span>
        <span>濕度</span>
        <span>種類</span>
        <span>備註</span>
        <span></span>
      </div>
      {state.measurements.map((row, index) => (
        <div className="data-row" key={`${row.site}-${index}`}>
          <input value={row.site} onChange={(event) => changeRow(index, "site", event.target.value)} />
          <input type="number" value={row.temperature} onChange={(event) => changeRow(index, "temperature", event.target.value)} />
          <input type="number" value={row.light} onChange={(event) => changeRow(index, "light", event.target.value)} />
          <input type="number" value={row.humidity} onChange={(event) => changeRow(index, "humidity", event.target.value)} />
          <input type="number" value={row.speciesCount} onChange={(event) => changeRow(index, "speciesCount", event.target.value)} />
          <input value={row.note} onChange={(event) => changeRow(index, "note", event.target.value)} />
          <button className="small-button" onClick={() => removeRow(index)} title="刪除">刪除</button>
        </div>
      ))}
      <button className="add-button" onClick={addRow}>新增測量紀錄</button>
    </div>
  );
}

function DataDashboard({ state, update, chartData }) {
  return (
    <section className="page-grid two-columns">
      <div className="panel chart-panel">
        <PanelTitle icon={BarChart3} title="生物種類比較" />
        <Bar data={chartData.species} options={chartOptions("種類數")} />
      </div>
      <div className="panel chart-panel">
        <PanelTitle icon={FlaskConical} title="環境因子比較" />
        <Line data={chartData.environment} options={chartOptions("測量值")} />
      </div>
      <div className="panel wide">
        <PanelTitle icon={ClipboardCheck} title="證據推論" />
        <textarea
          value={state.inference}
          onChange={(event) => update({ inference: event.target.value })}
          rows={5}
        />
      </div>
      <div className="panel wide">
        <PanelTitle icon={Microscope} title="生物觀察紀錄" />
        <EditableRows
          rows={state.observations}
          fields={[
            ["name", "觀察名稱"],
            ["aiName", "AI推測名稱"],
            ["count", "數量"],
            ["feature", "特徵"],
            ["evidence", "證據"],
          ]}
          onChange={(rows) => update({ observations: rows })}
          emptyRow={{ name: "", aiName: "", count: "", feature: "", evidence: "" }}
        />
      </div>
    </section>
  );
}

function Portfolio({ state }) {
  return (
    <section className="portfolio-page" id="portfolio-page">
      <div className="portfolio-header">
        <div>
          <p className="eyebrow">成果發布會</p>
          <h2>{state.groupCode} 小組生態調查成果</h2>
          <p>{state.habitat}｜{state.creature.name}</p>
        </div>
        <button className="print-button" onClick={() => window.print()}>
          <Presentation size={18} />
          <span>列印成果頁</span>
        </button>
      </div>
      <div className="portfolio-grid">
        <article>
          <h3>調查發現</h3>
          <p>{state.inference}</p>
        </article>
        <article>
          <h3>測量資料</h3>
          <ul>
            {state.measurements.map((row, index) => (
              <li key={index}>{row.site}：{row.temperature}C、{row.light} lux、濕度 {row.humidity}%、種類 {row.speciesCount}</li>
            ))}
          </ul>
        </article>
        <article className="span-two">
          <h3>最強適應生物</h3>
          <p><strong>{state.creature.card}</strong>：{state.creature.name}</p>
          {state.creature.image && <img className="portfolio-creature-image" src={state.creature.image} alt="最強適應生物作品" />}
          <div className="trait-grid">
            {state.creature.traits.map((trait, index) => (
              <div key={index}>
                <strong>{trait.structure}</strong>
                <span>{trait.functionText}</span>
                <small>{trait.evidence}</small>
              </div>
            ))}
          </div>
        </article>
        <article className="span-two">
          <h3>評量規準</h3>
          <div className="score-grid">
            {rubricItems.map(([key, label]) => (
              <div key={key}>
                <span>{label}</span>
                <strong>{state.rubric[key]} / 5</strong>
              </div>
            ))}
          </div>
        </article>
        <article>
          <h3>同儕回饋</h3>
          <p>{state.peerReview}</p>
        </article>
        <article>
          <h3>自我反思</h3>
          <p>{state.selfReview.strength}</p>
          <p>{state.selfReview.improve}</p>
          <p>{state.selfReview.action}</p>
        </article>
      </div>
    </section>
  );
}

function TeacherDisplay({ state, classroomData, setClassroomData }) {
  const allGroups = [state, ...classroomData.filter((group) => group.groupCode !== state.groupCode)].map(normalizeState);
  const classroomCharts = useMemo(() => buildClassroomChartData(allGroups), [allGroups]);
  const averages = useMemo(() => summarizeClassroom(allGroups), [allGroups]);
  const resetClassroom = () => {
    localStorage.setItem(CLASSROOM_KEY, JSON.stringify(classroomSamples));
    setClassroomData(classroomSamples);
  };

  return (
    <section className="page-grid teacher-page">
      <div className="panel wide dashboard-hero">
        <PanelTitle icon={Gauge} title="班級儀表板" />
        <div className="metric-grid">
          <div>
            <span>小組數</span>
            <strong>{allGroups.length}</strong>
          </div>
          <div>
            <span>平均種類數</span>
            <strong>{averages.species}</strong>
          </div>
          <div>
            <span>平均完成度</span>
            <strong>{averages.progress}%</strong>
          </div>
          <div>
            <span>平均評量分</span>
            <strong>{averages.rubric} / 5</strong>
          </div>
        </div>
      </div>
      <div className="panel chart-panel">
        <PanelTitle icon={BarChart3} title="各組生物種類數" />
        <Bar data={classroomCharts.species} options={chartOptions("平均種類數")} />
      </div>
      <div className="panel chart-panel">
        <PanelTitle icon={ClipboardCheck} title="各組評量總覽" />
        <Bar data={classroomCharts.rubric} options={chartOptions("平均分數")} />
      </div>
      <div className="panel wide">
        <div className="panel-title split-title">
          <div>
            <PanelTitle icon={Database} title="小組成果牆" />
          </div>
          <button className="small-button" onClick={resetClassroom}>重設範例資料</button>
        </div>
        <div className="group-wall">
          {allGroups.map((group) => (
            <article key={group.groupCode}>
              <div className="group-wall-title">
                <strong>{group.groupCode}</strong>
                <span>{group.habitat}</span>
              </div>
              <p>{group.inference}</p>
              <small>{group.creature.card}｜{group.creature.name}</small>
            </article>
          ))}
        </div>
      </div>
      <div className="panel">
        <PanelTitle icon={Leaf} title="課程時程" />
        <img className="schedule-image" src="./assets/course-schedule.jpg" alt="課程時程表" />
      </div>
      <div className="panel">
        <PanelTitle icon={ClipboardCheck} title="多元評量對應" />
        <div className="rubric-grid">
          <span>形成性評量</span><p>配對任務、工具操作、資料欄位檢查</p>
          <span>實作評量</span><p>微棲地觀察、測量紀錄、圖表製作</p>
          <span>同儕互評</span><p>證據問題、改進建議、合理性檢核</p>
          <span>總結性評量</span><p>成果發表、素養情境題、自評反思</p>
        </div>
      </div>
      <div className="panel wide">
        <PanelTitle icon={ShieldCheck} title="學習目標" />
        <div className="goal-cloud">
          <span>構造與功能</span>
          <span>環境因子</span>
          <span>測量工具</span>
          <span>資料圖表</span>
          <span>證據推論</span>
          <span>同儕溝通</span>
        </div>
      </div>
    </section>
  );
}

function EditableRows({ rows, fields, onChange, emptyRow }) {
  const changeRow = (index, key, value) => {
    onChange(rows.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row)));
  };
  return (
    <div className="editable-list">
      {rows.map((row, index) => (
        <div className="editable-card" key={index}>
          {fields.map(([key, label]) => (
            <label key={key}>
              <span>{label}</span>
              <input value={row[key] ?? ""} onChange={(event) => changeRow(index, key, event.target.value)} />
            </label>
          ))}
          <button className="small-button" onClick={() => onChange(rows.filter((_, rowIndex) => rowIndex !== index))}>刪除</button>
        </div>
      ))}
      <button className="add-button" onClick={() => onChange([...rows, emptyRow])}>新增一筆</button>
    </div>
  );
}

function PanelTitle({ icon: Icon, title }) {
  return (
    <div className="panel-title">
      <Icon size={20} />
      <h2>{title}</h2>
    </div>
  );
}

function buildChartData(rows) {
  const labels = rows.map((row) => row.site || "未命名");
  return {
    species: {
      labels,
      datasets: [
        {
          label: "生物種類數",
          data: rows.map((row) => Number(row.speciesCount) || 0),
          backgroundColor: "#3b7f6f",
          borderRadius: 6,
        },
      ],
    },
    environment: {
      labels,
      datasets: [
        { label: "溫度 C", data: rows.map((row) => Number(row.temperature) || 0), borderColor: "#b55b35", backgroundColor: "#b55b35", tension: 0.35 },
        { label: "照度 / 20", data: rows.map((row) => (Number(row.light) || 0) / 20), borderColor: "#d2a72c", backgroundColor: "#d2a72c", tension: 0.35 },
        { label: "濕度 %", data: rows.map((row) => Number(row.humidity) || 0), borderColor: "#2979a8", backgroundColor: "#2979a8", tension: 0.35 },
      ],
    },
  };
}

function buildClassroomChartData(groups) {
  const labels = groups.map((group) => group.groupCode || "未命名");
  return {
    species: {
      labels,
      datasets: [
        {
          label: "平均生物種類數",
          data: groups.map((group) => average(group.measurements.map((row) => Number(row.speciesCount) || 0))),
          backgroundColor: "#3b7f6f",
          borderRadius: 6,
        },
      ],
    },
    rubric: {
      labels,
      datasets: rubricItems.map(([key, label], index) => ({
        label,
        data: groups.map((group) => Number(group.rubric?.[key]) || 0),
        backgroundColor: ["#3b7f6f", "#b55b35", "#2979a8", "#d2a72c"][index],
        borderRadius: 6,
      })),
    },
  };
}

function summarizeClassroom(groups) {
  const speciesValues = groups.flatMap((group) => group.measurements.map((row) => Number(row.speciesCount) || 0));
  const progressValues = groups.map((group) => Math.round((Object.values(group.missionStatus || {}).filter(Boolean).length / missions.length) * 100));
  const rubricValues = groups.flatMap((group) => rubricItems.map(([key]) => Number(group.rubric?.[key]) || 0));
  return {
    species: formatAverage(speciesValues),
    progress: formatAverage(progressValues),
    rubric: formatAverage(rubricValues),
  };
}

function average(values) {
  const valid = values.filter((value) => Number.isFinite(value));
  if (!valid.length) return 0;
  return Math.round((valid.reduce((sum, value) => sum + value, 0) / valid.length) * 10) / 10;
}

function formatAverage(values) {
  const value = average(values);
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function chartOptions(title) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#24413a", font: { size: 13 } } },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { ticks: { color: "#38514b" }, grid: { color: "rgba(50, 82, 73, 0.08)" } },
      y: { title: { display: true, text: title, color: "#38514b" }, ticks: { color: "#38514b" }, grid: { color: "rgba(50, 82, 73, 0.12)" } },
    },
  };
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

async function loadXlsx() {
  return await import("xlsx");
}

function stateToWorkbook(value, xlsx) {
  const group = normalizeState(value);
  const workbook = xlsx.utils.book_new();
  appendSheet(xlsx, workbook, "小組資訊", [
    { 欄位: "組別代碼", 內容: group.groupCode },
    { 欄位: "調查地點", 內容: group.habitat },
    { 欄位: "證據推論", 內容: group.inference },
    { 欄位: "同儕回饋", 內容: group.peerReview },
    { 欄位: "環境卡", 內容: group.creature.card },
    { 欄位: "生物名稱", 內容: group.creature.name },
    { 欄位: "作品圖", 內容: group.creature.image ? "已包含於隱藏資料" : "" },
  ]);
  appendSheet(xlsx, workbook, "小組分工", roles.map((role) => ({ 角色: role, 姓名: group.roles[role] || "" })));
  appendSheet(xlsx, workbook, "適應配對", group.adaptation.map((row) => ({
    生物: row.organism,
    構造或行為: row.feature,
    環境壓力: row.pressure,
    功能: row.functionText,
  })));
  appendSheet(xlsx, workbook, "測量紀錄", group.measurements.map((row) => ({
    地點: row.site,
    溫度: row.temperature,
    照度: row.light,
    濕度: row.humidity,
    種類數: row.speciesCount,
    備註: row.note,
  })));
  appendSheet(xlsx, workbook, "生物觀察", group.observations.map((row) => ({
    觀察名稱: row.name,
    AI推測名稱: row.aiName,
    數量: row.count,
    特徵: row.feature,
    證據: row.evidence,
  })));
  appendSheet(xlsx, workbook, "適應生物特徵", group.creature.traits.map((row) => ({
    構造或行為: row.structure,
    功能: row.functionText,
    證據: row.evidence,
  })));
  appendSheet(xlsx, workbook, "任務進度", missions.map((mission) => ({
    任務代碼: mission.id,
    任務名稱: mission.title,
    是否完成: group.missionStatus[mission.id] ? "是" : "否",
  })));
  appendSheet(xlsx, workbook, "評量規準", rubricItems.map(([key, label, description]) => ({
    評量代碼: key,
    評量項目: label,
    分數: group.rubric[key],
    說明: description,
  })));
  appendSheet(xlsx, workbook, "自我反思", [
    { 題目: "我最會的探究能力", 回答: group.selfReview.strength },
    { 題目: "我需要改進的測量技能", 回答: group.selfReview.improve },
    { 題目: "我願意為校園生態做的一件事", 回答: group.selfReview.action },
  ]);
  appendSheet(xlsx, workbook, "_raw", [{ json: JSON.stringify(group) }], { hidden: true });
  return workbook;
}

function workbookToState(arrayBuffer, xlsx) {
  const workbook = xlsx.read(arrayBuffer, { type: "array" });
  const raw = sheetRows(xlsx, workbook, "_raw")[0]?.json;
  if (raw) return normalizeState(JSON.parse(raw));

  const info = Object.fromEntries(sheetRows(xlsx, workbook, "小組資訊").map((row) => [row.欄位, row.內容]));
  const roleRows = sheetRows(xlsx, workbook, "小組分工");
  const missionRows = sheetRows(xlsx, workbook, "任務進度");
  const rubricRows = sheetRows(xlsx, workbook, "評量規準");
  const reflectionRows = sheetRows(xlsx, workbook, "自我反思");
  const reflection = Object.fromEntries(reflectionRows.map((row) => [row.題目, row.回答]));

  return normalizeState({
    groupCode: info.組別代碼 || starterState.groupCode,
    habitat: info.調查地點 || starterState.habitat,
    inference: info.證據推論 || "",
    peerReview: info.同儕回饋 || "",
    roles: Object.fromEntries(roleRows.map((row) => [row.角色, row.姓名 || ""])),
    adaptation: sheetRows(xlsx, workbook, "適應配對").map((row) => ({
      organism: row.生物 || "",
      feature: row.構造或行為 || "",
      pressure: row.環境壓力 || "",
      functionText: row.功能 || "",
    })),
    measurements: sheetRows(xlsx, workbook, "測量紀錄").map((row) => ({
      site: row.地點 || "",
      temperature: row.溫度 || "",
      light: row.照度 || "",
      humidity: row.濕度 || "",
      speciesCount: row.種類數 || "",
      note: row.備註 || "",
    })),
    observations: sheetRows(xlsx, workbook, "生物觀察").map((row) => ({
      name: row.觀察名稱 || "",
      aiName: row.AI推測名稱 || "",
      count: row.數量 || "",
      feature: row.特徵 || "",
      evidence: row.證據 || "",
    })),
    creature: {
      card: info.環境卡 || starterState.creature.card,
      name: info.生物名稱 || starterState.creature.name,
      image: "",
      traits: sheetRows(xlsx, workbook, "適應生物特徵").map((row) => ({
        structure: row.構造或行為 || "",
        functionText: row.功能 || "",
        evidence: row.證據 || "",
      })),
    },
    missionStatus: Object.fromEntries(missionRows.map((row) => [row.任務代碼, row.是否完成 === "是" || row.是否完成 === true])),
    rubric: Object.fromEntries(rubricRows.map((row) => [row.評量代碼, Number(row.分數) || 1])),
    selfReview: {
      strength: reflection.我最會的探究能力 || "",
      improve: reflection.我需要改進的測量技能 || "",
      action: reflection.我願意為校園生態做的一件事 || "",
    },
  });
}

function appendSheet(xlsx, workbook, name, rows, options = {}) {
  const sheet = xlsx.utils.json_to_sheet(rows.length ? rows : [{}]);
  xlsx.utils.book_append_sheet(workbook, sheet, name);
  if (options.hidden) {
    workbook.Workbook ||= {};
    workbook.Workbook.Sheets ||= [];
    const index = workbook.SheetNames.indexOf(name);
    workbook.Workbook.Sheets[index] = { Hidden: 1 };
  }
}

function sheetRows(xlsx, workbook, name) {
  const sheet = workbook.Sheets[name];
  return sheet ? xlsx.utils.sheet_to_json(sheet, { defval: "" }) : [];
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

createRoot(document.getElementById("root")).render(<App />);
