// ============================================================================
// CANFORD BOOKS - FINANCIAL REPORTS
// Client-side reports based on the transactions stored in BooksStore.
// These are management reports; opening balances and tax adjustments can be
// added later through an opening-balance/chart-of-accounts module.
// ============================================================================

let currentReportTab = "pnl";
const REPORT_TABS = ['pnl','balance','trial','cashflow','ledger','aging','defaulters'];
const money = n => `₹${(Number(n)||0).toLocaleString('en-IN',{maximumFractionDigits:2})}`;
const num = n => Number(n)||0;
const esc = v => String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

function reportDateRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(),0,1);
  const end = new Date(now.getFullYear(),11,31,23,59,59);
  return {start,end};
}
function inRange(date, start, end) {
  if (!date) return true;
  const d = new Date(date);
  return !isNaN(d) && d >= start && d <= end;
}
function reportHeader(title, subtitle='') {
  return `<div class="text-center border-b border-slate-200 pb-4 mb-5"><h3 class="text-lg font-black text-slate-900 font-display">${title}</h3><p class="text-xs text-slate-500">Canford International • ${subtitle || 'Financial Report'}</p></div>`;
}
function reportActions(name) {
  return `<div class="flex justify-end mb-3"><button onclick="printFinancialReport('${name}')" class="px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold"><i class="fas fa-print mr-1"></i> Print Report</button></div>`;
}
function initReportsModule() { switchReportTab(currentReportTab || 'pnl'); }
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

function getReportData(){
  const invoices=BooksStore.getInvoices(), payments=BooksStore.getPayments(), expenses=BooksStore.getExpenses(), incomes=BooksStore.getIncomes();
  const feeRevenue=invoices.reduce((s,i)=>s+num(i.total),0);
  const feeCollected=payments.reduce((s,p)=>s+num(p.amount),0);
  const receivables=invoices.reduce((s,i)=>s+num(i.balanceDue),0);
  const otherIncome=incomes.filter(x=>x.type!=='capital').reduce((s,x)=>s+num(x.amount),0);
  const capital=incomes.filter(x=>x.type==='capital').reduce((s,x)=>s+num(x.amount),0);
  const expensesTotal=expenses.reduce((s,x)=>s+num(x.amount),0);
  const profit=feeRevenue+otherIncome-expensesTotal;
  const cash=feeCollected+otherIncome+capital-expensesTotal;
  return {invoices,payments,expenses,incomes,feeRevenue,feeCollected,receivables,otherIncome,capital,expensesTotal,profit,cash};
}

function renderPnLReport(){
  const c=document.getElementById('rep-view-pnl'); if(!c)return; const d=getReportData();
  const cats={}; d.expenses.forEach(e=>cats[e.category||'Uncategorised']=(cats[e.category||'Uncategorised']||0)+num(e.amount));
  c.innerHTML=`<div id="print-report-pnl">${reportActions('pnl')}<div class="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 text-xs">${reportHeader('Statement of Profit & Loss','Current stored transactions')}<div class="space-y-2">\n  <div class="flex justify-between bg-slate-100 px-3 py-2 font-bold"><span>Income</span><span>Amount</span></div>\n  <div class="flex justify-between px-3"><span>Course / Tuition Revenue</span><b>${money(d.feeRevenue)}</b></div>\n  <div class="flex justify-between px-3"><span>Indirect / Other Income</span><b>${money(d.otherIncome)}</b></div>\n  <div class="flex justify-between px-3 pt-2 border-t font-bold"><span>Total Income</span><b>${money(d.feeRevenue+d.otherIncome)}</b></div>\n  <div class="flex justify-between bg-slate-100 px-3 py-2 mt-4 font-bold"><span>Expenses</span><span>Amount</span></div>\n  ${Object.entries(cats).map(([k,v])=>`<div class="flex justify-between px-3"><span>${esc(k)}</span><b>${money(v)}</b></div>`).join('')}\n  <div class="flex justify-between px-3 pt-2 border-t font-bold"><span>Total Expenses</span><b>${money(d.expensesTotal)}</b></div>\n  <div class="flex justify-between mt-5 p-4 rounded-xl ${d.profit>=0?'bg-emerald-50':'bg-rose-50'} font-black text-sm"><span>Net Profit / (Loss)</span><span>${money(d.profit)}</span></div>\n  <p class="text-[10px] text-slate-400 mt-3">Capital introduced is equity/funding and is not included in profit.</p>\n</div></div></div>`;
}

