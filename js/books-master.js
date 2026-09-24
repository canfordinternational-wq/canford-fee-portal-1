// ============================================================================
// CANFORD BOOKS - MASTER SETUP MODULE (COURSES, EXPENSE CATEGORIES, MODES)
// ============================================================================

let currentMasterTab = "courses";

function initMasterModule() {
  switchMasterTab('courses');
  populateCourseDropdowns();
}

function switchMasterTab(tab) {
  currentMasterTab = tab;
  const tabs = ['courses', 'categories', 'modes'];

  tabs.forEach(t => {
    const btn = document.getElementById(`master-tab-${t}`);
    const view = document.getElementById(`master-view-${t}`);
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

  if (tab === 'courses') renderCoursesMaster();
  else if (tab === 'categories') renderCategoriesMaster();
  else if (tab === 'modes') renderPaymentModesMaster();
}

// ==========================================
// 1. COURSE / PROGRAM MASTER (Req 4 & 13)
// ==========================================

function renderCoursesMaster() {
  const container = document.getElementById("master-courses-tbody");
  if (!container) return;

  const courses = BooksStore.getCourses();

  container.innerHTML = courses.map(c => `
    <tr class="hover:bg-slate-50 border-b border-slate-100 text-xs">
      <td class="py-3 px-4 font-mono font-bold text-[#005696]">${c.id}</td>
      <td class="py-3 px-4">
        <div class="font-bold text-slate-900">${c.title}</div>
        <div class="text-[10px] text-slate-400">${c.description || ''}</div>
      </td>
      <td class="py-3 px-4">
        <span class="px-2 py-0.5 bg-amber-50 text-[#C5A059] border border-amber-200 rounded font-semibold text-[10px]">
          ${c.category}
        </span>
      </td>
      <td class="py-3 px-4 text-slate-600">${c.duration}</td>
      <td class="py-3 px-4 text-right font-black font-mono text-slate-900 text-sm">
        ₹${Number(c.totalFee).toLocaleString('en-IN')}
      </td>
      <td class="py-3 px-4 text-right space-x-1">
        <button onclick="openEditCourseModal('${c.id}')" class="px-2.5 py-1 bg-blue-50 text-[#005696] hover:bg-blue-100 rounded text-xs font-bold transition">
          <i class="fas fa-edit mr-1"></i> Edit
        </button>
        <button onclick="handleDeleteCourse('${c.id}', '${c.title.replace(/'/g, "\\'")}')" class="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded text-xs transition" title="Delete Course">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function openAddCourseModal() {
  const modal = document.getElementById("add-course-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeAddCourseModal() {
  const modal = document.getElementById("add-course-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function submitAddCourse(event) {
  event.preventDefault();
  const title = document.getElementById("new-course-title").value;
  const category = document.getElementById("new-course-category").value;
  const duration = document.getElementById("new-course-duration").value;
  const totalFee = Number(document.getElementById("new-course-total").value);
  const regFee = Number(document.getElementById("new-course-reg").value) || 0;
  const tuitionFee = Number(document.getElementById("new-course-tuition").value) || 0;
  const matFee = Number(document.getElementById("new-course-materials").value) || 0;
  const desc = document.getElementById("new-course-desc").value;

  try {
    BooksStore.addCourse({
      title,
      category,
      duration,
      totalFee,
      registrationFee: regFee,
      tuitionFee: tuitionFee,
      materialsFee: matFee,
      description: desc
    });

    closeAddCourseModal();
    renderCoursesMaster();
    populateCourseDropdowns();
    showToast(`Course "${title}" added successfully!`, "success");
  } catch (err) {
    showToast(err.message, "error");
  }
}

// Edit Course Handler (Req 13)
function openEditCourseModal(courseId) {
  const course = BooksStore.getCourses().find(c => c.id === courseId);
  if (!course) return;

  document.getElementById("edit-course-id").value = course.id;
  document.getElementById("edit-course-title").value = course.title;
  document.getElementById("edit-course-category").value = course.category;
  document.getElementById("edit-course-duration").value = course.duration;
  document.getElementById("edit-course-total").value = course.totalFee;
  document.getElementById("edit-course-reg").value = course.registrationFee || 0;
  document.getElementById("edit-course-tuition").value = course.tuitionFee || 0;
  document.getElementById("edit-course-materials").value = course.materialsFee || 0;
  document.getElementById("edit-course-desc").value = course.description || "";

  const modal = document.getElementById("edit-course-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeEditCourseModal() {
  const modal = document.getElementById("edit-course-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function submitEditCourse(event) {
  event.preventDefault();
  const id = document.getElementById("edit-course-id").value;
  const title = document.getElementById("edit-course-title").value;
  const category = document.getElementById("edit-course-category").value;
  const duration = document.getElementById("edit-course-duration").value;
  const totalFee = Number(document.getElementById("edit-course-total").value);
  const regFee = Number(document.getElementById("edit-course-reg").value) || 0;
  const tuitionFee = Number(document.getElementById("edit-course-tuition").value) || 0;
  const matFee = Number(document.getElementById("edit-course-materials").value) || 0;
  const desc = document.getElementById("edit-course-desc").value;

  try {
    BooksStore.updateCourse(id, {
      title,
      category,
      duration,
      totalFee,
      registrationFee: regFee,
      tuitionFee: tuitionFee,
      materialsFee: matFee,
      description: desc
    });

    closeEditCourseModal();
    renderCoursesMaster();
    populateCourseDropdowns();
    showToast(`Course "${title}" updated successfully!`, "success");
  } catch (err) {
    showToast(err.message, "error");
  }
}

function handleDeleteCourse(id, title) {
  if (confirm(`Are you sure you want to delete course "${title}" from the master catalogue?`)) {
    BooksStore.deleteCourse(id);
    renderCoursesMaster();
    populateCourseDropdowns();
    showToast(`Course "${title}" deleted`, "info");
  }
}

// ==========================================
// 2. EXPENSE CATEGORIES MASTER (Req 4)
// ==========================================

function renderCategoriesMaster() {
  const container = document.getElementById("master-categories-list");
  if (!container) return;

  const categories = BooksStore.getCategories();
  const expenses = BooksStore.getExpenses();

  container.innerHTML = categories.map(cat => {
    const count = expenses.filter(e => e.category === cat).length;
    return `
      <div class="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition text-xs">
        <div class="flex items-center gap-2.5">
          <i class="fas fa-tag text-[#005696]"></i>
          <span class="font-bold text-slate-800">${cat}</span>
          <span class="text-[10px] text-slate-400 font-mono">(${count} expenses recorded)</span>
        </div>
        <button onclick="handleDeleteCategory('${cat.replace(/'/g, "\\'")}')" class="text-slate-400 hover:text-rose-600 p-1" title="Delete Category">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
  }).join('');
}

