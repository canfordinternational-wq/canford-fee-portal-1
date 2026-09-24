// ============================================================================
// CANFORD INTERNATIONAL - ADMIN & ACCOUNTS MODULE
// ============================================================================

let currentFilterCourse = "all";
let currentFilterStatus = "all";
let currentSearchTerm = "";

// Refresh KPI Cards
function updateAdminKPIs() {
  const students = StudentStore.getAll();

  const totalRevenue = students.reduce((acc, s) => acc + (Number(s.paidFee) || 0), 0);
  const totalPending = students.reduce((acc, s) => acc + (Number(s.balanceFee) || 0), 0);
  const totalStudents = students.length;
  const overdueCount = students.filter(s => s.feeStatus === "Overdue" || (s.nextDueDate && new Date(s.nextDueDate) < new Date() && s.balanceFee > 0)).length;

  document.getElementById("kpi-total-collected").textContent = `₹${totalRevenue.toLocaleString('en-IN')}`;
  document.getElementById("kpi-total-pending").textContent = `₹${totalPending.toLocaleString('en-IN')}`;
  document.getElementById("kpi-total-students").textContent = totalStudents;
  document.getElementById("kpi-overdue-count").textContent = overdueCount;
}

// Render Admin Student Table
function refreshAdminTable() {
  updateAdminKPIs();

  let students = StudentStore.getAll();

  // Filter by search
  if (currentSearchTerm) {
    const q = currentSearchTerm.toLowerCase();
    students = students.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.place && s.place.toLowerCase().includes(q))
    );
  }

  // Filter by course
  if (currentFilterCourse !== "all") {
    students = students.filter(s => s.courseId === currentFilterCourse);
  }

  // Filter by status
  if (currentFilterStatus !== "all") {
    students = students.filter(s => s.feeStatus.toLowerCase() === currentFilterStatus.toLowerCase());
  }

  const tbody = document.getElementById("admin-students-tbody");
  if (!tbody) return;

  if (students.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-8 text-center text-slate-400">
          <i class="fas fa-search text-3xl mb-2"></i>
          <p class="text-sm font-medium">No student records found matching your filters.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = students.map((s, idx) => {
    let statusBadge = "";
    if (s.feeStatus === "Paid") {
      statusBadge = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">✓ Paid Full</span>`;
    } else if (s.feeStatus === "Overdue") {
      statusBadge = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 animate-pulse">⚠ Overdue</span>`;
    } else if (s.feeStatus === "Partial") {
      statusBadge = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Partial Paid</span>`;
    } else {
      statusBadge = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">Pending</span>`;
    }

    const progressPct = Math.round((s.paidFee / s.totalFee) * 100);

    return `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100 text-sm">
        <td class="py-3.5 px-4 font-mono text-xs font-bold text-[#005696]">
          ${s.id}
        </td>
        <td class="py-3.5 px-4">
          <div class="font-bold text-slate-900">${s.name}</div>
          <div class="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
            <span><i class="fas fa-phone-alt text-[10px] text-slate-400"></i> ${s.phone}</span>
            <span>•</span>
            <span><i class="fas fa-map-marker-alt text-[10px] text-slate-400"></i> ${s.place || 'Calicut'}</span>
          </div>
        </td>
        <td class="py-3.5 px-4">
          <div class="font-medium text-slate-800 text-xs">${s.courseName}</div>
          <div class="text-[11px] text-slate-400">${s.batch || 'Regular 2025'}</div>
        </td>
        <td class="py-3.5 px-4">
          <div class="flex justify-between text-xs mb-1">
            <span class="font-bold text-emerald-700">₹${s.paidFee.toLocaleString('en-IN')}</span>
            <span class="text-slate-400">/ ₹${s.totalFee.toLocaleString('en-IN')}</span>
          </div>
          <div class="w-28 bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div class="bg-emerald-600 h-1.5 rounded-full" style="width: ${progressPct}%"></div>
          </div>
        </td>
        <td class="py-3.5 px-4">
          <div class="font-bold ${s.balanceFee > 0 ? 'text-amber-700' : 'text-slate-500'}">
            ₹${s.balanceFee.toLocaleString('en-IN')}
          </div>
          ${s.nextDueDate ? `<div class="text-[11px] text-slate-400">Due: ${s.nextDueDate}</div>` : ''}
        </td>
        <td class="py-3.5 px-4">
          ${statusBadge}
        </td>
        <td class="py-3.5 px-4 text-right space-x-1">
          <button onclick="openCollectModal('${s.id}')" title="Collect / Record Payment" class="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-medium text-xs transition">
            <i class="fas fa-money-bill-wave"></i> Collect
          </button>
          <button onclick="viewStudentProfile('${s.id}')" title="View Full Details" class="p-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs transition">
            <i class="fas fa-eye"></i> Details
          </button>
          <button onclick="sendWhatsAppReminder('${s.id}')" title="Send WhatsApp Reminder" class="p-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs transition">
            <i class="fab fa-whatsapp text-sm"></i>
          </button>
          <button onclick="handleDeleteStudent('${s.id}', '${s.name.replace(/'/g, "\\'")}')" title="Delete Student" class="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs transition">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function handleDeleteStudent(studentId, studentName) {
  if (confirm(`Are you sure you want to delete student "${studentName}" (${studentId})?\n\nThis will remove their student record and fee ledger.`)) {
    if (typeof BooksStore !== 'undefined') {
      BooksStore.deleteStudent(studentId);
    } else if (typeof StudentStore !== 'undefined') {
      StudentStore.deleteStudent(studentId);
    }
    refreshAdminTable();
    if (typeof refreshZohoDashboard === 'function') refreshZohoDashboard();
    showToast(`Deleted student ${studentName}`, "info");
  }
}

// Open Offline / Manual Fee Collection Modal
function openCollectModal(studentId) {
  const student = StudentStore.getById(studentId);
  if (!student) return;

  if (student.balanceFee <= 0) {
    showToast("This student has already completed all fee payments.", "info");
    return;
  }

  document.getElementById("manual-student-id").value = student.id;
  document.getElementById("manual-student-name").textContent = `${student.name} (${student.id})`;
  document.getElementById("manual-student-course").textContent = student.courseName;
  document.getElementById("manual-balance").textContent = `₹${student.balanceFee.toLocaleString('en-IN')}`;
  document.getElementById("manual-amount").value = student.balanceFee;
  document.getElementById("manual-amount").max = student.balanceFee;

  const dateInput = document.getElementById("manual-date");
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  const modal = document.getElementById("manual-collect-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeCollectModal() {
  const modal = document.getElementById("manual-collect-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function submitManualPayment(event) {
  event.preventDefault();
  const studentId = document.getElementById("manual-student-id").value;
  const amount = Number(document.getElementById("manual-amount").value);
  const mode = document.getElementById("manual-mode").value;
  const date = document.getElementById("manual-date")?.value || new Date().toISOString().split('T')[0];
  const refNo = document.getElementById("manual-ref").value || `REF-${Date.now().toString().slice(-6)}`;
  const particulars = document.getElementById("manual-particulars").value || "Course Fee Collection";
  const notes = document.getElementById("manual-notes").value || "Direct office entry";

  try {
    const result = StudentStore.recordPayment(studentId, {
      amount: amount,
      date: date,
      mode: mode,
      txnId: refNo,
      particulars: particulars,
      notes: notes
    });

    closeCollectModal();
    refreshAdminTable();
    if (typeof refreshZohoDashboard === 'function') refreshZohoDashboard();
    showToast(`Payment of ₹${amount.toLocaleString('en-IN')} recorded on ${date}!`, "success");
    openReceiptModal(result.student, result.receipt);
  } catch (err) {
    showToast(err.message, "error");
  }
}

// Student Profile / Full Details Modal
function viewStudentProfile(studentId) {
  const student = StudentStore.getById(studentId);
  if (!student) return;

  const modal = document.getElementById("student-profile-modal");
  const container = document.getElementById("student-profile-content");

  const progressPct = Math.round((student.paidFee / student.totalFee) * 100);

  const historyHtml = student.paymentHistory && student.paymentHistory.length > 0 
    ? student.paymentHistory.map(h => `
      <div class="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
        <div>
          <span class="font-bold text-slate-800">${h.particulars}</span>
          <div class="text-slate-500 font-mono text-[11px]">${h.receiptNo} • ${h.date} • ${h.mode}</div>
        </div>
        <div class="text-right flex items-center gap-2">
          <span class="font-black text-emerald-700 text-sm">₹${Number(h.amount).toLocaleString('en-IN')}</span>
          <button onclick="openReceiptModal(StudentStore.getById('${student.id}'), StudentStore.getById('${student.id}').paymentHistory.find(x => x.receiptNo === '${h.receiptNo}'))" class="px-2 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded text-slate-700 font-semibold text-[11px]">
            <i class="fas fa-print"></i> Receipt
          </button>
        </div>
      </div>
    `).join('')
    : `<p class="text-slate-400 text-xs italic">No payment history recorded yet.</p>`;

  const installmentsHtml = student.installments.map((inst, idx) => {
    let instBadge = "";
    if (inst.status === "Paid") {
      instBadge = `<span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">Paid on ${inst.paidDate}</span>`;
    } else if (inst.status === "Overdue") {
      instBadge = `<span class="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-bold text-[10px]">Overdue (${inst.dueDate})</span>`;
    } else {
      instBadge = `<span class="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-bold text-[10px]">Due ${inst.dueDate}</span>`;
    }

    return `
      <div class="flex justify-between items-center p-2.5 border-b border-slate-100 text-xs">
        <div>
          <span class="font-semibold text-slate-800">${idx + 1}. ${inst.name}</span>
          <div class="mt-0.5">${instBadge}</div>
        </div>
        <div class="text-right">
          <span class="font-bold text-slate-900">₹${inst.amount.toLocaleString('en-IN')}</span>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <!-- Top Header -->
    <div class="flex justify-between items-start border-b border-slate-200 pb-4 mb-4">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-black text-slate-900">${student.name}</h2>
          <span class="px-2 py-0.5 bg-[#005696]/10 text-[#005696] font-mono text-xs font-bold rounded">${student.id}</span>
        </div>
        <p class="text-xs text-slate-500 mt-1">${student.courseName} • ${student.batch || 'Regular 2025'}</p>
      </div>
      <div class="text-right">
        <span class="text-xs text-slate-400">Status</span>
        <div class="font-bold text-emerald-700 text-sm">${student.status}</div>
      </div>
    </div>

    <!-- Contact & Personal Details -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl mb-4 text-xs">
      <div>
        <span class="text-slate-400 font-medium">Contact Phone</span>
        <p class="font-bold text-slate-800 mt-0.5">+91 ${student.phone}</p>
      </div>
      <div>
        <span class="text-slate-400 font-medium">Email Address</span>
        <p class="font-bold text-slate-800 mt-0.5 truncate">${student.email || 'N/A'}</p>
      </div>
      <div>
        <span class="text-slate-400 font-medium">Location</span>
        <p class="font-bold text-slate-800 mt-0.5">${student.place || 'Calicut'}</p>
      </div>
      <div>
        <span class="text-slate-400 font-medium">Qualification</span>
        <p class="font-bold text-slate-800 mt-0.5">${student.qualification || 'Degree'}</p>
      </div>
    </div>

    <!-- Fee Financial Summary Cards -->
    <div class="grid grid-cols-3 gap-3 mb-4 text-center">
      <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <span class="text-[11px] text-slate-500 uppercase font-semibold">Total Fee</span>
        <p class="text-base font-black text-slate-900 mt-0.5">₹${student.totalFee.toLocaleString('en-IN')}</p>
      </div>
      <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
        <span class="text-[11px] text-emerald-700 uppercase font-semibold">Paid to Date</span>
        <p class="text-base font-black text-emerald-800 mt-0.5">₹${student.paidFee.toLocaleString('en-IN')}</p>
      </div>
      <div class="p-3 ${student.balanceFee > 0 ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'} border rounded-xl">
        <span class="text-[11px] text-amber-700 uppercase font-semibold">Balance Due</span>
        <p class="text-base font-black text-amber-800 mt-0.5">₹${student.balanceFee.toLocaleString('en-IN')}</p>
      </div>
    </div>

    <!-- Installment Milestones -->
    <div class="mb-4">
      <h3 class="text-xs uppercase tracking-wider font-bold text-slate-500 mb-2">Installment Schedule</h3>
      <div class="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
        ${installmentsHtml}
      </div>
    </div>

    <!-- Payment Receipts History -->
    <div class="mb-2">
      <h3 class="text-xs uppercase tracking-wider font-bold text-slate-500 mb-2">Payment Receipts (${student.paymentHistory?.length || 0})</h3>
      <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
        ${historyHtml}
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeStudentProfileModal() {
  const modal = document.getElementById("student-profile-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// WhatsApp Reminder Dispatcher (Req 10 & Req 11)
function sendWhatsAppReminder(studentId) {
  const student = StudentStore.getById(studentId);
  if (!student) return;

  if (student.balanceFee <= 0) {
    showToast("Student has no outstanding dues.", "info");
    return;
  }

  const nextInst = student.installments.find(i => i.status !== "Paid");
  const dueDateStr = nextInst ? nextInst.dueDate : (student.nextDueDate || "Due Now");

  const org = (typeof BooksStore !== 'undefined') ? BooksStore.getOrg() : {};
  const bank = org.bank || {};
  const qrLink = bank.qrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${bank.upiId || 'canford@upi'}&pn=${encodeURIComponent(org.name || 'Canford International')}&am=${student.balanceFee}`;

  let message = org.whatsappTemplate || `*Fee Reminder - {organization_name}*\n\nDear {student_name},\nGreetings from {organization_name}, Calicut.\n\nThis is a gentle reminder regarding your pending fee installment for *{course_name}*.\n\n• Outstanding Balance: *₹{balance_amount}*\n• Due Date: *{due_date}*\n\nYou can pay online using our official UPI QR code below:\n{qr_link}\n\n• Primary UPI ID: {upi_id}\n• Bank: {bank_name} ({bank_branch})\n• A/C No: {account_no}\n• IFSC: {ifsc_code}\n\nFor queries, call us at {contact_phone}.\n\nBest regards,\nAccounts Office\n{organization_name}`;

  message = message
    .replace(/{organization_name}/g, org.name || "Canford International")
    .replace(/{student_name}/g, student.name)
    .replace(/{course_name}/g, student.courseName)
    .replace(/{invoice_no}/g, student.id)
    .replace(/{balance_amount}/g, Number(student.balanceFee).toLocaleString('en-IN'))
    .replace(/{due_date}/g, dueDateStr)
    .replace(/{upi_id}/g, bank.upiId || "canford@upi")
    .replace(/{qr_link}/g, qrLink)
    .replace(/{bank_name}/g, bank.bankName || "HDFC Bank")
    .replace(/{bank_branch}/g, bank.branch || "Calicut Branch")
    .replace(/{account_no}/g, bank.accountNumber || "50200084920194")
    .replace(/{ifsc_code}/g, bank.ifsc || "HDFC0001234")
    .replace(/{contact_phone}/g, org.contact?.phone || "+91 9895 577 123");

  const cleanPhone = student.phone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
}

// Add New Student Handler (Req 1: Immediately show student details)
function handleAddStudentSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("new-student-name").value;
  const courseId = document.getElementById("new-student-course").value;
  const phone = document.getElementById("new-student-phone").value;
  const email = document.getElementById("new-student-email").value;
  const place = document.getElementById("new-student-place").value;
  const qualification = document.getElementById("new-student-qualification").value;
  const batch = document.getElementById("new-student-batch").value;
  const initialPayment = Number(document.getElementById("new-student-initial-pay").value) || 0;
  const paymentMode = document.getElementById("new-student-pay-mode").value;

  try {
    const newStudent = StudentStore.addStudent({
      name,
      courseId,
      phone,
      email,
      place,
      qualification,
      batch,
      initialPayment,
      paymentMode
    });

    closeAddStudentModal();

    // Synchronize BooksStore
    if (typeof BooksStore !== 'undefined') {
      BooksStore.data.students = StudentStore.getAll();
      BooksStore.save();
    }

    refreshAdminTable();
    if (typeof refreshZohoDashboard === 'function') refreshZohoDashboard();

    showToast(`Candidate ${newStudent.name} (${newStudent.id}) registered successfully!`, "success");

    // Req 1: Immediately open and show the new student's full details!
    viewStudentProfile(newStudent.id);

    // If initial payment made, offer receipt option
    if (initialPayment > 0 && newStudent.paymentHistory.length > 0) {
      setTimeout(() => {
        openReceiptModal(newStudent, newStudent.paymentHistory[0]);
      }, 500);
    }
  } catch (err) {
    showToast(err.message, "error");
  }
}

