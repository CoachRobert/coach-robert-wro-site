import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom/client";

const coachImage = "/coach.png";

const pdfPages = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `第${i + 1}页`,
  src: `/pdf/page-${String(i + 1).padStart(2, "0")}.png`,
}));

const competitionTypes = [
  { name: "Robomission", fieldCost: 250, robotCost: 600, projectMultiplier: 1 },
  { name: "Future Innovator", fieldCost: 0, robotCost: 1000, projectMultiplier: 1.1 },
  { name: "Robosports", fieldCost: 250, robotCost: 600, projectMultiplier: 1 },
  { name: "Future Engineering", fieldCost: 350, robotCost: 800, projectMultiplier: 1.2 },
];

const ageGroups = ["Elementary", "Junior", "Senior"];

const competitionLocations = [
  { name: "加州", baseCost: 0 },
  { name: "外州", baseCost: 600 },
];

const venues = [
  { name: "教室", venueCostPerHour: 60, transportFactor: 1 },
  { name: "自家车库", venueCostPerHour: 0, transportFactor: 1 },
];

const trainingRegions = [
  { name: "EASTVALE", multiplier: 1, travelCost: 0 },
  { name: "CHINOHILLS", multiplier: 1.1, travelCost: 20 },
  { name: "RANCHO CUCAMONGA", multiplier: 1, travelCost: 0 },
  { name: "IRVINE", multiplier: 1.2, travelCost: 50 },
];

const tabs = [
  { id: "coach", label: "Coach Robert" },
  { id: "training", label: "WRO培训" },
  { id: "calculator", label: "报价" },
  { id: "official", label: "官网" },
];

function money(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);
}

