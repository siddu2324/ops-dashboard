// src/pages/dashboards/NOCDashboard.jsx
import { useState, useEffect, useRef } from "react";
import {
  RefreshCw, AlertCircle, CheckCircle, XCircle,
  Activity, Globe, Box, AlertTriangle, Bell,
  Monitor, ChevronDown, ChevronRight, Calendar,
  Download, Cpu, HardDrive, Network, MemoryStick,
  MapPin, ZoomIn, ZoomOut, Clock, Filter,
  Server, Wifi, Database, Cloud, Radio, Signal,
  X, Info, ExternalLink, Tag
} from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "../../components/common/Card";
import StatusDot from "../../components/common/StatusDot";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Date Picker Component
const DatePicker = ({ value, onChange, label }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[var(--color-muted)]">{label}</span>
      <div className="relative">
        <input 
          type="datetime-local" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="px-3 py-1.5 pl-8 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent w-[220px]"
        />
        <Calendar size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
      </div>
    </div>
  );
};

// Popup Modal Component
const PopupModal = ({ isOpen, onClose, title, data, severity, areaName, totalCount }) => {
  if (!isOpen) return null;

  const severityConfig = {
    Critical: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', badge: 'bg-red-500/20 text-red-400 border-red-500/30', icon: '🔴' },
    High: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: '🟠' },
    Medium: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: '🟡' },
    Low: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: '🔵' },
    Information: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: '🟣' },
    'Not classified': { bg: 'bg-gray-500/10', border: 'border-gray-500/30', text: 'text-gray-400', badge: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: '⚪' }
  };

  const colors = severityConfig[severity] || severityConfig['Not classified'];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center text-2xl`}>
              {colors.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--color-text)]">{title}</h3>
              <div className="flex items-center gap-3 mt-1">
                <span className={`text-xs px-3 py-1 rounded-full border font-medium ${colors.badge}`}>
                  {severity}
                </span>
                <span className="text-xs text-[var(--color-muted)]">
                  <span className="font-mono text-[var(--color-text)]">{totalCount}</span> problems found in <span className="text-[var(--color-text)] font-medium">{areaName}</span>
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-[var(--color-border)]/10 transition flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {data.length === 0 ? (
            <div className="text-center py-16 text-[var(--color-muted)]">
              <Info size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">No {severity.toLowerCase()} problems found in {areaName}</p>
              <p className="text-sm mt-1 opacity-60">All systems are operating normally</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-3">
                  <p className="text-xs text-[var(--color-faint)]">Total Problems</p>
                  <p className="text-lg font-bold text-[var(--color-text)]">{data.length}</p>
                </div>
                <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-3">
                  <p className="text-xs text-[var(--color-faint)]">Unique Hosts</p>
                  <p className="text-lg font-bold text-[var(--color-text)]">{new Set(data.map(d => d.host)).size}</p>
                </div>
                <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-3">
                  <p className="text-xs text-[var(--color-faint)]">Avg Duration</p>
                  <p className="text-lg font-bold text-[var(--color-text)]">{Math.round(data.reduce((acc, d) => acc + parseInt(d.duration), 0) / data.length / 30) || 0} months</p>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--color-bg)] border-b border-[var(--color-border)]">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Host</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Problem</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Duration</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Tags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index} className={`border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/5 transition ${index === data.length - 1 ? 'border-b-0' : ''}`}>
                        <td className="px-4 py-3 text-[var(--color-text)] font-mono text-xs whitespace-nowrap">
                          {item.time}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[var(--color-ok)]"></div>
                            <span className="text-[var(--color-text)] font-medium">{item.host}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <div className="flex items-start gap-2">
                            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${colors.text.replace('text-', 'bg-')}`}></span>
                            <span className="text-[var(--color-text)] text-sm leading-relaxed">{item.problem}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-[var(--color-muted)]" />
                            <span className="text-[var(--color-muted)] font-mono text-xs">{item.duration}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            {item.tags.map((tag, i) => (
                              <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-border)]/20 text-[var(--color-muted)] border border-[var(--color-border)]/50 hover:border-[var(--color-border)] transition">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6">
          <div className="flex items-center gap-4 text-xs text-[var(--color-muted)]">
            <span>Showing <span className="text-[var(--color-text)] font-medium">{data.length}</span> problems</span>
            <span className="w-px h-4 bg-[var(--color-border)]"></span>
            <span>Severity: <span className={`font-medium ${colors.text}`}>{severity}</span></span>
            <span className="w-px h-4 bg-[var(--color-border)]"></span>
            <span>Area: <span className="text-[var(--color-text)] font-medium">{areaName}</span></span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => toast.success('Exporting problems...')}
              className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)]/10 transition text-[var(--color-muted)] hover:text-[var(--color-text)] flex items-center gap-2"
            >
              <Download size={16} />
              Export
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-90 transition shadow-lg shadow-[var(--color-accent)]/20"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Professional Geo Map Component
const GeoMap = () => {
  return (
    <div className="relative w-full h-[500px] bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg)] via-[var(--color-panel)] to-[var(--color-bg)] opacity-50"></div>
      
      <svg className="absolute inset-0 w-full h-full" opacity="0.05">
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--color-text)" strokeWidth="0.5"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <svg className="relative w-full h-full" viewBox="0 0 1200 650" preserveAspectRatio="xMidYMid meet">
        <rect width="1200" height="650" fill="var(--color-bg)" opacity="0.3" />
        
        <g fill="none" stroke="var(--color-muted)" strokeWidth="1.5" opacity="0.4">
          <path d="M80,80 Q120,50 180,60 Q220,55 250,80 Q280,100 270,140 Q260,170 280,200 Q290,220 270,240 Q250,255 220,245 Q200,235 180,250 Q160,265 140,250 Q120,235 100,220 Q80,200 70,170 Q60,140 70,110 Q75,90 80,80 Z" />
          <path d="M220,190 Q240,180 260,190 Q280,200 270,220 Q260,240 240,230 Q220,220 220,190 Z" />
          <path d="M150,270 Q170,260 190,270 Q210,280 200,300 Q190,320 170,310 Q150,300 150,270 Z" />
          <path d="M260,290 Q280,280 300,290 Q320,310 310,350 Q300,390 290,430 Q280,470 270,500 Q260,510 250,500 Q240,480 230,440 Q220,400 230,360 Q240,320 250,300 Z" />
          <path d="M560,90 Q580,80 600,85 Q620,90 630,110 Q640,130 630,150 Q620,165 600,160 Q580,155 570,140 Q560,120 560,90 Z" />
          <path d="M540,120 Q550,110 570,115 Q580,120 570,130 Q560,135 550,130 Q540,125 540,120 Z" />
          <path d="M580,160 Q600,155 610,165 Q620,175 610,185 Q600,190 590,185 Q580,175 580,160 Z" />
          <path d="M580,200 Q600,190 620,200 Q640,210 650,240 Q660,270 650,310 Q640,350 620,380 Q600,400 590,380 Q580,360 570,330 Q560,300 560,270 Q560,240 570,220 Q575,210 580,200 Z" />
          <path d="M540,280 Q550,270 560,280 Q570,290 560,300 Q550,310 540,300 Q530,290 540,280 Z" />
          <path d="M680,70 Q710,60 740,65 Q770,70 790,90 Q810,110 820,140 Q830,170 820,200 Q810,230 790,250 Q770,260 750,255 Q730,250 710,240 Q690,220 680,190 Q670,160 670,130 Q670,100 680,70 Z" />
          <path d="M800,90 Q830,80 860,85 Q890,90 910,110 Q930,130 920,160 Q910,190 890,210 Q870,220 850,210 Q830,200 820,180 Q810,160 800,140 Q790,120 800,90 Z" />
          <path d="M850,220 Q870,215 890,225 Q910,235 900,255 Q890,270 870,265 Q850,255 850,220 Z" />
          <path d="M750,180 Q770,170 780,180 Q790,190 785,210 Q780,230 770,250 Q760,260 750,250 Q740,230 735,210 Q730,190 740,180 Z" />
          <path d="M760,260 Q775,255 785,265 Q795,275 785,285 Q775,295 765,285 Q755,275 760,260 Z" />
          <path d="M820,280 Q840,270 860,280 Q880,290 870,310 Q860,330 840,340 Q820,345 810,330 Q800,310 810,290 Z" />
          <path d="M860,340 Q870,335 880,345 Q890,355 880,365 Q870,370 860,360 Q850,350 860,340 Z" />
          <path d="M900,370 Q930,360 960,370 Q990,380 1000,410 Q1010,440 990,460 Q970,470 950,460 Q930,450 920,430 Q910,410 900,390 Q890,380 900,370 Z" />
          <path d="M860,120 Q870,110 880,120 Q890,130 880,150 Q870,170 860,160 Q850,150 850,135 Q850,125 860,120 Z" />
          <path d="M540,80 Q550,75 560,80 Q570,85 560,100 Q550,110 540,100 Q530,90 540,80 Z" />
          <path d="M300,40 Q320,30 340,40 Q360,50 350,70 Q340,90 320,80 Q300,70 300,50 Z" />
          <circle cx="1030" cy="430" r="10" />
          <circle cx="1060" cy="410" r="6" />
          <circle cx="1040" cy="450" r="8" />
          <circle cx="1080" cy="440" r="5" />
          <circle cx="1100" cy="420" r="4" />
        </g>
        
        <g stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.2">
          <line x1="180" y1="140" x2="600" y2="130" />
          <line x1="600" y1="130" x2="800" y2="150" />
          <line x1="800" y1="150" x2="760" y2="220" />
          <line x1="760" y1="220" x2="950" y2="390" />
          <line x1="600" y1="130" x2="730" y2="180" />
          <line x1="730" y1="180" x2="760" y2="220" />
          <line x1="180" y1="140" x2="260" y2="300" />
          <line x1="260" y1="300" x2="580" y2="250" />
          <line x1="800" y1="150" x2="860" y2="130" />
        </g>
        
        <circle r="3" fill="var(--color-accent)" opacity="0.6">
          <animateMotion dur="8s" repeatCount="indefinite" path="M180,140 L600,130" />
        </circle>
        <circle r="3" fill="var(--color-accent)" opacity="0.6">
          <animateMotion dur="6s" repeatCount="indefinite" path="M600,130 L800,150" />
        </circle>
        <circle r="3" fill="var(--color-accent)" opacity="0.6">
          <animateMotion dur="7s" repeatCount="indefinite" path="M800,150 L760,220" />
        </circle>
        
        <g>
          <circle cx="180" cy="140" r="8" fill="#ff4444" opacity="0.3">
            <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="180" cy="140" r="5" fill="#ff4444" />
          <circle cx="180" cy="140" r="2" fill="#ffffff" />
          <text x="165" y="125" fill="var(--color-text)" fontSize="10" fontWeight="bold">US-East</text>
          <text x="165" y="155" fill="var(--color-crit)" fontSize="8">● Critical</text>
          
          <circle cx="130" cy="210" r="8" fill="#00ff88" opacity="0.3">
            <animate attributeName="r" values="8;14;8" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="130" cy="210" r="5" fill="#00ff88" />
          <circle cx="130" cy="210" r="2" fill="#ffffff" />
          <text x="115" y="195" fill="var(--color-text)" fontSize="10" fontWeight="bold">US-West</text>
          <text x="115" y="225" fill="var(--color-ok)" fontSize="8">● Healthy</text>
          
          <circle cx="600" cy="130" r="8" fill="#ffaa00" opacity="0.3">
            <animate attributeName="r" values="8;14;8" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="600" cy="130" r="5" fill="#ffaa00" />
          <circle cx="600" cy="130" r="2" fill="#ffffff" />
          <text x="585" y="115" fill="var(--color-text)" fontSize="10" fontWeight="bold">London</text>
          <text x="585" y="145" fill="var(--color-warn)" fontSize="8">● Warning</text>
          
          <circle cx="650" cy="145" r="6" fill="#00ff88" opacity="0.3">
            <animate attributeName="r" values="6;11;6" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="650" cy="145" r="4" fill="#00ff88" />
          <circle cx="650" cy="145" r="1.5" fill="#ffffff" />
          <text x="640" y="135" fill="var(--color-text)" fontSize="9">Paris</text>
          
          <circle cx="820" cy="150" r="6" fill="#00ff88" opacity="0.3">
            <animate attributeName="r" values="6;11;6" dur="2.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="820" cy="150" r="4" fill="#00ff88" />
          <circle cx="820" cy="150" r="1.5" fill="#ffffff" />
          <text x="805" y="140" fill="var(--color-text)" fontSize="10" fontWeight="bold">Tokyo</text>
          <text x="805" y="165" fill="var(--color-ok)" fontSize="8">● Healthy</text>
          
          <circle cx="740" cy="180" r="7" fill="#ffaa00" opacity="0.3">
            <animate attributeName="r" values="7;12;7" dur="2.1s" repeatCount="indefinite" />
          </circle>
          <circle cx="740" cy="180" r="4.5" fill="#ffaa00" />
          <circle cx="740" cy="180" r="1.5" fill="#ffffff" />
          <text x="725" y="170" fill="var(--color-text)" fontSize="9">Singapore</text>
          
          <circle cx="770" cy="220" r="9" fill="#ff4444" opacity="0.3">
            <animate attributeName="r" values="9;15;9" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="770" cy="220" r="6" fill="#ff4444" />
          <circle cx="770" cy="220" r="2" fill="#ffffff" />
          <text x="755" y="205" fill="var(--color-text)" fontSize="10" fontWeight="bold">Mumbai</text>
          <text x="755" y="240" fill="var(--color-crit)" fontSize="8">● Critical</text>
          
          <circle cx="790" cy="250" r="6" fill="#00ff88" opacity="0.3">
            <animate attributeName="r" values="6;11;6" dur="2.3s" repeatCount="indefinite" />
          </circle>
          <circle cx="790" cy="250" r="4" fill="#00ff88" />
          <circle cx="790" cy="250" r="1.5" fill="#ffffff" />
          <text x="780" y="265" fill="var(--color-text)" fontSize="9">Bangalore</text>
          
          <circle cx="950" cy="390" r="7" fill="#ffaa00" opacity="0.3">
            <animate attributeName="r" values="7;12;7" dur="2.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="950" cy="390" r="4.5" fill="#ffaa00" />
          <circle cx="950" cy="390" r="1.5" fill="#ffffff" />
          <text x="935" y="380" fill="var(--color-text)" fontSize="9">Sydney</text>
          
          <circle cx="850" cy="180" r="5" fill="#00ff88" opacity="0.3">
            <animate attributeName="r" values="5;9;5" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="850" cy="180" r="3" fill="#00ff88" />
          <circle cx="850" cy="180" r="1" fill="#ffffff" />
          <text x="840" y="175" fill="var(--color-text)" fontSize="9">Shanghai</text>
          
          <circle cx="280" cy="350" r="6" fill="#00ff88" opacity="0.3">
            <animate attributeName="r" values="6;11;6" dur="2.7s" repeatCount="indefinite" />
          </circle>
          <circle cx="280" cy="350" r="4" fill="#00ff88" />
          <circle cx="280" cy="350" r="1.5" fill="#ffffff" />
          <text x="265" y="345" fill="var(--color-text)" fontSize="9">Sao Paulo</text>
          
          <circle cx="680" cy="200" r="5" fill="#ffaa00" opacity="0.3">
            <animate attributeName="r" values="5;9;5" dur="1.9s" repeatCount="indefinite" />
          </circle>
          <circle cx="680" cy="200" r="3" fill="#ffaa00" />
          <circle cx="680" cy="200" r="1" fill="#ffffff" />
          <text x="670" y="195" fill="var(--color-text)" fontSize="9">Dubai</text>
        </g>
        
        <text x="600" y="35" fill="var(--color-text)" fontSize="16" fontWeight="bold" textAnchor="middle" opacity="0.6" letterSpacing="2">
          GLOBAL NETWORK STATUS
        </text>
        
        <text x="600" y="55" fill="var(--color-muted)" fontSize="10" textAnchor="middle" opacity="0.5">
          2026-07-06 17:51:03 – 2026-07-10 17:51:04
        </text>
        
        <g transform="translate(1030, 570)">
          <rect x="-10" y="-25" width="160" height="70" rx="6" fill="var(--color-panel)" stroke="var(--color-border)" strokeWidth="0.5" opacity="0.9"/>
          <circle cx="5" cy="-10" r="4" fill="#00ff88" />
          <text x="15" y="-6" fill="var(--color-text)" fontSize="9">Healthy</text>
          <circle cx="5" cy="5" r="4" fill="#ffaa00" />
          <text x="15" y="9" fill="var(--color-text)" fontSize="9">Warning</text>
          <circle cx="5" cy="20" r="4" fill="#ff4444" />
          <text x="15" y="24" fill="var(--color-text)" fontSize="9">Critical</text>
          <circle cx="80" cy="-10" r="3" fill="var(--color-accent)" opacity="0.6" />
          <text x="90" y="-6" fill="var(--color-text)" fontSize="9">Data Flow</text>
          <line x1="80" y1="5" x2="110" y2="5" stroke="var(--color-accent)" strokeWidth="1" opacity="0.4" />
          <text x="90" y="9" fill="var(--color-text)" fontSize="9">Connection</text>
        </g>
        
        <g transform="translate(20, 580)">
          <rect x="0" y="0" width="200" height="45" rx="6" fill="var(--color-panel)" stroke="var(--color-border)" strokeWidth="0.5" opacity="0.9"/>
          <text x="10" y="18" fill="var(--color-muted)" fontSize="9">Network Status</text>
          <text x="10" y="35" fill="var(--color-ok)" fontSize="11" fontWeight="bold">12 Locations • 8 Online</text>
        </g>
      </svg>
      
      <div className="absolute bottom-4 right-4 flex gap-1">
        <button className="p-2 bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)]/10 transition shadow-lg" title="Zoom In">
          <ZoomIn size={18} className="text-[var(--color-muted)]" />
        </button>
        <button className="p-2 bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)]/10 transition shadow-lg" title="Zoom Out">
          <ZoomOut size={18} className="text-[var(--color-muted)]" />
        </button>
        <button className="p-2 bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)]/10 transition shadow-lg" title="Reset View">
          <Globe size={18} className="text-[var(--color-muted)]" />
        </button>
      </div>
      
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-[var(--color-panel)] px-3 py-1.5 rounded-lg border border-[var(--color-border)] shadow-lg opacity-80">
        <div className="w-2 h-2 rounded-full bg-[var(--color-ok)] animate-pulse"></div>
        <span className="text-xs text-[var(--color-muted)]">Live</span>
      </div>
    </div>
  );
};

