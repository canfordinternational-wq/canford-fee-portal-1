// ============================================================================
// CANFORD BOOKS - CORE ACCOUNTING DATA ENGINE (ZOHO BOOKS ARCHITECTURE)
// ============================================================================

const DEFAULT_COURSES_LIST = [
  {
    id: "cma-usa-comp",
    title: "CMA USA (Part 1 & Part 2 Comprehensive)",
    category: "International Certification",
    duration: "9 - 12 Months",
    totalFee: 85000,
    registrationFee: 15000,
    tuitionFee: 55000,
    materialsFee: 15000,
    description: "Certified Management Accountant (IMA USA). Globally recognized benchmark for financial professionals."
  },
  {
    id: "cma-usa-p2",
    title: "CMA USA Part 2 (Strategic Financial Management)",
    category: "International Certification",
    duration: "4 - 6 Months",
    totalFee: 45000,
    registrationFee: 10000,
    tuitionFee: 25000,
    materialsFee: 10000,
    description: "Specialized coaching for Part 2: Corporate Finance, Risk Management, Decision Analysis."
  },
  {
    id: "cma-usa-p1",
    title: "CMA USA Part 1 (Financial Planning & Analytics)",
    category: "International Certification",
    duration: "4 - 6 Months",
    totalFee: 45000,
    registrationFee: 10000,
    tuitionFee: 25000,
    materialsFee: 10000,
    description: "Foundational mastery in Cost Management, Internal Controls, Technology, Reporting."
  },
  {
    id: "ifrs-dip",
    title: "Diploma in IFRS (ACCA / IAAP UK Certified)",
    category: "Professional Accounting",
    duration: "3 - 4 Months",
    totalFee: 38000,
    registrationFee: 8000,
    tuitionFee: 22000,
    materialsFee: 8000,
    description: "International Financial Reporting Standards certification accredited with IAAP UK and ACCA standards."
  },
  {
    id: "biz-analytics",
    title: "Executive Business Analytics & Financial AI",
    category: "Data & Finance",
    duration: "4 Months",
    totalFee: 50000,
    registrationFee: 10000,
    tuitionFee: 32000,
    materialsFee: 8000,
    description: "Data analytics, Power BI, Python for finance, and AI workflows for financial leadership."
  }
];

const DEFAULT_EXPENSE_CATEGORIES = [
  "Advertising & Marketing",
  "IT & Software Subscriptions",
  "Legal & Professional Fees",
  "Telephone & Internet",
  "Course Materials & Licensing",
  "Printing & Stationery",
  "Rent & Utilities",
  "Office Administration"
];

const DEFAULT_PAYMENT_MODES = [
  "Bank Transfer (NEFT/RTGS)",
  "UPI / PhonePe / GPay",
  "Cash / Direct Office",
  "Cheque / DD",
  "POS Card Swipe"
];

const DEFAULT_USERS = [
  { id: "USR-001", name: "Fathima", email: "fathi@canfordinternational.com", role: "Administrator", status: "Active" },
  { id: "USR-002", name: "Nesrin", email: "accounts@canfordinternational.com", role: "Accounts Officer", status: "Active" },
  { id: "USR-003", name: "Admissions Desk", email: "info@canfordinternational.com", role: "Counselor", status: "Active" }
];

const DEFAULT_WHATSAPP_TEMPLATE = `*Fee Reminder - {organization_name}*

Dear {student_name},
Greetings from {organization_name}, Calicut.

This is a gentle reminder regarding your pending fee installment for *{course_name}*.

• Invoice No: *{invoice_no}*
• Outstanding Balance: *₹{balance_amount}*
• Due Date: *{due_date}*

You can scan and pay via our official UPI QR code below:
{qr_link}

*Bank Transfer Details:*
• Bank: {bank_name} ({bank_branch})
• A/C No: {account_no}
• IFSC: {ifsc_code}
• Primary UPI: {upi_id}

For assistance, please contact our accounts desk at {contact_phone}.

Best regards,
Accounts Department
{organization_name}`;

