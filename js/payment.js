// ============================================================================
// CANFORD INTERNATIONAL - PAYMENT & RECEIPT MODULE
// ============================================================================

let currentActiveStudent = null;
let currentPaymentAmount = 0;
let currentParticulars = "";
let selectedPaymentMethod = "upi";

// Convert numbers to Indian Rupees in words
function numberToWordsINR(amount) {
  const num = Math.floor(Number(amount));
  if (isNaN(num) || num === 0) return "Zero Rupees Only";

  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n) {
    if (n === 0) return '';
    let str = '';
    if (n >= 10000000) {
      str += inWords(Math.floor(n / 10000000)) + 'Crore ';
      n %= 10000000;
    }
    if (n >= 100000) {
      str += inWords(Math.floor(n / 100000)) + 'Lakh ';
      n %= 100000;
    }
    if (n >= 1000) {
      str += inWords(Math.floor(n / 1000)) + 'Thousand ';
      n %= 1000;
    }
    if (n >= 100) {
      str += inWords(Math.floor(n / 100)) + 'Hundred ';
      n %= 100;
    }
    if (n > 0) {
      if (str !== '') str += 'and ';
      if (n < 20) {
        str += a[n];
      } else {
        str += b[Math.floor(n / 10)] + ' ' + a[n % 10];
      }
    }
    return str;
  }

  return "Rupees " + inWords(num).trim() + " Only";
}