// Generate popup data for a specific area and severity
const generatePopupDataForArea = (areaName, severity, count) => {
  const problems = [
    "Service is unavailable - HTTP 503 error",
    "High CPU usage detected - exceeding 90% threshold",
    "Memory exhausted - swap usage at 95%",
    "Disk full - no space left on device",
    "Network latency spike - response time > 500ms",
    "Database connection failed - connection pool exhausted",
    "SSL certificate expired - unable to establish secure connection",
    "Backup failed - insufficient storage space",
    "Service not responding - health check timeout",
    "High error rate - 5% of requests failing",
    "JVM heap memory usage critical",
    "Database replication lag detected",
    "Cache miss ratio high - performance degraded",
    "API rate limit exceeded",
    "Pod crash loop detected"
  ];
  
  const hosts = [
    "VITBLRUATMSSQL",
    "VITBLRSRVAAC01",
    "VITBLRSRVD01",
    "vitblrsrvbkp01",
    "VITBLRSRVAAC02",
    "VITBLRSRVVW01",
    "VITSRVADC02",
    "VITBLRSRVPW01",
    "ASPL_VITBLRSRVT51",
    "VITSRVPRTG01",
    "PROD-WEB-01",
    "PROD-DB-01",
    "STG-APP-01",
    "DEV-CACHE-01"
  ];
  
  const tags = [
    "Application: MSSQL",
    "Service: Web Server",
    "Environment: Production",
    "Priority: High",
    "Application: Database",
    "Service: API Gateway",
    "Environment: Staging",
    "Priority: Medium",
    "Application: Cache",
    "Service: Load Balancer",
    "Environment: Development",
    "Team: DevOps",
    "Team: Backend",
    "Component: Authentication"
  ];

  const data = [];
  const countToGenerate = Math.min(count || 5, 20);
  
  for (let i = 0; i < countToGenerate; i++) {
    const now = new Date();
    const pastDate = new Date(now);
    pastDate.setDate(now.getDate() - Math.floor(Math.random() * 365));
    pastDate.setHours(Math.floor(Math.random() * 24));
    pastDate.setMinutes(Math.floor(Math.random() * 60));
    pastDate.setSeconds(Math.floor(Math.random() * 60));
    
    const durationDays = Math.floor(Math.random() * 365) + 1;
    const durationMonths = Math.floor(durationDays / 30);
    const remainingDays = durationDays % 30;
    
    const numTags = Math.floor(Math.random() * 2) + 2;
    const selectedTags = [];
    const shuffledTags = [...tags].sort(() => Math.random() - 0.5);
    for (let j = 0; j < numTags && j < shuffledTags.length; j++) {
      if (!selectedTags.includes(shuffledTags[j])) {
        selectedTags.push(shuffledTags[j]);
      }
    }
    
    data.push({
      time: pastDate.toISOString().replace('T', ' ').slice(0, 19),
      info: severity.charAt(0).toUpperCase() + severity.slice(1),
      host: hosts[Math.floor(Math.random() * hosts.length)],
      problem: problems[Math.floor(Math.random() * problems.length)],
      duration: `${durationMonths > 0 ? durationMonths + 'y ' : ''}${remainingDays > 0 ? remainingDays + 'M ' : ''}${Math.floor(Math.random() * 30) + 1}d`,
      tags: selectedTags
    });
  }
  
  return data;
};

