// ============================================================================
// CANFORD BOOKS - AUTOMATIC FINANCIAL REPORT ENGINE
// Reports are generated directly from invoices, payments, expenses,
// indirect income and capital entries already stored in BooksStore.
// No manual report entry is required.
// ============================================================================

let currentReportTab = "pnl";
let reportPeriod = "fy";
const REPORT_TABS = ['pnl','balance','trial','cashflow','ledger','aging','defaulters'];
const money = n => `₹${(Number(n)||0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const num = n => Number(n)||0;
const esc = v => String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

function financialYearRange(base = new Date()) {
  const y = base.getFullYear();
  const startYear = base.getMonth() >= 3 ? y : y - 1;
  return { start:new Date(startYear,3,1,0,0,0,0), end:new Date(startYear+1,2,31,23,59,59,999) };
}
function currentCalendarYearRange(base = new Date()) {
  return { start:new Date(base.getFullYear(),0,1), end:new Date(base.getFullYear(),11,31,23,59,59,999) };
}
function reportPeriodRange() {
  const now = new Date();
  if (reportPeriod === 'year') return currentCalendarYearRange(now);
  if (reportPeriod === 'all') return { start:new Date(0), end:new Date(8640000000000000) };
  return financialYearRange(now);
}
function inRange(date, start, end) {
  if (!date) return true;
  const d = new Date(date);
  return !isNaN(d) && d >= start && d <= end;
}
function dateOnly(v) {
  const d = new Date(v || '');
  return isNaN(d) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function reportPeriodLabel() {
  if (reportPeriod === 'all') return 'All recorded transactions';
  const r = reportPeriodRange();
  return `${r.start.toLocaleDateString('en-IN')} – ${r.end.toLocaleDateString('en-IN')}`;
}
function reportHeader(title, subtitle='') {
  return `<div class="text-center border-b border-slate-200 pb-4 mb-5"><h3 class="text-lg font-black text-slate-900 font-display">${title}</h3><p class="text-xs text-slate-500">Canford International • ${subtitle || reportPeriodLabel()}</p></div>`;
}
function reportControls() {
  return `<div class="flex flex-wrap items-center justify-between gap-2 mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
    <div><p class="text-[10px] font-black uppercase tracking-wide text-slate-500">Automatic reporting period</p><p class="text-xs text-slate-700">Reports update from the latest saved transactions.</p></div>
    <div class="flex items-center gap-2"><select onchange="setReportPeriod(this.value)" class="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white font-semibold"><option value="fy" ${reportPeriod==='fy'?'selected':''}>Current Financial Year (Apr–Mar)</option><option value="year" ${reportPeriod==='year'?'selected':''}>Current Calendar Year</option><option value="all" ${reportPeriod==='all'?'selected':''}>All Recorded Transactions</option></select><button onclick="refreshFinancialReports()" class="px-3 py-2 rounded-lg bg-[#005696] text-white text-xs font-bold"><i class="fas fa-sync-alt mr-1"></i>Refresh</button></div>
  </div>`;
}
function reportActions(name) {
  return `<div class="flex justify-end mb-3"><button onclick="printFinancialReport('${name}')" class="px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold"><i class="fas fa-print mr-1"></i> Print Report</button></div>`;
}
function initReportsModule() { switchReportTab(currentReportTab || 'pnl'); }
function setReportPeriod(period) { reportPeriod = ['fy','year','all'].includes(period) ? period : 'fy'; refreshFinancialReports(); }
function refreshFinancialReports() { switchReportTab(currentReportTab || 'pnl'); }

function switchReportTab(tab) {
  currentReportTab = REPORT_TABS.includes(tab) ? tab : 'pnl';
  REPORT_TABS.forEach(t => {
    const btn=document.getElementById(`rep-tab-${t}`), view=document.getElementById(`rep-view-${t}`);
    if(!btn || !view) return;
    if(t===currentReportTab){ btn.className='px-4 py-2 border-b-2 border-[#005696] font-bold text-xs text-[#005696]'; view.classList.remove('hidden'); }
    else { btn.className='px-4 py-2 text-slate-500 hover:text-slate-800 font-semibold text-xs'; view.classList.add('hidden'); }
  });
  ({pnl:renderPnLReport,balance:renderBalanceSheet,trial:renderTrialBalance,cashflow:renderCashFlow,ledger:renderGeneralLedger,aging:renderAgingReport,defaulters:renderDefaultersReport}[currentReportTab])();
}

// Build the accounting engine from the data already recorded in the software.
// Invoices: Dr Accounts Receivable / Cr Course Fee Revenue
// Payments: Dr Cash/Bank / Cr Accounts Receivable
// Other income: Dr Cash/Bank / Cr Other Income
// Capital: Dr Cash/Bank / Cr Capital Introduced
// Expenses: Dr Expense / Cr Cash/Bank
function getReportData(asOf = null) {
  const range = reportPeriodRange();
  const end = asOf ? new Date(asOf.getFullYear(), asOf.getMonth(), asOf.getDate(), 23,59,59,999) : range.end;
  const invoices = BooksStore.getInvoices().filter(i => inRange(i.date, range.start, end));
  const payments = BooksStore.getPayments().filter(p => inRange(p.date || p.paymentDate, range.start, end));
  const expenses = BooksStore.getExpenses().filter(e => inRange(e.date || e.expenseDate, range.start, end));
  const incomes = BooksStore.getIncomes().filter(x => inRange(x.date, range.start, end));

  const feeRevenue = invoices.reduce((s,i)=>s+num(i.total),0);
  const feeCollected = payments.reduce((s,p)=>s+num(p.amount),0);
  const otherIncome = incomes.filter(x=>x.type!=='capital').reduce((s,x)=>s+num(x.amount),0);
  const capital = incomes.filter(x=>x.type==='capital').reduce((s,x)=>s+num(x.amount),0);
  const expensesTotal = expenses.reduce((s,x)=>s+num(x.amount),0);
  const receivables = Math.max(0, feeRevenue - feeCollected);
  const profit = feeRevenue + otherIncome - expensesTotal;
  const cash = feeCollected + otherIncome + capital - expensesTotal;
  const assets = cash + receivables;
  const equity = capital + profit;
  const difference = assets - equity;
  return {range:{start:range.start,end},invoices,payments,expenses,incomes,feeRevenue,feeCollected,receivables,otherIncome,capital,expensesTotal,profit,cash,assets,equity,difference};
}

function renderPnLReport(){
  const c=document.getElementById('rep-view-pnl'); if(!c)return; const d=getReportData();
  const cats={}; d.expenses.forEach(e=>cats[e.category||'Uncategorised']=(cats[e.category||'Uncategorised']||0)+num(e.amount));
  c.innerHTML=`${reportControls()}<div id="print-report-pnl">${reportActions('pnl')}<div class="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 text-xs">${reportHeader('Statement of Profit & Loss',reportPeriodLabel())}<div class="space-y-2">
  <div class="flex justify-between bg-slate-100 px-3 py-2 font-bold"><span>Income</span><span>Amount</span></div>
  <div class="flex justify-between px-3"><span>Course / Tuition Revenue</span><b>${money(d.feeRevenue)}</b></div>
  <div class="flex justify-between px-3"><span>Indirect / Other Income</span><b>${money(d.otherIncome)}</b></div>
  <div class="flex justify-between px-3 pt-2 border-t font-bold"><span>Total Income</span><b>${money(d.feeRevenue+d.otherIncome)}</b></div>
  <div class="flex justify-between bg-slate-100 px-3 py-2 mt-4 font-bold"><span>Expenses</span><span>Amount</span></div>
  ${Object.entries(cats).map(([k,v])=>`<div class="flex justify-between px-3"><span>${esc(k)}</span><b>${money(v)}</b></div>`).join('')}
  <div class="flex justify-between px-3 pt-2 border-t font-bold"><span>Total Expenses</span><b>${money(d.expensesTotal)}</b></div>
  <div class="flex justify-between mt-5 p-4 rounded-xl ${d.profit>=0?'bg-emerald-50':'bg-rose-50'} font-black text-sm"><span>Net Profit / (Loss)</span><span>${money(d.profit)}</span></div>
  <p class="text-[10px] text-slate-400 mt-3">Capital introduced is automatically treated as equity and excluded from profit.</p>
