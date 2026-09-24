// ============================================================================
// CANFORD BOOKS - SETTINGS MODULE (ORG, BANKING, DIGITAL SIGN, USERS, WHATSAPP)
// ============================================================================

let currentSettingsTab = "org";

function initSettingsModule() {
  switchSettingsTab('org');
}

function switchSettingsTab(tab) {
  currentSettingsTab = tab;
  const tabs = ['org', 'banking', 'users', 'customization', 'whatsapp'];

  tabs.forEach(t => {
    const btn = document.getElementById(`settings-tab-${t}`);
    const view = document.getElementById(`settings-view-${t}`);
    if (btn && view) {
      if (t === tab) {
        btn.className = "px-4 py-2 border-b-2 border-[#005696] font-bold text-xs text-[#005696]";
        view.classList.remove("hidden");
      } else {
        btn.className = "px-4 py-2 text-slate-500 hover:text-slate-800 font-semibold text-xs";
        view.classList.add("hidden");
      }
    }
  });

  if (tab === 'org') loadOrgSettingsForm();
  else if (tab === 'banking') loadBankingSettingsForm();
  else if (tab === 'users') renderUsersTable();
  else if (tab === 'whatsapp') loadWhatsAppTemplateForm();
}

// 1. Organization Profile Form (Req 5 & 6)
function loadOrgSettingsForm() {
  const org = BooksStore.getOrg();

  document.getElementById("set-org-name").value = org.name || "";
  document.getElementById("set-org-legal").value = org.legalName || "";
  document.getElementById("set-org-tagline").value = org.tagline || "";
  document.getElementById("set-org-gstin").value = org.gstin || "";
  document.getElementById("set-org-pan").value = org.pan || "";
  document.getElementById("set-org-sac").value = org.sacCode || "999293";
  document.getElementById("set-org-phone").value = org.contact.phone || "";
  document.getElementById("set-org-email").value = org.contact.email || "";
  document.getElementById("set-org-website").value = org.contact.website || "";
  document.getElementById("set-org-address1").value = org.address.line1 || "";
  document.getElementById("set-org-address2").value = org.address.line2 || "";
  document.getElementById("set-org-city").value = org.address.city || "Calicut";
  document.getElementById("set-org-state").value = org.address.state || "Kerala";
  document.getElementById("set-org-pincode").value = org.address.pincode || "673014";

  // Digital Sign (Req 6)
  const sign = org.digitalSign || {};
  document.getElementById("set-sign-enabled").checked = sign.enabled !== false;
  document.getElementById("set-sign-name").value = sign.name || "Authorized Accounts Officer";
  document.getElementById("set-sign-title").value = sign.designation || "Head of Finance & Admissions";

  const preview = document.getElementById("set-sign-preview");
  if (sign.image) {
    preview.innerHTML = `<img src="${sign.image}" alt="Digital Signature" class="h-12 object-contain">`;
  } else {
    preview.innerHTML = `<span class="italic text-base font-serif text-slate-800">${sign.name || 'Authorized Signatory'}</span>`;
  }
}

function saveOrgProfile(event) {
  event.preventDefault();

  const org = BooksStore.getOrg();
  const sign = org.digitalSign || {};

  BooksStore.updateOrg({
    name: document.getElementById("set-org-name").value.trim(),
    legalName: document.getElementById("set-org-legal").value.trim(),
    tagline: document.getElementById("set-org-tagline").value.trim(),
    gstin: document.getElementById("set-org-gstin").value.trim(),
    pan: document.getElementById("set-org-pan").value.trim(),
    sacCode: document.getElementById("set-org-sac").value.trim(),
    contact: {
      phone: document.getElementById("set-org-phone").value.trim(),
      email: document.getElementById("set-org-email").value.trim(),
      website: document.getElementById("set-org-website").value.trim()
    },
    address: {
      line1: document.getElementById("set-org-address1").value.trim(),
      line2: document.getElementById("set-org-address2").value.trim(),
      city: document.getElementById("set-org-city").value.trim(),
      state: document.getElementById("set-org-state").value.trim(),
      pincode: document.getElementById("set-org-pincode").value.trim(),
      country: "India"
    },
    digitalSign: {
      enabled: document.getElementById("set-sign-enabled").checked,
      name: document.getElementById("set-sign-name").value.trim(),
      designation: document.getElementById("set-sign-title").value.trim(),
      image: sign.image || ""
    }
  });

  showToast("Organization profile and digital signature updated!", "success");
  if (typeof renderInvoiceDetail === 'function' && currentSelectedInvoiceId) {
    renderInvoiceDetail(currentSelectedInvoiceId);
  }
}

function handleSignatureFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    const org = BooksStore.getOrg();
    org.digitalSign = org.digitalSign || {};
    org.digitalSign.image = dataUrl;
    BooksStore.updateOrg({ digitalSign: org.digitalSign });

    document.getElementById("set-sign-preview").innerHTML = `<img src="${dataUrl}" alt="Signature" class="h-12 object-contain">`;
    showToast("Digital signature image uploaded successfully!", "success");
  };
  reader.readAsDataURL(file);
}

// 2. Banking Details Form (Req 7 & Req 10)
function loadBankingSettingsForm() {
  const org = BooksStore.getOrg();
  const bank = org.bank || {};

  document.getElementById("set-bank-name").value = bank.bankName || "HDFC Bank";
  document.getElementById("set-bank-accname").value = bank.accountName || "Canford International";
  document.getElementById("set-bank-accno").value = bank.accountNumber || "50200084920194";
  document.getElementById("set-bank-ifsc").value = bank.ifsc || "HDFC0001234";
  document.getElementById("set-bank-branch").value = bank.branch || "Calicut Branch";
  document.getElementById("set-bank-upi").value = bank.upiId || "canford@upi";
  document.getElementById("set-bank-qr").value = bank.qrUrl || "";

  updateSettingsQrPreview();
}

function saveBankDetails(event) {
  event.preventDefault();

  BooksStore.updateBank({
    bankName: document.getElementById("set-bank-name").value.trim(),
    accountName: document.getElementById("set-bank-accname").value.trim(),
    accountNumber: document.getElementById("set-bank-accno").value.trim(),
    ifsc: document.getElementById("set-bank-ifsc").value.trim(),
    branch: document.getElementById("set-bank-branch").value.trim(),
    upiId: document.getElementById("set-bank-upi").value.trim(),
    qrUrl: document.getElementById("set-bank-qr").value.trim()
  });

  showToast("Bank and UPI details updated successfully!", "success");
  if (typeof renderInvoiceDetail === 'function' && currentSelectedInvoiceId) {
    renderInvoiceDetail(currentSelectedInvoiceId);
  }
}

function handleQrFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    document.getElementById("set-bank-qr").value = dataUrl;
    updateSettingsQrPreview(dataUrl);
    showToast("Company QR code uploaded!", "success");
  };
  reader.readAsDataURL(file);
}

function updateSettingsQrPreview(overrideUrl) {
  const upiId = document.getElementById("set-bank-upi")?.value || "canford@upi";
  const customUrl = overrideUrl || document.getElementById("set-bank-qr")?.value;
  const preview = document.getElementById("set-qr-preview");
  if (!preview) return;

  const qrSrc = customUrl || `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=${encodeURIComponent(upiId)}&pn=Canford%20International`;
  preview.innerHTML = `<img src="${qrSrc}" alt="Payment QR" class="w-32 h-32 object-contain mx-auto border p-1 rounded-xl bg-white shadow-sm">`;
}