// Mock data generator
const generateNOCData = () => {
  const problemGroups = [
    { name: "Area 1", critical: 1, high: 16, medium: 69, low: 8, information: 14, notClassified: 1 },
    { name: "Area 2", critical: 0, high: 8, medium: 23, low: 3, information: 5, notClassified: 0 },
    { name: "Area 3", critical: 2, high: 4, medium: 12, low: 1, information: 3, notClassified: 1 },
    { name: "Area 4", critical: 0, high: 2, medium: 8, low: 0, information: 2, notClassified: 0 },
    { name: "Area 5", critical: 1, high: 5, medium: 15, low: 4, information: 6, notClassified: 2 },
    { name: "Area 6", critical: 0, high: 1, medium: 4, low: 0, information: 1, notClassified: 0 },
  ];

  const deviceAvailability = [
    { type: "Total Hosts", available: 0, notAvailable: 3, mixed: 0, unknown: 81, total: 84 },
    { type: "Agent (passive)", available: 0, notAvailable: 0, mixed: 0, unknown: 75, total: 75 },
    { type: "SNMP", available: 0, notAvailable: 3, mixed: 0, unknown: 10, total: 13 },
    { type: "JMX", available: 0, notAvailable: 0, mixed: 0, unknown: 1, total: 1 },
  ];

  const mapTree = [
    { name: "ASPL", values: [1, 3, 16, 32, 64, 2] },
    { name: "Linux DC Location", values: [2, 2, 3, 3] },
    { name: "Linux HO Location", values: [10, 6, 10, 1] },
    { name: "Windows DC Location", values: [1, 1, 2, 9, 3] },
    { name: "Windows HO Location", values: [2, 14, 2, 1] },
  ];

  const ispLinks = [
    { name: "Internal IT: Airtel ISP Link Gateway", metric: "ICMP resp.", latency: 4, status: "up" },
    { name: "Internal IT: Spectranet Broadband Line", metric: "ICMP resp.", latency: 3, status: "up" },
    { name: "Internal IT: Spectranet Lease Line", metric: "ICMP resp.", latency: 2, status: "warning" },
  ];

  const latencyHistory = Array.from({ length: 14 }, (_, i) => ({
    time: new Date(Date.now() - (13 - i) * 6 * 60 * 60 * 1000),
    values: [
      Math.floor(Math.random() * 10) + 1,
      Math.floor(Math.random() * 10) + 1,
      Math.floor(Math.random() * 10) + 1,
    ]
  }));

  return {
    problemGroups,
    deviceAvailability,
    mapTree,
    ispLinks,
    latencyHistory,
  };
};

