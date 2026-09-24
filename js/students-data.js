// ============================================================================
// CANFORD INTERNATIONAL - STUDENT & FEE DATA REPOSITORY
// ============================================================================

const CANFORD_COURSES = {
  "cma-usa-comp": {
    id: "cma-usa-comp",
    title: "CMA USA (Part 1 & Part 2 Comprehensive)",
    category: "International Certification",
    duration: "9 - 12 Months",
    totalFee: 85000,
    registrationFee: 15000,
    tuitionFee: 55000,
    materialsFee: 15000, // Includes Hock International 2025 books & LMS
    description: "Certified Management Accountant (IMA USA). Globally recognized benchmark for management accountants and financial professionals.",
    installments: [
      { num: 1, name: "Admission & Registration", amount: 35000, dueDays: 0 },
      { num: 2, name: "Part 1 Exam Prep & Materials", amount: 25000, dueDays: 60 },
      { num: 3, name: "Part 2 Final Clearance", amount: 25000, dueDays: 120 }
    ]
  },
  "cma-usa-p2": {
    id: "cma-usa-p2",
    title: "CMA USA Part 2 (Strategic Financial Management)",
    category: "International Certification",
    duration: "4 - 6 Months",
    totalFee: 45000,
    registrationFee: 10000,
    tuitionFee: 25000,
    materialsFee: 10000,
    description: "Specialized coaching for Part 2: Financial Statement Analysis, Corporate Finance, Risk Management, and Decision Analysis.",
    installments: [
      { num: 1, name: "Admission & Hock 2025 Book Access", amount: 25000, dueDays: 0 },
      { num: 2, name: "Final Mock Exam & LMS Extension", amount: 20000, dueDays: 60 }
    ]
  },
  "cma-usa-p1": {
    id: "cma-usa-p1",
    title: "CMA USA Part 1 (Financial Planning, Performance & Analytics)",
    category: "International Certification",
    duration: "4 - 6 Months",
    totalFee: 45000,
    registrationFee: 10000,
    tuitionFee: 25000,
    materialsFee: 10000,
    description: "Foundational mastery in Cost Management, Internal Controls, Technology, and External Financial Reporting.",
    installments: [
      { num: 1, name: "Admission & Course Material", amount: 25000, dueDays: 0 },
      { num: 2, name: "Mid-Term Review & Mocks", amount: 20000, dueDays: 60 }
    ]
  },
  "ifrs-dip": {
    id: "ifrs-dip",
    title: "Diploma in IFRS (ACCA / IAAP UK Certified)",
    category: "Professional Accounting",
    duration: "3 - 4 Months",
    totalFee: 38000,
    registrationFee: 8000,
    tuitionFee: 22000,
    materialsFee: 8000,
    description: "International Financial Reporting Standards certification accredited with IAAP UK and ACCA standards for global finance careers.",
    installments: [
      { num: 1, name: "Admission & Comprehensive Guide", amount: 20000, dueDays: 0 },
      { num: 2, name: "Final Assessment & IAAP Certification", amount: 18000, dueDays: 45 }
    ]
  },
  "biz-analytics": {
    id: "biz-analytics",
    title: "Executive Business Analytics & Financial AI",
    category: "Data & Finance",
    duration: "4 Months",
    totalFee: 50000,
    registrationFee: 10000,
    tuitionFee: 32000,
    materialsFee: 8000,
    description: "Hands-on data analytics, Power BI, Python for finance, and practical AI workflow tools for financial decision-making.",
    installments: [
      { num: 1, name: "Registration & Tool Setup", amount: 25000, dueDays: 0 },
      { num: 2, name: "Capstone Project & Placement Mentorship", amount: 25000, dueDays: 60 }
    ]
  }
};