</div></div></div>`;
}

function renderBalanceSheet(){
  const c=document.getElementById('rep-view-balance'); if(!c)return; const d=getReportData(new Date());
  c.innerHTML=`${reportControls()}<div id="print-report-balance">${reportActions('balance')}<div class="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 text-xs">${reportHeader('Balance Sheet',`Automatically calculated as of ${new Date().toLocaleDateString('en-IN')}`)}
    <div class="grid md:grid-cols-2 gap-6">
      <div><div class="bg-slate-100 px-3 py-2 font-bold mb-2">ASSETS</div><div class="flex justify-between px-3 py-1"><span>Cash / Bank</span><b>${money(d.cash)}</b></div><div class="flex justify-between px-3 py-1"><span>Student Fee Receivables</span><b>${money(d.receivables)}</b></div><div class="flex justify-between border-t mt-2 pt-2 px-3 font-black"><span>Total Assets</span><b>${money(d.assets)}</b></div></div>
      <div><div class="bg-slate-100 px-3 py-2 font-bold mb-2">EQUITY & LIABILITIES</div><div class="flex justify-between px-3 py-1"><span>Capital Introduced</span><b>${money(d.capital)}</b></div><div class="flex justify-between px-3 py-1"><span>Retained / Current Profit</span><b>${money(d.profit)}</b></div><div class="flex justify-between border-t mt-2 pt-2 px-3 font-black"><span>Total Equity & Liabilities</span><b>${money(d.equity)}</b></div></div>
    </div>
    <div class="mt-6 p-4 rounded-xl ${Math.abs(d.difference)<0.01?'bg-emerald-50':'bg-amber-50'}"><div class="flex justify-between font-bold"><span>Balance Check</span><span>${Math.abs(d.difference)<0.01?'BALANCED':'DIFFERENCE '+money(d.difference)}</span></div><p class="text-[10px] text-slate-500 mt-1">The statement is generated automatically from invoices, receipts, income, capital and expenses stored in Canford Books.</p></div>
  </div></div>`;
}

function renderTrialBalance(){
  const c=document.getElementById('rep-view-trial'); if(!c)return; const d=getReportData();
  const rows=[['Cash / Bank',d.cash,0],['Student Fee Receivables',d.receivables,0],['Expenses',d.expensesTotal,0],['Capital Introduced',0,d.capital],['Course Fee Revenue',0,d.feeRevenue],['Indirect / Other Income',0,d.otherIncome]];
  const td=rows.reduce((s,r)=>s+r[1],0), tc=rows.reduce((s,r)=>s+r[2],0);
  c.innerHTML=`${reportControls()}<div id="print-report-trial">${reportActions('trial')}<div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">${reportHeader('Trial Balance',reportPeriodLabel())}<table class="w-full text-xs"><thead><tr class="bg-slate-50 border-y"><th class="text-left p-3">Account</th><th class="text-right p-3">Debit</th><th class="text-right p-3">Credit</th></tr></thead><tbody>${rows.map(r=>`<tr class="border-b"><td class="p-3">${esc(r[0])}</td><td class="p-3 text-right font-mono">${r[1]?money(r[1]):'-'}</td><td class="p-3 text-right font-mono">${r[2]?money(r[2]):'-'}</td></tr>`).join('')}</tbody><tfoot><tr class="font-black bg-slate-100"><td class="p-3">TOTAL</td><td class="p-3 text-right">${money(td)}</td><td class="p-3 text-right">${money(tc)}</td></tr></tfoot></table><p class="p-4 text-[10px] text-slate-500">Automatically derived from the transaction engine. Debit and credit totals agree because each stored transaction is represented as a double-entry event.</p></div></div>`;
}

