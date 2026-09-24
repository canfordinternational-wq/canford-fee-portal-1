// ============================================================================
// CANFORD BOOKS - FINANCIAL REPORTS MODULE (PROFIT & LOSS, AGING, DEFAULTERS)
// ============================================================================

let currentReportTab = "pnl";

function initReportsModule() {
  switchReportTab('pnl');
}

function switchReportTab(tab) {
  currentReportTab = tab;
  const tabs = ['pnl', 'aging', 'defaulters'];
  tabs.forEach(t => {
    const btn = document.getElementById(`rep-tab-${t}`);
    const view = document.getElementById(`rep-view-${t}`);
    if (t === tab) {
      btn.className = "px-4 py-2 border-b-2 border-[#005696] font-bold text-xs text-[#005696]";
      view.classList.remove("hidden");
    } else {
      btn.className = "px-4 py-2 text-slate-500 hover:text-slate-800 font-semibold text-xs";
      view.classList.add("hidden");
    }
  });

  if (tab === 'pnl') renderPnLReport();
  else if (tab === 'aging') renderAgingReport();
  else if (tab === 'defaulters') renderDefaultersReport();
}

// 1. Profit & Loss Statement
function renderPnLReport() {
  const container = document.getElementById("rep-view-pnl");
  if (!container) return;

  const payments = BooksStore.getPayments();
  const expenses = BooksStore.getExpenses();

  const totalRevenue = payments.reduce((s, p) => s + Number(p.amount), 0);
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const netProfit = totalRevenue - totalExpenses;

  // Group expenses by category
  const catMap = {};
  expenses.forEach(e => {
    catMap[e.category] = (catMap[e.category] || 0) + Number(e.amount);
  });

  container.innerHTML = `
    <div class="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 text-xs">
      <div class="text-center border-b border-slate-200 pb-4 mb-6">
        <h3 class="text-lg font-black text-slate-900 font-display">Statement of Profit & Loss</h3>
        <p class="text-xs text-slate-500">Canford International • Academic Year 2025-2026</p>
      </div>

      <!-- Operating Income -->
      <div class="mb-6">
        <div class="flex justify-between items-center bg-slate-100 px-3 py-2 rounded-lg font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
          <span>Operating Income (Course Collections)</span>
          <span>Amount (₹)</span>
        </div>
        <div class="space-y-1.5 px-3">
          <div class="flex justify-between text-slate-700">
            <span>Tuition & Course Fee Collections Received</span>
            <span class="font-mono font-semibold">₹${totalRevenue.toLocaleString('en-IN')}</span>
          </div>
          <div class="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
            <span>Total Operating Income (A)</span>
            <span class="text-emerald-700 font-mono text-sm">₹${totalRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <!-- Operating Expenses -->
      <div class="mb-6">
        <div class="flex justify-between items-center bg-slate-100 px-3 py-2 rounded-lg font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
          <span>Operating Expenses & Overheads</span>
          <span>Amount (₹)</span>
        </div>
        <div class="space-y-1.5 px-3">
          ${Object.entries(catMap).map(([cat, amt]) => `
            <div class="flex justify-between text-slate-700">
              <span>${cat}</span>
              <span class="font-mono">₹${amt.toLocaleString('en-IN')}</span>
            </div>
          `).join('')}
          <div class="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
            <span>Total Operating Expenses (B)</span>
            <span class="text-rose-700 font-mono text-sm">₹${totalExpenses.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <!-- Net Surplus / Profit -->
      <div class="p-4 rounded-xl border ${netProfit >= 0 ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'} flex justify-between items-center text-sm font-black">
        <div>
          <span class="uppercase tracking-wider text-xs ${netProfit >= 0 ? 'text-emerald-900' : 'text-rose-900'}">Net Operating Surplus (A - B)</span>
          <p class="text-[11px] font-normal text-slate-500 mt-0.5">Operating Margin after direct outlays</p>
        </div>
        <span class="text-xl font-mono ${netProfit >= 0 ? 'text-emerald-800' : 'text-rose-800'}">
          ₹${netProfit.toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  `;
}