// Seed student records authentic to Canford International documents & records
const INITIAL_STUDENTS = [
  {
    id: "CAN-2025-001",
    name: "Brisa C Briji",
    courseId: "cma-usa-p2",
    courseName: "CMA USA Part 2 (Strategic Financial Management)",
    phone: "8921488686",
    email: "brisacbriji@gmail.com",
    place: "Thrissur",
    qualification: "B.Com Degree",
    admissionDate: "2025-04-12",
    batch: "Weekend Batch 2025-A",
    status: "Active",
    totalFee: 45000,
    paidFee: 25000,
    balanceFee: 20000,
    nextDueDate: "2026-10-15",
    feeStatus: "Partial", // Paid, Partial, Overdue, Pending
    installments: [
      {
        id: "INST-001-1",
        name: "Admission & Hock 2025 Book Access",
        amount: 25000,
        dueDate: "2025-04-12",
        paidDate: "2025-04-12",
        status: "Paid",
        receiptNo: "REC-2025-0104",
        paymentMode: "Bank Transfer (NEFT)",
        txnRef: "NEFT-SBIN482910"
      },
      {
        id: "INST-001-2",
        name: "Final Mock Exam & LMS Extension",
        amount: 20000,
        dueDate: "2026-10-15",
        paidDate: null,
        status: "Upcoming",
        receiptNo: null,
        paymentMode: null,
        txnRef: null
      }
    ],
    paymentHistory: [
      {
        receiptNo: "REC-2025-0104",
        date: "2025-04-12",
        amount: 25000,
        particulars: "Admission & Hock 2025 Book Access",
        mode: "Bank Transfer (NEFT)",
        txnId: "NEFT-SBIN482910",
        notes: "Admission fee & LMS confirmation verified"
      }
    ]
  },
  {
    id: "CAN-2025-002",
    name: "Musawir K",
    courseId: "cma-usa-comp",
    courseName: "CMA USA (Part 1 & Part 2 Comprehensive)",
    phone: "9207450664",
    email: "musawir.k@gmail.com",
    place: "Oorakam, Malappuram",
    qualification: "B.Com Degree",
    admissionDate: "2025-02-10",
    batch: "Regular Batch 2025-B",
    status: "Active",
    totalFee: 85000,
    paidFee: 85000,
    balanceFee: 0,
    nextDueDate: null,
    feeStatus: "Paid",
    installments: [
      {
        id: "INST-002-1",
        name: "Admission & Registration",
        amount: 35000,
        dueDate: "2025-02-10",
        paidDate: "2025-02-10",
        status: "Paid",
        receiptNo: "REC-2025-0082",
        paymentMode: "UPI / Google Pay",
        txnRef: "UPI-482910848201"
      },
      {
        id: "INST-002-2",
        name: "Part 1 Exam Prep & Materials",
        amount: 25000,
        dueDate: "2025-04-15",
        paidDate: "2025-04-14",
        status: "Paid",
        receiptNo: "REC-2025-0145",
        paymentMode: "Debit Card",
        txnRef: "CARD-AUTH-92810"
      },
      {
        id: "INST-002-3",
        name: "Part 2 Final Clearance",
        amount: 25000,
        dueDate: "2025-06-20",
        paidDate: "2025-06-18",
        status: "Paid",
        receiptNo: "REC-2025-0210",
        paymentMode: "Net Banking",
        txnRef: "HDFC-TXN-820194"
      }
    ],
    paymentHistory: [
      {
        receiptNo: "REC-2025-0082",
        date: "2025-02-10",
        amount: 35000,
        particulars: "Admission & Registration Fee",
        mode: "UPI / Google Pay",
        txnId: "UPI-482910848201",
        notes: "Full admission package"
      },
      {
        receiptNo: "REC-2025-0145",
        date: "2025-04-14",
        amount: 25000,
        particulars: "Part 1 Exam Prep & Materials",
        mode: "Debit Card",
        txnId: "CARD-AUTH-92810",
        notes: "Part 1 Hock materials delivered"
      },
      {
        receiptNo: "REC-2025-0210",
        date: "2025-06-18",
        amount: 25000,
        particulars: "Part 2 Final Clearance",
        mode: "Net Banking",
        txnId: "HDFC-TXN-820194",
        notes: "Fee clearance certificate issued"
      }
    ]
  },
  {
    id: "CAN-2025-003",
    name: "Ameena Sherin",
    courseId: "cma-usa-comp",
    courseName: "CMA USA (Part 1 & Part 2 Comprehensive)",
    phone: "9539690606",
    email: "ameena.sherin@outlook.com",
    place: "Calicut",
    qualification: "M.Com",
    admissionDate: "2025-05-02",
    batch: "Evening Batch 2025-C",
    status: "Active",
    totalFee: 85000,
    paidFee: 35000,
    balanceFee: 50000,
    nextDueDate: "2026-08-30",
    feeStatus: "Overdue",
    installments: [
      {
        id: "INST-003-1",
        name: "Admission & Registration",
        amount: 35000,
        dueDate: "2025-05-02",
        paidDate: "2025-05-02",
        status: "Paid",
        receiptNo: "REC-2025-0160",
        paymentMode: "UPI / PhonePe",
        txnRef: "UPI-9102839201"
      },
      {
        id: "INST-003-2",
        name: "Part 1 Exam Prep & Materials",
        amount: 25000,
        dueDate: "2026-08-30",
        paidDate: null,
        status: "Overdue",
        receiptNo: null,
        paymentMode: null,
        txnRef: null
      },
      {
        id: "INST-003-3",
        name: "Part 2 Final Clearance",
        amount: 25000,
        dueDate: "2026-11-15",
        paidDate: null,
        status: "Upcoming",
        receiptNo: null,
        paymentMode: null,
        txnRef: null
      }
    ],
    paymentHistory: [
      {
        receiptNo: "REC-2025-0160",
        date: "2025-05-02",
        amount: 35000,
        particulars: "Admission & Registration Fee",
        mode: "UPI / PhonePe",
        txnId: "UPI-9102839201",
        notes: "Admission verified"
      }
    ]
  },
  {
    id: "CAN-2025-004",
    name: "Dilshad M",
    courseId: "ifrs-dip",
    courseName: "Diploma in IFRS (ACCA / IAAP UK Certified)",
    phone: "8891450700",
    email: "dilshad.m@gmail.com",
    place: "Manjeri, Malappuram",
    qualification: "BBA Finance",
    admissionDate: "2025-06-01",
    batch: "Weekend Batch 2025-B",
    status: "Active",
    totalFee: 38000,
    paidFee: 0,
    balanceFee: 38000,
    nextDueDate: "2026-09-25",
    feeStatus: "Pending",
    installments: [
      {
        id: "INST-004-1",
        name: "Admission & Comprehensive Guide",
        amount: 20000,
        dueDate: "2026-09-25",
        paidDate: null,
        status: "Due",
        receiptNo: null,
        paymentMode: null,
        txnRef: null
      },
      {
        id: "INST-004-2",
        name: "Final Assessment & IAAP Certification",
        amount: 18000,
        dueDate: "2026-11-20",
        paidDate: null,
        status: "Upcoming",
        receiptNo: null,
        paymentMode: null,
        txnRef: null
      }
    ],
    paymentHistory: []
  },
  {
    id: "CAN-2025-005",
    name: "Amal Hadi",
    courseId: "biz-analytics",
    courseName: "Executive Business Analytics & Financial AI",
    phone: "9747601091",
    email: "amal.hadi@yahoo.com",
    place: "Kozhikode",
    qualification: "B.Tech Computer Science",
    admissionDate: "2025-05-15",
    batch: "AI & Analytics Batch 1",
    status: "Active",
    totalFee: 50000,
    paidFee: 25000,
    balanceFee: 25000,
    nextDueDate: "2026-10-20",
    feeStatus: "Partial",
    installments: [
      {
        id: "INST-005-1",
        name: "Registration & Tool Setup",
        amount: 25000,
        dueDate: "2025-05-15",
        paidDate: "2025-05-15",
        status: "Paid",
        receiptNo: "REC-2025-0185",
        paymentMode: "UPI / Paytm",
        txnRef: "PTM-93019842"
      },
      {
        id: "INST-005-2",
        name: "Capstone Project & Placement Mentorship",
        amount: 25000,
        dueDate: "2026-10-20",
        paidDate: null,
        status: "Upcoming",
        receiptNo: null,
        paymentMode: null,
        txnRef: null
      }
    ],
    paymentHistory: [
      {
        receiptNo: "REC-2025-0185",
        date: "2025-05-15",
        amount: 25000,
        particulars: "Registration & Tool Setup",
        mode: "UPI / Paytm",
        txnId: "PTM-93019842",
        notes: "Analytics environment login provisioned"
      }
    ]
  },
  {
    id: "CAN-2025-006",
    name: "Fathima Faza",
    courseId: "ifrs-dip",
    courseName: "Diploma in IFRS (ACCA / IAAP UK Certified)",
    phone: "8606886784",
    email: "fathima.faza@gmail.com",
    place: "Chelembra",
    qualification: "B.Voc Logistics",
    admissionDate: "2025-03-20",
    batch: "Regular Batch 2025-A",
    status: "Active",
    totalFee: 38000,
    paidFee: 38000,
    balanceFee: 0,
    nextDueDate: null,
    feeStatus: "Paid",
    installments: [
      {
        id: "INST-006-1",
        name: "Admission & Comprehensive Guide",
        amount: 20000,
        dueDate: "2025-03-20",
        paidDate: "2025-03-20",
        status: "Paid",
        receiptNo: "REC-2025-0120",
        paymentMode: "Cash / Direct",
        txnRef: "CASH-REC-120"
      },
      {
        id: "INST-006-2",
        name: "Final Assessment & IAAP Certification",
        amount: 18000,
        dueDate: "2025-05-10",
        paidDate: "2025-05-08",
        status: "Paid",
        receiptNo: "REC-2025-0174",
        paymentMode: "Bank Transfer",
        txnRef: "NEFT-FED-29103"
      }
    ],
    paymentHistory: [
      {
        receiptNo: "REC-2025-0120",
        date: "2025-03-20",
        amount: 20000,
        particulars: "Admission & Comprehensive Guide",
        mode: "Cash / Direct",
        txnId: "CASH-REC-120",
        notes: "Paid at Calicut Office"
      },
      {
        receiptNo: "REC-2025-0174",
        date: "2025-05-08",
        amount: 18000,
        particulars: "Final Assessment & IAAP Certification",
        mode: "Bank Transfer",
        txnId: "NEFT-FED-29103",
        notes: "Exam clearance issued"
      }
    ]
  },
  {
    id: "CAN-2025-007",
    name: "Farsana K",
    courseId: "cma-usa-p2",
    courseName: "CMA USA Part 2 (Strategic Financial Management)",
    phone: "9744064866",
    email: "farsana.k@gmail.com",
    place: "Calicut",
    qualification: "B.Com",
    admissionDate: "2025-04-25",
    batch: "Weekend Batch 2025-A",
    status: "Active",
    totalFee: 45000,
    paidFee: 25000,
    balanceFee: 20000,
    nextDueDate: "2026-10-30",
    feeStatus: "Partial",
    installments: [
      {
        id: "INST-007-1",
        name: "Admission & Hock 2025 Book Access",
        amount: 25000,
        dueDate: "2025-04-25",
        paidDate: "2025-04-25",
        status: "Paid",
        receiptNo: "REC-2025-0152",
        paymentMode: "UPI / Google Pay",
        txnRef: "UPI-829103847"
      },
      {
        id: "INST-007-2",
        name: "Final Mock Exam & LMS Extension",
        amount: 20000,
        dueDate: "2026-10-30",
        paidDate: null,
        status: "Upcoming",
        receiptNo: null,
        paymentMode: null,
        txnRef: null
      }
    ],
    paymentHistory: [
      {
        receiptNo: "REC-2025-0152",
        date: "2025-04-25",
        amount: 25000,
        particulars: "Admission & Hock 2025 Book Access",
        mode: "UPI / Google Pay",
        txnId: "UPI-829103847",
        notes: "Books delivered"
      }
    ]
  },
  {
    id: "CAN-2025-008",
    name: "Salih Rahman",
    courseId: "cma-usa-comp",
    courseName: "CMA USA (Part 1 & Part 2 Comprehensive)",
    phone: "7510690102",
    email: "salih.rahman@gmail.com",
    place: "Kannur",
    qualification: "M.Com Finance",
    admissionDate: "2025-05-18",
    batch: "Regular Batch 2025-B",
    status: "Active",
    totalFee: 85000,
    paidFee: 35000,
    balanceFee: 50000,
    nextDueDate: "2026-09-30",
    feeStatus: "Partial",
    installments: [
      {
        id: "INST-008-1",
        name: "Admission & Registration",
        amount: 35000,
        dueDate: "2025-05-18",
        paidDate: "2025-05-18",
        status: "Paid",
        receiptNo: "REC-2025-0192",
        paymentMode: "Net Banking",
        txnRef: "AXIS-PAY-981240"
      },
      {
        id: "INST-008-2",
        name: "Part 1 Exam Prep & Materials",
        amount: 25000,
        dueDate: "2026-09-30",
        paidDate: null,
        status: "Due",
        receiptNo: null,
        paymentMode: null,
        txnRef: null
      },
      {
        id: "INST-008-3",
        name: "Part 2 Final Clearance",
        amount: 25000,
        dueDate: "2026-12-15",
        paidDate: null,
        status: "Upcoming",
        receiptNo: null,
        paymentMode: null,
        txnRef: null
      }
    ],
    paymentHistory: [
      {
        receiptNo: "REC-2025-0192",
        date: "2025-05-18",
        amount: 35000,
        particulars: "Admission & Registration Fee",
        mode: "Net Banking",
        txnId: "AXIS-PAY-981240",
        notes: "Admission processed"
      }
    ]
  }
];