function styles() {
  return {
    page: {
      minHeight: "100vh",
      background: "#f1f5f9",
      color: "#0f172a",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    container: {
      maxWidth: "480px",
      margin: "0 auto",
      paddingBottom: "120px",
    },
    header: {
      position: "sticky",
      top: 0,
      zIndex: 20,
      background: "rgba(241,245,249,0.96)",
      borderBottom: "1px solid #dbe3ec",
      padding: "14px 16px 12px",
      backdropFilter: "blur(8px)",
    },
    headerTop: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "12px",
    },
    smallLabel: {
      fontSize: "11px",
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "#64748b",
      marginBottom: "4px",
    },
    title: {
      fontSize: "20px",
      fontWeight: 700,
      margin: 0,
    },
    badge: {
      background: "#f59e0b",
      color: "#111827",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: 700,
      padding: "6px 10px",
    },
    tabGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "8px",
    },
    tabButton: {
      border: "none",
      borderRadius: "16px",
      padding: "10px 6px",
      fontSize: "11px",
      cursor: "pointer",
      fontWeight: 600,
    },
    content: {
      padding: "16px",
      display: "grid",
      gap: "16px",
    },
    card: {
      background: "#fff",
      borderRadius: "24px",
      boxShadow: "0 6px 24px rgba(15,23,42,0.08)",
      overflow: "hidden",
    },
    darkCard: {
      background: "linear-gradient(135deg, #020617, #0f172a 60%, #1d4ed8)",
      color: "#fff",
      borderRadius: "24px",
      boxShadow: "0 10px 30px rgba(15,23,42,0.18)",
      overflow: "hidden",
    },
    sectionPad: {
      padding: "20px",
    },
    cardTitle: {
      fontSize: "30px",
      fontWeight: 800,
      margin: "0 0 8px 0",
    },
    cardText: {
      fontSize: "14px",
      lineHeight: 1.7,
      color: "#cbd5e1",
      margin: 0,
    },
    whiteSoftBadge: {
      display: "inline-block",
      background: "rgba(255,255,255,0.16)",
      color: "#fff",
      borderRadius: "999px",
      padding: "6px 10px",
      fontSize: "12px",
      marginBottom: "12px",
      fontWeight: 700,
    },
    image: {
      width: "100%",
      display: "block",
      borderRadius: "20px",
    },
    twoCols: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
    },
    statBox: {
      background: "rgba(255,255,255,0.12)",
      borderRadius: "16px",
      padding: "12px",
      textAlign: "center",
    },
    statNum: {
      fontSize: "28px",
      fontWeight: 800,
      color: "#fff",
      marginBottom: "4px",
    },
    statLabel: {
      fontSize: "12px",
      color: "#cbd5e1",
    },
    infoCard: {
      background: "#fff",
      borderRadius: "24px",
      boxShadow: "0 6px 24px rgba(15,23,42,0.08)",
      padding: "20px",
      fontSize: "14px",
      lineHeight: 1.9,
      color: "#475569",
    },
    labelStrong: {
      color: "#0f172a",
      fontWeight: 700,
    },
    pageGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
    },
    thumbButton: {
      border: "none",
      background: "#fff",
      borderRadius: "20px",
      padding: "8px",
      textAlign: "left",
      cursor: "pointer",
      boxShadow: "0 6px 20px rgba(15,23,42,0.08)",
    },
    thumbTitle: {
      fontSize: "12px",
      color: "#64748b",
      padding: "8px 2px 2px",
      fontWeight: 600,
    },
    formCard: {
      background: "#fff",
      borderRadius: "24px",
      boxShadow: "0 6px 24px rgba(15,23,42,0.08)",
      padding: "20px",
    },
    inputLabel: {
      fontSize: "14px",
      fontWeight: 600,
      marginBottom: "8px",
      display: "block",
      color: "#0f172a",
    },
    input: {
      width: "100%",
      boxSizing: "border-box",
      padding: "12px 14px",
      borderRadius: "14px",
      border: "1px solid #d1d5db",
      fontSize: "14px",
      outline: "none",
      background: "#fff",
    },
    select: {
      width: "100%",
      boxSizing: "border-box",
      padding: "12px 14px",
      borderRadius: "14px",
      border: "1px solid #d1d5db",
      fontSize: "14px",
      outline: "none",
      background: "#fff",
    },
    row2: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
    },
    toggleRow: {
      background: "#f8fafc",
      borderRadius: "16px",
      padding: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
    },
    toggleText: {
      fontSize: "14px",
      fontWeight: 600,
    },
    resultDark: {
      background: "#020617",
      color: "#fff",
      borderRadius: "20px",
      padding: "18px",
    },
    resultTitle: {
      fontSize: "14px",
      color: "#cbd5e1",
      marginBottom: "8px",
    },
    resultNum: {
      fontSize: "38px",
      fontWeight: 800,
      lineHeight: 1.1,
    },
    resultGold: {
      background: "#fef3c7",
      borderRadius: "20px",
      padding: "18px",
    },
    resultGoldTitle: {
      fontSize: "14px",
      color: "#475569",
      marginBottom: "8px",
    },
    resultGoldNum: {
      fontSize: "32px",
      fontWeight: 800,
      color: "#111827",
    },
    lineList: {
      display: "grid",
      gap: "8px",
      fontSize: "14px",
      color: "#475569",
    },
    lineItem: {
      display: "flex",
      justifyContent: "space-between",
      gap: "12px",
    },
    btn: {
      width: "100%",
      border: "none",
      borderRadius: "16px",
      padding: "14px 16px",
      background: "#0f172a",
      color: "#fff",
      fontSize: "15px",
      fontWeight: 700,
      cursor: "pointer",
    },
    linkBoxDark: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "#0f172a",
      color: "#fff",
      textDecoration: "none",
      borderRadius: "16px",
      padding: "16px",
      fontWeight: 700,
    },
    linkBoxBlue: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "#2563eb",
      color: "#fff",
      textDecoration: "none",
      borderRadius: "16px",
      padding: "16px",
      fontWeight: 700,
    },
    modal: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.82)",
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
    },
    modalCard: {
      background: "#fff",
      borderRadius: "20px",
      padding: "12px",
      width: "100%",
      maxWidth: "460px",
    },
    modalTop: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "8px",
      padding: "4px 6px",
      fontSize: "14px",
      color: "#475569",
      fontWeight: 600,
    },
    closeBtn: {
      border: "none",
      background: "#f1f5f9",
      borderRadius: "999px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: 600,
    },
    fixedBar: {
      position: "fixed",
      left: "50%",
      bottom: "14px",
      transform: "translateX(-50%)",
      width: "calc(100% - 24px)",
      maxWidth: "480px",
      background: "#020617",
      color: "#fff",
      borderRadius: "24px",
      padding: "14px 16px",
      boxShadow: "0 18px 40px rgba(2,6,23,0.35)",
      zIndex: 30,
    },
    fixedBarInner: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
    },
    fixedSmall: {
      fontSize: "12px",
      color: "#94a3b8",
      marginBottom: "2px",
    },
    fixedTitle: {
      fontSize: "15px",
      fontWeight: 700,
    },
    fixedBtn: {
      border: "none",
      background: "#f59e0b",
      color: "#111827",
      borderRadius: "16px",
      padding: "12px 16px",
      fontWeight: 700,
      cursor: "pointer",
      whiteSpace: "nowrap",
    },
  };
}

