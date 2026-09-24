// ============================================================================
// CANFORD BOOKS - EXPENSES & OUTFLOWS MODULE (REAL DATA FROM ACCOUNTS SHEET)
// ============================================================================

let expenseCategoryFilter = "all";

function initExpensesModule() {
  renderExpensesList();
}

function renderExpensesList() {
  const expenses = BooksStore.getExpenses();
  const tbody = document.getElementById("books-expenses-tbody");
  if (!tbody) return;

  let filtered = expenses;
  if (expenseCategoryFilter !== "all") {
    filtered = expenses.filter(e => e.category === expenseCategoryFilter);
  }

  // Update Category Breakdown Widgets
  const totalExp = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const marketingExp = expenses.filter(e => e.category === "Advertising & Marketing").reduce((s, e) => s + Number(e.amount), 0);
  const itExp = expenses.filter(e => e.category === "IT & Software Subscriptions").reduce((s, e) => s + Number(e.amount), 0);
  const legalExp = expenses.filter(e => e.category === "Legal & Professional Fees").reduce((s, e) => s + Number(e.amount), 0);

  const totalEl = document.getElementById("exp-metric-total");
  if (totalEl) totalEl.textContent = `₹${totalExp.toLocaleString('en-IN')}`;

  const mktEl = document.getElementById("exp-metric-marketing");
  if (mktEl) mktEl.textContent = `₹${marketingExp.toLocaleString('en-IN')}`;

  const itEl = document.getElementById("exp-metric-it");
  if (itEl) itEl.textContent = `₹${itExp.toLocaleString('en-IN')}`;

  const legEl = document.getElementById("exp-metric-legal");
  if (legEl) legEl.textContent = `₹${legalExp.toLocaleString('en-IN')}`;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="p-8 text-center text-slate-400 text-xs">No expenses recorded in this category.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(e => `
    <tr class="hover:bg-slate-50 transition border-b border-slate-100 text-xs">
      <td class="py-3 px-4 font-mono text-slate-500">${e.date}</td>
      <td class="py-3 px-4">
        <div class="font-bold text-slate-900">${e.particulars}</div>
        <div class="text-[10px] text-slate-400">${e.notes || ''}</div>
      </td>
      <td class="py-3 px-4">
        <span class="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold text-[10px] border border-slate-200">
          ${e.category}
        </span>
      </td>
      <td class="py-3 px-4 text-slate-700">${e.vendor}</td>
      <td class="py-3 px-4 font-mono text-[11px] text-slate-500">${e.paidThrough}</td>
      <td class="py-3 px-4 text-right font-black text-rose-700 font-mono text-sm">
        ₹${Number(e.amount).toLocaleString('en-IN')}
      </td>
      <td class="py-3 px-4 text-right">
        <button onclick="handleDeleteExpense('${e.id}', '${e.particulars.replace(/'/g, "\\'")}')" class="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs transition" title="Delete Expense">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function handleDeleteExpense(expId, particulars) {
  if (confirm(`Are you sure you want to delete expense "${particulars}"?`)) {
    BooksStore.deleteExpense(expId);
    renderExpensesList();
    if (typeof refreshZohoDashboard === 'function') refreshZohoDashboard();
    showToast(`Deleted expense: ${particulars}`, "info");
  }
}

function filterExpensesByCategory(cat) {
  expenseCategoryFilter = cat;
  renderExpensesList();
}

function openAddExpenseModal() {
  const modal = document.getElementById("add-expense-modal");
  const dateInput = document.getElementById("new-exp-date");
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeAddExpenseModal() {
  const modal = document.getElementById("add-expense-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function submitNewExpense(event) {
  event.preventDefault();
  const date = document.getElementById("new-exp-date")?.value || new Date().toISOString().split('T')[0];
  const particulars = document.getElementById("new-exp-particulars").value;
  const category = document.getElementById("new-exp-category").value;
  const vendor = document.getElementById("new-exp-vendor").value;
  const amount = Number(document.getElementById("new-exp-amount").value);
  const paidThrough = document.getElementById("new-exp-mode").value;
  const reference = document.getElementById("new-exp-ref").value;
  const notes = document.getElementById("new-exp-notes").value;

  try {
    BooksStore.addExpense({
      date,
      particulars,
      category,
      vendor,
      amount,
      paidThrough,
      reference,
      notes
    });

    closeAddExpenseModal();
    renderExpensesList();
    showToast(`Recorded expense of ₹${amount.toLocaleString('en-IN')} on ${date}!`, "success");
    if (typeof refreshZohoDashboard === 'function') refreshZohoDashboard();
  } catch (err) {
    showToast(err.message, "error");
  }
}