function submitAddCategory(event) {
  event.preventDefault();
  const input = document.getElementById("new-cat-name");
  const name = input.value.trim();
  if (name) {
    BooksStore.addCategory(name);
    input.value = "";
    renderCategoriesMaster();
    populateCategoryDropdowns();
    showToast(`Expense category "${name}" added!`, "success");
  }
}

function handleDeleteCategory(catName) {
  if (confirm(`Delete expense category "${catName}"?`)) {
    BooksStore.deleteCategory(catName);
    renderCategoriesMaster();
    populateCategoryDropdowns();
    showToast(`Category "${catName}" deleted`, "info");
  }
}

// ==========================================
// 3. PAYMENT MODES MASTER (Req 4)
// ==========================================

function renderPaymentModesMaster() {
  const container = document.getElementById("master-modes-list");
  if (!container) return;

  const modes = BooksStore.getPaymentModes();

  container.innerHTML = modes.map(m => `
    <div class="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition text-xs">
      <div class="flex items-center gap-2.5">
        <i class="fas fa-wallet text-emerald-600"></i>
        <span class="font-bold text-slate-800">${m}</span>
      </div>
      <button onclick="handleDeletePaymentMode('${m.replace(/'/g, "\\'")}')" class="text-slate-400 hover:text-rose-600 p-1" title="Delete Mode">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  `).join('');
}

function submitAddPaymentMode(event) {
  event.preventDefault();
  const input = document.getElementById("new-mode-name");
  const mode = input.value.trim();
  if (mode) {
    BooksStore.addPaymentMode(mode);
    input.value = "";
    renderPaymentModesMaster();
    populatePaymentModeDropdowns();
    showToast(`Payment mode "${mode}" added!`, "success");
  }
}

function handleDeletePaymentMode(mode) {
  if (confirm(`Delete payment mode "${mode}"?`)) {
    BooksStore.deletePaymentMode(mode);
    renderPaymentModesMaster();
    populatePaymentModeDropdowns();
    showToast(`Mode "${mode}" deleted`, "info");
  }
}

// ==========================================
// DYNAMIC DROPDOWN POPULATOR (Req 13)
// ==========================================

function populateCourseDropdowns() {
  const courses = BooksStore.getCourses();

  // Populate Add Student Course dropdown
  const studentCourseSelect = document.getElementById("new-student-course");
  if (studentCourseSelect) {
    studentCourseSelect.innerHTML = courses.map(c => `
      <option value="${c.id}">${c.title} (₹${Number(c.totalFee).toLocaleString('en-IN')})</option>
    `).join('');
  }

  // Populate Admin Filter Course dropdown
  const adminFilterSelect = document.getElementById("admin-filter-course");
  if (adminFilterSelect) {
    const curVal = adminFilterSelect.value || "all";
    adminFilterSelect.innerHTML = `<option value="all">All Programs</option>` + courses.map(c => `
      <option value="${c.id}">${c.title}</option>
    `).join('');
    adminFilterSelect.value = curVal;
  }
}

function populateCategoryDropdowns() {
  const categories = BooksStore.getCategories();
  const select = document.getElementById("new-exp-category");
  if (select) {
    select.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');
  }
}

function populatePaymentModeDropdowns() {
  const modes = BooksStore.getPaymentModes();
  const selects = [
    document.getElementById("manual-mode"),
    document.getElementById("new-student-pay-mode"),
    document.getElementById("inv-pay-mode"),
    document.getElementById("new-exp-mode")
  ];

  selects.forEach(sel => {
    if (sel) {
      sel.innerHTML = modes.map(m => `<option value="${m}">${m}</option>`).join('');
    }
  });
}