function TabButton({ active, onClick, label }) {
  const s = styles();
  return (
    <button
      onClick={onClick}
      style={{
        ...s.tabButton,
        background: active ? "#0f172a" : "#ffffff",
        color: active ? "#ffffff" : "#475569",
      }}
    >
      {label}
    </button>
  );
}

function NumberField({ label, value, onChange, suffix, min = 0 }) {
  const s = styles();
  return (
    <div>
      <label style={s.inputLabel}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type="number"
          min={min}
          value={value}
          onChange={(e) => onChange(Number(e.target.value || 0))}
          style={{ ...s.input, paddingRight: suffix ? "48px" : "14px" }}
        />
        {suffix ? (
          <span
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function App() {
  const s = styles();

  const [activeTab, setActiveTab] = useState("coach");


  const [competitionType, setCompetitionType] = useState("Future Innovator");
  const [ageGroup, setAgeGroup] = useState("Junior");
  const [teamSize, setTeamSize] = useState(2);
  const [teamRegistrationCount, setTeamRegistrationCount] = useState(1);
  const [fieldPurchaseCount, setFieldPurchaseCount] = useState(1);
  const [registrationFeeCount, setRegistrationFeeCount] = useState(1);
  const [trainingRegion, setTrainingRegion] = useState("EASTVALE");
  const [trainingWeeks, setTrainingWeeks] = useState(12);
  const [sessionsPerWeek, setSessionsPerWeek] = useState(1);
  const [hoursPerSession, setHoursPerSession] = useState(3);
  const [trainingRobotKitCount, setTrainingRobotKitCount] = useState(1);
  const [trainingVenue, setTrainingVenue] = useState("自家车库");
  const [coachHours1, setCoachHours1] = useState(8);
  const [coachHours2, setCoachHours2] = useState(0);
  const [coachLocation1, setCoachLocation1] = useState("加州");
  const [coachLocation2, setCoachLocation2] = useState("外州");
  const [shareDiscount, setShareDiscount] = useState(true);
  const [girlDiscount, setGirlDiscount] = useState(true);
  const [friendDiscount, setFriendDiscount] = useState(false);

  const result = useMemo(() => {
    const project =
      competitionTypes.find((x) => x.name === competitionType) || competitionTypes[0];
    const region =
      trainingRegions.find((x) => x.name === trainingRegion) || trainingRegions[0];
    const venue =
      venues.find((x) => x.name === trainingVenue) || venues[0];
    const compLoc1 =
      competitionLocations.find((x) => x.name === coachLocation1) || competitionLocations[0];
    const compLoc2 =
      competitionLocations.find((x) => x.name === coachLocation2) || competitionLocations[0];

    const competitionSubtotal =
      100 * teamRegistrationCount +
      project.fieldCost * fieldPurchaseCount +
      300 * registrationFeeCount;

    const trainingHours = trainingWeeks * sessionsPerWeek * hoursPerSession;
    const trainingService =
      trainingHours * 180 * region.multiplier * project.projectMultiplier;
    const trainingRobot = project.robotCost * trainingRobotKitCount;
    const venueSubtotal = venue.venueCostPerHour * trainingHours;
    const transportSubtotal =
      venue.transportFactor * region.travelCost * trainingWeeks * sessionsPerWeek;
    const onsiteCoachSubtotal =
      compLoc1.baseCost +
      coachHours1 * 30 +
      compLoc2.baseCost * (coachHours2 > 0 ? 1 : 0) +
      coachHours2 * 30;

    const totalDiscount =
      (shareDiscount ? 0.1 : 0) +
      (girlDiscount ? 0.05 : 0) +
      (friendDiscount ? 0.05 : 0);

    const teamTotal =
      competitionSubtotal +
      trainingService +
      trainingRobot +
      venueSubtotal +
      transportSubtotal +
      onsiteCoachSubtotal;

    const perStudent = teamSize > 0 ? (teamTotal * (1 - totalDiscount)) / teamSize : 0;

    return {
      trainingHours,
      competitionSubtotal,
      trainingService,
      trainingRobot,
      venueSubtotal,
      transportSubtotal,
      onsiteCoachSubtotal,
      teamTotal,
      perStudent,
      totalDiscount,
    };
  }, [
    competitionType,
    trainingRegion,
    trainingVenue,
    teamRegistrationCount,
    fieldPurchaseCount,
    registrationFeeCount,
    trainingWeeks,
    sessionsPerWeek,
    hoursPerSession,
    trainingRobotKitCount,
    coachLocation1,
    coachLocation2,
    coachHours1,
    coachHours2,
    shareDiscount,
    girlDiscount,
    friendDiscount,
    teamSize,
  ]);

  const copyQuote = async () => {
    const text =
      `Coach Robert WRO 报价\n` +
      `项目：${competitionType}\n` +
      `年龄组：${ageGroup}\n` +
      `团队人数：${teamSize}\n` +
      `培训地区：${trainingRegion}\n` +
      `训练安排：${trainingWeeks}周 × 每周${sessionsPerWeek}次 × 每次${hoursPerSession}小时\n` +
      `团队总成本：${money(result.teamTotal)}\n` +
      `折扣后人均：${money(result.perStudent)}`;

    try {
      await navigator.clipboard.writeText(text);
      alert("报价摘要已复制");
    } catch (e) {
      console.error(e);
      alert("复制失败，请手动复制");
    }
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <div style={s.headerTop}>
            <div>
              <div style={s.smallLabel}>Coach Robert</div>
              <h1 style={s.title}>WRO Mobile Site</h1>
            </div>
            <div style={s.badge}>2026</div>
          </div>

          <div style={s.tabGrid}>
            {tabs.map((item) => (
              <TabButton
                key={item.id}
                active={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
                label={item.label}
              />
            ))}
          </div>
        </div>

        <div style={s.content}>
          {activeTab === "coach" && (
            <div style={{ display: "grid", gap: "16px" }}>
              <div style={s.darkCard}>
                <div style={s.sectionPad}>
                  <div style={s.whiteSoftBadge}>WRO USA Team Coach</div>
                  <h2 style={s.cardTitle}>Coach Robert</h2>
                  <p style={s.cardText}>
                    面向南加州家庭的 WRO 竞赛训练、组队支持、比赛咨询与个性化训练服务。
                  </p>
                </div>

                <div style={{ padding: "0 16px 16px" }}>
                  <img src={coachImage} alt="Coach Robert" style={s.image} />
                  <div style={{ ...s.twoCols, marginTop: "16px" }}>
                    <div style={s.statBox}>
                      <div style={s.statNum}>13</div>
                      <div style={s.statLabel}>全美冠军团队</div>
                    </div>
                    <div style={s.statBox}>
                      <div style={s.statNum}>16</div>
                      <div style={s.statLabel}>代表美国参赛团队</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={s.infoCard}>
                <div><span style={s.labelStrong}>服务城市：</span>Eastvale · Rancho Cucamonga · Chino Hills · Irvine</div>
                <div><span style={s.labelStrong}>支持方式：</span>线下训练、上门培训、组队支持、比赛咨询</div>
                <div><span style={s.labelStrong}>联系电话：</span>909-219-3801</div>
              </div>
            </div>
          )}

          {activeTab === "training" && (
            <div style={{ display: "grid", gap: "16px" }}>
              <div style={s.darkCard}>
                <div style={s.sectionPad}>
                  <div style={s.whiteSoftBadge}>WRO 2026 TRAINING PLAN</div>
                  <h2 style={{ ...s.cardTitle, fontSize: "28px" }}>WRO 培训介绍</h2>
                  <p style={s.cardText}>
                    以下内容按手机纵向连续展示。向下滑动即可依次查看全部 20 页培训内容。
                  </p>
                </div>
              </div>
          
              <div style={{ display: "grid", gap: "14px" }}>
                {pdfPages.map((page) => (
                  <div
                    key={page.id}
                    style={{
                      background: "#ffffff",
                      borderRadius: "20px",
                      padding: "10px",
                      boxShadow: "0 6px 20px rgba(15,23,42,0.08)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#334155",
                        padding: "4px 4px 10px 4px",
                      }}
                    >
                      {page.title}
                    </div>
          
                    <img
                      src={page.src}
                      alt={page.title}
                      style={{
                        width: "100%",
                        display: "block",
                        borderRadius: "16px",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          
          {activeTab === "calculator" && (
            <div style={{ display: "grid", gap: "16px" }}>
              <div style={s.darkCard}>
                <div style={s.sectionPad}>
                  <div style={s.whiteSoftBadge}>Final Excel Logic</div>
                  <h2 style={{ ...s.cardTitle, fontSize: "28px" }}>培训报价计算器</h2>
                </div>
              </div>

              <div style={s.formCard}>
                <div style={{ display: "grid", gap: "16px" }}>
                  <div>
                    <label style={s.inputLabel}>参加项目</label>
                    <select
                      value={competitionType}
                      onChange={(e) => setCompetitionType(e.target.value)}
                      style={s.select}
                    >
                      {competitionTypes.map((item) => (
                        <option key={item.name} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={s.inputLabel}>年龄组别</label>
                    <select
                      value={ageGroup}
                      onChange={(e) => setAgeGroup(e.target.value)}
                      style={s.select}
                    >
                      {ageGroups.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <NumberField label="团队人数" value={teamSize} onChange={setTeamSize} suffix="人" min={1} />
                  <NumberField label="团队注册费" value={teamRegistrationCount} onChange={setTeamRegistrationCount} suffix="次" />
                  <NumberField label="比赛场地购买" value={fieldPurchaseCount} onChange={setFieldPurchaseCount} suffix="次" />
                  <NumberField label="注册比赛费" value={registrationFeeCount} onChange={setRegistrationFeeCount} suffix="次" />

                  <div>
                    <label style={s.inputLabel}>培训地区</label>
                    <select
                      value={trainingRegion}
                      onChange={(e) => setTrainingRegion(e.target.value)}
                      style={s.select}
                    >
                      {trainingRegions.map((item) => (
                        <option key={item.name} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={s.inputLabel}>培训场地</label>
                    <select
                      value={trainingVenue}
                      onChange={(e) => setTrainingVenue(e.target.value)}
                      style={s.select}
                    >
                      {venues.map((item) => (
                        <option key={item.name} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={s.row2}>
                    <NumberField label="培训周数" value={trainingWeeks} onChange={setTrainingWeeks} suffix="周" />
                    <NumberField label="每周几次" value={sessionsPerWeek} onChange={setSessionsPerWeek} suffix="次" />
                  </div>

                  <div style={s.row2}>
                    <NumberField label="每次小时" value={hoursPerSession} onChange={setHoursPerSession} suffix="小时" />
                    <NumberField label="器材套数" value={trainingRobotKitCount} onChange={setTrainingRobotKitCount} suffix="套" />
                  </div>

                  <div style={s.row2}>
                    <NumberField label="服务1小时" value={coachHours1} onChange={setCoachHours1} suffix="小时" />
                    <NumberField label="服务2小时" value={coachHours2} onChange={setCoachHours2} suffix="小时" />
                  </div>

                  <div>
                    <label style={s.inputLabel}>服务1地点</label>
                    <select
                      value={coachLocation1}
                      onChange={(e) => setCoachLocation1(e.target.value)}
                      style={s.select}
                    >
                      {competitionLocations.map((item) => (
                        <option key={item.name} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={s.inputLabel}>服务2地点</label>
                    <select
                      value={coachLocation2}
                      onChange={(e) => setCoachLocation2(e.target.value)}
                      style={s.select}
                    >
                      {competitionLocations.map((item) => (
                        <option key={item.name} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={s.toggleRow}>
                    <span style={s.toggleText}>分享优惠 10%</span>
                    <input type="checkbox" checked={shareDiscount} onChange={(e) => setShareDiscount(e.target.checked)} />
                  </div>

                  <div style={s.toggleRow}>
                    <span style={s.toggleText}>女生优惠 5%</span>
                    <input type="checkbox" checked={girlDiscount} onChange={(e) => setGirlDiscount(e.target.checked)} />
                  </div>

                  <div style={s.toggleRow}>
                    <span style={s.toggleText}>友情优惠</span>
                    <input type="checkbox" checked={friendDiscount} onChange={(e) => setFriendDiscount(e.target.checked)} />
                  </div>
                </div>
              </div>

              <div style={s.formCard}>
                <div style={s.resultDark}>
                  <div style={s.resultTitle}>团队总成本</div>
                  <div style={s.resultNum}>{money(result.teamTotal)}</div>
                  <div style={{ marginTop: "10px", fontSize: "12px", color: "#cbd5e1" }}>
                    {result.trainingHours} 小时训练 · 总折扣 {Math.round(result.totalDiscount * 100)}%
                  </div>
                </div>

                <div style={{ height: "14px" }} />

                <div style={s.resultGold}>
                  <div style={s.resultGoldTitle}>折扣后队员分摊</div>
                  <div style={s.resultGoldNum}>{money(result.perStudent)}</div>
                </div>

                <div style={{ height: "14px" }} />

                <div style={s.lineList}>
                  <div style={s.lineItem}><span>注册小计</span><span>{money(result.competitionSubtotal)}</span></div>
                  <div style={s.lineItem}><span>培训服务</span><span>{money(result.trainingService)}</span></div>
                  <div style={s.lineItem}><span>器材成本</span><span>{money(result.trainingRobot)}</span></div>
                  <div style={s.lineItem}><span>场地成本</span><span>{money(result.venueSubtotal)}</span></div>
                  <div style={s.lineItem}><span>交通成本</span><span>{money(result.transportSubtotal)}</span></div>
                  <div style={s.lineItem}><span>赛场教练服务</span><span>{money(result.onsiteCoachSubtotal)}</span></div>
                </div>

                <div style={{ height: "16px" }} />
                <button style={s.btn} onClick={copyQuote}>复制报价摘要</button>
              </div>
            </div>
          )}

          {activeTab === "official" && (
            <div style={{ display: "grid", gap: "16px" }}>
              <div style={s.formCard}>
                <h3 style={{ fontSize: "20px", marginTop: 0, marginBottom: "16px" }}>WRO 官方入口</h3>
                <div style={{ display: "grid", gap: "12px" }}>
                  <a
                    href="https://wro-association.org/"
                    target="_blank"
                    rel="noreferrer"
                    style={s.linkBoxDark}
                  >
                    <span>国际官网</span>
                    <span>↗</span>
                  </a>

                  <a
                    href="https://www.uselyouthrobotics.com/"
                    target="_blank"
                    rel="noreferrer"
                    style={s.linkBoxBlue}
                  >
                    <span>美国官网</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>



      <div style={s.fixedBar}>
        <div style={s.fixedBarInner}>
          <div>
            <div style={s.fixedSmall}>Quick Contact</div>
            <div style={s.fixedTitle}>Coach Robert · 909-219-3801</div>
          </div>
          <button style={s.fixedBtn}>联系咨询</button>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
