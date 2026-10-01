// ============================================================================
// CANFORD BOOKS - CLIENT / STUDENT PORTAL
// Activates the existing Client Portal module using the same StudentStore data.
// ============================================================================

(function () {
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;
  const normalizePhone = (value) => String(value || '').replace(/\D/g, '');

  window.handleStudentSearch = function (event) {
    event.preventDefault();
    const idEl = document.getElementById('student-search-id');
    const phoneEl = document.getElementById('student-search-phone');
    const id = (idEl?.value || '').trim();
    const phoneLast4 = normalizePhone(phoneEl?.value || '').slice(-4);
    const result = document.getElementById('portal-search-result');

    if (!id || phoneLast4.length !== 4) {
      if (result) result.innerHTML = '<div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">Enter your Student ID and the last 4 digits of your registered mobile number.</div>';
      return;
    }

    const student = StudentStore.getById(id);
    if (!student || normalizePhone(student.phone).slice(-4) !== phoneLast4) {
      if (result) result.innerHTML = '<div class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">Student details could not be verified. Please check the Student ID and mobile number.</div>';
      const panel = document.getElementById('portal-student-panel');
      if (panel) panel.classList.add('hidden');
      return;
    }

    if (result) result.innerHTML = '<div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">Student verified successfully.</div>';
    renderStudentPortal(student.id);
  };

  window.loadStudentInPortal = function (studentId) {
    // Kept for compatibility with older buttons/bookmarks.
    const student = StudentStore.getById(studentId);
    if (!student) return;
    renderStudentPortal(student.id);
  };

  window.renderStudentPortal = function (studentId) {
    const student = StudentStore.getById(studentId);
    if (!student) return;

    const panel = document.getElementById('portal-student-panel');
    if (panel) panel.classList.remove('hidden');

    const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
    set('sp-name', student.name);
    set('sp-id', student.id);
    set('sp-course', student.courseName);
    set('sp-phone', student.phone ? `+91 ${student.phone}` : '—');
    set('sp-place', student.place || '—');
    set('sp-next-due-date', student.nextDueDate || 'No pending due');
    set('sp-total-fee', money(student.totalFee));
    set('sp-paid-fee', money(student.paidFee));
    set('sp-balance-fee', money(student.balanceFee));

    const badge = document.getElementById('sp-badge');
    if (badge) {
      const status = student.feeStatus || (student.balanceFee <= 0 ? 'Paid' : 'Partial');
      const cls = status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800';
      badge.innerHTML = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${cls}">${esc(status)}</span>`;
    }

    const payBtn = document.getElementById('sp-main-pay-btn');
    if (payBtn) {
      payBtn.disabled = Number(student.balanceFee) <= 0;
      payBtn.className = `py-2.5 px-5 text-white font-bold text-xs rounded-xl shadow transition ${student.balanceFee > 0 ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-400 cursor-not-allowed'}`;
      payBtn.innerHTML = student.balanceFee > 0 ? '<i class="fas fa-lock mr-1"></i> Pay Online' : '<i class="fas fa-check mr-1"></i> Fully Paid';
      payBtn.onclick = () => { if (student.balanceFee > 0) openCheckoutModal(student.id); };
    }

    const instBox = document.getElementById('sp-installments-list');
    if (instBox) {
      const installments = Array.isArray(student.installments) ? student.installments : [];
      instBox.innerHTML = installments.length ? installments.map((inst, idx) => {
        const paid = inst.status === 'Paid';
        const partial = inst.status === 'Partial';
        const statusClass = paid ? 'bg-emerald-100 text-emerald-700' : partial ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-800';
        return `<div class="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/70">
          <div class="min-w-0"><div class="font-bold text-xs text-slate-800">${idx + 1}. ${esc(inst.name)}</div><div class="text-[11px] text-slate-400 mt-0.5">Due: ${esc(inst.dueDate || '—')}</div></div>
          <div class="text-right shrink-0"><div class="font-black text-sm text-slate-900">${money(inst.amount)}</div><span class="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusClass}">${esc(inst.status || 'Due')}</span></div>
        </div>`;
      }).join('') : '<div class="text-xs text-slate-400 p-3">No installment schedule available.</div>';
    }

    const receiptBox = document.getElementById('sp-receipts-list');
    if (receiptBox) {
      const history = Array.isArray(student.paymentHistory) ? student.paymentHistory : [];
      receiptBox.innerHTML = history.length ? history.map((r, idx) => `<div class="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200">
        <div><div class="font-bold text-xs text-slate-800">${esc(r.receiptNo || `Receipt ${idx + 1}`)}</div><div class="text-[11px] text-slate-400">${esc(r.date || '—')} • ${esc(r.mode || 'Payment')}</div></div>
        <div class="text-right"><div class="font-black text-sm text-emerald-700">${money(r.amount)}</div><button class="text-[10px] text-[#005696] font-bold underline" onclick='openReceiptModal(${JSON.stringify(student).replace(/'/g,"&#39;")}, ${JSON.stringify(r).replace(/'/g,"&#39;")})'>View Receipt</button></div>
      </div>`).join('') : '<div class="text-xs text-slate-400 p-3">No payment receipts available.</div>';
    }
  };

  window.activateClientPortal = function () {
    if (typeof StudentStore === 'undefined') return;
    const panel = document.getElementById('portal-student-panel');
    if (panel) panel.classList.add('hidden');
    const result = document.getElementById('portal-search-result');
    if (result) result.innerHTML = '';
    const idEl = document.getElementById('student-search-id');
    const phoneEl = document.getElementById('student-search-phone');
    if (idEl) idEl.value = '';
    if (phoneEl) phoneEl.value = '';
  };
})();
