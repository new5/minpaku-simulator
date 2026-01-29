import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, ReferenceLine, AreaChart, Area, ComposedChart
} from 'recharts';
import { Calculator, TrendingUp, DollarSign, PieChart as PieIcon, AlertCircle, Info, Home, Settings, Calendar, Sun, Snowflake, CloudSun, Clock } from 'lucide-react';

const App = () => {
  // --- State: Base Inputs ---
  const [initialInvestment, setInitialInvestment] = useState(3000000);
  const [rent, setRent] = useState(120000);
  const [adr, setAdr] = useState(15000); // 通常期のADR
  const [occupancyRate, setOccupancyRate] = useState(70); // 通常期の稼働率
  const [avgStayLength, setAvgStayLength] = useState(2.5); // 通常期の平均連泊数
   
  const [cleaningFeeRevenue, setCleaningFeeRevenue] = useState(5000);
  const [cleaningCost, setCleaningCost] = useState(6000);
   
  const [utilities, setUtilities] = useState(25000);
  const [otaCommissionRate, setOtaCommissionRate] = useState(15);
  
  // 代行手数料関連
  const [managementFixedFee, setManagementFixedFee] = useState(0); 
  const [managementFeeRate, setManagementFeeRate] = useState(0); 

  // --- State: Seasonality ---
  // 0: Low(閑散), 1: Regular(通常), 2: Semi-High(準繁忙/第2繁忙), 3: High(繁忙)
  const [monthTypes, setMonthTypes] = useState([
    0, 0, 1, 2, 3, 1, 2, 3, 2, 1, 1, 3 
    // Jan(Low), Feb(Low), Mar(Reg), Apr(Semi), May(High)... sample default
  ]);

  const [seasonConfig, setSeasonConfig] = useState({
    high: { adrMultiplier: 1.3, occAdjustment: 15, stayLength: 3.0 },      // 繁忙期: 強気設定, 連泊長め
    semiHigh: { adrMultiplier: 1.15, occAdjustment: 5, stayLength: 2.5 },  // 第2繁忙期
    low: { adrMultiplier: 0.8, occAdjustment: -15, stayLength: 2.0 },      // 閑散期: 連泊短め
  });

  const toggleMonthType = (index) => {
    setMonthTypes(prev => {
      const newTypes = [...prev];
      newTypes[index] = (newTypes[index] + 1) % 4; // Cycle 0 -> 1 -> 2 -> 3 -> 0
      return newTypes;
    });
  };

  const updateSeasonConfig = (type, field, value) => {
    setSeasonConfig(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  // --- Calculations ---
  const calculations = useMemo(() => {
    // Helper to get season params
    const getSeasonParams = (typeIndex) => {
      if (typeIndex === 1) return { adr, occ: occupancyRate, stayLength: avgStayLength }; // Regular
      
      if (typeIndex === 3) { // High
        return { 
          adr: adr * seasonConfig.high.adrMultiplier, 
          occ: Math.min(100, occupancyRate + seasonConfig.high.occAdjustment),
          stayLength: seasonConfig.high.stayLength
        };
      }
      
      if (typeIndex === 2) { // Semi-High
        return { 
          adr: adr * seasonConfig.semiHigh.adrMultiplier, 
          occ: Math.min(100, occupancyRate + seasonConfig.semiHigh.occAdjustment),
          stayLength: seasonConfig.semiHigh.stayLength
        };
      }

      // Low (0)
      return { 
        adr: adr * seasonConfig.low.adrMultiplier, 
        occ: Math.max(0, occupancyRate + seasonConfig.low.occAdjustment),
        stayLength: seasonConfig.low.stayLength
      };
    };

    let annualRevenue = 0;
    let annualExpenses = 0;
    const monthlyData = [];

    // Loop through 12 months
    for (let i = 0; i < 12; i++) {
      const { adr: currentAdr, occ: currentOcc, stayLength: currentStayLength } = getSeasonParams(monthTypes[i]);
      
      const daysInMonth = 30; 
      const bookedDays = daysInMonth * (currentOcc / 100);
      const numberOfStays = bookedDays / currentStayLength;

      // Monthly Revenue
      const accRev = currentAdr * bookedDays;
      const clRev = cleaningFeeRevenue * numberOfStays;
      const totalRev = accRev + clRev;

      // Monthly Expenses
      const otaFee = accRev * (otaCommissionRate / 100);
      
      // Management Fee Logic
      const variableManagementFee = (totalRev - otaFee) * (managementFeeRate / 100);
      const managementFeeTotal = variableManagementFee + managementFixedFee;

      const cleaningCostTotal = cleaningCost * numberOfStays;
      const suppliesCost = 300 * bookedDays;
      const fixedCosts = rent + utilities;
      
      const totalExp = fixedCosts + otaFee + managementFeeTotal + cleaningCostTotal + suppliesCost;
      const netProfit = totalRev - totalExp;

      monthlyData.push({
        month: `${i + 1}月`,
        seasonType: monthTypes[i], 
        売上: Math.round(totalRev),
        支出: Math.round(totalExp),
        利益: Math.round(netProfit),
        adr: Math.round(currentAdr),
        occ: Math.round(currentOcc),
        stayLength: currentStayLength.toFixed(1)
      });

      annualRevenue += totalRev;
      annualExpenses += totalExp;
    }

    const annualNetProfit = annualRevenue - annualExpenses;
    const monthlyNetProfitAvg = annualNetProfit / 12;

    // ROI & Payback
    const roi = initialInvestment > 0 ? (annualNetProfit / initialInvestment) * 100 : 0;
    const paybackMonths = annualNetProfit > 0 ? (initialInvestment / annualNetProfit) * 12 : 999;

    // Breakdown Logic
    const breakdownTotal = {
        rent: rent * 12,
        utilities: utilities * 12,
        cleaning: 0,
        ota: 0,
        mgmt: 0,
        supplies: 0
    };

    monthlyData.forEach((m, i) => {
        const { adr: currentAdr, occ: currentOcc, stayLength: currentStayLength } = getSeasonParams(monthTypes[i]);
        const bDays = 30 * (currentOcc / 100);
        const nStays = bDays / currentStayLength;
        const accRev = currentAdr * bDays;
        const clRev = cleaningFeeRevenue * nStays;
        const tRev = accRev + clRev;

        const monthlyOta = accRev * (otaCommissionRate / 100);
        const monthlyVariableMgmt = (tRev - monthlyOta) * (managementFeeRate / 100);

        breakdownTotal.ota += monthlyOta;
        breakdownTotal.mgmt += monthlyVariableMgmt + managementFixedFee;
        breakdownTotal.cleaning += cleaningCost * nStays;
        breakdownTotal.supplies += 300 * bDays;
    });

    const breakdown = [
      { name: '家賃', value: breakdownTotal.rent },
      { name: '光熱費・通信', value: breakdownTotal.utilities },
      { name: '清掃原価', value: breakdownTotal.cleaning },
      { name: 'OTA手数料', value: breakdownTotal.ota },
      { name: '運営代行費', value: breakdownTotal.mgmt },
      { name: '消耗品他', value: breakdownTotal.supplies },
    ].filter(item => item.value > 0);

    return {
      monthlyData,
      totalRevenue: annualRevenue,
      totalExpenses: annualExpenses,
      monthlyNetProfit: monthlyNetProfitAvg,
      annualNetProfit,
      roi,
      paybackMonths,
      breakdown
    };
  }, [initialInvestment, rent, adr, occupancyRate, avgStayLength, cleaningFeeRevenue, cleaningCost, utilities, otaCommissionRate, managementFeeRate, managementFixedFee, monthTypes, seasonConfig]);

  // --- Chart Data Generators ---

  // 1. Occupancy Sensitivity (Base Scenario Only)
  const occupancySimulationData = useMemo(() => {
    const data = [];
    for (let i = 10; i <= 100; i += 10) {
      const bDays = 30 * (i / 100);
      const nStays = bDays / avgStayLength; // Use Base Avg Stay Length
      const accRev = adr * bDays;
      const clRev = cleaningFeeRevenue * nStays;
      const tRev = accRev + clRev;
      
      const ota = accRev * (otaCommissionRate / 100);
      const mgmtVariable = (tRev - ota) * (managementFeeRate / 100);
      const mgmt = mgmtVariable + managementFixedFee;

      const clCost = cleaningCost * nStays;
      const supp = 300 * bDays;
      const tExp = rent + utilities + ota + mgmt + clCost + supp;

      data.push({
        name: `${i}%`,
        売上: tRev,
        支出: tExp,
        利益: tRev - tExp,
      });
    }
    return data;
  }, [rent, utilities, adr, avgStayLength, cleaningFeeRevenue, cleaningCost, otaCommissionRate, managementFeeRate, managementFixedFee]);

  // 2. Long Term Projection
  const longTermData = useMemo(() => {
    const data = [];
    let cumulative = -initialInvestment;
    for (let year = 0; year <= 5; year++) {
      data.push({
        year: `${year}年目`,
        累積収支: Math.round(cumulative),
        投資額ライン: 0
      });
      cumulative += calculations.annualNetProfit;
    }
    return data;
  }, [initialInvestment, calculations.annualNetProfit]);

  // --- UI Helpers ---
  const SectionTitle = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-4 text-slate-700 border-b pb-2">
      <Icon className="w-5 h-5 text-indigo-600" />
      <h3 className="font-bold text-lg">{title}</h3>
    </div>
  );

  const InputGroup = ({ label, value, onChange, unit, step = 1000, min = 0, max, helpText, small = false }) => (
    <div className={small ? "mb-2" : "mb-4"}>
      <div className="flex justify-between items-center mb-1">
        <label className={`block font-medium text-slate-600 ${small ? "text-xs" : "text-sm"}`}>{label}</label>
        {helpText && !small && (
           <div className="group relative">
             <Info className="w-3 h-3 text-slate-400 cursor-help" />
             <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
               {helpText}
             </div>
           </div>
        )}
      </div>
      <div className="flex items-center">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border bg-white ${small ? "p-1 text-xs" : "p-2 sm:text-sm"}`}
          step={step}
          min={min}
          max={max}
        />
        <span className={`ml-2 text-slate-500 w-8 ${small ? "text-xs" : "text-sm"}`}>{unit}</span>
      </div>
      {!small && (
        <input 
          type="range" 
          min={min} 
          max={max || value * 2} 
          value={value} 
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full mt-2 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
      )}
    </div>
  );

  const formatYen = (val) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(val);
  };

  const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
  // Colors: 0:Low, 1:Regular, 2:Semi-High, 3:High
  const SEASON_COLORS = ['#0ea5e9', '#6366f1', '#f59e0b', '#f43f5e']; 
  const SEASON_LABELS = ['閑散期', '通常期', '準繁忙期', '繁忙期'];

  return (
    <div className="min-h-screen bg-slate-50 p-2 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center justify-center md:justify-start gap-3">
            <Home className="w-8 h-8 text-indigo-600" />
            民泊収益シミュレーター Pro
          </h1>
          <p className="text-slate-500 mt-2">
            月ごとの季節変動（繁忙期・準繁忙期・閑散期）を考慮した、より実践的な収益予測が可能です。
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input Forms */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Seasonality Settings */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 ring-2 ring-indigo-50">
              <SectionTitle icon={Calendar} title="季節変動設定" />
              
              <div className="mb-6">
                <p className="text-xs text-slate-500 mb-3">
                  各月をクリックしてシーズンタイプを変更<br/>
                  (青:閑散 / 紫:通常 / 橙:準繁忙 / 赤:繁忙)
                </p>
                <div className="grid grid-cols-6 gap-2">
                  {monthTypes.map((type, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleMonthType(idx)}
                      className="flex flex-col items-center justify-center p-2 rounded transition-colors text-white text-xs font-bold"
                      style={{ backgroundColor: SEASON_COLORS[type] }}
                    >
                      <span>{idx + 1}月</span>
                      <span className="opacity-75 text-[10px]">{SEASON_LABELS[type]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                {/* High Season Config */}
                <div className="bg-rose-50 p-3 rounded-lg border border-rose-100">
                  <div className="flex items-center gap-2 mb-2 text-rose-700 font-bold text-sm">
                    <Sun className="w-4 h-4" /> 繁忙期設定 (通常比)
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <InputGroup 
                      label="ADR倍率" 
                      value={seasonConfig.high.adrMultiplier} 
                      onChange={(v) => updateSeasonConfig('high', 'adrMultiplier', v)} 
                      unit="倍" 
                      step={0.05} 
                      small 
                    />
                    <InputGroup 
                      label="稼働率増減" 
                      value={seasonConfig.high.occAdjustment} 
                      onChange={(v) => updateSeasonConfig('high', 'occAdjustment', v)} 
                      unit="%" 
                      step={5} 
                      min={-100}
                      small 
                    />
                    <div className="col-span-2">
                      <InputGroup 
                        label="平均連泊数" 
                        value={seasonConfig.high.stayLength} 
                        onChange={(v) => updateSeasonConfig('high', 'stayLength', v)} 
                        unit="泊" 
                        step={0.1} 
                        min={1}
                        small 
                      />
                    </div>
                  </div>
                </div>

                {/* Semi-High Season Config */}
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                  <div className="flex items-center gap-2 mb-2 text-orange-700 font-bold text-sm">
                    <CloudSun className="w-4 h-4" /> 準繁忙期設定 (通常比)
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <InputGroup 
                      label="ADR倍率" 
                      value={seasonConfig.semiHigh.adrMultiplier} 
                      onChange={(v) => updateSeasonConfig('semiHigh', 'adrMultiplier', v)} 
                      unit="倍" 
                      step={0.05} 
                      small 
                    />
                    <InputGroup 
                      label="稼働率増減" 
                      value={seasonConfig.semiHigh.occAdjustment} 
                      onChange={(v) => updateSeasonConfig('semiHigh', 'occAdjustment', v)} 
                      unit="%" 
                      step={5} 
                      min={-100}
                      small 
                    />
                     <div className="col-span-2">
                      <InputGroup 
                        label="平均連泊数" 
                        value={seasonConfig.semiHigh.stayLength} 
                        onChange={(v) => updateSeasonConfig('semiHigh', 'stayLength', v)} 
                        unit="泊" 
                        step={0.1} 
                        min={1}
                        small 
                      />
                    </div>
                  </div>
                </div>

                {/* Low Season Config */}
                <div className="bg-sky-50 p-3 rounded-lg border border-sky-100">
                  <div className="flex items-center gap-2 mb-2 text-sky-700 font-bold text-sm">
                    <Snowflake className="w-4 h-4" /> 閑散期設定 (通常比)
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <InputGroup 
                      label="ADR倍率" 
                      value={seasonConfig.low.adrMultiplier} 
                      onChange={(v) => updateSeasonConfig('low', 'adrMultiplier', v)} 
                      unit="倍" 
                      step={0.05} 
                      small 
                    />
                    <InputGroup 
                      label="稼働率増減" 
                      value={seasonConfig.low.occAdjustment} 
                      onChange={(v) => updateSeasonConfig('low', 'occAdjustment', v)} 
                      unit="%" 
                      step={5} 
                      min={-100}
                      small 
                    />
                     <div className="col-span-2">
                      <InputGroup 
                        label="平均連泊数" 
                        value={seasonConfig.low.stayLength} 
                        onChange={(v) => updateSeasonConfig('low', 'stayLength', v)} 
                        unit="泊" 
                        step={0.1} 
                        min={1}
                        small 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Base Parameters */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <SectionTitle icon={TrendingUp} title="通常期の基準設定" />
              <InputGroup 
                label="通常期 ADR (宿泊単価)" 
                value={adr} 
                onChange={setAdr} 
                unit="円" 
                step={500}
                max={50000}
              />
              <InputGroup 
                label="通常期 稼働率" 
                value={occupancyRate} 
                onChange={setOccupancyRate} 
                unit="%" 
                min={0} 
                max={100} 
                step={5}
                helpText="これを基準に繁忙期・閑散期が計算されます"
              />
              <InputGroup 
                label="通常期 平均連泊数" 
                value={avgStayLength} 
                onChange={setAvgStayLength} 
                unit="泊" 
                min={1} 
                max={10} 
                step={0.5}
              />
            </div>

            {/* 3. Cost & Initial */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
               <SectionTitle icon={Calculator} title="コスト・初期投資" />
               <InputGroup label="初期投資" value={initialInvestment} onChange={setInitialInvestment} unit="円" step={100000} max={20000000} />
               <InputGroup label="家賃" value={rent} onChange={setRent} unit="円" max={500000} />
               <InputGroup label="光熱費" value={utilities} onChange={setUtilities} unit="円" />
               <div className="grid grid-cols-2 gap-2">
                 <InputGroup label="清掃受取" value={cleaningFeeRevenue} onChange={setCleaningFeeRevenue} unit="円" small />
                 <InputGroup label="清掃支払" value={cleaningCost} onChange={setCleaningCost} unit="円" small />
               </div>
               
               <div className="pt-4 mt-2 border-t border-slate-100">
                 <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">代行・手数料</h4>
                 <InputGroup label="OTA手数料率" value={otaCommissionRate} onChange={setOtaCommissionRate} unit="%" max={30} step={1} small />
                 <InputGroup 
                    label="運営代行 基本月額" 
                    value={managementFixedFee} 
                    onChange={setManagementFixedFee} 
                    unit="円" 
                    step={1000} 
                    helpText="毎月固定で発生する代行費用"
                    small 
                 />
                 <InputGroup 
                    label="運営代行 手数料率" 
                    value={managementFeeRate} 
                    onChange={setManagementFeeRate} 
                    unit="%" 
                    max={50} 
                    step={1} 
                    helpText="計算式: (売上合計 - OTA手数料) × 料率"
                    small 
                 />
               </div>
            </div>

          </div>

          {/* Right Column: Dashboard & Charts */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* KPI Cards (Annual / 12 for monthly avg) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-6 rounded-xl shadow-sm border text-white ${calculations.monthlyNetProfit >= 0 ? 'bg-indigo-600 border-indigo-700' : 'bg-rose-500 border-rose-600'}`}>
                <div className="text-indigo-100 text-sm mb-1 flex items-center gap-1">
                  <DollarSign className="w-4 h-4" /> 年間想定純利益
                </div>
                <div className="text-3xl font-bold tracking-tight">
                  {formatYen(calculations.annualNetProfit)}
                </div>
                <div className="text-xs mt-2 opacity-80">
                   (月平均: {formatYen(calculations.monthlyNetProfit)})
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="text-slate-500 text-sm mb-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> 実質利回り (年)
                </div>
                <div className={`text-3xl font-bold tracking-tight ${calculations.roi >= 10 ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {calculations.roi.toFixed(1)}%
                </div>
                <div className="text-xs mt-2 text-slate-400">
                   年間売上: {formatYen(calculations.totalRevenue)}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="text-slate-500 text-sm mb-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> 回収期間目安
                </div>
                <div className="text-3xl font-bold tracking-tight text-slate-700">
                  {calculations.paybackMonths > 120 
                    ? '10年以上' 
                    : `${(calculations.paybackMonths / 12).toFixed(1)}年`}
                </div>
                <div className="text-xs mt-2 text-slate-400">
                   投資額: {formatYen(initialInvestment)}
                </div>
              </div>
            </div>

            {/* Chart 1: Monthly Financials (New!) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg mb-4 text-slate-700 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-500" />
                月別収支推移 (季節変動あり)
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                設定した季節パターン（繁忙期・準繁忙期・通常期・閑散期）に基づいた月ごとの予測です。
              </p>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={calculations.monthlyData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{fontSize: 12}} />
                    <YAxis tickFormatter={(val) => `¥${val/10000}万`} tick={{fontSize: 12}} width={60} />
                    <Tooltip 
                      formatter={(value, name) => [formatYen(value), name]}
                      labelFormatter={(label, payload) => {
                        if (payload && payload[0]) {
                           const type = payload[0].payload.seasonType;
                           return `${label} (${SEASON_LABELS[type]})`;
                        }
                        return label;
                      }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="売上" fill="#818cf8" barSize={20} radius={[4, 4, 0, 0]} opacity={0.8} />
                    <Line type="monotone" dataKey="支出" stroke="#ef4444" strokeWidth={2} dot={{r:3}} />
                    <Line type="monotone" dataKey="利益" stroke="#10b981" strokeWidth={3} dot={{r:4}} />
                    <ReferenceLine y={0} stroke="#64748b" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2 & 3 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Cost Breakdown */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg mb-4 text-slate-700 flex items-center gap-2">
                  <PieIcon className="w-5 h-5 text-pink-500" />
                  年間コスト内訳
                </h3>
                <div className="h-64 w-full relative">
                   <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={calculations.breakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {calculations.breakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatYen(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xs text-slate-400">年間支出</span>
                      <span className="font-bold text-slate-700 text-sm">{formatYen(calculations.totalExpenses)}</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  {calculations.breakdown.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-slate-600 truncate">{item.name}</span>
                      <span className="font-medium ml-auto">{formatYen(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Long Term */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg mb-4 text-slate-700 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  累積キャッシュフロー (5年)
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={longTermData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="year" tick={{fontSize: 11}} />
                      <YAxis tickFormatter={(val) => `${val/10000}万`} tick={{fontSize: 11}} width={45} />
                      <Tooltip formatter={(value) => formatYen(value)} />
                      <ReferenceLine y={0} stroke="#64748b" strokeDasharray="3 3" />
                      <Area 
                        type="monotone" 
                        dataKey="累積収支" 
                        stroke="#10b981" 
                        fillOpacity={1} 
                        fill="url(#colorProfit)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-slate-400 mt-4 text-center">
                  年間利益 {formatYen(calculations.annualNetProfit)} が継続した場合の推移
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;