// 2. Receivables Aging Summary (1-30, 31-60, 60+ days)
function renderAgingReport() {
  const container = document.getElementById("rep-view-aging");
  if (!container) return;

  const invoices = BooksStore.getInvoices().filter(i => i.balanceDue > 0);
  const today = new Date();

  container.innerHTML = `
    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-xs">
      <div class="p-4 border-b border-slate-100">
        <h3 class="font-bold text-slate-900">Accounts Receivable Aging Summary</h3>
        <p class="text-[11px] text-slate-500">Breakdown of outstanding candidate balances by age</p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
              <th class="py-3 px-4">Candidate / Student</th>
              <th class="py-3 px-4">Invoice #</th>
              <th class="py-3 px-4 text-right">Current (Not Due)</th>
              <th class="py-3 px-4 text-right">1 - 30 Days</th>
              <th class="py-3 px-4 text-right">31 - 60 Days</th>
              <th class="py-3 px-4 text-right">> 60 Days</th>
              <th class="py-3 px-4 text-right">Total Outstanding</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${invoices.map(inv => {
              const due = new Date(inv.dueDate);
              const diffDays = Math.floor((today - due) / (1000 * 60 * 60 * 24));

              let cur = 0, d1_30 = 0, d31_60 = 0, d60plus = 0;
              if (diffDays <= 0) cur = inv.balanceDue;
              else if (diffDays <= 30) d1_30 = inv.balanceDue;
              else if (diffDays <= 60) d31_60 = inv.balanceDue;
              else d60plus = inv.balanceDue;

              return `
                <tr class="hover:bg-slate-50">
                  <td class="py-3 px-4 font-bold text-slate-900">${inv.studentName}</td>
                  <td class="py-3 px-4 font-mono text-[#005696]">${inv.invoiceNumber}</td>
                  <td class="py-3 px-4 text-right font-mono text-slate-600">${cur > 0 ? '₹' + cur.toLocaleString('en-IN') : '-'}</td>
                  <td class="py-3 px-4 text-right font-mono text-amber-700">${d1_30 > 0 ? '₹' + d1_30.toLocaleString('en-IN') : '-'}</td>
                  <td class="py-3 px-4 text-right font-mono text-orange-700">${d31_60 > 0 ? '₹' + d31_60.toLocaleString('en-IN') : '-'}</td>
                  <td class="py-3 px-4 text-right font-mono text-rose-700 font-bold">${d60plus > 0 ? '₹' + d60plus.toLocaleString('en-IN') : '-'}</td>
                  <td class="py-3 px-4 text-right font-mono font-black text-slate-900">₹${Number(inv.balanceDue).toLocaleString('en-IN')}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 3. Defaulters Report
function renderDefaultersReport() {
  const container = document.getElementById("rep-view-defaulters");
  if (!container) return;

  const today = new Date();
  const overdueInvoices = BooksStore.getInvoices().filter(i => i.balanceDue > 0 && new Date(i.dueDate) < today);

  container.innerHTML = `
    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 text-xs">
      <div class="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
        <div>
          <h3 class="font-bold text-slate-900">Overdue Fee Defaulters List</h3>
          <p class="text-[11px] text-slate-500">Students with unpaid installments past due date</p>
        </div>
        <span class="px-3 py-1 bg-rose-100 text-rose-800 rounded-full font-bold text-xs">
          ${overdueInvoices.length} Accounts Overdue
        </span>
      </div>

      <div class="space-y-3">
        ${overdueInvoices.map(inv => `
          <div class="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-rose-50/50 border border-rose-200 rounded-xl gap-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-900 text-sm">${inv.studentName}</span>
                <span class="font-mono text-[10px] text-slate-500">(${inv.studentId})</span>
              </div>
              <p class="text-slate-600 text-[11px] mt-0.5">Invoice: <strong>${inv.invoiceNumber}</strong> • Due since: <span class="text-rose-700 font-bold">${inv.dueDate}</span></p>
            </div>
            <div class="flex items-center gap-4 justify-between sm:justify-end">
              <div class="text-right">
                <span class="text-[10px] text-slate-400 uppercase">Overdue Amount:</span>
                <div class="text-base font-black text-rose-800 font-mono">₹${Number(inv.balanceDue).toLocaleString('en-IN')}</div>
              </div>
              <button onclick="sendInvoiceWhatsApp('${inv.id}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow">
                <i class="fab fa-whatsapp"></i> Alert
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