function renderCashFlow(){
  const c=document.getElementById('rep-view-cashflow'); if(!c)return; const d=getReportData();
  const operating=d.feeCollected+d.otherIncome-d.expensesTotal, financing=d.capital, net=operating+financing;
  c.innerHTML=`${reportControls()}<div id="print-report-cashflow">${reportActions('cashflow')}<div class="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 text-xs">${reportHeader('Cash Flow Statement',reportPeriodLabel())}
    <div class="space-y-2"><div class="flex justify-between bg-slate-100 p-3 font-bold"><span>Operating Activities</span><span>Amount</span></div><div class="flex justify-between px-3"><span>Student Fee Collections</span><b>${money(d.feeCollected)}</b></div><div class="flex justify-between px-3"><span>Other Income Received</span><b>${money(d.otherIncome)}</b></div><div class="flex justify-between px-3"><span>Operating Expenses Paid</span><b>(${money(d.expensesTotal)})</b></div><div class="flex justify-between border-t px-3 pt-2 font-bold"><span>Net Cash from Operations</span><b>${money(operating)}</b></div><div class="flex justify-between bg-slate-100 p-3 mt-4 font-bold"><span>Financing Activities</span><b>${money(financing)}</b></div><div class="flex justify-between px-3"><span>Capital Introduced</span><b>${money(financing)}</b></div><div class="flex justify-between mt-5 p-4 bg-slate-900 text-white rounded-xl font-black"><span>Net Change in Cash / Bank</span><span>${money(net)}</span></div></div>
  </div></div>`;
}

