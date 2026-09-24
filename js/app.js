// ============================================================================
// CANFORD BOOKS - MAIN CONTROLLER (ZOHO BOOKS DESKTOP WORKFLOW)
// ============================================================================

let currentActiveModule = "dashboard";

document.addEventListener("DOMContentLoaded", () => {
  initZohoApp();
});

// Global Escape Key Handler to exit any opened modal or drawer (Req 9)
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.keyCode === 27) {
    closeAllModals();
  }
});

function closeAllModals() {
  closeQuickCreateDropdown();

  const modalIds = [
    'new-invoice-modal',
    'edit-invoice-modal',
    'invoice-payment-modal',
    'add-expense-modal',
    'manual-collect-modal',
    'add-student-modal',
    'student-profile-modal',
    'checkout-modal',
    'receipt-modal',
    'add-course-modal',
    'edit-course-modal',
    'add-user-modal'
  ];

  modalIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('hidden');
      el.classList.remove('flex');
    }
  });

  const studentDrawer = document.getElementById('student-profile-drawer');
  if (studentDrawer) {
    studentDrawer.classList.add('translate-x-full');
  }
  const drawerOverlay = document.getElementById('drawer-overlay');
  if (drawerOverlay) {
    drawerOverlay.classList.add('hidden');
  }

  document.querySelectorAll('.glass-overlay:not(.hidden)').forEach(el => {
    el.classList.add('hidden');
    el.classList.remove('flex');
  });
}

function initZohoApp() {
  // Initialize Books Store
  BooksStore.init();

  // Initialize Invoices & Expenses & Masters & Settings
  initInvoicesModule();
  initExpensesModule();
  initPaymentsModule();
  initReportsModule();
  if (typeof initMasterModule === 'function') initMasterModule();
  if (typeof initSettingsModule === 'function') initSettingsModule();

  // Load Dashboard
  refreshZohoDashboard();

  // Render the student table after the data store has initialized.
  if (typeof refreshAdminTable === 'function') refreshAdminTable();

  // Initialize public student portal if loaded
  if (typeof initApp === 'function') {
    // legacy support
  }
}

// Switch Zoho Books Modules (Sidebar navigation)
function switchModule(moduleName) {
  currentActiveModule = moduleName;

  const modules = ['dashboard', 'students', 'invoices', 'payments', 'expenses', 'reports', 'master', 'settings', 'publicpay'];
  modules.forEach(m => {
    const view = document.getElementById(`books-view-${m}`);
    const navItem = document.getElementById(`side-nav-${m}`);

    if (view) {
      if (m === moduleName) {
        view.classList.remove("hidden");
        if (navItem) navItem.classList.add("sidebar-item-active");
      } else {
        view.classList.add("hidden");
        if (navItem) navItem.classList.remove("sidebar-item-active");
      }
    }
  });

  // Module specific refresh hooks
  if (moduleName === 'dashboard') refreshZohoDashboard();
  else if (moduleName === 'invoices') renderInvoicesList();
  else if (moduleName === 'expenses') renderExpensesList();
  else if (moduleName === 'payments') renderPaymentsList();
  else if (moduleName === 'reports') initReportsModule();
  else if (moduleName === 'master') {
    if (typeof initMasterModule === 'function') initMasterModule();
  }
  else if (moduleName === 'settings') {
    if (typeof initSettingsModule === 'function') initSettingsModule();
  }
  else if (moduleName === 'students') {
    if (typeof refreshAdminTable === 'function') refreshAdminTable();
  }
  else if (moduleName === 'publicpay') {
    const students = BooksStore.getStudents();
    if (students.length > 0 && typeof renderStudentPortal === 'function') {
      renderStudentPortal(students[0].id);
    }
  }

  // Close quick create dropdown if open
  closeQuickCreateDropdown();
}

