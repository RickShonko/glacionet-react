import React, { useState } from 'react';
import { Mountain, Waves, TrendingUp, Menu, X, MapPin, AlertTriangle, Droplets } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample Data
const glacierData = {
  name: "Kolahoi Glacier",
  region: "Himalayas",
  elevation: 4700,
  area_km2: 12.4,
  temp_anomaly: 2.3,
  melt_rate: 0.45,
  coordinates: [34.0250, 75.3275]
};

const predictionsData = {
  glof_risk: 0.78,
  water_security_index: 0.62,
  temp_anomaly: 2.3,
  glacier_area_current: 12.4,
  meltwater_forecast: [
    {day: 1, flow: 45.2}, {day: 2, flow: 47.8}, {day: 3, flow: 52.1},
    {day: 4, flow: 55.6}, {day: 5, flow: 58.9}, {day: 6, flow: 62.3},
    {day: 7, flow: 65.8}, {day: 8, flow: 68.4}, {day: 9, flow: 71.2},
    {day: 10, flow: 73.5}, {day: 11, flow: 76.1}, {day: 12, flow: 78.9},
    {day: 13, flow: 81.2}, {day: 14, flow: 83.6}, {day: 15, flow: 85.4},
    {day: 16, flow: 87.8}, {day: 17, flow: 89.2}, {day: 18, flow: 90.5},
    {day: 19, flow: 91.8}, {day: 20, flow: 92.4}, {day: 21, flow: 92.1},
    {day: 22, flow: 91.5}, {day: 23, flow: 90.2}, {day: 24, flow: 88.6},
    {day: 25, flow: 86.4}, {day: 26, flow: 84.1}, {day: 27, flow: 81.5},
    {day: 28, flow: 78.9}, {day: 29, flow: 76.2}, {day: 30, flow: 73.8}
  ],
  glacier_area_history: [
    {month: "Jan", area: 13.2}, {month: "Feb", area: 13.1},
    {month: "Mar", area: 13.0}, {month: "Apr", area: 12.9},
    {month: "May", area: 12.7}, {month: "Jun", area: 12.6},
    {month: "Jul", area: 12.5}, {month: "Aug", area: 12.4},
    {month: "Sep", area: 12.4}, {month: "Oct", area: 12.4},
    {month: "Nov", area: 12.4}, {month: "Dec", area: 12.4}
  ],
  ai_summary: "GlacioNet AI predicts a 14% increase in meltwater flow over the next 30 days due to elevated temperatures. GLOF risk remains high at 78%. Glacier area has decreased by 6% over the past year.",
  risk_factors: [
    "Rising temperatures (+2.3°C above baseline)",
    "Rapid lake expansion (12% growth in 6 months)",
    "Downstream population: ~45,000 people at risk"
  ]
};

// Navbar Component
function Navbar({ currentPage, setCurrentPage }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Overview', icon: Mountain },
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'predictions', label: 'AI Predictions', icon: TrendingUp }
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <Mountain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">GlacioNet</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}