function renderGeneralLedger(){
  const c=document.getElementById('rep-view-ledger'); if(!c)return; const d=getReportData();
  const rows=[];
  d.invoices.forEach(x=>rows.push({date:x.date,ref:x.invoiceNumber||x.id,account:'Accounts Receivable',particulars:`Invoice - ${x.studentName||'Student fee'}`,debit:num(x.total),credit:0,contra:'Course Fee Revenue'}));
  d.invoices.forEach(x=>rows.push({date:x.date,ref:x.invoiceNumber||x.id,account:'Course Fee Revenue',particulars:`Invoice - ${x.studentName||'Student fee'}`,debit:0,credit:num(x.total),contra:'Accounts Receivable'}));
  d.payments.forEach(x=>rows.push({date:x.date||x.paymentDate||'',ref:x.reference||x.paymentNumber||x.id,account:x.account||'Cash / Bank',particulars:`Fee received - ${x.studentName||'Student'}`,debit:num(x.amount),credit:0,contra:'Accounts Receivable'}));
  d.payments.forEach(x=>rows.push({date:x.date||x.paymentDate||'',ref:x.reference||x.paymentNumber||x.id,account:'Accounts Receivable',particulars:`Fee received - ${x.studentName||'Student'}`,debit:0,credit:num(x.amount),contra:x.account||'Cash / Bank'}));
  d.incomes.forEach(x=>{const acc=x.type==='capital'?'Capital Introduced':'Indirect / Other Income';rows.push({date:x.date,ref:x.reference||x.id,account:'Cash / Bank',particulars:x.particulars,debit:num(x.amount),credit:0,contra:acc});rows.push({date:x.date,ref:x.reference||x.id,account:acc,particulars:x.particulars,debit:0,credit:num(x.amount),contra:'Cash / Bank'});});
  d.expenses.forEach(x=>{const acc=x.category||'Expense';rows.push({date:x.date||x.expenseDate||'',ref:x.reference||x.id,account:acc,particulars:x.particulars||'Expense',debit:num(x.amount),credit:0,contra:x.paidThrough||'Cash / Bank'});rows.push({date:x.date||x.expenseDate||'',ref:x.reference||x.id,account:x.paidThrough||'Cash / Bank',particulars:x.particulars||'Expense',debit:0,credit:num(x.amount),contra:acc});});
  rows.sort((a,b)=>new Date(a.date)-new Date(b.date));
  c.innerHTML=`${reportControls()}<div id="print-report-ledger">${reportActions('ledger')}<div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">${reportHeader('General Ledger','Automatic double-entry transaction register')}<div class="overflow-x-auto"><table class="w-full text-xs"><thead><tr class="bg-slate-50 border-y"><th class="p-3 text-left">Date</th><th class="p-3 text-left">Reference</th><th class="p-3 text-left">Account</th><th class="p-3 text-left">Particulars</th><th class="p-3 text-right">Debit</th><th class="p-3 text-right">Credit</th></tr></thead><tbody>${rows.map(r=>`<tr class="border-b"><td class="p-3">${esc(r.date)}</td><td class="p-3 font-mono">${esc(r.ref)}</td><td class="p-3 font-semibold">${esc(r.account)}</td><td class="p-3">${esc(r.particulars)}</td><td class="p-3 text-right">${r.debit?money(r.debit):'-'}</td><td class="p-3 text-right">${r.credit?money(r.credit):'-'}</td></tr>`).join('') || '<tr><td colspan="6" class="p-8 text-center text-slate-400">No transactions recorded yet.</td></tr>'}</tbody></table></div></div></div>`;
}