// Refresh Zoho Dashboard Widgets
function refreshZohoDashboard() {
  const metrics = BooksStore.getMetrics();

  // Receivables Card
  const recTotalEl = document.getElementById("dash-total-receivables");
  if (recTotalEl) recTotalEl.textContent = `₹${metrics.totalReceivables.toLocaleString('en-IN')}`;

  const recCurrentEl = document.getElementById("dash-current-receivables");
  if (recCurrentEl) recCurrentEl.textContent = `₹${metrics.currentReceivables.toLocaleString('en-IN')}`;

  const recOverdueEl = document.getElementById("dash-overdue-receivables");
  if (recOverdueEl) recOverdueEl.textContent = `₹${metrics.totalOverdue.toLocaleString('en-IN')}`;

  // Cash Flow / Profit
  const incomeEl = document.getElementById("dash-total-income");
  if (incomeEl) incomeEl.textContent = `₹${metrics.totalCollected.toLocaleString('en-IN')}`;

  const expenseEl = document.getElementById("dash-total-expenses");
  if (expenseEl) expenseEl.textContent = `₹${metrics.totalExpenses.toLocaleString('en-IN')}`;

  const profitEl = document.getElementById("dash-net-profit");
  if (profitEl) {
    profitEl.textContent = `₹${metrics.netProfit.toLocaleString('en-IN')}`;
    profitEl.className = `text-2xl font-black font-mono ${metrics.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`;
  }

  // Student and invoice count
  const countEl = document.getElementById("dash-active-students");
  if (countEl) countEl.textContent = metrics.studentCount;

  // Recent Transactions Feed
  renderRecentActivityFeed();
}