const CANFORD_ORG = {
  name: "Canford International",
  tagline: "Center for Global Professional Excellence",
  legalName: "Canford International Institute LLP",
  gstin: "32AAAAA0000A1Z5",
  pan: "AAAAA0000A",
  sacCode: "999293", // Commercial Training & Coaching Services
  address: {
    line1: "HiLITE Business Park, 6th Floor",
    line2: "HiLITE City, Kozhikode Bypass",
    city: "Calicut",
    state: "Kerala",
    pincode: "673014",
    country: "India"
  },
  contact: {
    phone: "+91 9895 577 123",
    email: "canfordinternational@gmail.com",
    website: "www.canfordinternational.com"
  },
  bank: {
    accountName: "Canford International",
    bankName: "HDFC Bank",
    accountNumber: "50200084920194",
    ifsc: "HDFC0001234",
    branch: "Calicut Branch",
    upiId: "canford@upi",
    qrUrl: ""
  },
  digitalSign: {
    enabled: true,
    type: "typed", // 'typed' or 'image'
    name: "Authorized Accounts Officer",
    designation: "Head of Finance & Admissions",
    image: ""
  },
  whatsappTemplate: DEFAULT_WHATSAPP_TEMPLATE,
  currency: "INR",
  currencySymbol: "₹"
};

// Initial Seed Invoices
const SEED_INVOICES = [
  {
    id: "INV-2025-001",
    invoiceNumber: "INV-2025-001",
    studentId: "CAN-2025-001",
    studentName: "Brisa C Briji",
    courseId: "cma-usa-p2",
    date: "2025-04-12",
    dueDate: "2025-04-12",
    status: "Paid",
    items: [
      { name: "CMA USA Part 2 Admission & Tuition", sac: "999293", qty: 1, rate: 25000, amount: 25000 },
      { name: "Hock International 2025 Book & LMS Provisioning", sac: "999293", qty: 1, rate: 10000, amount: 10000 }
    ],
    subtotal: 35000,
    discount: 10000,
    taxableAmount: 25000,
    cgst: 0,
    sgst: 0,
    total: 25000,
    amountPaid: 25000,
    balanceDue: 0,
    notes: "Part 1 of 2 installments. Admission confirmed.",
    terms: "Payment is due upon receipt. Hock 2025 materials provided.",
    editHistory: []
  },
  {
    id: "INV-2025-002",
    invoiceNumber: "INV-2025-002",
    studentId: "CAN-2025-001",
    studentName: "Brisa C Briji",
    courseId: "cma-usa-p2",
    date: "2025-08-01",
    dueDate: "2026-10-15",
    status: "Unpaid",
    items: [
      { name: "CMA USA Part 2 Final Clearance & Mock Exam Prep", sac: "999293", qty: 1, rate: 20000, amount: 20000 }
    ],
    subtotal: 20000,
    discount: 0,
    taxableAmount: 20000,
    cgst: 0,
    sgst: 0,
    total: 20000,
    amountPaid: 0,
    balanceDue: 20000,
    notes: "Installment 2. Exam registration support & mock evaluation.",
    terms: "Due on or before October 15, 2026.",
    editHistory: []
  },
  {
    id: "INV-2025-003",
    invoiceNumber: "INV-2025-003",
    studentId: "CAN-2025-002",
    studentName: "Musawir K",
    courseId: "cma-usa-comp",
    date: "2025-02-10",
    dueDate: "2025-06-20",
    status: "Paid",
    items: [
      { name: "CMA USA Comprehensive Program (Parts 1 & 2)", sac: "999293", qty: 1, rate: 70000, amount: 70000 },
      { name: "Hock 2025 Complete Study Kit & IMA Exam Support", sac: "999293", qty: 1, rate: 15000, amount: 15000 }
    ],
    subtotal: 85000,
    discount: 0,
    taxableAmount: 85000,
    cgst: 0,
    sgst: 0,
    total: 85000,
    amountPaid: 85000,
    balanceDue: 0,
    notes: "All 3 installments fully paid. Full fee clearance issued.",
    terms: "Full course clearance issued.",
    editHistory: []
  },
  {
    id: "INV-2025-004",
    invoiceNumber: "INV-2025-004",
    studentId: "CAN-2025-003",
    studentName: "Ameena Sherin",
    courseId: "cma-usa-comp",
    date: "2025-05-02",
    dueDate: "2026-08-30",
    status: "Overdue",
    items: [
      { name: "CMA USA Part 1 & Part 2 Comprehensive Coaching", sac: "999293", qty: 1, rate: 65000, amount: 65000 },
      { name: "Hock 2025 Study System & Mock Tests", sac: "999293", qty: 1, rate: 20000, amount: 20000 }
    ],
    subtotal: 85000,
    discount: 0,
    taxableAmount: 85000,
    cgst: 0,
    sgst: 0,
    total: 85000,
    amountPaid: 35000,
    balanceDue: 50000,
    notes: "Installment 1 paid (₹35,000). Installment 2 (₹25,000) was due on 30-Aug-2026.",
    terms: "Please clear pending installment to maintain LMS access.",
    editHistory: []
  },
  {
    id: "INV-2025-005",
    invoiceNumber: "INV-2025-005",
    studentId: "CAN-2025-004",
    studentName: "Dilshad M",
    courseId: "ifrs-dip",
    date: "2025-06-01",
    dueDate: "2026-09-25",
    status: "Unpaid",
    items: [
      { name: "Diploma in IFRS (ACCA / IAAP UK Curriculum)", sac: "999293", qty: 1, rate: 38000, amount: 38000 }
    ],
    subtotal: 38000,
    discount: 0,
    taxableAmount: 38000,
    cgst: 0,
    sgst: 0,
    total: 38000,
    amountPaid: 0,
    balanceDue: 38000,
    notes: "Admission fee pending.",
    terms: "Payment due within 15 days of batch commencement.",
    editHistory: []
  },
  {
    id: "INV-2025-006",
    invoiceNumber: "INV-2025-006",
    studentId: "CAN-2025-005",
    studentName: "Amal Hadi",
    courseId: "biz-analytics",
    date: "2025-05-15",
    dueDate: "2026-10-20",
    status: "Partially Paid",
    items: [
      { name: "Executive Business Analytics & Financial AI", sac: "999293", qty: 1, rate: 50000, amount: 50000 }
    ],
    subtotal: 50000,
    discount: 0,
    taxableAmount: 50000,
    cgst: 0,
    sgst: 0,
    total: 50000,
    amountPaid: 25000,
    balanceDue: 25000,
    notes: "Installment 1 paid. Installment 2 due in October.",
    terms: "Course access active.",
    editHistory: []
  }
];