// MetricCard Component
function MetricCard({ title, value, subtitle, icon: Icon, trend, color = "blue" }) {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-400",
    green: "from-green-500 to-emerald-400",
    orange: "from-orange-500 to-amber-400",
    red: "from-red-500 to-rose-400"
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className={`text-sm font-semibold px-2 py-1 rounded ${
            trend > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          }`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <h3 className="text-slate-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-slate-800 mb-1">{value}</p>
      {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
    </div>
  );
}

// Home Page
function HomePage({ setCurrentPage }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-slate-800 mb-6">
              AI-Powered Glacier Health Monitoring
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Real-time glacier meltwater tracking and GLOF risk assessment to protect communities and water security
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setCurrentPage('map')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                View Map
              </button>
              <button
                onClick={() => setCurrentPage('predictions')}
                className="px-6 py-3 bg-white text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors border border-slate-200 flex items-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                See Predictions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Current Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Glacier Area"
            value={`${glacierData.area_km2} km²`}
            subtitle="Down 6% from last year"
            icon={Mountain}
            trend={-6}
            color="blue"
          />
          <MetricCard
            title="Temperature Anomaly"
            value={`+${predictionsData.temp_anomaly}°C`}
            subtitle="Above baseline"
            icon={TrendingUp}
            trend={2.3}
            color="orange"
          />
          <MetricCard
            title="GLOF Risk Score"
            value={`${Math.round(predictionsData.glof_risk * 100)}%`}
            subtitle="High risk level"
            icon={AlertTriangle}
            color="red"
          />
          <MetricCard
            title="Water Security"
            value={`${Math.round(predictionsData.water_security_index * 100)}%`}
            subtitle="Moderate concern"
            icon={Droplets}
            color="green"
          />
        </div>

        {/* Problem Statement */}
        <div className="mt-12 bg-white rounded-xl p-8 shadow-lg border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">The Climate Challenge</h2>
          <div className="space-y-4 text-slate-600">
            <p>
              Glaciers worldwide are melting at unprecedented rates due to climate change. This poses two critical threats:
            </p>
            <div className="grid md:grid-cols-2 gap-6 my-6">
              <div className="bg-red-50 rounded-lg p-6 border border-red-100">
                <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Glacial Lake Outburst Floods (GLOFs)
                </h3>
                <p className="text-red-800 text-sm">
                  Rapid glacier melt creates unstable lakes that can burst catastrophically, devastating downstream communities with little warning.
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <Droplets className="w-5 h-5" />
                  Water Security Crisis
                </h3>
                <p className="text-blue-800 text-sm">
                  Over 2 billion people depend on glacier meltwater. Accelerated melting disrupts seasonal water supply for agriculture, energy, and drinking water.
                </p>
              </div>
            </div>
            <p className="font-semibold text-slate-800">
              GlacioNet uses AI and satellite data to predict meltwater patterns and GLOF risks, enabling early warnings and informed water management decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Map Page (Simplified - no actual Leaflet in this demo)
function MapPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Glacier Monitor</h1>
          <p className="text-slate-600">Real-time satellite imagery and risk zones</p>
        </div>

        {/* Simulated Map */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
          <div className="bg-gradient-to-br from-slate-100 to-blue-100 h-[600px] relative flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Interactive Map View</h3>
              <p className="text-slate-600 mb-4">Kolahoi Glacier, Himalayas</p>
              <div className="inline-block bg-white rounded-lg p-4 shadow-lg">
                <div className="text-sm text-slate-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Glacier Boundary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-cyan-400 rounded"></div>
                    <span>Glacial Lake</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>High Risk Zone</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Glacier Info Panel */}
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-lg border border-slate-100">
            <h4 className="font-semibold text-slate-700 mb-2">Location</h4>
            <p className="text-2xl font-bold text-slate-800">{glacierData.name}</p>
            <p className="text-slate-600 text-sm">{glacierData.region}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg border border-slate-100">
            <h4 className="font-semibold text-slate-700 mb-2">Elevation</h4>
            <p className="text-2xl font-bold text-slate-800">{glacierData.elevation}m</p>
            <p className="text-slate-600 text-sm">Above sea level</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg border border-slate-100">
            <h4 className="font-semibold text-slate-700 mb-2">Current Area</h4>
            <p className="text-2xl font-bold text-slate-800">{glacierData.area_km2} km²</p>
            <p className="text-red-600 text-sm font-semibold">↓ 6% annual loss</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Predictions Page
function PredictionsPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">AI Predictions</h1>
          <p className="text-slate-600">30-day meltwater forecast and risk analysis</p>
        </div>

        {/* AI Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-8 text-white mb-6 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">AI Analysis Summary</h2>
              <p className="text-blue-50 text-lg leading-relaxed">
                {predictionsData.ai_summary}
              </p>
            </div>
          </div>
        </div>

        {/* Risk Scores */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">GLOF Risk Score</h3>
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div className="mb-4">
              <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl font-bold text-red-600">
                  {Math.round(predictionsData.glof_risk * 100)}
                </span>
                <span className="text-2xl text-slate-600 mb-1">/ 100</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-red-500 to-rose-400 h-3 rounded-full transition-all"
                  style={{ width: `${predictionsData.glof_risk * 100}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-slate-600">High risk - immediate monitoring recommended</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Water Security Index</h3>
              <Droplets className="w-6 h-6 text-blue-500" />
            </div>
            <div className="mb-4">
              <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl font-bold text-blue-600">
                  {Math.round(predictionsData.water_security_index * 100)}
                </span>
                <span className="text-2xl text-slate-600 mb-1">/ 100</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-3 rounded-full transition-all"
                  style={{ width: `${predictionsData.water_security_index * 100}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-slate-600">Moderate concern - seasonal monitoring advised</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">30-Day Meltwater Forecast</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={predictionsData.meltwater_forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="day"
                  label={{ value: 'Days', position: 'insideBottom', offset: -5 }}
                  stroke="#64748b"
                />
                <YAxis
                  label={{ value: 'Flow (m³/s)', angle: -90, position: 'insideLeft' }}
                  stroke="#64748b"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="flow"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-slate-600 mt-2">
              Peak meltwater flow expected around day 20
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Glacier Area - 12 Month Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={predictionsData.glacier_area_history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis
                  label={{ value: 'Area (km²)', angle: -90, position: 'insideLeft' }}
                  stroke="#64748b"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="area" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-slate-600 mt-2">
              Consistent area loss observed since May
            </p>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">Key Risk Factors</h3>
          <div className="space-y-3">
            {predictionsData.risk_factors.map((factor, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">{factor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function GlacioNetApp() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} />}
      {currentPage === 'map' && <MapPage />}
      {currentPage === 'predictions' && <PredictionsPage />}
    </div>
  );
}