function renderRecentActivityFeed() {
  const container = document.getElementById("dash-recent-activity");
  if (!container) return;

  const payments = BooksStore.getPayments().slice(0, 5);
  const expenses = BooksStore.getExpenses().slice(0, 5);

  const combined = [
    ...payments.map(p => ({ type: 'inflow', title: `Fee Received from ${p.studentName}`, sub: `${p.mode} • ${p.reference}`, amt: p.amount, date: p.date })),
    ...expenses.map(e => ({ type: 'outflow', title: e.particulars, sub: `${e.category} • ${e.vendor}`, amt: e.amount, date: e.date }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  container.innerHTML = combined.map(c => `
    <div class="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition text-xs">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center font-bold ${c.type === 'inflow' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}">
          <i class="fas ${c.type === 'inflow' ? 'fa-arrow-down' : 'fa-arrow-up'} text-xs"></i>
        </div>
        <div>
          <span class="font-bold text-slate-800">${c.title}</span>
          <div class="text-[10px] text-slate-400 font-mono">${c.sub} • ${c.date}</div>
        </div>
      </div>
      <div class="text-right font-black font-mono ${c.type === 'inflow' ? 'text-emerald-700' : 'text-rose-700'}">
        ${c.type === 'inflow' ? '+' : '-'}₹${Number(c.amt).toLocaleString('en-IN')}
      </div>
    </div>
  `).join('');
}

// Payments Module
function initPaymentsModule() {
  renderPaymentsList();
}

function renderPaymentsList() {
  const container = document.getElementById("books-payments-tbody");
  if (!container) return;

  const payments = BooksStore.getPayments();
  if (payments.length === 0) {
    container.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-slate-400 text-xs">No payments recorded.</td></tr>`;
    return;
  }

  container.innerHTML = payments.map(p => `
    <tr class="hover:bg-slate-50 border-b border-slate-100 text-xs">
      <td class="py-3 px-4 font-mono font-bold text-[#005696]">${p.paymentNumber}</td>
      <td class="py-3 px-4 font-mono text-slate-500">${p.date}</td>
      <td class="py-3 px-4">
        <div class="font-bold text-slate-900">${p.studentName}</div>
        <div class="text-[10px] text-slate-400 font-mono">${p.studentId}</div>
      </td>
      <td class="py-3 px-4 font-mono text-slate-600">${p.invoiceId || '-'}</td>
      <td class="py-3 px-4">
        <span class="font-semibold text-slate-700">${p.mode}</span>
        <div class="text-[10px] text-slate-400 font-mono">${p.reference}</div>
      </td>
      <td class="py-3 px-4 text-right font-black text-emerald-700 font-mono text-sm">
        ₹${Number(p.amount).toLocaleString('en-IN')}
      </td>
      <td class="py-3 px-4 text-right space-x-1">
        <button onclick="viewPaymentVoucher('${p.id}')" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold transition">
          <i class="fas fa-print mr-1"></i> Voucher
        </button>
        <button onclick="handleDeletePayment('${p.id}', '${p.paymentNumber}')" class="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded text-xs transition" title="Delete Payment">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function handleDeletePayment(payId, payNumber) {
  if (confirm(`Are you sure you want to delete payment voucher "${payNumber}"?\n\nThis will restore the outstanding balance on the associated invoice and student account.`)) {
    BooksStore.deletePayment(payId);
    renderPaymentsList();
    if (typeof refreshZohoDashboard === 'function') refreshZohoDashboard();
    if (typeof renderInvoicesList === 'function') renderInvoicesList();
    if (typeof refreshAdminTable === 'function') refreshAdminTable();
    showToast(`Payment ${payNumber} deleted and balance restored`, "info");
  }
}

function viewPaymentVoucher(payId) {
  const pay = BooksStore.getPayments().find(p => p.id === payId);
  if (!pay) return;

  const student = BooksStore.getStudents().find(s => s.id === pay.studentId) || {
    id: pay.studentId,
    name: pay.studentName,
    courseName: "CMA USA / IFRS",
    phone: "9895577123",
    paidFee: pay.amount,
    totalFee: pay.amount,
    balanceFee: 0,
    admissionDate: pay.date
  };

  openReceiptModal(student, {
    receiptNo: pay.receiptNo || pay.paymentNumber,
    date: pay.date,
    amount: pay.amount,
    particulars: `Tuition Fee Clearance (${pay.paymentNumber})`,
    mode: pay.mode,
    txnId: pay.reference,
    notes: pay.notes
  });
}

// Quick Create Dropdown toggle
function toggleQuickCreateDropdown() {
  const dd = document.getElementById("quick-create-dropdown");
  if (dd) dd.classList.toggle("hidden");
}

function closeQuickCreateDropdown() {
  const dd = document.getElementById("quick-create-dropdown");
  if (dd) dd.classList.add("hidden");
}

// Add New Invoice Modal
function openNewInvoiceModal() {
  closeQuickCreateDropdown();
  const modal = document.getElementById("new-invoice-modal");
  const studentSelect = document.getElementById("new-inv-student");
  
  // Populate students
  studentSelect.innerHTML = BooksStore.getStudents().map(s => `
    <option value="${s.id}" data-course="${s.courseId}" data-name="${s.name}" data-balance="${s.balanceFee}">${s.name} (${s.id}) - Balance: ₹${s.balanceFee.toLocaleString('en-IN')}</option>
  `).join('');

  // Set default dates
  const dateInput = document.getElementById("new-inv-date");
  if (dateInput) dateInput.value = new Date().toISOString().split("T")[0];

  const dueInput = document.getElementById("new-inv-due-date");
  if (dueInput && !dueInput.value) {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    dueInput.value = d.toISOString().split("T")[0];
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeNewInvoiceModal() {
  const modal = document.getElementById("new-invoice-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function submitNewInvoice(event) {
  event.preventDefault();
  const studentSelect = document.getElementById("new-inv-student");
  const studentId = studentSelect.value;
  const selectedOpt = studentSelect.selectedOptions[0];
  const studentName = selectedOpt.getAttribute("data-name");
  const courseId = selectedOpt.getAttribute("data-course") || "cma-usa-comp";

  const invDate = document.getElementById("new-inv-date")?.value || new Date().toISOString().split("T")[0];
  const dueDate = document.getElementById("new-inv-due-date").value;
  const itemName = document.getElementById("new-inv-item-name").value;
  const itemRate = Number(document.getElementById("new-inv-item-rate").value);
  const discount = Number(document.getElementById("new-inv-discount").value) || 0;
  const notes = document.getElementById("new-inv-notes").value;

  const total = Math.max(0, itemRate - discount);

  try {
    const newInv = BooksStore.addInvoice({
      date: invDate,
      studentId,
      studentName,
      courseId,
      dueDate,
      items: [
        { name: itemName, sac: "999293", qty: 1, rate: itemRate, amount: itemRate }
      ],
      subtotal: itemRate,
      discount: discount,
      taxableAmount: total,
      total: total,
      notes: notes
    });

    closeNewInvoiceModal();
    switchModule("invoices");
    selectInvoice(newInv.id);
    showToast(`Invoice ${newInv.invoiceNumber} created successfully!`, "success");
  } catch (err) {
    showToast(err.message, "error");
  }
}
