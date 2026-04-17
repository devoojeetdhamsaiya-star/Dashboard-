/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Wallet, 
  Moon, 
  Sun, 
  History, 
  Download,
  LayoutDashboard,
  PieChart as PieChartIcon,
  Filter,
  TrendingUp,
  ArrowRightLeft,
  Users,
  Settings,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Transaction } from './types';
import { INITIAL_TRANSACTIONS, processDashboardData } from './lib/data-utils';
import { ChartGrid } from './components/ChartCards';
import { FileUpload } from './components/FileUpload';
import { ManualForm } from './components/ManualForm';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeView, setActiveView] = useState('overview');

  const dashboardData = useMemo(() => processDashboardData(transactions), [transactions]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleAddTransaction = (t: Transaction) => {
    setTransactions([t, ...transactions]);
    setIsFormOpen(false);
  };

  const handleDataLoaded = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const SidebarItem = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveView(id)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
        activeView === id 
          ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5' 
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${activeView === id ? 'text-primary' : 'group-hover:text-foreground'}`} />
        <span className="text-sm font-semibold tracking-tight uppercase">{label}</span>
      </div>
      {activeView === id && <ChevronRight className="w-4 h-4 animate-in fade-in slide-in-from-left-2" />}
    </button>
  );

  return (
    <div className="flex h-screen bg-background transition-colors duration-300 font-sans overflow-hidden">
      {/* Immersive Sidebar */}
      <aside className="w-72 border-r bg-card/30 backdrop-blur-xl flex flex-col z-50">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary shadow-lg shadow-primary/20 border border-primary/30">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter text-primary uppercase">DASHBOARDS</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-70">Finance Intelligence</p>
            </div>
          </div>

          <nav className="space-y-2">
            <SidebarItem id="overview" label="Overview" icon={LayoutDashboard} />
            <SidebarItem id="profitability" label="Profitability" icon={TrendingUp} />
            <SidebarItem id="cashflow" label="Cashflow" icon={ArrowRightLeft} />
            <SidebarItem id="debtors" label="Debtors" icon={Users} />
            <SidebarItem id="ledger" label="Transaction Log" icon={History} />
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <FileUpload onDataLoaded={handleDataLoaded} />
          
          <Separator className="opacity-10" />
          
          <div className="flex items-center justify-between px-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="rounded-full w-10 h-10 border-white/10"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">System Status</p>
              <div className="flex items-center justify-end gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <span className="text-[10px] font-bold text-foreground">ENCRYPTED</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-background/50 relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-xl px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-primary/30 text-primary uppercase font-black tracking-widest animate-pulse">
              Live Data
            </Badge>
            <span className="text-xs text-muted-foreground font-medium italic opacity-50">Syncing from dashboard_data.xlsx</span>
          </div>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger
              render={
                <Button className="rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform font-bold tracking-tight">
                  <Plus className="w-4 h-4 mr-2" /> NEW RECORD
                </Button>
              }
            />
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Transaction</DialogTitle>
                <DialogDescription>
                  Manually enter a new income or expense record to the ledger.
                </DialogDescription>
              </DialogHeader>
              <ManualForm onAdd={handleAddTransaction} />
            </DialogContent>
          </Dialog>
        </header>

        <div className="p-8 pb-16 max-w-7xl mx-auto space-y-8">
          <AnimatePresence mode="wait">
            {activeView === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <MetricCard 
                    title="Total Income" 
                    value={formatCurrency(dashboardData.totalIncome)} 
                    icon={<ArrowUpCircle className="w-6 h-6 text-[#00FF94]" />}
                    description="Gross Earnings"
                    trend="+12.5% vs Prev"
                    color="text-[#00FF94]"
                    glowClass="glow-income"
                  />
                  <MetricCard 
                    title="Total Expenses" 
                    value={formatCurrency(dashboardData.totalExpenses)} 
                    icon={<ArrowDownCircle className="w-6 h-6 text-[#FF4D4D]" />}
                    description="Operational Costs"
                    trend="-4.2% optimized"
                    color="text-[#FF4D4D]"
                    glowClass="glow-expense"
                  />
                  <MetricCard 
                    title="Net Profit" 
                    value={formatCurrency(dashboardData.balance)} 
                    icon={<Wallet className="w-6 h-6 text-[#00D1FF]" />}
                    description="Retained Earnings"
                    trend="8.1% Margin"
                    color="text-[#00D1FF]"
                  />
                </div>

                <ChartGrid data={dashboardData} />
              </motion.div>
            )}

            {activeView === 'profitability' && (
              <motion.div
                key="profitability"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-black tracking-tighter text-primary">PROFITABILITY ANALYSIS</h2>
                  <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest opacity-60">Margin & Performance Metrics</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MetricCard title="Gross Margin" value="54.2%" color="text-[#00FF94]" />
                  <MetricCard title="EBITDA" value={formatCurrency(dashboardData.balance * 1.1)} color="text-[#00D1FF]" />
                  <MetricCard title="OpEx Ratio" value="28.4%" color="text-[#FF4D4D]" />
                  <MetricCard title="ROI" value="12.8%" color="text-yellow-400" />
                </div>
                <Card className="bg-card/50 border-white/5 backdrop-blur-md">
                   <CardHeader>
                     <CardTitle>Profit Trend</CardTitle>
                   </CardHeader>
                   <CardContent className="h-[400px]">
                      <ChartGrid data={dashboardData} /> {/* Reusing for demo, could specialize later */}
                   </CardContent>
                </Card>
              </motion.div>
            )}

            {activeView === 'cashflow' && (
              <motion.div
                key="cashflow"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-black tracking-tighter text-blue-400">CASHFLOW MONITOR</h2>
                  <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest opacity-60">Liquidity & Inflow Visualization</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <MetricCard title="Inflow" value={formatCurrency(dashboardData.totalIncome)} color="text-[#00FF94]" />
                  <MetricCard title="Outflow" value={formatCurrency(dashboardData.totalExpenses)} color="text-[#FF4D4D]" />
                  <MetricCard title="Burn Rate" value={formatCurrency(dashboardData.totalExpenses / 12)} color="text-orange-500" />
                </div>
                <Card className="p-8 bg-black/40 border-primary/20">
                   <div className="text-center py-20">
                      <ArrowRightLeft className="w-16 h-16 text-primary/20 mx-auto mb-4" />
                      <h3 className="text-xl font-bold uppercase tracking-widest">Temporal Cash Analysis</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto mt-2">Integrating high-frequency cashflow data from latest dashboard intelligence exports.</p>
                   </div>
                </Card>
              </motion.div>
            )}

            {activeView === 'debtors' && (
              <motion.div
                key="debtors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-black tracking-tighter text-red-400">DEBTOR MANAGEMENT</h2>
                  <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest opacity-60">Accounts Receivable Tracking</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <MetricCard title="Outstanding" value={formatCurrency(450000)} color="text-red-400" />
                  <MetricCard title="Overdue" value={formatCurrency(120000)} color="text-red-600" />
                  <MetricCard title="Collection Rate" value="92%" color="text-green-500" />
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Aging Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-6 w-full bg-muted rounded-full overflow-hidden flex">
                       <div className="h-full bg-green-500 w-[60%]" />
                       <div className="h-full bg-yellow-500 w-[20%]" />
                       <div className="h-full bg-orange-500 w-[10%]" />
                       <div className="h-full bg-red-500 w-[10%]" />
                    </div>
                    <div className="mt-4 flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      <span>0-30 Days</span>
                      <span>31-60 Days</span>
                      <span>61-90 Days</span>
                      <span>90+ Days</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeView === 'ledger' && (
              <motion.div
                key="ledger"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="border-white/5 bg-card/50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Transaction Log</CardTitle>
                      <CardDescription>Full immutable history of the current ledger.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="font-bold border-white/10 uppercase text-[10px] tracking-widest">
                       Download CSV
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[700px]">
                      <Table>
                        <TableHeader className="bg-muted/50 sticky top-0 z-10">
                          <TableRow>
                            <TableHead className="w-[120px]">Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions.map((t) => (
                            <TableRow key={t.id} className="group hover:bg-muted/30 transition-colors">
                              <TableCell className="text-xs font-medium text-muted-foreground">
                                {format(new Date(t.date), 'dd/MM/yy')}
                              </TableCell>
                              <TableCell className="font-bold text-sm tracking-tight">
                                {t.description || 'GENERIC_ENTRY'}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-bold border-white/10 uppercase text-[9px] tracking-widest opacity-60">
                                  {t.category}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  className={`uppercase text-[9px] font-black tracking-widest ${t.type === 'income' ? 'bg-[#00FF94]/10 text-[#00FF94] border-[#00FF94]/20' : 'bg-[#FF4D4D]/10 text-[#FF4D4D] border-[#FF4D4D]/20'}`}
                                >
                                  {t.type}
                                </Badge>
                              </TableCell>
                              <TableCell className={`text-right font-mono font-black ${t.type === 'income' ? 'text-[#00FF94]' : 'text-[#FF4D4D]'}`}>
                                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ title, value, icon, description, trend, color, glowClass }: any) {
  return (
    <Card className={`relative overflow-hidden group hover:-translate-y-1 transition-all duration-500 border-white/5 bg-card/50 backdrop-blur-md shadow-2xl ${glowClass || ''}`}>
      <div className={`absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.1] group-hover:scale-150 transition-all duration-700`}>
        {icon}
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-primary/30 transition-colors">
            {icon ? React.cloneElement(icon, { className: 'w-4 h-4 ' + color }) : <Wallet className="w-4 h-4 text-primary" />}
          </div>
          <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-black tracking-tighter ${color} tabular-nums`}>{value}</div>
        <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-black/20 border border-white/5">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight opacity-70 flex-1">{description || 'Live Metrics'}</p>
          <span className={`text-[10px] font-black tracking-tighters px-2 py-0.5 rounded ${color} bg-current/10`}>{trend || 'Stable'}</span>
        </div>
      </CardContent>
    </Card>
  );
}