function renderBalanceSheet(){
  const c=document.getElementById('rep-view-balance'); if(!c)return; const d=getReportData();
  const equity=d.capital+d.profit, assets=d.cash+d.receivables, difference=assets-equity;
  c.innerHTML=`<div id="print-report-balance">${reportActions('balance')}<div class="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 text-xs">${reportHeader('Balance Sheet','Position based on stored transactions')}\n    <div class="grid md:grid-cols-2 gap-6">\n      <div><div class="bg-slate-100 px-3 py-2 font-bold mb-2">ASSETS</div><div class="flex justify-between px-3 py-1"><span>Cash / Bank (calculated)</span><b>${money(d.cash)}</b></div><div class="flex justify-between px-3 py-1"><span>Student Fee Receivables</span><b>${money(d.receivables)}</b></div><div class="flex justify-between border-t mt-2 pt-2 px-3 font-black"><span>Total Assets</span><b>${money(assets)}</b></div></div>\n      <div><div class="bg-slate-100 px-3 py-2 font-bold mb-2">EQUITY & LIABILITIES</div><div class="flex justify-between px-3 py-1"><span>Capital Introduced</span><b>${money(d.capital)}</b></div><div class="flex justify-between px-3 py-1"><span>Current Profit / (Loss)</span><b>${money(d.profit)}</b></div><div class="flex justify-between px-3 py-1"><span>Other Liabilities</span><b>${money(0)}</b></div><div class="flex justify-between border-t mt-2 pt-2 px-3 font-black"><span>Total Equity & Liabilities</span><b>${money(equity)}</b></div></div>\n    </div>\n    <div class="mt-6 p-4 rounded-xl ${Math.abs(difference)<0.01?'bg-emerald-50':'bg-amber-50'}"><div class="flex justify-between font-bold"><span>Balance Check Difference</span><span>${money(difference)}</span></div><p class="text-[10px] text-slate-500 mt-1">A non-zero difference usually means opening balances, liabilities, assets, drawings, or other ledger accounts have not yet been entered.</p></div>\n  </div></div>`;
}

function renderTrialBalance(){
  const c=document.getElementById('rep-view-trial'); if(!c)return; const d=getReportData();
  const rows=[['Cash / Bank',d.cash,0],['Student Fee Receivables',d.receivables,0],['Expenses',d.expensesTotal,0],['Capital Introduced',0,d.capital],['Course Fee Revenue',0,d.feeRevenue],['Indirect / Other Income',0,d.otherIncome]];
  const td=rows.reduce((s,r)=>s+r[1],0), tc=rows.reduce((s,r)=>s+r[2],0);
  c.innerHTML=`<div id="print-report-trial">${reportActions('trial')}<div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">${reportHeader('Trial Balance','Calculated from current stored transactions')}<table class="w-full text-xs"><thead><tr class="bg-slate-50 border-y"><th class="text-left p-3">Account</th><th class="text-right p-3">Debit</th><th class="text-right p-3">Credit</th></tr></thead><tbody>${rows.map(r=>`<tr class="border-b"><td class="p-3">${esc(r[0])}</td><td class="p-3 text-right font-mono">${r[1]?money(r[1]):'-'}</td><td class="p-3 text-right font-mono">${r[2]?money(r[2]):'-'}</td></tr>`).join('')}</tbody><tfoot><tr class="font-black bg-slate-100"><td class="p-3">TOTAL</td><td class="p-3 text-right">${money(td)}</td><td class="p-3 text-right">${money(tc)}</td></tr></tfoot></table><p class="p-4 text-[10px] text-slate-500">This management trial balance is derived from the portal's transaction model. Full double-entry accounting requires opening balances and all ledger accounts.</p></div></div>`;
}

function renderCashFlow(){
  const c=document.getElementById('rep-view-cashflow'); if(!c)return; const d=getReportData();
  const operating=d.feeCollected+d.otherIncome-d.expensesTotal, financing=d.capital, net=operating+financing;
  c.innerHTML=`<div id="print-report-cashflow">${reportActions('cashflow')}<div class="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 text-xs">${reportHeader('Cash Flow Statement','Movement from recorded receipts, income, expenses and capital')}\n    <div class="space-y-2"><div class="flex justify-between bg-slate-100 p-3 font-bold"><span>Operating Activities</span><span>Amount</span></div><div class="flex justify-between px-3"><span>Student Fee Collections</span><b>${money(d.feeCollected)}</b></div><div class="flex justify-between px-3"><span>Other Income Received</span><b>${money(d.otherIncome)}</b></div><div class="flex justify-between px-3"><span>Operating Expenses Paid</span><b>(${money(d.expensesTotal)})</b></div><div class="flex justify-between border-t px-3 pt-2 font-bold"><span>Net Cash from Operations</span><b>${money(operating)}</b></div><div class="flex justify-between bg-slate-100 p-3 mt-4 font-bold"><span>Financing Activities</span><b>${money(financing)}</b></div><div class="flex justify-between px-3"><span>Capital Introduced</span><b>${money(financing)}</b></div><div class="flex justify-between mt-5 p-4 bg-slate-900 text-white rounded-xl font-black"><span>Net Change in Cash / Bank</span><span>${money(net)}</span></div></div>\n  </div></div>`;
}

