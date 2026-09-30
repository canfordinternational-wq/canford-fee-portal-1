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
      <td class="py-3 px-4 text-right whitespace-nowrap">
        <button onclick="openEditExpenseModal('${e.id}')" class="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs transition mr-1" title="Edit Expense">
          <i class="fas fa-edit"></i>
        </button>
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


function ensureEditExpenseModal() {
  if (document.getElementById("edit-expense-modal")) return;
  const div = document.createElement("div");
  div.id = "edit-expense-modal";
  div.className = "fixed inset-0 z-[60] hidden items-center justify-center p-4 glass-overlay";
  div.innerHTML = `
    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 text-xs">
      <div class="bg-[#072a4a] text-white p-4 flex justify-between items-center">
        <div><span class="text-[10px] uppercase tracking-wider text-amber-300 font-bold">Audit Controlled Edit</span><h3 class="text-sm font-bold">Edit Operating Expense</h3></div>
        <button type="button" onclick="closeEditExpenseModal()" class="text-white/70 hover:text-white"><i class="fas fa-times"></i></button>
      </div>
      <form onsubmit="submitEditExpense(event)" class="p-5 space-y-3">
        <input type="hidden" id="edit-exp-id">
        <div class="grid grid-cols-2 gap-3">
          <div><label class="block font-semibold text-slate-700 mb-1">Expense Date *</label><input type="date" id="edit-exp-date" required class="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold"></div>
          <div><label class="block font-semibold text-slate-700 mb-1">Amount (₹) *</label><input type="number" id="edit-exp-amount" min="0.01" step="any" required class="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold font-mono"></div>
        </div>
        <div><label class="block font-semibold text-slate-700 mb-1">Expense Particulars *</label><input type="text" id="edit-exp-particulars" required class="w-full p-2 bg-white border border-slate-300 rounded-xl"></div>
        <div><label class="block font-semibold text-slate-700 mb-1">Category *</label><select id="edit-exp-category" class="w-full p-2 bg-white border border-slate-300 rounded-xl"></select></div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="block font-semibold text-slate-700 mb-1">Paid Through *</label><select id="edit-exp-mode" class="w-full p-2 bg-white border border-slate-300 rounded-xl"><option>Bank Transfer</option><option>UPI</option><option>Cash</option><option>Card</option></select></div>
          <div><label class="block font-semibold text-slate-700 mb-1">Vendor / Payee</label><input type="text" id="edit-exp-vendor" class="w-full p-2 bg-white border border-slate-300 rounded-xl"></div>
        </div>
        <div><label class="block font-semibold text-slate-700 mb-1">Reference #</label><input type="text" id="edit-exp-ref" class="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono"></div>
        <div><label class="block font-semibold text-slate-700 mb-1">Notes</label><input type="text" id="edit-exp-notes" class="w-full p-2 bg-white border border-slate-300 rounded-xl"></div>
        <div><label class="block font-semibold text-rose-700 mb-1">Reason for Edit * <span class="font-normal text-slate-500">(required for audit)</span></label><textarea id="edit-exp-reason" required minlength="3" rows="2" placeholder="e.g. Corrected amount based on original receipt" class="w-full p-2 bg-amber-50 border border-amber-300 rounded-xl"></textarea></div>
        <div class="pt-2 flex justify-end gap-2"><button type="button" onclick="closeEditExpenseModal()" class="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">Cancel</button><button type="submit" class="py-2 px-5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow">Save Changes</button></div>
      </form>
    </div>`;
  document.body.appendChild(div);
}

function openEditExpenseModal(id) {
  ensureEditExpenseModal();
  const expense = BooksStore.getExpenses().find(e => e.id === id);
  if (!expense) return showToast("Expense not found.", "error");
  document.getElementById("edit-exp-id").value = expense.id;
  document.getElementById("edit-exp-date").value = expense.date || "";
  document.getElementById("edit-exp-amount").value = expense.amount || "";
  document.getElementById("edit-exp-particulars").value = expense.particulars || "";
  document.getElementById("edit-exp-vendor").value = expense.vendor || "";
  document.getElementById("edit-exp-ref").value = expense.reference || "";
  document.getElementById("edit-exp-notes").value = expense.notes || "";
  const cat = document.getElementById("edit-exp-category");
  const cats = [...new Set([...(BooksStore.getCategories() || []), expense.category])];
  cat.innerHTML = cats.map(c => `<option value="${String(c).replace(/"/g,'&quot;')}">${c}</option>`).join("");
  cat.value = expense.category || cats[0] || "";
  document.getElementById("edit-exp-mode").value = expense.paidThrough || "Bank Transfer";
  document.getElementById("edit-exp-reason").value = "";
  const modal = document.getElementById("edit-expense-modal");
  modal.classList.remove("hidden"); modal.classList.add("flex");
}

function closeEditExpenseModal() {
  const modal = document.getElementById("edit-expense-modal");
  if (modal) { modal.classList.add("hidden"); modal.classList.remove("flex"); }
}

function submitEditExpense(event) {
  event.preventDefault();
  const id = document.getElementById("edit-exp-id").value;
  const reason = document.getElementById("edit-exp-reason").value.trim();
  try {
    const updated = BooksStore.updateExpense(id, {
      date: document.getElementById("edit-exp-date").value,
      amount: Number(document.getElementById("edit-exp-amount").value),
      particulars: document.getElementById("edit-exp-particulars").value.trim(),
      category: document.getElementById("edit-exp-category").value,
      paidThrough: document.getElementById("edit-exp-mode").value,
      vendor: document.getElementById("edit-exp-vendor").value.trim(),
      reference: document.getElementById("edit-exp-ref").value.trim(),
      notes: document.getElementById("edit-exp-notes").value.trim()
    }, reason);
    closeEditExpenseModal();
    renderExpensesList();
    if (typeof refreshZohoDashboard === 'function') refreshZohoDashboard();
    showToast(`Updated expense ${updated.id}. Edit reason recorded.`, "success");
  } catch (err) {
    showToast(err.message || "Unable to update expense.", "error");
  }
}