// Seed Payments Received
const SEED_PAYMENTS = [
  {
    id: "PAY-2025-001",
    paymentNumber: "PAY-2025-001",
    studentId: "CAN-2025-001",
    studentName: "Brisa C Briji",
    invoiceId: "INV-2025-001",
    date: "2025-04-12",
    amount: 25000,
    mode: "Bank Transfer (NEFT)",
    reference: "NEFT-SBIN482910",
    account: "HDFC Bank Operating A/C",
    receiptNo: "REC-2025-0104",
    notes: "Admission fee & Hock 2025 book access verified"
  },
  {
    id: "PAY-2025-002",
    paymentNumber: "PAY-2025-002",
    studentId: "CAN-2025-002",
    studentName: "Musawir K",
    invoiceId: "INV-2025-003",
    date: "2025-02-10",
    amount: 35000,
    mode: "UPI / Google Pay",
    reference: "UPI-482910848201",
    account: "HDFC Bank Operating A/C",
    receiptNo: "REC-2025-0082",
    notes: "Full admission package"
  },
  {
    id: "PAY-2025-003",
    paymentNumber: "PAY-2025-003",
    studentId: "CAN-2025-002",
    studentName: "Musawir K",
    invoiceId: "INV-2025-003",
    date: "2025-04-14",
    amount: 25000,
    mode: "Debit Card",
    reference: "CARD-AUTH-92810",
    account: "HDFC Bank Operating A/C",
    receiptNo: "REC-2025-0145",
    notes: "Part 1 Hock materials clearance"
  },
  {
    id: "PAY-2025-004",
    paymentNumber: "PAY-2025-004",
    studentId: "CAN-2025-002",
    studentName: "Musawir K",
    invoiceId: "INV-2025-003",
    date: "2025-06-18",
    amount: 25000,
    mode: "Net Banking",
    reference: "HDFC-TXN-820194",
    account: "HDFC Bank Operating A/C",
    receiptNo: "REC-2025-0210",
    notes: "Part 2 final clearance"
  },
  {
    id: "PAY-2025-005",
    paymentNumber: "PAY-2025-005",
    studentId: "CAN-2025-003",
    studentName: "Ameena Sherin",
    invoiceId: "INV-2025-004",
    date: "2025-05-02",
    amount: 35000,
    mode: "UPI / PhonePe",
    reference: "UPI-9102839201",
    account: "HDFC Bank Operating A/C",
    receiptNo: "REC-2025-0160",
    notes: "Admission package"
  },
  {
    id: "PAY-2025-006",
    paymentNumber: "PAY-2025-006",
    studentId: "CAN-2025-005",
    studentName: "Amal Hadi",
    invoiceId: "INV-2025-006",
    date: "2025-05-15",
    amount: 25000,
    mode: "UPI / Paytm",
    reference: "PTM-93019842",
    account: "HDFC Bank Operating A/C",
    receiptNo: "REC-2025-0185",
    notes: "Registration & Tool setup"
  }
];

