import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Trophy, BookOpen, Calculator, Globe, Copy, ExternalLink } from "lucide-react";

const coachImage = "/public/coach.png";

const pdfPages = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `第${i + 1}页`,
  src: `/public/pdf/page_${String(i + 1).padStart(2, "0")}.png`,
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
  { id: "coach", label: "Coach Robert", icon: Trophy },
  { id: "training", label: "WRO培训", icon: BookOpen },
  { id: "calculator", label: "报价", icon: Calculator },
  { id: "official", label: "官网", icon: Globe },
];

function money(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number.isFinite(n) ? n : 0);
}

function TabButton({ active, onClick, label, icon: Icon }: { active: boolean; onClick: () => void; label: string; icon: any }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] ${active ? "bg-slate-900 text-white" : "bg-white text-slate-600"}`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function NumberField({ label, value, onChange, suffix, min = 0 }: { label: string; value: number; onChange: (v: number) => void; suffix?: string; min?: number }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <div className="relative">
        <Input type="number" min={min} value={value} onChange={(e) => onChange(Number(e.target.value || 0))} className="rounded-2xl pr-12" />
        {suffix ? <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">{suffix}</span> : null}
      </div>
    </div>
  );
}

export default function WROMobileSite() {
  const [activeTab, setActiveTab] = useState("coach");
  const [selectedPage, setSelectedPage] = useState<null | { id: number; title: string; src: string }>(null);

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
    const project = competitionTypes.find((x) => x.name === competitionType) || competitionTypes[0];
    const region = trainingRegions.find((x) => x.name === trainingRegion) || trainingRegions[0];
    const venue = venues.find((x) => x.name === trainingVenue) || venues[0];
    const compLoc1 = competitionLocations.find((x) => x.name === coachLocation1) || competitionLocations[0];
    const compLoc2 = competitionLocations.find((x) => x.name === coachLocation2) || competitionLocations[0];

    const competitionSubtotal = 100 * teamRegistrationCount + project.fieldCost * fieldPurchaseCount + 300 * registrationFeeCount;
    const trainingHours = trainingWeeks * sessionsPerWeek * hoursPerSession;
    const trainingService = trainingHours * 180 * region.multiplier * project.projectMultiplier;
    const trainingRobot = project.robotCost * trainingRobotKitCount;
    const venueSubtotal = venue.venueCostPerHour * trainingHours;
    const transportSubtotal = venue.transportFactor * region.travelCost * trainingWeeks * sessionsPerWeek;
    const onsiteCoachSubtotal = compLoc1.baseCost + coachHours1 * 30 + compLoc2.baseCost * (coachHours2 > 0 ? 1 : 0) + coachHours2 * 30;
    const totalDiscount = (shareDiscount ? 0.1 : 0) + (girlDiscount ? 0.05 : 0) + (friendDiscount ? 0.05 : 0);
    const teamTotal = competitionSubtotal + trainingService + trainingRobot + venueSubtotal + transportSubtotal + onsiteCoachSubtotal;
    const perStudent = teamSize > 0 ? (teamTotal * (1 - totalDiscount)) / teamSize : 0;
    return { trainingHours, competitionSubtotal, trainingService, trainingRobot, venueSubtotal, transportSubtotal, onsiteCoachSubtotal, teamTotal, perStudent, totalDiscount };
  }, [competitionType, trainingRegion, trainingVenue, teamRegistrationCount, fieldPurchaseCount, registrationFeeCount, trainingWeeks, sessionsPerWeek, hoursPerSession, trainingRobotKitCount, coachLocation1, coachLocation2, coachHours1, coachHours2, shareDiscount, girlDiscount, friendDiscount, teamSize]);

  const copyQuote = async () => {
    const text = `Coach Robert WRO 报价\n项目：${competitionType}\n年龄组：${ageGroup}\n团队人数：${teamSize}\n培训地区：${trainingRegion}\n训练安排：${trainingWeeks}周 × 每周${sessionsPerWeek}次 × 每次${hoursPerSession}小时\n团队总成本：${money(result.teamTotal)}\n折扣后人均：${money(result.perStudent)}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-md pb-28">
        <div className="sticky top-0 z-20 border-b bg-slate-100/95 px-4 py-3 backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Coach Robert</p>
              <h1 className="text-lg font-bold">WRO Mobile Site</h1>
            </div>
            <Badge className="rounded-full bg-amber-500 text-slate-950">2026</Badge>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {tabs.map((item) => (
              <TabButton key={item.id} active={activeTab === item.id} onClick={() => setActiveTab(item.id)} label={item.label} icon={item.icon} />
            ))}
          </div>
        </div>

        <div className="space-y-4 px-4 pt-4">
          {activeTab === "coach" && (
            <div className="space-y-4">
              <Card className="overflow-hidden rounded-[28px] border-0 bg-slate-950 text-white shadow-xl">
                <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 p-5">
                  <Badge className="mb-3 rounded-full bg-white/15 text-white">WRO USA Team Coach</Badge>
                  <h2 className="text-3xl font-black">Coach Robert</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">面向南加州家庭的 WRO 竞赛训练、组队支持、比赛咨询与个性化训练服务。</p>
                </div>
                <div className="p-4">
                  <img src={coachImage} alt="Coach Robert" className="w-full rounded-[24px] object-cover" />
                  <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-2xl bg-white/10 p-3"><div className="text-2xl font-black">13</div><div className="text-xs text-slate-300">全美冠军团队</div></div>
                    <div className="rounded-2xl bg-white/10 p-3"><div className="text-2xl font-black">16</div><div className="text-xs text-slate-300">代表美国参赛团队</div></div>
                  </div>
                </div>
              </Card>

              <Card className="rounded-[28px] border-0 shadow-sm">
                <CardContent className="space-y-3 p-5 text-sm leading-7 text-slate-600">
                  <div><span className="font-semibold text-slate-900">服务城市：</span>Eastvale · Rancho Cucamonga · Chino Hills · Irvine</div>
                  <div><span className="font-semibold text-slate-900">支持方式：</span>线下训练、上门培训、组队支持、比赛咨询</div>
                  <div><span className="font-semibold text-slate-900">联系电话：</span>909-219-3801</div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "training" && (
            <div className="space-y-4">
              <Card className="rounded-[28px] border-0 bg-gradient-to-br from-blue-950 to-slate-900 text-white shadow-xl">
                <CardContent className="p-5">
                  <Badge className="mb-3 rounded-full bg-white/15 text-white">WRO 2026 TRAINING PLAN</Badge>
                  <h2 className="text-2xl font-black">WRO 培训介绍</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">保留了你上传 PDF 的 20 页内容，点击任意页面可放大查看。</p>
                </CardContent>
              </Card>
              <div className="grid grid-cols-2 gap-3">
                {pdfPages.map((page) => (
                  <button key={page.id} onClick={() => setSelectedPage(page)} className="overflow-hidden rounded-[24px] bg-white p-2 text-left shadow-sm">
                    <img src={page.src} alt={page.title} className="w-full rounded-[18px] object-cover" />
                    <div className="px-1 pb-1 pt-2 text-xs font-medium text-slate-600">{page.title}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "calculator" && (
            <div className="space-y-4">
              <Card className="rounded-[28px] border-0 bg-gradient-to-br from-slate-950 to-slate-800 text-white shadow-xl">
                <CardContent className="p-5">
                  <Badge className="mb-3 rounded-full bg-white/15 text-white">Final Excel Logic</Badge>
                  <h2 className="text-2xl font-black">培训报价计算器</h2>
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border-0 shadow-sm"><CardContent className="space-y-4 p-5">
                <div className="space-y-2">
                  <Label>参加项目</Label>
                  <Select value={competitionType} onValueChange={setCompetitionType}><SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger><SelectContent>{competitionTypes.map((item) => <SelectItem key={item.name} value={item.name}>{item.name}</SelectItem>)}</SelectContent></Select>
                </div>
                <div className="space-y-2">
                  <Label>年龄组别</Label>
                  <Select value={ageGroup} onValueChange={setAgeGroup}><SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger><SelectContent>{ageGroups.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
                </div>
                <NumberField label="团队人数" value={teamSize} onChange={setTeamSize} suffix="人" min={1} />
                <NumberField label="团队注册费" value={teamRegistrationCount} onChange={setTeamRegistrationCount} suffix="次" />
                <NumberField label="比赛场地购买" value={fieldPurchaseCount} onChange={setFieldPurchaseCount} suffix="次" />
                <NumberField label="注册比赛费" value={registrationFeeCount} onChange={setRegistrationFeeCount} suffix="次" />
                <div className="space-y-2">
                  <Label>培训地区</Label>
                  <Select value={trainingRegion} onValueChange={setTrainingRegion}><SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger><SelectContent>{trainingRegions.map((item) => <SelectItem key={item.name} value={item.name}>{item.name}</SelectItem>)}</SelectContent></Select>
                </div>
                <div className="space-y-2">
                  <Label>培训场地</Label>
                  <Select value={trainingVenue} onValueChange={setTrainingVenue}><SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger><SelectContent>{venues.map((item) => <SelectItem key={item.name} value={item.name}>{item.name}</SelectItem>)}</SelectContent></Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <NumberField label="培训周数" value={trainingWeeks} onChange={setTrainingWeeks} suffix="周" />
                  <NumberField label="每周几次" value={sessionsPerWeek} onChange={setSessionsPerWeek} suffix="次" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <NumberField label="每次小时" value={hoursPerSession} onChange={setHoursPerSession} suffix="小时" />
                  <NumberField label="器材套数" value={trainingRobotKitCount} onChange={setTrainingRobotKitCount} suffix="套" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <NumberField label="服务1小时" value={coachHours1} onChange={setCoachHours1} suffix="小时" />
                  <NumberField label="服务2小时" value={coachHours2} onChange={setCoachHours2} suffix="小时" />
                </div>
                <div className="space-y-2">
                  <Label>服务1地点</Label>
                  <Select value={coachLocation1} onValueChange={setCoachLocation1}><SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger><SelectContent>{competitionLocations.map((item) => <SelectItem key={item.name} value={item.name}>{item.name}</SelectItem>)}</SelectContent></Select>
                </div>
                <div className="space-y-2">
                  <Label>服务2地点</Label>
                  <Select value={coachLocation2} onValueChange={setCoachLocation2}><SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger><SelectContent>{competitionLocations.map((item) => <SelectItem key={item.name} value={item.name}>{item.name}</SelectItem>)}</SelectContent></Select>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"><span>分享优惠 10%</span><Switch checked={shareDiscount} onCheckedChange={setShareDiscount} /></div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"><span>女生优惠 5%</span><Switch checked={girlDiscount} onCheckedChange={setGirlDiscount} /></div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"><span>友情优惠</span><Switch checked={friendDiscount} onCheckedChange={setFriendDiscount} /></div>
              </CardContent></Card>

              <Card className="rounded-[28px] border-0 bg-white shadow-lg"><CardContent className="space-y-4 p-5">
                <div className="rounded-[24px] bg-slate-950 p-5 text-white">
                  <div className="text-sm text-slate-300">团队总成本</div>
                  <div className="mt-2 text-4xl font-black">{money(result.teamTotal)}</div>
                  <div className="mt-3 text-xs text-slate-300">{result.trainingHours} 小时训练 · 总折扣 {Math.round(result.totalDiscount * 100)}%</div>
                </div>
                <div className="rounded-[24px] bg-amber-50 p-5">
                  <div className="text-sm text-slate-600">折扣后队员分摊</div>
                  <div className="mt-2 text-3xl font-black text-slate-950">{money(result.perStudent)}</div>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between"><span>注册小计</span><span>{money(result.competitionSubtotal)}</span></div>
                  <div className="flex justify-between"><span>培训服务</span><span>{money(result.trainingService)}</span></div>
                  <div className="flex justify-between"><span>器材成本</span><span>{money(result.trainingRobot)}</span></div>
                  <div className="flex justify-between"><span>场地成本</span><span>{money(result.venueSubtotal)}</span></div>
                  <div className="flex justify-between"><span>交通成本</span><span>{money(result.transportSubtotal)}</span></div>
                  <div className="flex justify-between"><span>赛场教练服务</span><span>{money(result.onsiteCoachSubtotal)}</span></div>
                </div>
                <Separator />
                <Button className="w-full rounded-2xl" onClick={copyQuote}><Copy className="mr-2 h-4 w-4" />复制报价摘要</Button>
              </CardContent></Card>
            </div>
          )}

          {activeTab === "official" && (
            <div className="space-y-4">
              <Card className="rounded-[28px] border-0 shadow-sm">
                <CardContent className="space-y-4 p-5">
                  <h3 className="text-lg font-bold">WRO 官方入口</h3>
                  <a href="https://wro-association.org/" target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl bg-slate-900 p-4 text-white">国际官网 <ExternalLink className="h-4 w-4" /></a>
                  <a href="https://www.uselyouthrobotics.com/" target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl bg-blue-600 p-4 text-white">美国官网 <ExternalLink className="h-4 w-4" /></a>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {selectedPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setSelectedPage(null)}>
          <div className="w-full max-w-md rounded-[24px] bg-white p-3" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between px-2 py-1 text-sm font-medium text-slate-600">
              <span>{selectedPage.title}</span>
              <button onClick={() => setSelectedPage(null)} className="rounded-full bg-slate-100 px-3 py-1">关闭</button>
            </div>
            <img src={selectedPage.src} alt={selectedPage.title} className="w-full rounded-[18px] object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}