// 3. Users & Roles Setup (Req 8)
function renderUsersTable() {
  const container = document.getElementById("settings-users-tbody");
  if (!container) return;

  const users = BooksStore.getUsers();

  container.innerHTML = users.map(u => `
    <tr class="hover:bg-slate-50 border-b border-slate-100 text-xs">
      <td class="py-3 px-4 font-mono text-slate-500 font-bold">${u.id}</td>
      <td class="py-3 px-4 font-bold text-slate-900">${u.name}</td>
      <td class="py-3 px-4 text-slate-600">${u.email}</td>
      <td class="py-3 px-4">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${u.role === 'Administrator' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-[#005696]'}">
          ${u.role}
        </span>
      </td>
      <td class="py-3 px-4">
        <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">Active</span>
      </td>
      <td class="py-3 px-4 text-right">
        <button onclick="handleDeleteUser('${u.id}', '${u.name.replace(/'/g, "\\'")}')" class="p-1 text-slate-400 hover:text-rose-600 transition" title="Delete User">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function openAddUserModal() {
  const modal = document.getElementById("add-user-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeAddUserModal() {
  const modal = document.getElementById("add-user-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function submitAddUser(event) {
  event.preventDefault();
  const name = document.getElementById("new-user-name").value.trim();
  const email = document.getElementById("new-user-email").value.trim();
  const role = document.getElementById("new-user-role").value;

  try {
    BooksStore.addUser({ name, email, role });
    closeAddUserModal();
    renderUsersTable();
    showToast(`User ${name} added successfully!`, "success");
  } catch (err) {
    showToast(err.message, "error");
  }
}

function handleDeleteUser(id, name) {
  if (confirm(`Remove staff access for ${name}?`)) {
    BooksStore.deleteUser(id);
    renderUsersTable();
    showToast(`User ${name} removed`, "info");
  }
}

// 4. WhatsApp Message Customization & Template Editor (Req 10 & Req 11)
function loadWhatsAppTemplateForm() {
  const org = BooksStore.getOrg();
  const tplArea = document.getElementById("set-whatsapp-template");
  if (!tplArea) return;

  tplArea.value = org.whatsappTemplate || DEFAULT_WHATSAPP_TEMPLATE;
  updateWhatsAppPreview();
}

function insertTemplateTag(tag) {
  const tplArea = document.getElementById("set-whatsapp-template");
  if (!tplArea) return;

  const start = tplArea.selectionStart;
  const end = tplArea.selectionEnd;
  const text = tplArea.value;
  tplArea.value = text.substring(0, start) + tag + text.substring(end);
  tplArea.focus();
  tplArea.selectionStart = tplArea.selectionEnd = start + tag.length;
  updateWhatsAppPreview();
}

function updateWhatsAppPreview() {
  const tplArea = document.getElementById("set-whatsapp-template");
  const previewDiv = document.getElementById("set-whatsapp-preview");
  if (!tplArea || !previewDiv) return;

  const org = BooksStore.getOrg();
  const bank = org.bank || {};
  const qrLink = bank.qrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${bank.upiId}&pn=${encodeURIComponent(org.name)}&am=20000`;

  let previewText = tplArea.value
    .replace(/{organization_name}/g, org.name)
    .replace(/{student_name}/g, "Brisa C Briji")
    .replace(/{course_name}/g, "CMA USA Part 2")
    .replace(/{invoice_no}/g, "INV-2025-002")
    .replace(/{balance_amount}/g, "20,000")
    .replace(/{due_date}/g, "15-Oct-2026")
    .replace(/{upi_id}/g, bank.upiId || "canford@upi")
    .replace(/{qr_link}/g, qrLink)
    .replace(/{bank_name}/g, bank.bankName || "HDFC Bank")
    .replace(/{bank_branch}/g, bank.branch || "Calicut Branch")
    .replace(/{account_no}/g, bank.accountNumber || "50200084920194")
    .replace(/{ifsc_code}/g, bank.ifsc || "HDFC0001234")
    .replace(/{contact_phone}/g, org.contact.phone || "+91 9895 577 123");

  previewDiv.textContent = previewText;
}

function saveWhatsAppTemplate(event) {
  event.preventDefault();
  const tpl = document.getElementById("set-whatsapp-template").value;
  BooksStore.updateWhatsAppTemplate(tpl);
  showToast("WhatsApp reminder template saved!", "success");
}

function resetWhatsAppTemplateDefault() {
  if (confirm("Reset WhatsApp message template to default?")) {
    document.getElementById("set-whatsapp-template").value = DEFAULT_WHATSAPP_TEMPLATE;
    updateWhatsAppPreview();
    BooksStore.updateWhatsAppTemplate(DEFAULT_WHATSAPP_TEMPLATE);
    showToast("Template reset to default", "info");
  }
}