// Seed Operating Expenses
const SEED_EXPENSES = [
  {
    id: "EXP-2025-001",
    date: "2025-02-15",
    category: "Legal & Professional Fees",
    particulars: "Trade Mark Registration",
    vendor: "IPR India Consultant",
    amount: 10700,
    paidThrough: "Bank Transfer",
    reference: "NEFT-TM-01",
    notes: "Official trademark application for Canford International brand"
  },
  {
    id: "EXP-2025-002",
    date: "2025-04-05",
    category: "Telephone & Internet",
    particulars: "New SIM Card Connection",
    vendor: "Telecom Provider",
    amount: 300,
    paidThrough: "Cash",
    reference: "CASH-SIM",
    notes: "Dedicated admissions enquiry line"
  },
  {
    id: "EXP-2025-003",
    date: "2025-04-26",
    category: "Telephone & Internet",
    particulars: "Phone Bill (April)",
    vendor: "Jio / Airtel Telecom",
    amount: 194.27,
    paidThrough: "UPI",
    reference: "UPI-TEL-APR",
    notes: "Monthly office telephone bill"
  },
  {
    id: "EXP-2025-004",
    date: "2025-04-28",
    category: "IT & Software Subscriptions",
    particulars: "Domain Purchase (canfordinternational.com)",
    vendor: "GoDaddy / Namecheap",
    amount: 1300,
    paidThrough: "Card",
    reference: "CARD-DOM-28",
    notes: "Official institution domain renewal"
  },
  {
    id: "EXP-2025-005",
    date: "2025-04-28",
    category: "Advertising & Marketing",
    particulars: "Digital Marketing Campaign",
    vendor: "Meta / Instagram Ads",
    amount: 500,
    paidThrough: "UPI",
    reference: "META-AD-01",
    notes: "Ad spend for Calicut CMA batch"
  },
  {
    id: "EXP-2025-006",
    date: "2025-04-30",
    category: "Advertising & Marketing",
    particulars: "Digital Marketing Campaign",
    vendor: "Meta / Instagram Ads",
    amount: 800,
    paidThrough: "UPI",
    reference: "META-AD-02",
    notes: "Calicut / Malappuram student lead campaigns"
  },
  {
    id: "EXP-2025-007",
    date: "2025-05-15",
    category: "IT & Software Subscriptions",
    particulars: "Website Development Advance",
    vendor: "Web Developer Agency",
    amount: 7500,
    paidThrough: "Bank Transfer",
    reference: "NEFT-WEB-1",
    notes: "Phase 1 institutional website & portal development"
  },
  {
    id: "EXP-2025-008",
    date: "2025-05-19",
    category: "Telephone & Internet",
    particulars: "Phone Bill (May)",
    vendor: "Jio / Airtel Telecom",
    amount: 429.82,
    paidThrough: "UPI",
    reference: "UPI-TEL-MAY",
    notes: "Office admissions line usage"
  },
  {
    id: "EXP-2025-009",
    date: "2025-06-15",
    category: "Advertising & Marketing",
    particulars: "Leads Generation Campaign",
    vendor: "Marketing Agency",
    amount: 3000,
    paidThrough: "Bank Transfer",
    reference: "NEFT-LEADS-01",
    notes: "CMA & IFRS student candidate leads"
  },
  {
    id: "EXP-2025-010",
    date: "2025-06-28",
    category: "IT & Software Subscriptions",
    particulars: "Website Development Final Settlement",
    vendor: "Web Developer Agency",
    amount: 5000,
    paidThrough: "Bank Transfer",
    reference: "NEFT-WEB-2",
    notes: "Phase 2 website deployment and LMS integration"
  },
  {
    id: "EXP-2025-011",
    date: "2025-06-28",
    category: "Course Materials & Licensing",
    particulars: "LMS Access Licenses",
    vendor: "EdTech LMS Provider",
    amount: 5000,
    paidThrough: "Bank Transfer",
    reference: "NEFT-LMS-01",
    notes: "Online test portal and video lectures portal setup"
  },
  {
    id: "EXP-2025-012",
    date: "2025-07-06",
    category: "Advertising & Marketing",
    particulars: "Digital Marketing (Video Production)",
    vendor: "Freelance Video Editor",
    amount: 500,
    paidThrough: "UPI",
    reference: "UPI-VID-01",
    notes: "Reels & student testimonial promo video"
  },
  {
    id: "EXP-2025-013",
    date: "2025-07-10",
    category: "Advertising & Marketing",
    particulars: "Digital Marketing (Video Promotion)",
    vendor: "Meta Ads",
    amount: 499,
    paidThrough: "UPI",
    reference: "UPI-VID-02",
    notes: "Instagram sponsored reels campaign"
  },
  {
    id: "EXP-2025-014",
    date: "2025-07-10",
    category: "Printing & Stationery",
    particulars: "Brochures & Marketing Materials",
    vendor: "Calicut Commercial Printers",
    amount: 1000,
    paidThrough: "Cash",
    reference: "CASH-BR-01",
    notes: "CMA USA and IFRS high quality print brochures"
  },
  {
    id: "EXP-2025-015",
    date: "2025-07-14",
    category: "Telephone & Internet",
    particulars: "Phone Bill (June)",
    vendor: "Telecom Provider",
    amount: 647.82,
    paidThrough: "UPI",
    reference: "UPI-TEL-JUN",
    notes: "Office phone bills"
  },
  {
    id: "EXP-2025-016",
    date: "2025-08-20",
    category: "Telephone & Internet",
    particulars: "Phone Bill (July)",
    vendor: "Telecom Provider",
    amount: 647.82,
    paidThrough: "UPI",
    reference: "UPI-TEL-JUL",
    notes: "Office phone bills"
  }
];