function openAddStudentModal() {
  const modal = document.getElementById("add-student-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeAddStudentModal() {
  const modal = document.getElementById("add-student-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// CSV Export
function exportStudentsCSV() {
  const students = StudentStore.getAll();
  const headers = ["Student ID", "Full Name", "Course", "Contact Phone", "Email", "Location", "Batch", "Total Fee (INR)", "Paid Fee (INR)", "Balance Fee (INR)", "Fee Status", "Next Due Date", "Admission Date"];

  const rows = students.map(s => [
    `"${s.id}"`,
    `"${s.name}"`,
    `"${s.courseName}"`,
    `"${s.phone}"`,
    `"${s.email || ''}"`,
    `"${s.place || ''}"`,
    `"${s.batch || ''}"`,
    s.totalFee,
    s.paidFee,
    s.balanceFee,
    `"${s.feeStatus}"`,
    `"${s.nextDueDate || ''}"`,
    `"${s.admissionDate || ''}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  const todayStr = new Date().toISOString().split('T')[0];
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Canford_Students_Fee_Report_${todayStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("Fee Report CSV exported successfully", "success");
}

// Reset data to default
function handleResetDemoData() {
  if (confirm("Reset all student and fee records back to official sample data? Any newly added records will be replaced.")) {
    StudentStore.resetToDefault();
    refreshAdminTable();
    showToast("Data reset to official Canford records.", "info");
  }
}