// Open Checkout Modal for a Student
function openCheckoutModal(studentId, defaultAmount = null, particulars = null) {
  const student = StudentStore.getById(studentId);
  if (!student) {
    showToast("Student record not found", "error");
    return;
  }

  currentActiveStudent = student;
  const balance = student.balanceFee;

  if (balance <= 0) {
    showToast("All fees for this course are already fully paid!", "info");
    return;
  }

  const nextInst = student.installments.find(i => i.status !== "Paid");
  const instAmount = nextInst ? nextInst.amount : balance;

  // Set amounts
  currentPaymentAmount = defaultAmount || Math.min(instAmount, balance);
  currentParticulars = particulars || (nextInst ? nextInst.name : "Course Tuition Installment");

  // Populate modal UI
  document.getElementById("checkout-student-name").textContent = student.name;
  document.getElementById("checkout-student-id").textContent = student.id;
  document.getElementById("checkout-course").textContent = student.courseName;
  document.getElementById("checkout-balance").textContent = `₹${student.balanceFee.toLocaleString('en-IN')}`;

  // Radio selection options
  const optInst = document.getElementById("opt-next-installment");
  const optInstLabel = document.getElementById("opt-next-installment-text");
  const optFull = document.getElementById("opt-full-balance");
  const optFullLabel = document.getElementById("opt-full-balance-text");
  const customInput = document.getElementById("checkout-custom-amount");

  if (nextInst && nextInst.amount < balance) {
    optInst.checked = true;
    optInst.disabled = false;
    optInstLabel.innerHTML = `<strong>Next Installment:</strong> ${nextInst.name} — <span class="text-emerald-700 font-bold">₹${nextInst.amount.toLocaleString('en-IN')}</span>`;
  } else {
    optFull.checked = true;
    optInst.disabled = true;
    optInstLabel.innerHTML = `<strong>Next Installment:</strong> <span class="text-slate-400">N/A (Final balance)</span>`;
  }

  optFullLabel.innerHTML = `<strong>Full Remaining Balance:</strong> <span class="text-emerald-700 font-bold">₹${balance.toLocaleString('en-IN')}</span>`;
  customInput.value = currentPaymentAmount;
  customInput.max = balance;

  updatePaySummary();
  selectPaymentMethod("upi");

  // Show modal
  const modal = document.getElementById("checkout-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkout-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function handleAmountOptionChange() {
  if (!currentActiveStudent) return;
  const balance = currentActiveStudent.balanceFee;
  const nextInst = currentActiveStudent.installments.find(i => i.status !== "Paid");
  const customInput = document.getElementById("checkout-custom-amount");

  if (document.getElementById("opt-next-installment").checked) {
    currentPaymentAmount = nextInst ? nextInst.amount : balance;
    currentParticulars = nextInst ? nextInst.name : "Course Installment";
    customInput.value = currentPaymentAmount;
  } else if (document.getElementById("opt-full-balance").checked) {
    currentPaymentAmount = balance;
    currentParticulars = "Full Course Fee Clearance";
    customInput.value = currentPaymentAmount;
  }
  updatePaySummary();
}

function handleCustomAmountChange(val) {
  if (!currentActiveStudent) return;
  const num = Number(val);
  const balance = currentActiveStudent.balanceFee;

  document.getElementById("opt-custom").checked = true;
  if (num > balance) {
    currentPaymentAmount = balance;
    document.getElementById("checkout-custom-amount").value = balance;
  } else if (num < 100) {
    currentPaymentAmount = 100;
  } else {
    currentPaymentAmount = num;
  }
  currentParticulars = "Custom Installment Fee Payment";
  updatePaySummary();
}

function selectPaymentMethod(method) {
  selectedPaymentMethod = method;
  const methods = ['upi', 'card', 'netbanking'];
  methods.forEach(m => {
    const btn = document.getElementById(`pay-tab-${m}`);
    const content = document.getElementById(`pay-panel-${m}`);
    if (m === method) {
      btn.className = "flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all bg-[#005696] text-white shadow-md";
      content.classList.remove("hidden");
    } else {
      btn.className = "flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all bg-slate-100 text-slate-600 hover:bg-slate-200";
      content.classList.add("hidden");
    }
  });

  if (method === 'upi') {
    updateUpiQr();
  }
}

function updatePaySummary() {
  const formatted = `₹${currentPaymentAmount.toLocaleString('en-IN')}`;
  document.getElementById("pay-btn-amount").textContent = formatted;
  document.getElementById("summary-pay-amount").textContent = formatted;
  if (selectedPaymentMethod === 'upi') {
    updateUpiQr();
  }
}

function updateUpiQr() {
  const qrImg = document.getElementById("upi-qr-image");
  if (!qrImg) return;
  const upiUrl = `upi://pay?pa=canford@upi&pn=Canford%20International&am=${currentPaymentAmount}&cu=INR&tn=FeePayment-${currentActiveStudent?.id || 'Student'}`;
  const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}&margin=1`;
  qrImg.src = qrApi;
}

// Process Payment (Simulated Gateway)
function processPayment() {
  if (!currentActiveStudent || currentPaymentAmount <= 0) return;

  const btn = document.getElementById("btn-process-payment");
  const btnOriginalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `
    <svg class="animate-spin h-5 w-5 text-white inline-block mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
    </svg>
    Connecting to Secure Gateway...
  `;

  let modeName = "UPI / QR Code";
  let txnPrefix = "UPI";
  if (selectedPaymentMethod === "card") {
    const cardNum = document.getElementById("card-number")?.value || "4532";
    modeName = `Credit/Debit Card (ending in ${cardNum.slice(-4)})`;
    txnPrefix = "CARD";
  } else if (selectedPaymentMethod === "netbanking") {
    const bank = document.getElementById("netbanking-bank")?.value || "Online Bank";
    modeName = `Net Banking (${bank})`;
    txnPrefix = "NETB";
  }

  setTimeout(() => {
    try {
      const txnId = `${txnPrefix}-${Math.floor(100000000 + Math.random() * 900000000)}`;
      const result = StudentStore.recordPayment(currentActiveStudent.id, {
        amount: currentPaymentAmount,
        particulars: currentParticulars,
        mode: modeName,
        txnId: txnId,
        notes: `Online portal payment authorized via ${modeName}`
      });

      // Reset button
      btn.disabled = false;
      btn.innerHTML = btnOriginalText;

      // Close checkout modal
      closeCheckoutModal();

      // Trigger Confetti
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      showToast(`Payment of ₹${currentPaymentAmount.toLocaleString('en-IN')} Successful!`, "success");

      // Refresh view and open receipt modal
      if (window.renderStudentPortal) {
        window.renderStudentPortal(result.student.id);
      }
      if (window.refreshAdminTable) {
        window.refreshAdminTable();
      }

      // Open official receipt view
      openReceiptModal(result.student, result.receipt);

    } catch (err) {
      console.error(err);
      btn.disabled = false;
      btn.innerHTML = btnOriginalText;
      showToast(err.message || "Payment processing failed", "error");
    }
  }, 1800);
}

// Generate & Display Official Canford Fee Receipt
function openReceiptModal(student, receiptTxn) {
  const modal = document.getElementById("receipt-modal");
  const container = document.getElementById("receipt-paper");

  const words = numberToWordsINR(receiptTxn.amount);
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  // Verification QR data URL
  const verifyData = `CANFORD-INTL-RECEIPT|${receiptTxn.receiptNo}|${student.id}|INR-${receiptTxn.amount}|DATE-${receiptTxn.date}`;
  const verifyQr = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(verifyData)}`;

  container.innerHTML = `
    <!-- Top Branding Header -->
    <div class="border-b-2 border-[#005696] pb-4 mb-5 flex flex-col md:flex-row justify-between items-center gap-4">
      <div class="flex items-center gap-4">
        <img src="assets/logo.png" alt="Canford International" class="h-14 object-contain">
        <div>
          <h1 class="text-2xl font-black tracking-tight text-[#005696]">Canford International</h1>
          <p class="text-xs uppercase tracking-wider text-[#C5A059] font-bold">Center for Global Professional Excellence</p>
        </div>
      </div>
      <div class="text-right text-xs text-slate-600">
        <p class="font-semibold text-slate-800">HiLITE Business Park, 6th Floor</p>
        <p>Calicut, Kerala - 673014</p>
        <p>Phone: <strong>+91 9895 577 123</strong> | Email: canfordinternational@gmail.com</p>
        <p>Web: <span class="text-[#005696] font-medium">www.canfordinternational.com</span></p>
      </div>
    </div>

    <!-- Receipt Header Badge -->
    <div class="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 mb-5">
      <div>
        <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Receipt Number</span>
        <div class="text-base font-black text-[#005696]">${receiptTxn.receiptNo}</div>
      </div>
      <div class="text-center">
        <span class="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full font-bold text-xs uppercase tracking-wider">
          ✓ Official Fee Receipt (Paid)
        </span>
      </div>
      <div class="text-right">
        <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Time</span>
        <div class="text-sm font-bold text-slate-800">${receiptTxn.date} at ${timeStr}</div>
      </div>
    </div>

    <!-- Student & Course Details -->
    <div class="grid grid-cols-2 gap-4 bg-white border border-slate-200 rounded-xl p-4 mb-5 text-sm">
      <div>
        <p class="text-xs text-slate-500 font-semibold uppercase">Student Information</p>
        <p class="text-base font-bold text-slate-900 mt-1">${student.name}</p>
        <p class="text-slate-600 font-mono text-xs">Student ID: <span class="font-bold text-[#005696]">${student.id}</span></p>
        <p class="text-slate-600 text-xs">Phone: +91 ${student.phone} ${student.email ? '• ' + student.email : ''}</p>
        <p class="text-slate-600 text-xs">Location: ${student.place || 'Calicut'}</p>
      </div>
      <div class="text-right">
        <p class="text-xs text-slate-500 font-semibold uppercase">Program Enrolled</p>
        <p class="text-base font-bold text-slate-900 mt-1">${student.courseName}</p>
        <p class="text-slate-600 text-xs">Batch: <span class="font-medium">${student.batch || 'Regular 2025'}</span></p>
        <p class="text-slate-600 text-xs">Admission Date: ${student.admissionDate}</p>
      </div>
    </div>

    <!-- Payment Breakdown Table -->
    <table class="w-full border-collapse mb-5 text-sm">
      <thead>
        <tr class="bg-slate-100 text-slate-700 uppercase text-xs font-bold border-y border-slate-300">
          <th class="py-2.5 px-3 text-left">Sl.</th>
          <th class="py-2.5 px-3 text-left">Particulars / Description</th>
          <th class="py-2.5 px-3 text-left">Payment Mode & Ref</th>
          <th class="py-2.5 px-3 text-right">Amount Paid</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-slate-200">
          <td class="py-3 px-3 font-medium text-slate-500">01</td>
          <td class="py-3 px-3">
            <span class="font-bold text-slate-900">${receiptTxn.particulars}</span>
            <div class="text-xs text-slate-500">${receiptTxn.notes || 'Course fee collection'}</div>
          </td>
          <td class="py-3 px-3 font-mono text-xs">
            <span class="font-bold text-slate-700">${receiptTxn.mode}</span><br>
            <span class="text-slate-500">Ref: ${receiptTxn.txnId}</span>
          </td>
          <td class="py-3 px-3 text-right font-black text-base text-slate-900">
            ₹${Number(receiptTxn.amount).toLocaleString('en-IN')}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="bg-emerald-50 text-emerald-950 font-bold border-t-2 border-emerald-400">
          <td colspan="3" class="py-2.5 px-3 text-right uppercase text-xs">Total Amount Paid in this Transaction:</td>
          <td class="py-2.5 px-3 text-right text-lg font-black text-emerald-800">
            ₹${Number(receiptTxn.amount).toLocaleString('en-IN')}
          </td>
        </tr>
      </tfoot>
    </table>

    <!-- Amount in words & Course Ledger snapshot -->
    <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-6 text-xs">
      <p class="text-slate-500 font-semibold uppercase tracking-wider">Amount in Words:</p>
      <p class="text-sm font-bold text-slate-900 italic mt-0.5">${words}</p>
    </div>

    <div class="grid grid-cols-3 gap-3 text-center border border-slate-200 rounded-xl p-3 mb-8 text-xs bg-slate-50">
      <div>
        <span class="text-slate-500 font-semibold">Total Course Fee</span>
        <p class="text-sm font-black text-slate-800 mt-0.5">₹${student.totalFee.toLocaleString('en-IN')}</p>
      </div>
      <div>
        <span class="text-slate-500 font-semibold">Total Fee Paid to Date</span>
        <p class="text-sm font-black text-emerald-700 mt-0.5">₹${student.paidFee.toLocaleString('en-IN')}</p>
      </div>
      <div>
        <span class="text-slate-500 font-semibold">Current Balance Remaining</span>
        <p class="text-sm font-black ${student.balanceFee > 0 ? 'text-amber-700' : 'text-slate-700'} mt-0.5">₹${student.balanceFee.toLocaleString('en-IN')}</p>
      </div>
    </div>

    <!-- Verification & Signatures -->
    <div class="flex justify-between items-end pt-4 border-t border-slate-200">
      <div class="flex items-center gap-3">
        <img src="${verifyQr}" alt="Verification QR" class="w-16 h-16 border p-1 rounded bg-white">
        <div class="text-[11px] text-slate-500 leading-tight">
          <p class="font-bold text-slate-700 uppercase">Tamper-Proof Digital Verification</p>
          <p>Scan QR code with any camera to</p>
          <p>verify receipt authenticity.</p>
          <p class="font-mono text-[9px] text-slate-400 mt-0.5">${receiptTxn.receiptNo}</p>
        </div>
      </div>

      <div class="text-center">
        <div class="w-32 border-b border-slate-400 mb-1"></div>
        <p class="text-xs font-bold text-slate-800">Accounts Department</p>
        <p class="text-[10px] text-[#005696] font-semibold uppercase">Canford International, Calicut</p>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeReceiptModal() {
  const modal = document.getElementById("receipt-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function printReceipt() {
  window.print();
}

function shareReceiptWhatsApp(studentId, receiptNo) {
  const student = StudentStore.getById(studentId);
  if (!student) return;
  const txn = student.paymentHistory.find(t => t.receiptNo === receiptNo) || student.paymentHistory[0];
  if (!txn) return;

  const text = `*Canford International - Official Fee Receipt*\n\n` +
    `Dear ${student.name},\n` +
    `We acknowledge receipt of ₹${Number(txn.amount).toLocaleString('en-IN')} for *${student.courseName}*.\n\n` +
    `• Receipt No: ${txn.receiptNo}\n` +
    `• Date: ${txn.date}\n` +
    `• Mode: ${txn.mode}\n` +
    `• Remaining Course Balance: ₹${student.balanceFee.toLocaleString('en-IN')}\n\n` +
    `Thank you,\nCanford International, Calicut\nHiLITE Business Park | Ph: 9895577123`;

  const cleanPhone = student.phone.replace(/[^0-9]/g, '');
  const url = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}