// Unified Zoho Books Storage Controller
const ZOHO_STORAGE_KEY = "canford_zoho_books_v1";

const BooksStore = {
  data: null,

  init() {
    try {
      const raw = localStorage.getItem(ZOHO_STORAGE_KEY);
      if (raw) {
        this.data = JSON.parse(raw);
      }
    } catch (e) {
      console.error("Failed reading books data from storage", e);
    }

    if (!this.data) {
      this.data = {};
    }

    // Safeguards for new fields
    this.data.org = this.data.org || CANFORD_ORG;
    this.data.org.bank = this.data.org.bank || CANFORD_ORG.bank;
    this.data.org.digitalSign = this.data.org.digitalSign || CANFORD_ORG.digitalSign;
    this.data.org.whatsappTemplate = this.data.org.whatsappTemplate || CANFORD_ORG.whatsappTemplate;
    this.data.courses = this.data.courses || DEFAULT_COURSES_LIST;
    this.data.categories = this.data.categories || DEFAULT_EXPENSE_CATEGORIES;
    this.data.paymentModes = this.data.paymentModes || DEFAULT_PAYMENT_MODES;
    this.data.users = this.data.users || DEFAULT_USERS;
    this.data.students = typeof StudentStore !== 'undefined' ? StudentStore.getAll() : (this.data.students || []);
    this.data.invoices = this.data.invoices || SEED_INVOICES;
    this.data.payments = this.data.payments || SEED_PAYMENTS;
    this.data.expenses = this.data.expenses || SEED_EXPENSES;

    this.save();
    return this.data;
  },

  save() {
    try {
      localStorage.setItem(ZOHO_STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error("Failed saving books data", e);
    }
  },

  resetDefaults() {
    this.data = {
      org: CANFORD_ORG,
      courses: DEFAULT_COURSES_LIST,
      categories: DEFAULT_EXPENSE_CATEGORIES,
      paymentModes: DEFAULT_PAYMENT_MODES,
      users: DEFAULT_USERS,
      students: typeof StudentStore !== 'undefined' ? StudentStore.resetToDefault() : [],
      invoices: SEED_INVOICES,
      payments: SEED_PAYMENTS,
      expenses: SEED_EXPENSES
    };
    this.save();
    return this.data;
  },

  // Getters
  getInvoices() { return this.data.invoices || []; },
  getPayments() { return this.data.payments || []; },
  getExpenses() { return this.data.expenses || []; },
  getStudents() { return typeof StudentStore !== 'undefined' ? StudentStore.getAll() : (this.data.students || []); },
  getCourses() { return this.data.courses || DEFAULT_COURSES_LIST; },
  getCategories() { return this.data.categories || DEFAULT_EXPENSE_CATEGORIES; },
  getPaymentModes() { return this.data.paymentModes || DEFAULT_PAYMENT_MODES; },
  getUsers() { return this.data.users || DEFAULT_USERS; },
  getOrg() { return this.data.org || CANFORD_ORG; },

  // Organization Updates (Req 5, 6, 7, 10, 11)
  updateOrg(newOrg) {
    this.data.org = { ...this.data.org, ...newOrg };
    this.save();
    return this.data.org;
  },

  updateBank(newBank) {
    this.data.org.bank = { ...this.data.org.bank, ...newBank };
    this.save();
    return this.data.org.bank;
  },

  updateDigitalSign(newSign) {
    this.data.org.digitalSign = { ...this.data.org.digitalSign, ...newSign };
    this.save();
    return this.data.org.digitalSign;
  },

  updateWhatsAppTemplate(tpl) {
    this.data.org.whatsappTemplate = tpl;
    this.save();
    return this.data.org.whatsappTemplate;
  },

  // Courses Master (Req 4 & 13)
  addCourse(course) {
    const courses = this.getCourses();
    const id = course.id || course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCourse = {
      id: id,
      title: course.title,
      category: course.category || "Professional Certification",
      duration: course.duration || "6 Months",
      totalFee: Number(course.totalFee) || 50000,
      registrationFee: Number(course.registrationFee) || 10000,
      tuitionFee: Number(course.tuitionFee) || 30000,
      materialsFee: Number(course.materialsFee) || 10000,
      description: course.description || ""
    };
    courses.push(newCourse);
    this.data.courses = courses;
    this.save();
    return newCourse;
  },

  updateCourse(id, courseData) {
    const courses = this.getCourses();
    const idx = courses.findIndex(c => c.id === id);
    if (idx !== -1) {
      courses[idx] = { ...courses[idx], ...courseData };
      this.data.courses = courses;
      this.save();
      return courses[idx];
    }
    throw new Error("Course not found");
  },

  deleteCourse(id) {
    this.data.courses = this.getCourses().filter(c => c.id !== id);
    this.save();
    return this.data.courses;
  },

  // Expense Categories Master (Req 4)
  addCategory(name) {
    const clean = String(name).trim();
    if (!clean) return;
    if (!this.data.categories.includes(clean)) {
      this.data.categories.push(clean);
      this.save();
    }
    return this.data.categories;
  },

  deleteCategory(name) {
    this.data.categories = this.data.categories.filter(c => c !== name);
    this.save();
    return this.data.categories;
  },

  // Payment Modes Master (Req 4)
  addPaymentMode(mode) {
    const clean = String(mode).trim();
    if (!clean) return;
    if (!this.data.paymentModes.includes(clean)) {
      this.data.paymentModes.push(clean);
      this.save();
    }
    return this.data.paymentModes;
  },

  deletePaymentMode(mode) {
    this.data.paymentModes = this.data.paymentModes.filter(m => m !== mode);
    this.save();
    return this.data.paymentModes;
  },

  // Users & Roles Setup (Req 8)
  addUser(userData) {
    const users = this.getUsers();
    const id = `USR-${String(users.length + 1).padStart(3, '0')}`;
    const newUser = {
      id: id,
      name: userData.name,
      email: userData.email,
      role: userData.role || "Staff",
      status: "Active"
    };
    users.push(newUser);
    this.data.users = users;
    this.save();
    return newUser;
  },

  deleteUser(id) {
    this.data.users = this.getUsers().filter(u => u.id !== id);
    this.save();
    return this.data.users;
  },

  // Financial Metrics
  getMetrics() {
    const invoices = this.getInvoices();
    const payments = this.getPayments();
    const expenses = this.getExpenses();

    const totalInvoiced = invoices.reduce((s, i) => s + (Number(i.total) || 0), 0);
    const totalCollected = payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
    const totalReceivables = invoices.reduce((s, i) => s + (Number(i.balanceDue) || 0), 0);

    const today = new Date();
    const overdueInvoices = invoices.filter(i => i.balanceDue > 0 && new Date(i.dueDate) < today);
    const totalOverdue = overdueInvoices.reduce((s, i) => s + i.balanceDue, 0);
    const currentReceivables = Math.max(0, totalReceivables - totalOverdue);

    const totalExpenses = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
    const netProfit = totalCollected - totalExpenses;

    return {
      totalInvoiced,
      totalCollected,
      totalReceivables,
      currentReceivables,
      totalOverdue,
      overdueCount: overdueInvoices.length,
      totalExpenses,
      netProfit,
      invoiceCount: invoices.length,
      studentCount: this.getStudents().length
    };
  },

  // Add Invoice (Req 2: Date support)
  addInvoice(inv) {
    const id = `INV-${new Date().getFullYear()}-${String(this.data.invoices.length + 1).padStart(3, '0')}`;
    const newInv = {
      id: id,
      invoiceNumber: id,
      studentId: inv.studentId,
      studentName: inv.studentName,
      courseId: inv.courseId,
      date: inv.date || new Date().toISOString().split('T')[0],
      dueDate: inv.dueDate,
      status: "Unpaid",
      items: inv.items,
      subtotal: inv.subtotal,
      discount: inv.discount || 0,
      taxableAmount: inv.taxableAmount,
      cgst: inv.cgst || 0,
      sgst: inv.sgst || 0,
      total: inv.total,
      amountPaid: 0,
      balanceDue: inv.total,
      notes: inv.notes || "Official course fee invoice",
      terms: inv.terms || "Payable upon receipt",
      editHistory: []
    };

    this.data.invoices.unshift(newInv);
    this.save();
    return newInv;
  },

  // Edit Invoice with Audit Reason (Req 3)
  editInvoice(invoiceId, updatedFields, reason) {
    const inv = this.data.invoices.find(i => i.id === invoiceId);
    if (!inv) throw new Error("Invoice not found");

    if (!reason || !reason.trim()) {
      throw new Error("A reason for editing the invoice is mandatory for compliance.");
    }

    const previousTotal = inv.total;
    const previousBalance = inv.balanceDue;

    inv.date = updatedFields.date || inv.date;
    inv.dueDate = updatedFields.dueDate || inv.dueDate;
    if (updatedFields.items) inv.items = updatedFields.items;
    if (updatedFields.subtotal !== undefined) inv.subtotal = updatedFields.subtotal;
    if (updatedFields.discount !== undefined) inv.discount = updatedFields.discount;
    if (updatedFields.taxableAmount !== undefined) inv.taxableAmount = updatedFields.taxableAmount;
    if (updatedFields.total !== undefined) inv.total = updatedFields.total;
    if (updatedFields.notes !== undefined) inv.notes = updatedFields.notes;
    if (updatedFields.terms !== undefined) inv.terms = updatedFields.terms;

    // Recalculate balance due
    inv.balanceDue = Math.max(0, inv.total - (Number(inv.amountPaid) || 0));
    inv.status = inv.balanceDue === 0 ? "Paid" : (inv.amountPaid > 0 ? "Partially Paid" : "Unpaid");

    inv.editHistory = inv.editHistory || [];
    inv.editHistory.unshift({
      timestamp: new Date().toISOString(),
      dateFormatted: new Date().toLocaleString('en-IN'),
      reason: reason.trim(),
      previousTotal: previousTotal,
      newTotal: inv.total,
      editor: "Accounts Office"
    });

    this.save();
    return inv;
  },

  // Record Payment (Req 2: Date support)
  recordPaymentForInvoice(paymentData) {
    const invoice = this.data.invoices.find(i => i.id === paymentData.invoiceId);
    if (!invoice) throw new Error("Invoice not found");

    const amount = Number(paymentData.amount);
    if (isNaN(amount) || amount <= 0) throw new Error("Invalid payment amount");

    invoice.amountPaid += amount;
    invoice.balanceDue = Math.max(0, invoice.total - invoice.amountPaid);
    invoice.status = invoice.balanceDue === 0 ? "Paid" : "Partially Paid";

    const payId = `PAY-${new Date().getFullYear()}-${String(this.data.payments.length + 1).padStart(3, '0')}`;
    const newPayment = {
      id: payId,
      paymentNumber: payId,
      studentId: invoice.studentId,
      studentName: invoice.studentName,
      invoiceId: invoice.id,
      date: paymentData.date || new Date().toISOString().split('T')[0],
      amount: amount,
      mode: paymentData.mode || "Bank Transfer",
      reference: paymentData.reference || `REF-${Date.now().toString().slice(-6)}`,
      account: paymentData.account || "HDFC Bank Operating A/C",
      receiptNo: `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: paymentData.notes || "Fee collection applied to invoice"
    };

    this.data.payments.unshift(newPayment);

    // Sync StudentStore
    if (typeof StudentStore !== 'undefined') {
      try {
        StudentStore.recordPayment(invoice.studentId, {
          amount: amount,
          mode: paymentData.mode,
          txnId: paymentData.reference,
          particulars: `Payment for ${invoice.invoiceNumber}`
        });
      } catch (e) {
        console.warn("Could not sync with StudentStore", e);
      }
    }

    this.save();
    return { invoice, payment: newPayment };
  },

  // Add Expense (Req 2: Date support)
  addExpense(exp) {
    const expId = `EXP-${new Date().getFullYear()}-${String(this.data.expenses.length + 1).padStart(3, '0')}`;
    const newExpense = {
      id: expId,
      date: exp.date || new Date().toISOString().split('T')[0],
      category: exp.category,
      particulars: exp.particulars,
      vendor: exp.vendor || "Vendor",
      amount: Number(exp.amount),
      paidThrough: exp.paidThrough || "Bank Transfer",
      reference: exp.reference || `REF-${Date.now().toString().slice(-6)}`,
      notes: exp.notes || ""
    };

    this.data.expenses.unshift(newExpense);
    this.save();
    return newExpense;
  },

  // Delete Invoice
  deleteInvoice(id) {
    this.data.invoices = this.data.invoices.filter(i => i.id !== id);
    this.save();
    return this.data.invoices;
  },

  // Delete Payment
  deletePayment(id) {
    const pay = this.data.payments.find(p => p.id === id);
    if (pay) {
      if (pay.invoiceId) {
        const inv = this.data.invoices.find(i => i.id === pay.invoiceId);
        if (inv) {
          inv.amountPaid = Math.max(0, inv.amountPaid - Number(pay.amount));
          inv.balanceDue = Math.max(0, inv.total - inv.amountPaid);
          inv.status = inv.balanceDue === 0 ? "Paid" : (inv.amountPaid > 0 ? "Partially Paid" : "Unpaid");
        }
      }

      if (typeof StudentStore !== 'undefined' && pay.studentId) {
        const student = StudentStore.getById(pay.studentId);
        if (student) {
          student.paidFee = Math.max(0, student.paidFee - Number(pay.amount));
          student.balanceFee = Math.max(0, student.totalFee - student.paidFee);
          student.feeStatus = student.balanceFee === 0 ? "Paid" : (student.paidFee > 0 ? "Partial" : "Pending");
          student.paymentHistory = (student.paymentHistory || []).filter(h => h.receiptNo !== pay.receiptNo && h.txnId !== pay.reference);
          StudentStore.saveAll(StudentStore.getAll());
        }
      }

      this.data.payments = this.data.payments.filter(p => p.id !== id);
      this.save();
    }
    return this.data.payments;
  },

  // Delete Expense
  deleteExpense(id) {
    this.data.expenses = this.data.expenses.filter(e => e.id !== id);
    this.save();
    return this.data.expenses;
  },

  // Delete Student
  deleteStudent(id) {
    if (typeof StudentStore !== 'undefined') {
      StudentStore.deleteStudent(id);
    }
    this.data.students = (this.data.students || []).filter(s => s.id !== id);
    this.save();
    return this.data.students;
  }
};

// Initialize Books Data
BooksStore.init();
