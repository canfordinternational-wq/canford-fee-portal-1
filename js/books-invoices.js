// ============================================================================
// CANFORD BOOKS - INVOICE MANAGEMENT MODULE (ZOHO BOOKS SPLIT-PANE UI)
// ============================================================================

let currentSelectedInvoiceId = null;
let invoiceFilterStatus = "all";

function initInvoicesModule() {
  renderInvoicesList();
}

function renderInvoicesList() {
  const invoices = BooksStore.getInvoices();
  const listContainer = document.getElementById("books-invoices-list");
  if (!listContainer) return;

  let filtered = invoices;
  if (invoiceFilterStatus !== "all") {
    filtered = invoices.filter(i => i.status.toLowerCase() === invoiceFilterStatus.toLowerCase());
  }

  if (filtered.length === 0) {
    listContainer.innerHTML = `
      <div class="p-8 text-center text-slate-400">
        <i class="far fa-file-alt text-3xl mb-2"></i>
        <p class="text-xs">No invoices found in this view.</p>
      </div>
    `;
    return;
  }

  // If no active invoice selected, pick the first one
  if (!currentSelectedInvoiceId || !invoices.find(i => i.id === currentSelectedInvoiceId)) {
    currentSelectedInvoiceId = filtered[0].id;
  }

  listContainer.innerHTML = filtered.map(inv => {
    const isSelected = inv.id === currentSelectedInvoiceId;
    let badgeClass = "bg-slate-100 text-slate-600";
    if (inv.status === "Paid") badgeClass = "bg-emerald-100 text-emerald-800";
    else if (inv.status === "Overdue") badgeClass = "bg-rose-100 text-rose-800 font-bold";
    else if (inv.status === "Partially Paid") badgeClass = "bg-amber-100 text-amber-800";
    else if (inv.status === "Unpaid") badgeClass = "bg-blue-100 text-blue-800";

    return `
      <div onclick="selectInvoice('${inv.id}')" class="p-3.5 border-b border-slate-100 cursor-pointer transition text-xs ${isSelected ? 'bg-blue-50/70 border-l-4 border-l-[#005696]' : 'hover:bg-slate-50'}">
        <div class="flex justify-between items-start mb-1">
          <span class="font-bold text-slate-900">${inv.studentName}</span>
          <span class="font-black text-slate-900">₹${Number(inv.total).toLocaleString('en-IN')}</span>
        </div>
        <div class="flex justify-between items-center text-[11px] text-slate-500 mb-1.5">
          <span class="font-mono text-[#005696] font-semibold">${inv.invoiceNumber}</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold ${badgeClass}">${inv.status}</span>
        </div>
        <div class="flex justify-between items-center text-[10px] text-slate-400">
          <span>Date: ${inv.date}</span>
          <div class="flex items-center gap-2">
            <span>Due: ${inv.dueDate}</span>
            <button onclick="event.stopPropagation(); handleDeleteInvoice('${inv.id}', '${inv.invoiceNumber}')" class="text-slate-400 hover:text-rose-600 p-0.5 transition" title="Delete Invoice">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Render detail pane on right
  renderInvoiceDetail(currentSelectedInvoiceId);
}

function selectInvoice(id) {
  currentSelectedInvoiceId = id;
  renderInvoicesList();
}

function setInvoiceFilter(status) {
  invoiceFilterStatus = status;
  const tabs = ['all', 'unpaid', 'partially paid', 'paid', 'overdue'];
  tabs.forEach(t => {
    const el = document.getElementById(`inv-tab-${t.replace(' ', '-')}`);
    if (el) {
      if (t === status) {
        el.className = "px-3 py-1.5 rounded-lg text-xs font-bold bg-[#005696] text-white shadow-sm";
      } else {
        el.className = "px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100";
      }
    }
  });
  renderInvoicesList();
}

function renderInvoiceDetail(invId) {
  const container = document.getElementById("books-invoice-detail-pane");
  if (!container) return;

  const inv = BooksStore.getInvoices().find(i => i.id === invId);
  if (!inv) {
    container.innerHTML = `<div class="p-8 text-center text-slate-400 text-sm">Select an invoice from the list.</div>`;
    return;
  }

  const org = BooksStore.getOrg();
  const words = numberToWordsINR(inv.total);

  let ribbonColor = "bg-slate-500";
  if (inv.status === "Paid") ribbonColor = "bg-emerald-600";
  else if (inv.status === "Overdue") ribbonColor = "bg-rose-600";
  else if (inv.status === "Partially Paid") ribbonColor = "bg-amber-600";
  else if (inv.status === "Unpaid") ribbonColor = "bg-blue-600";

  // UPI payment link & QR
  const upiUrl = `upi://pay?pa=${org.bank.upiId}&pn=${encodeURIComponent(org.name)}&am=${inv.balanceDue}&cu=INR&tn=${inv.invoiceNumber}`;
  const qrUrl = (org.bank && org.bank.qrUrl) ? org.bank.qrUrl : `https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(upiUrl)}`;

  // Digital Sign HTML (Req 6)
  let signHtml = `<div class="w-36 ml-auto border-b border-slate-400 mb-1"></div>`;
  if (org.digitalSign && org.digitalSign.enabled) {
    if (org.digitalSign.image) {
      signHtml = `<img src="${org.digitalSign.image}" alt="Digital Sign" class="h-10 ml-auto object-contain mb-1"><div class="w-36 ml-auto border-b border-slate-400 mb-1"></div>`;
    } else {
      signHtml = `<div class="font-serif italic font-bold text-sm text-[#005696] mb-1 text-right">${org.digitalSign.name || 'Authorized Signatory'}</div><div class="w-36 ml-auto border-b border-slate-400 mb-1"></div>`;
    }
  }

  // Edit History / Audit Trail (Req 3)
  const auditHtml = (inv.editHistory && inv.editHistory.length > 0) ? `
    <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-xs text-amber-900">
      <div class="flex items-center gap-1.5 font-bold mb-1">
        <i class="fas fa-history text-amber-600"></i>
        <span>Audit Revision History:</span>
      </div>
      <div class="space-y-1">
        ${inv.editHistory.map(h => `
          <div class="text-[11px] text-amber-800">
            • <strong>${h.dateFormatted || h.timestamp}</strong>: <em>"${h.reason}"</em> (Previous Total: ₹${Number(h.previousTotal).toLocaleString('en-IN')})
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  container.innerHTML = `
    <!-- Top Action Bar (Zoho Style) -->
    <div class="no-print bg-white p-3.5 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2 sticky top-0 z-20">
      <div class="flex items-center gap-2">
        <span class="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-white ${ribbonColor}">
          ${inv.status}
        </span>
        <span class="font-mono text-xs font-bold text-slate-700">${inv.invoiceNumber}</span>
      </div>

      <div class="flex items-center gap-2">
        ${inv.balanceDue > 0 ? `
          <button onclick="openInvoicePaymentModal('${inv.id}')" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5">
            <i class="fas fa-credit-card"></i> Record Payment
          </button>
        ` : ''}

        <!-- Edit Invoice Button (Req 3) -->
        <button onclick="openEditInvoiceModal('${inv.id}')" class="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#005696] rounded-lg text-xs font-bold transition flex items-center gap-1.5" title="Edit Invoice Details">
          <i class="fas fa-edit"></i> Edit Invoice
        </button>

        <button onclick="window.print()" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5">
          <i class="fas fa-print"></i> Print / PDF
        </button>

        <button onclick="sendInvoiceWhatsApp('${inv.id}')" class="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5">
          <i class="fab fa-whatsapp"></i> Send Alert
        </button>

        <button onclick="handleDeleteInvoice('${inv.id}', '${inv.invoiceNumber}')" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5" title="Delete Invoice">
          <i class="fas fa-trash-alt"></i> Delete
        </button>
      </div>
    </div>

    <!-- Zoho Books Professional Tax Invoice Paper Sheet -->
    <div class="p-6 lg:p-8 bg-slate-100 min-h-screen">
      <div id="invoice-sheet" class="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-md p-8 text-xs text-slate-800 relative">
        
        <!-- Header: Logo & Org Details -->
        <div class="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
          <div class="flex items-start gap-4">
            <img src="assets/logo.png" alt="Canford International" class="h-16 object-contain">
            <div>
              <h2 class="text-xl font-black text-[#005696] font-display">${org.name}</h2>
              <p class="text-[11px] text-slate-600">${org.address.line1}</p>
              <p class="text-[11px] text-slate-600">${org.address.city}, ${org.address.state} - ${org.address.pincode}</p>
              <p class="text-[11px] text-slate-600 mt-1">Phone: ${org.contact.phone} • Email: ${org.contact.email}</p>
              <p class="text-[10px] text-slate-500 font-mono mt-0.5">GSTIN: <span class="font-bold text-slate-700">${org.gstin}</span></p>
            </div>
          </div>

          <div class="text-right">
            <span class="text-2xl font-black tracking-tight text-slate-900 uppercase">TAX INVOICE</span>
            <div class="mt-2 space-y-1 font-mono">
              <p><span class="text-slate-500">Invoice #:</span> <strong>${inv.invoiceNumber}</strong></p>
              <p><span class="text-slate-500">Invoice Date:</span> ${inv.date}</p>
              <p><span class="text-slate-500">Due Date:</span> <strong class="${inv.status === 'Overdue' ? 'text-rose-600' : 'text-slate-800'}">${inv.dueDate}</strong></p>
            </div>
          </div>
        </div>

        <!-- Bill To Section -->
        <div class="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bill To (Candidate):</span>
            <h4 class="text-sm font-black text-slate-900 mt-1">${inv.studentName}</h4>
            <p class="text-slate-600 font-mono text-[11px]">Student ID: <strong>${inv.studentId}</strong></p>
            <p class="text-slate-600 text-[11px]">Enrolled Course: <strong>${inv.courseId.toUpperCase()}</strong></p>
          </div>
          <div class="text-right flex flex-col justify-end">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment Terms:</span>
            <p class="text-slate-800 font-medium">${inv.terms}</p>
            <div class="mt-2">
              <span class="text-xs text-slate-500">Balance Due:</span>
              <div class="text-xl font-black ${inv.balanceDue > 0 ? 'text-amber-800' : 'text-emerald-700'}">
                ₹${Number(inv.balanceDue).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        <!-- Line Items Table -->
        <table class="w-full border-collapse mb-6">
          <thead>
            <tr class="bg-[#005696] text-white uppercase text-[10px] font-bold tracking-wider">
              <th class="py-2.5 px-3 text-left w-10">#</th>
              <th class="py-2.5 px-3 text-left">Item & Description</th>
              <th class="py-2.5 px-3 text-center w-24">HSN / SAC</th>
              <th class="py-2.5 px-3 text-right w-16">Qty</th>
              <th class="py-2.5 px-3 text-right w-28">Rate (₹)</th>
              <th class="py-2.5 px-3 text-right w-28">Amount (₹)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            ${inv.items.map((item, idx) => `
              <tr class="hover:bg-slate-50">
                <td class="py-3 px-3 text-slate-400 font-mono">${idx + 1}</td>
                <td class="py-3 px-3">
                  <div class="font-bold text-slate-900">${item.name}</div>
                  <div class="text-[10px] text-slate-400">Certified Professional Training Program</div>
                </td>
                <td class="py-3 px-3 text-center font-mono text-slate-500">${item.sac || org.sacCode || '999293'}</td>
                <td class="py-3 px-3 text-right font-mono">${item.qty}</td>
                <td class="py-3 px-3 text-right font-mono">₹${Number(item.rate).toLocaleString('en-IN')}</td>
                <td class="py-3 px-3 text-right font-mono font-bold text-slate-900">₹${Number(item.amount).toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Totals & Tax Calculation -->
        <div class="flex justify-end mb-6">
          <div class="w-72 space-y-2 text-xs">
            <div class="flex justify-between text-slate-600">
              <span>Sub Total:</span>
              <span class="font-mono font-semibold">₹${Number(inv.subtotal).toLocaleString('en-IN')}</span>
            </div>
            ${inv.discount > 0 ? `
              <div class="flex justify-between text-emerald-700">
                <span>Scholarship / Discount:</span>
                <span class="font-mono font-semibold">-₹${Number(inv.discount).toLocaleString('en-IN')}</span>
              </div>
            ` : ''}
            <div class="flex justify-between text-slate-600">
              <span>CGST (9%):</span>
              <span class="font-mono">₹0.00 (Exempt/Inclusive)</span>
            </div>
            <div class="flex justify-between text-slate-600">
              <span>SGST (9%):</span>
              <span class="font-mono">₹0.00 (Exempt/Inclusive)</span>
            </div>
            <div class="border-t border-slate-300 pt-2 flex justify-between font-black text-sm text-slate-900">
              <span>Total Invoice Amount:</span>
              <span class="text-[#005696] font-mono">₹${Number(inv.total).toLocaleString('en-IN')}</span>
            </div>
            <div class="flex justify-between text-emerald-800 font-bold border-t border-slate-100 pt-1">
              <span>Payment Made:</span>
              <span class="font-mono">₹${Number(inv.amountPaid).toLocaleString('en-IN')}</span>
            </div>
            <div class="flex justify-between text-base font-black text-amber-900 bg-amber-50 p-2 rounded-lg">
              <span>Balance Due:</span>
              <span class="font-mono">₹${Number(inv.balanceDue).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <!-- Total in words -->
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-6">
          <span class="text-[10px] text-slate-400 font-bold uppercase">Total in Words:</span>
          <p class="font-bold text-slate-800 italic mt-0.5">${words}</p>
        </div>

        <!-- Audit History Section (Req 3) -->
        ${auditHtml}

        <!-- Banking & Digital Signature Footer (Req 6 & 7) -->
        <div class="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200 items-end">
          <div class="flex items-center gap-4">
            ${inv.balanceDue > 0 ? `
              <img src="${qrUrl}" alt="UPI QR" class="w-20 h-20 border p-1 rounded-xl bg-white shadow-sm">
            ` : ''}
            <div class="text-[11px] text-slate-600 space-y-0.5">
              <p class="font-bold text-slate-800 uppercase text-[10px] tracking-wider">Bank Details for NEFT / RTGS / IMPS:</p>
              <p>Bank: <strong>${org.bank.bankName}</strong> (${org.bank.branch})</p>
              <p class="font-mono">A/C No: <strong>${org.bank.accountNumber}</strong></p>
              <p class="font-mono">IFSC: <strong>${org.bank.ifsc}</strong></p>
              <p class="font-mono text-[10px]">UPI ID: <span class="font-bold text-[#005696]">${org.bank.upiId}</span></p>
            </div>
          </div>

          <div class="text-right">
            ${signHtml}
            <p class="font-bold text-slate-900 text-xs">${org.digitalSign?.name || 'Authorized Signatory'}</p>
            <p class="text-[10px] text-slate-500 uppercase">${org.digitalSign?.designation || org.name}</p>
          </div>
        </div>

      </div>
    </div>
  `;
}

// Record payment modal for invoice (Req 2: Date support)
function openInvoicePaymentModal(invoiceId) {
  const inv = BooksStore.getInvoices().find(i => i.id === invoiceId);
  if (!inv) return;

  document.getElementById("inv-pay-id").value = inv.id;
  document.getElementById("inv-pay-title").textContent = `Record Payment for ${inv.invoiceNumber}`;
  document.getElementById("inv-pay-student").textContent = `${inv.studentName} (${inv.studentId})`;
  document.getElementById("inv-pay-balance").textContent = `₹${Number(inv.balanceDue).toLocaleString('en-IN')}`;
  document.getElementById("inv-pay-amount").value = inv.balanceDue;
  document.getElementById("inv-pay-amount").max = inv.balanceDue;
  
  const dateInput = document.getElementById("inv-pay-date");
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  const modal = document.getElementById("invoice-payment-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeInvoicePaymentModal() {
  const modal = document.getElementById("invoice-payment-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function submitInvoicePayment(event) {
  event.preventDefault();
  const invId = document.getElementById("inv-pay-id").value;
  const amount = Number(document.getElementById("inv-pay-amount").value);
  const mode = document.getElementById("inv-pay-mode").value;
  const ref = document.getElementById("inv-pay-ref").value;
  const date = document.getElementById("inv-pay-date")?.value || new Date().toISOString().split('T')[0];
  const notes = document.getElementById("inv-pay-notes").value;

  try {
    const result = BooksStore.recordPaymentForInvoice({
      invoiceId: invId,
      amount: amount,
      date: date,
      mode: mode,
      reference: ref,
      notes: notes
    });

    closeInvoicePaymentModal();
    renderInvoicesList();
    renderInvoiceDetail(invId);
    showToast(`Payment of ₹${amount.toLocaleString('en-IN')} recorded on ${date}!`, "success");
    
    if (typeof refreshZohoDashboard === 'function') refreshZohoDashboard();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// Edit Invoice Handlers (Req 3)
function openEditInvoiceModal(invId) {
  const inv = BooksStore.getInvoices().find(i => i.id === invId);
  if (!inv) return;

  document.getElementById("edit-inv-id").value = inv.id;
  document.getElementById("edit-inv-title").textContent = `Edit Invoice ${inv.invoiceNumber} (${inv.studentName})`;
  document.getElementById("edit-inv-date").value = inv.date;
  document.getElementById("edit-inv-due-date").value = inv.dueDate;
  
  const firstItem = inv.items && inv.items[0] ? inv.items[0] : { name: "Course Fee", rate: inv.total };
  document.getElementById("edit-inv-item-name").value = firstItem.name;
  document.getElementById("edit-inv-item-rate").value = firstItem.rate;
  document.getElementById("edit-inv-discount").value = inv.discount || 0;
  document.getElementById("edit-inv-notes").value = inv.notes || "";
  document.getElementById("edit-inv-reason").value = "";

  const modal = document.getElementById("edit-invoice-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeEditInvoiceModal() {
  const modal = document.getElementById("edit-invoice-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function submitEditInvoice(event) {
  event.preventDefault();
  const invId = document.getElementById("edit-inv-id").value;
  const date = document.getElementById("edit-inv-date").value;
  const dueDate = document.getElementById("edit-inv-due-date").value;
  const itemName = document.getElementById("edit-inv-item-name").value;
  const itemRate = Number(document.getElementById("edit-inv-item-rate").value);
  const discount = Number(document.getElementById("edit-inv-discount").value) || 0;
  const notes = document.getElementById("edit-inv-notes").value;
  const reason = document.getElementById("edit-inv-reason").value.trim();

  if (!reason) {
    showToast("Please provide a reason for editing the invoice.", "warning");
    return;
  }

  const total = Math.max(0, itemRate - discount);

  try {
    BooksStore.editInvoice(invId, {
      date,
      dueDate,
      items: [{ name: itemName, sac: "999293", qty: 1, rate: itemRate, amount: itemRate }],
      subtotal: itemRate,
      discount: discount,
      taxableAmount: total,
      total: total,
      notes: notes
    }, reason);

    closeEditInvoiceModal();
    renderInvoicesList();
    renderInvoiceDetail(invId);
    if (typeof refreshZohoDashboard === 'function') refreshZohoDashboard();
    showToast(`Invoice updated successfully with audit trail!`, "success");
  } catch (err) {
    showToast(err.message, "error");
  }
}

// WhatsApp Invoice Alert with Dynamic QR and Template (Req 10 & Req 11)
function sendInvoiceWhatsApp(invId) {
  const inv = BooksStore.getInvoices().find(i => i.id === invId);
  if (!inv) return;

  const org = BooksStore.getOrg();
  const bank = org.bank || {};
  const qrLink = bank.qrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${bank.upiId}&pn=${encodeURIComponent(org.name)}&am=${inv.balanceDue}&cu=INR&tn=${inv.invoiceNumber}`;

  let text = org.whatsappTemplate || `*Fee Reminder - {organization_name}*\n\nDear {student_name},\nThis is a gentle reminder regarding your pending fee for *{course_name}*.\n\n• Invoice No: *{invoice_no}*\n• Outstanding Balance: *₹{balance_amount}*\n• Due Date: *{due_date}*\n\nYou can pay online via UPI to *{upi_id}* or scan the official payment QR code below:\n{qr_link}\n\nBank Transfer Details:\n• Bank: {bank_name} ({bank_branch})\n• Account No: {account_no}\n• IFSC: {ifsc_code}\n\nFor queries, call us at {contact_phone}.\n\nBest regards,\nAccounts Office\n{organization_name}`;

  text = text
    .replace(/{organization_name}/g, org.name)
    .replace(/{student_name}/g, inv.studentName)
    .replace(/{course_name}/g, inv.courseId.toUpperCase())
    .replace(/{invoice_no}/g, inv.invoiceNumber)
    .replace(/{balance_amount}/g, Number(inv.balanceDue).toLocaleString('en-IN'))
    .replace(/{due_date}/g, inv.dueDate)
    .replace(/{upi_id}/g, bank.upiId || "canford@upi")
    .replace(/{qr_link}/g, qrLink)
    .replace(/{bank_name}/g, bank.bankName || "HDFC Bank")
    .replace(/{bank_branch}/g, bank.branch || "Calicut Branch")
    .replace(/{account_no}/g, bank.accountNumber || "50200084920194")
    .replace(/{ifsc_code}/g, bank.ifsc || "HDFC0001234")
    .replace(/{contact_phone}/g, org.contact.phone || "+91 9895 577 123");

  const student = BooksStore.getStudents().find(s => s.id === inv.studentId);
  const phone = student ? student.phone.replace(/[^0-9]/g, '') : "9895577123";

  window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(text)}`, '_blank');
}

function handleDeleteInvoice(invId, invNumber) {
  if (confirm(`Are you sure you want to delete invoice "${invNumber}"?`)) {
    BooksStore.deleteInvoice(invId);
    currentSelectedInvoiceId = null;
    renderInvoicesList();
    if (typeof refreshZohoDashboard === 'function') refreshZohoDashboard();
    showToast(`Invoice ${invNumber} deleted`, "info");
  }
}