// Data Store Management (with localStorage sync)
const STORAGE_KEY = "canford_students_v1";

const StudentStore = {
  getAll() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to parse stored students", e);
    }
    // Initialize with default
    this.saveAll(INITIAL_STUDENTS);
    return INITIAL_STUDENTS;
  },

  saveAll(students) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
      console.error("Failed to save students to localStorage", e);
    }
  },

  resetToDefault() {
    this.saveAll(INITIAL_STUDENTS);
    return INITIAL_STUDENTS;
  },

  getById(id) {
    const students = this.getAll();
    if (!id) return null;
    const query = String(id).trim().toLowerCase();
    return students.find(s => 
      s.id.toLowerCase() === query || 
      s.phone.replace(/[^0-9]/g, '').includes(query.replace(/[^0-9]/g, '')) ||
      (s.email && s.email.toLowerCase() === query)
    ) || null;
  },

  search(term) {
    const students = this.getAll();
    if (!term || !term.trim()) return students;
    const q = term.trim().toLowerCase();
    return students.filter(s => 
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.place && s.place.toLowerCase().includes(q)) ||
      s.courseName.toLowerCase().includes(q)
    );
  },

  addStudent(studentData) {
    const students = this.getAll();
    const newId = `CAN-2025-${String(students.length + 1).padStart(3, '0')}`;
    const course = CANFORD_COURSES[studentData.courseId] || {
      id: "custom",
      title: studentData.courseName || "Custom Course",
      totalFee: Number(studentData.totalFee) || 50000,
      installments: [
        { num: 1, name: "Admission Fee", amount: Number(studentData.totalFee) || 50000, dueDays: 0 }
      ]
    };

    const totalFee = Number(studentData.totalFee) || course.totalFee;
    const initialPayment = Number(studentData.initialPayment) || 0;

    // Generate installment milestones
    const installments = [];
    const today = new Date();
    const defaultInstallments = course.installments || [
      { num: 1, name: "Installment 1", amount: Math.round(totalFee / 2), dueDays: 0 },
      { num: 2, name: "Installment 2", amount: Math.round(totalFee / 2), dueDays: 60 }
    ];

    let allocatedPaid = initialPayment;

    defaultInstallments.forEach((inst, idx) => {
      const instDueDate = new Date(today);
      instDueDate.setDate(instDueDate.getDate() + (inst.dueDays || (idx * 45)));

      const isPaid = allocatedPaid >= inst.amount;
      allocatedPaid = Math.max(0, allocatedPaid - inst.amount);

      installments.push({
        id: `INST-${newId}-${idx + 1}`,
        name: inst.name,
        amount: inst.amount,
        dueDate: instDueDate.toISOString().split('T')[0],
        paidDate: isPaid ? today.toISOString().split('T')[0] : null,
        status: isPaid ? "Paid" : (idx === 0 ? "Due" : "Upcoming"),
        receiptNo: isPaid ? `REC-${today.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}` : null,
        paymentMode: isPaid ? (studentData.paymentMode || "Cash / Direct") : null,
        txnRef: isPaid ? `TXN-${Date.now().toString().slice(-6)}` : null
      });
    });

    const paymentHistory = [];
    if (initialPayment > 0) {
      paymentHistory.push({
        receiptNo: installments[0]?.receiptNo || `REC-${today.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        date: today.toISOString().split('T')[0],
        amount: initialPayment,
        particulars: "Initial Admission / Registration Fee",
        mode: studentData.paymentMode || "Cash / Direct",
        txnId: `TXN-${Date.now().toString().slice(-6)}`,
        notes: "Admission enrollment payment"
      });
    }

    const paidFee = initialPayment;
    const balanceFee = Math.max(0, totalFee - paidFee);
    const feeStatus = balanceFee === 0 ? "Paid" : (paidFee > 0 ? "Partial" : "Pending");

    const newStudent = {
      id: newId,
      name: studentData.name,
      courseId: studentData.courseId,
      courseName: course.title,
      phone: studentData.phone,
      email: studentData.email || "",
      place: studentData.place || "Calicut",
      qualification: studentData.qualification || "Degree",
      admissionDate: studentData.admissionDate || today.toISOString().split('T')[0],
      batch: studentData.batch || "Regular 2025",
      status: "Active",
      totalFee: totalFee,
      paidFee: paidFee,
      balanceFee: balanceFee,
      nextDueDate: installments.find(i => i.status !== "Paid")?.dueDate || null,
      feeStatus: feeStatus,
      installments: installments,
      paymentHistory: paymentHistory
    };

    students.unshift(newStudent);
    this.saveAll(students);
    return newStudent;
  },

  recordPayment(studentId, paymentData) {
    const students = this.getAll();
    const student = students.find(s => s.id === studentId);
    if (!student) throw new Error("Student not found");

    const amount = Number(paymentData.amount);
    if (isNaN(amount) || amount <= 0) throw new Error("Invalid payment amount");

    const today = new Date().toISOString().split('T')[0];
    const receiptNo = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    student.paidFee += amount;
    student.balanceFee = Math.max(0, student.totalFee - student.paidFee);
    student.feeStatus = student.balanceFee === 0 ? "Paid" : "Partial";

    // Allocate payment against pending installments
    let remainingToAllocate = amount;
    for (const inst of student.installments) {
      if (inst.status !== "Paid" && remainingToAllocate > 0) {
        if (remainingToAllocate >= inst.amount) {
          inst.status = "Paid";
          inst.paidDate = today;
          inst.receiptNo = receiptNo;
          inst.paymentMode = paymentData.mode;
          inst.txnRef = paymentData.txnId || `TXN-${Date.now().toString().slice(-6)}`;
          remainingToAllocate -= inst.amount;
        } else {
          inst.status = "Partial";
          break;
        }
      }
    }

    // Update next due date
    const nextPending = student.installments.find(i => i.status !== "Paid");
    student.nextDueDate = nextPending ? nextPending.dueDate : null;

    // Create history entry
    const newTxn = {
      receiptNo: receiptNo,
      date: today,
      amount: amount,
      particulars: paymentData.particulars || "Course Fee Installment",
      mode: paymentData.mode || "Online Payment",
      txnId: paymentData.txnId || `TXN-${Date.now().toString().slice(-6)}`,
      notes: paymentData.notes || "Fee collection recorded"
    };

    student.paymentHistory.unshift(newTxn);
    this.saveAll(students);

    return {
      student,
      receipt: newTxn
    };
  },

  deleteStudent(id) {
    let students = this.getAll();
    students = students.filter(s => s.id !== id);
    this.saveAll(students);
    return students;
  }
};