export default function NOCDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState(() => {
    const now = new Date();
    const fourDaysAgo = new Date(now);
    fourDaysAgo.setDate(now.getDate() - 4);
    return fourDaysAgo.toISOString().slice(0, 16);
  });
  const [toDate, setToDate] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const mapRef = useRef(null);
  const [popupState, setPopupState] = useState({
    isOpen: false,
    title: '',
    severity: '',
    areaName: '',
    data: [],
    totalCount: 0
  });
  const [expandedSections, setExpandedSections] = useState({
    problems: true,
    availability: true,
    map: true,
    tree: true,
    isp: true,
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(false), 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = (showToast = true) => {
    setIsRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      const data = generateNOCData();
      setDashboardData(data);
      setLoading(false);
      setIsRefreshing(false);
      if (showToast) toast.success("Dashboard updated");
    }, 800);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleApplyDateRange = () => {
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      if (from > to) {
        toast.error("From date must be before To date");
        return;
      }
      toast.success(`Date range applied: ${from.toLocaleString()} to ${to.toLocaleString()}`);
      fetchData(true);
    } else {
      toast.error("Please select both dates");
    }
  };

  const openPopup = (areaName, severity, count) => {
    if (!dashboardData) return;
    
    const data = generatePopupDataForArea(areaName, severity, count);
    
    setPopupState({
      isOpen: true,
      title: `${severity} Problems in ${areaName}`,
      severity: severity,
      areaName: areaName,
      data: data,
      totalCount: count
    });
  };

  const closePopup = () => {
    setPopupState({
      isOpen: false,
      title: '',
      severity: '',
      areaName: '',
      data: [],
      totalCount: 0
    });
  };

  // Export to PDF with map image
  const exportToPDF = async () => {
    setIsExporting(true);
    const toastId = toast.loading("Generating PDF...");
    
    try {
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      let yPos = 20;
      const margin = 20;
      const pageWidth = 280;
      const pageHeight = 210;
      
      // Title
      pdf.setFontSize(18);
      pdf.setTextColor('#000000');
      pdf.text('NOC Dashboard', margin, yPos);
      yPos += 10;
      
      // Date range
      pdf.setFontSize(10);
      pdf.setTextColor('#666666');
      pdf.text(`From: ${fromDate}  To: ${toDate}`, margin, yPos);
      yPos += 10;
      
      // Separator
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;
      
      // Capture the map as an image
      const mapElement = document.querySelector('.map-container');
      if (mapElement) {
        const canvas = await html2canvas(mapElement, {
          scale: 1.5,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: mapElement.scrollWidth,
          height: mapElement.scrollHeight,
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        
        const imgWidth = pageWidth - (margin * 2);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        if (yPos + imgHeight > pageHeight - 20) {
          pdf.addPage();
          yPos = 20;
        }
        
        pdf.addImage(imgData, 'JPEG', margin, yPos, imgWidth, imgHeight);
        yPos += imgHeight + 10;
      }
      
      // Problems by severity table
      if (yPos > pageHeight - 50) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFontSize(14);
      pdf.setTextColor('#000000');
      pdf.text('Problems by severity', margin, yPos);
      yPos += 10;
      
      const headers = ['Host group', 'Critical', 'High', 'Medium', 'Low', 'Information', 'Not classified'];
      let xPos = margin;
      const colWidths = [45, 22, 22, 22, 22, 28, 32];
      
      pdf.setFontSize(9);
      pdf.setTextColor('#666666');
      headers.forEach((header, i) => {
        pdf.text(header, xPos, yPos);
        xPos += colWidths[i];
      });
      yPos += 5;
      
      pdf.setTextColor('#333333');
      dashboardData.problemGroups.forEach((group) => {
        if (yPos > pageHeight - 20) {
          pdf.addPage();
          yPos = 20;
        }
        xPos = margin;
        const rowData = [
          group.name,
          group.critical || '-',
          group.high || '-',
          group.medium || '-',
          group.low || '-',
          group.information || '-',
          group.notClassified || '-'
        ];
        rowData.forEach((data, i) => {
          pdf.text(String(data), xPos, yPos);
          xPos += colWidths[i];
        });
        yPos += 6;
      });
      
      yPos += 5;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;
      
      // Device Availability
      if (yPos > pageHeight - 50) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFontSize(14);
      pdf.setTextColor('#000000');
      pdf.text('Overall Device Availability', margin, yPos);
      yPos += 10;
      
      const availHeaders = ['Type', 'Available', 'Not available', 'Mixed', 'Unknown', 'Total'];
      const availColWidths = [55, 28, 32, 22, 28, 22];
      xPos = margin;
      
      pdf.setFontSize(9);
      pdf.setTextColor('#666666');
      availHeaders.forEach((header, i) => {
        pdf.text(header, xPos, yPos);
        xPos += availColWidths[i];
      });
      yPos += 5;
      
      pdf.setTextColor('#333333');
      dashboardData.deviceAvailability.forEach((device) => {
        if (yPos > pageHeight - 20) {
          pdf.addPage();
          yPos = 20;
        }
        xPos = margin;
        const rowData = [
          device.type,
          device.available,
          device.notAvailable,
          device.mixed,
          device.unknown,
          device.total
        ];
        rowData.forEach((data, i) => {
          pdf.text(String(data), xPos, yPos);
          xPos += availColWidths[i];
        });
        yPos += 6;
      });
      
      yPos += 5;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;
      
      // ISP Links
      if (yPos > pageHeight - 50) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFontSize(14);
      pdf.setTextColor('#000000');
      pdf.text('ISP Links', margin, yPos);
      yPos += 10;
      
      const ispHeaders = ['Link Name', 'Metric', 'Latency', 'Status'];
      const ispColWidths = [110, 35, 25, 25];
      xPos = margin;
      
      pdf.setFontSize(9);
      pdf.setTextColor('#666666');
      ispHeaders.forEach((header, i) => {
        pdf.text(header, xPos, yPos);
        xPos += ispColWidths[i];
      });
      yPos += 5;
      
      pdf.setTextColor('#333333');
      dashboardData.ispLinks.forEach((link) => {
        if (yPos > pageHeight - 20) {
          pdf.addPage();
          yPos = 20;
        }
        xPos = margin;
        const rowData = [
          link.name,
          link.metric,
          `${link.latency}ms`,
          link.status.toUpperCase()
        ];
        rowData.forEach((data, i) => {
          pdf.text(String(data), xPos, yPos);
          xPos += ispColWidths[i];
        });
        yPos += 6;
      });
      
      pdf.setFontSize(8);
      pdf.setTextColor('#999999');
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, margin, pageHeight - 10);
      
      pdf.save(`NOC_Dashboard_${new Date().toISOString().slice(0, 10)}.pdf`);
      
      toast.success("PDF exported successfully!", { id: toastId });
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast.error("Failed to export PDF: " + error.message, { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <Card className="overflow-hidden">
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <DatePicker 
              value={fromDate} 
              onChange={setFromDate} 
              label="From" 
            />
            <DatePicker 
              value={toDate} 
              onChange={setToDate} 
              label="To" 
            />
            <button 
              onClick={handleApplyDateRange}
              className="px-4 py-1.5 bg-[var(--color-accent)] text-[#06222A] font-semibold rounded-lg hover:opacity-80 transition"
            >
              Apply
            </button>
          </div>
        </div>
      </Card>

      {/* Problems by Severity - Clean Table Design */}
      <Card className="overflow-hidden">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--color-border)]/10 transition"
          onClick={() => toggleSection('problems')}
        >
          <div className="flex items-center gap-3">
            {expandedSections.problems ? <ChevronDown size={20} className="text-[var(--color-muted)]" /> : <ChevronRight size={20} className="text-[var(--color-muted)]" />}
            <AlertTriangle size={20} className="text-[var(--color-muted)]" />
            <h3 className="font-semibold text-[var(--color-text)]">Problems by severity</h3>
          </div>
        </div>
        {expandedSections.problems && (
          <div className="p-4 border-t border-[var(--color-border)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-bg)] border-b border-[var(--color-border)]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Host group</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Critical
                    </span>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      High
                    </span>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                      Medium
                    </span>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      Low
                    </span>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      Information
                    </span>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                      Not classified
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.problemGroups.map((group, i) => (
                  <tr key={i} className={`border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/5 transition ${i % 2 === 0 ? 'bg-[var(--color-bg)]/30' : ''}`}>
                    <td className="px-4 py-3 text-[var(--color-text)] font-medium">{group.name}</td>
                    
                    <td className="px-4 py-3 text-center">
                      {group.critical > 0 ? (
                        <button
                          onClick={() => openPopup(group.name, 'Critical', group.critical)}
                          className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 font-bold hover:bg-red-500/20 transition cursor-pointer border border-red-500/20 hover:border-red-500/40"
                        >
                          {group.critical}
                        </button>
                      ) : (
                        <span className="text-[var(--color-faint)]">—</span>
                      )}
                    </td>
                    
                    <td className="px-4 py-3 text-center">
                      {group.high > 0 ? (
                        <button
                          onClick={() => openPopup(group.name, 'High', group.high)}
                          className="px-3 py-1 rounded-lg bg-orange-500/10 text-orange-400 font-bold hover:bg-orange-500/20 transition cursor-pointer border border-orange-500/20 hover:border-orange-500/40"
                        >
                          {group.high}
                        </button>
                      ) : (
                        <span className="text-[var(--color-faint)]">—</span>
                      )}
                    </td>
                    
                    <td className="px-4 py-3 text-center">
                      {group.medium > 0 ? (
                        <button
                          onClick={() => openPopup(group.name, 'Medium', group.medium)}
                          className="px-3 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 font-bold hover:bg-yellow-500/20 transition cursor-pointer border border-yellow-500/20 hover:border-yellow-500/40"
                        >
                          {group.medium}
                        </button>
                      ) : (
                        <span className="text-[var(--color-faint)]">—</span>
                      )}
                    </td>
                    
                    <td className="px-4 py-3 text-center">
                      {group.low > 0 ? (
                        <button
                          onClick={() => openPopup(group.name, 'Low', group.low)}
                          className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 font-bold hover:bg-blue-500/20 transition cursor-pointer border border-blue-500/20 hover:border-blue-500/40"
                        >
                          {group.low}
                        </button>
                      ) : (
                        <span className="text-[var(--color-faint)]">—</span>
                      )}
                    </td>
                    
                    <td className="px-4 py-3 text-center">
                      {group.information > 0 ? (
                        <button
                          onClick={() => openPopup(group.name, 'Information', group.information)}
                          className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-400 font-bold hover:bg-purple-500/20 transition cursor-pointer border border-purple-500/20 hover:border-purple-500/40"
                        >
                          {group.information}
                        </button>
                      ) : (
                        <span className="text-[var(--color-faint)]">—</span>
                      )}
                    </td>
                    
                    <td className="px-4 py-3 text-center">
                      {group.notClassified > 0 ? (
                        <button
                          onClick={() => openPopup(group.name, 'Not classified', group.notClassified)}
                          className="px-3 py-1 rounded-lg bg-gray-500/10 text-gray-400 font-bold hover:bg-gray-500/20 transition cursor-pointer border border-gray-500/20 hover:border-gray-500/40"
                        >
                          {group.notClassified}
                        </button>
                      ) : (
                        <span className="text-[var(--color-faint)]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Popup Modal */}
      <PopupModal
        isOpen={popupState.isOpen}
        onClose={closePopup}
        title={popupState.title}
        data={popupState.data}
        severity={popupState.severity}
        areaName={popupState.areaName}
        totalCount={popupState.totalCount}
      />

      {/* Overall Device Availability - Clean Table Design */}
      <Card className="overflow-hidden">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--color-border)]/10 transition"
          onClick={() => toggleSection('availability')}
        >
          <div className="flex items-center gap-3">
            {expandedSections.availability ? <ChevronDown size={20} className="text-[var(--color-muted)]" /> : <ChevronRight size={20} className="text-[var(--color-muted)]" />}
            <Server size={20} className="text-[var(--color-muted)]" />
            <h3 className="font-semibold text-[var(--color-text)]">Overall Device Availability</h3>
          </div>
        </div>
        {expandedSections.availability && (
          <div className="p-4 border-t border-[var(--color-border)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-bg)] border-b border-[var(--color-border)]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Available
                    </span>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Not available
                    </span>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                      Mixed
                    </span>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                      Unknown
                    </span>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.deviceAvailability.map((device, i) => (
                  <tr key={i} className={`border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/5 transition ${i % 2 === 0 ? 'bg-[var(--color-bg)]/30' : ''}`}>
                    <td className="px-4 py-3 text-[var(--color-text)] font-medium">{device.type}</td>
                    <td className="px-4 py-3 text-center text-[var(--color-text)]">{device.available}</td>
                    <td className="px-4 py-3 text-center text-[var(--color-text)]">{device.notAvailable}</td>
                    <td className="px-4 py-3 text-center text-[var(--color-text)]">{device.mixed}</td>
                    <td className="px-4 py-3 text-center text-[var(--color-text)]">{device.unknown}</td>
                    <td className="px-4 py-3 text-center text-[var(--color-text)] font-bold">{device.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* World Map */}
      <Card className="overflow-hidden">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--color-border)]/10 transition"
          onClick={() => toggleSection('map')}
        >
          <div className="flex items-center gap-3">
            {expandedSections.map ? <ChevronDown size={20} className="text-[var(--color-muted)]" /> : <ChevronRight size={20} className="text-[var(--color-muted)]" />}
            <Globe size={20} className="text-[var(--color-muted)]" />
            <h3 className="font-semibold text-[var(--color-text)]">World Map</h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 text-[var(--color-ok)]">● 8 Online</span>
            <span className="inline-flex items-center gap-1 text-[var(--color-warn)]">● 3 Warning</span>
            <span className="inline-flex items-center gap-1 text-[var(--color-crit)]">● 2 Critical</span>
          </div>
        </div>
        {expandedSections.map && (
          <div className="p-4 border-t border-[var(--color-border)] map-container" ref={mapRef}>
            <GeoMap />
          </div>
        )}
      </Card>

      {/* Map Navigation Tree and ISP Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Map Navigation Tree */}
        <Card className="overflow-hidden">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--color-border)]/10 transition"
            onClick={() => toggleSection('tree')}
          >
            <div className="flex items-center gap-3">
              {expandedSections.tree ? <ChevronDown size={20} className="text-[var(--color-muted)]" /> : <ChevronRight size={20} className="text-[var(--color-muted)]" />}
              <MapPin size={20} className="text-[var(--color-muted)]" />
              <h3 className="font-semibold text-[var(--color-text)]">Map navigation tree</h3>
            </div>
          </div>
          {expandedSections.tree && (
            <div className="p-4 border-t border-[var(--color-border)]">
              <div className="space-y-3">
                {dashboardData.mapTree.map((item, i) => (
                  <div key={i} className="flex items-center justify-between hover:bg-[var(--color-border)]/10 px-2 py-1 rounded transition">
                    <span className="text-[var(--color-text)]">{item.name}</span>
                    <div className="flex gap-1">
                      {item.values.map((val, j) => (
                        <span 
                          key={j} 
                          className={`px-2 py-0.5 rounded text-xs ${
                            val > 10 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            val > 5 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            'bg-green-500/20 text-green-400 border border-green-500/30'
                          }`}
                        >
                          {val}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* ISP Links */}
        <Card className="overflow-hidden">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--color-border)]/10 transition"
            onClick={() => toggleSection('isp')}
          >
            <div className="flex items-center gap-3">
              {expandedSections.isp ? <ChevronDown size={20} className="text-[var(--color-muted)]" /> : <ChevronRight size={20} className="text-[var(--color-muted)]" />}
              <Signal size={20} className="text-[var(--color-muted)]" />
              <h3 className="font-semibold text-[var(--color-text)]">ISP Links</h3>
            </div>
          </div>
          {expandedSections.isp && (
            <div className="p-4 border-t border-[var(--color-border)]">
              <div className="space-y-4">
                {dashboardData.ispLinks.map((link, i) => (
                  <div key={i} className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 hover:border-[var(--color-accent)] transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {link.status === 'up' ? (
                          <CheckCircle size={14} className="text-[var(--color-ok)]" />
                        ) : (
                          <AlertCircle size={14} className="text-[var(--color-warn)]" />
                        )}
                        <span className="text-sm text-[var(--color-text)]">{link.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-[var(--color-text)]">{link.latency}ms</span>
                        <StatusDot state={link.status} size="sm" />
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-[var(--color-muted)]">{link.metric}</div>
                    
                    <div className="mt-2 h-8 flex items-end gap-0.5">
                      {dashboardData.latencyHistory.slice(-8).map((point, j) => (
                        <div 
                          key={j}
                          className="flex-1 rounded-sm transition-all duration-300"
                          style={{ 
                            height: `${(point.values[i % 3] / 10) * 100}%`,
                            background: point.values[i % 3] > 7 ? 'var(--color-crit)' : 
                                       point.values[i % 3] > 4 ? 'var(--color-warn)' : 'var(--color-ok)',
                            opacity: 0.4 + (point.values[i % 3] / 10) * 0.4
                          }}
                        />
                      ))}
                    </div>
                    
                    <div className="mt-1 flex justify-between text-[8px] text-[var(--color-faint)]">
                      {dashboardData.latencyHistory.slice(-8).map((point, j) => (
                        <span key={j}>
                          {new Date(point.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}