function renderGeneralLedger(){
  const c=document.getElementById('rep-view-ledger'); if(!c)return; const d=getReportData();
  const rows=[];
  d.payments.forEach(x=>rows.push({date:x.date||x.paymentDate||'',ref:x.reference||x.receiptNumber||x.id,account:'Student Fee Collection',particulars:x.studentName||'Student fee',debit:num(x.amount),credit:0}));
  d.incomes.forEach(x=>rows.push({date:x.date,ref:x.reference||x.id,account:x.type==='capital'?'Capital Introduced':'Indirect / Other Income',particulars:x.particulars,debit:num(x.amount),credit:0}));
  d.expenses.forEach(x=>rows.push({date:x.date||x.expenseDate||'',ref:x.reference||x.id,account:x.category||'Expense',particulars:x.particulars||'Expense',debit:0,credit:num(x.amount)}));
  rows.sort((a,b)=>new Date(a.date)-new Date(b.date));
  c.innerHTML=`<div id="print-report-ledger">${reportActions('ledger')}<div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">${reportHeader('General Ledger','Transaction register')}<div class="overflow-x-auto"><table class="w-full text-xs"><thead><tr class="bg-slate-50 border-y"><th class="p-3 text-left">Date</th><th class="p-3 text-left">Reference</th><th class="p-3 text-left">Account</th><th class="p-3 text-left">Particulars</th><th class="p-3 text-right">Debit</th><th class="p-3 text-right">Credit</th></tr></thead><tbody>${rows.map(r=>`<tr class="border-b"><td class="p-3">${esc(r.date)}</td><td class="p-3 font-mono">${esc(r.ref)}</td><td class="p-3 font-semibold">${esc(r.account)}</td><td class="p-3">${esc(r.particulars)}</td><td class="p-3 text-right">${r.debit?money(r.debit):'-'}</td><td class="p-3 text-right">${r.credit?money(r.credit):'-'}</td></tr>`).join('') || '<tr><td colspan="6" class="p-8 text-center text-slate-400">No ledger transactions recorded yet.</td></tr>'}</tbody></table></div></div></div>`;
}

function renderAgingReport(){
  const c=document.getElementById('rep-view-aging'); if(!c)return; const invoices=BooksStore.getInvoices().filter(i=>num(i.balanceDue)>0), today=new Date();
  c.innerHTML=`<div id="print-report-aging">${reportActions('aging')}<div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-xs">${reportHeader('Accounts Receivable Aging Summary','Outstanding student balances')}<div class="overflow-x-auto"><table class="w-full text-left"><thead><tr class="bg-slate-50 border-y text-[10px] font-bold"><th class="p-3">Student</th><th class="p-3">Invoice</th><th class="p-3 text-right">Current</th><th class="p-3 text-right">1-30</th><th class="p-3 text-right">31-60</th><th class="p-3 text-right">60+</th><th class="p-3 text-right">Total</th></tr></thead><tbody>${invoices.map(inv=>{const diff=Math.floor((today-new Date(inv.dueDate))/(86400000));let b=[0,0,0,0]; const a=num(inv.balanceDue); if(diff<=0)b[0]=a;else if(diff<=30)b[1]=a;else if(diff<=60)b[2]=a;else b[3]=a; return `<tr class="border-b"><td class="p-3 font-bold">${esc(inv.studentName)}</td><td class="p-3">${esc(inv.invoiceNumber)}</td>${b.map(v=>`<td class="p-3 text-right">${v?money(v):'-'}</td>`).join('')}<td class="p-3 text-right font-black">${money(a)}</td></tr>`}).join('')||'<tr><td colspan="7" class="p-8 text-center text-slate-400">No outstanding balances.</td></tr>'}</tbody></table></div></div></div>`;
}
function renderDefaultersReport(){
  const c=document.getElementById('rep-view-defaulters'); if(!c)return; const today=new Date(), rows=BooksStore.getInvoices().filter(i=>num(i.balanceDue)>0 && new Date(i.dueDate)<today);
  c.innerHTML=`<div id="print-report-defaulters">${reportActions('defaulters')}<div class="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 text-xs">${reportHeader('Overdue Fee Defaulters List','Invoices past due date')}<div class="space-y-3">${rows.map(inv=>`<div class="flex justify-between p-3 bg-rose-50 border border-rose-200 rounded-xl"><div><b>${esc(inv.studentName)}</b><p class="text-slate-500">${esc(inv.invoiceNumber)} • Due ${esc(inv.dueDate)}</p></div><b class="text-rose-800">${money(inv.balanceDue)}</b></div>`).join('')||'<p class="text-center text-slate-400 p-6">No overdue accounts.</p>'}</div></div></div>`;
}

function printFinancialReport(name){
  const el=document.getElementById(`print-report-${name}`); if(!el)return;
  const win=window.open('','_blank','width=1000,height=800'); if(!win){alert('Please allow pop-ups to print the report.');return;}
  win.document.write(`<html><head><title>Canford Books - ${name}</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#111}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px}button{display:none}.hidden{display:block!important}.text-right{text-align:right}.font-bold,.font-black{font-weight:700}.border-b{border-bottom:1px solid #ddd}.bg-slate-100{background:#f1f5f9;padding:8px}.text-center{text-align:center}@media print{body{padding:8px}}</style></head><body>${el.innerHTML}</body></html>`); win.document.close(); win.focus(); setTimeout(()=>win.print(),300);
}