function renderAgingReport(){
  const c=document.getElementById('rep-view-aging'); if(!c)return; const invoices=BooksStore.getInvoices().filter(i=>num(i.balanceDue)>0), today=new Date();
  c.innerHTML=`${reportControls()}<div id="print-report-aging">${reportActions('aging')}<div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-xs">${reportHeader('Accounts Receivable Aging Summary','Automatically calculated from outstanding invoices')}<div class="overflow-x-auto"><table class="w-full text-left"><thead><tr class="bg-slate-50 border-y text-[10px] font-bold"><th class="p-3">Student</th><th class="p-3">Invoice</th><th class="p-3 text-right">Current</th><th class="p-3 text-right">1-30</th><th class="p-3 text-right">31-60</th><th class="p-3 text-right">60+</th><th class="p-3 text-right">Total</th></tr></thead><tbody>${invoices.map(inv=>{const diff=Math.floor((today-new Date(inv.dueDate))/(86400000));let b=[0,0,0,0]; const a=num(inv.balanceDue); if(diff<=0)b[0]=a;else if(diff<=30)b[1]=a;else if(diff<=60)b[2]=a;else b[3]=a; return `<tr class="border-b"><td class="p-3 font-bold">${esc(inv.studentName)}</td><td class="p-3">${esc(inv.invoiceNumber)}</td>${b.map(v=>`<td class="p-3 text-right">${v?money(v):'-'}</td>`).join('')}<td class="p-3 text-right font-black">${money(a)}</td></tr>`}).join('')||'<tr><td colspan="7" class="p-8 text-center text-slate-400">No outstanding balances.</td></tr>'}</tbody></table></div></div></div>`;
}
function renderDefaultersReport(){
  const c=document.getElementById('rep-view-defaulters'); if(!c)return; const today=new Date(), rows=BooksStore.getInvoices().filter(i=>num(i.balanceDue)>0 && new Date(i.dueDate)<today);
  c.innerHTML=`${reportControls()}<div id="print-report-defaulters">${reportActions('defaulters')}<div class="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 text-xs">${reportHeader('Overdue Fee Defaulters List','Automatically calculated from overdue invoices')}<div class="space-y-3">${rows.map(inv=>`<div class="flex justify-between p-3 bg-rose-50 border border-rose-200 rounded-xl"><div><b>${esc(inv.studentName)}</b><p class="text-slate-500">${esc(inv.invoiceNumber)} • Due ${esc(inv.dueDate)}</p></div><b class="text-rose-800">${money(inv.balanceDue)}</b></div>`).join('')||'<p class="text-center text-slate-400 p-6">No overdue accounts.</p>'}</div></div></div>`;
}

function printFinancialReport(name){
  const el=document.getElementById(`print-report-${name}`); if(!el)return;
  const win=window.open('','_blank','width=1000,height=800'); if(!win){alert('Please allow pop-ups to print the report.');return;}
  win.document.write(`<html><head><title>Canford Books - ${name}</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#111}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px}button,select{display:none}.hidden{display:block!important}.text-right{text-align:right}.font-bold,.font-black{font-weight:700}.border-b{border-bottom:1px solid #ddd}.bg-slate-100{background:#f1f5f9;padding:8px}.text-center{text-align:center}@media print{body{padding:8px}}</style></head><body>${el.innerHTML}</body></html>`); win.document.close(); win.focus(); setTimeout(()=>win.print(),300);
}

// Re-render reports automatically whenever BooksStore.save() fires a change event.
window.addEventListener('canford-books-data-changed', () => {
  const reportsView = document.getElementById('books-view-reports');
  if (reportsView && !reportsView.classList.contains('hidden')) refreshFinancialReports();
});
