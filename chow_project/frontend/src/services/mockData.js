// Comprehensive Mock Data and State Manager for OPD Queue & Booking System

export const initialDepartments = [
  { id: 1, name: 'Cardiology', code: 'CARD', description: 'Heart & Cardiovascular Care', doctorCount: 4, active: true },
  { id: 2, name: 'General OPD', code: 'GOPD', description: 'Primary Care & Routine Consultations', doctorCount: 6, active: true },
  { id: 3, name: 'Orthopedics', code: 'ORTH', description: 'Bones, Joints & Musculoskeletal Care', doctorCount: 3, active: true },
  { id: 4, name: 'Pediatrics', code: 'PEDS', description: 'Child & Adolescent Health', doctorCount: 4, active: true },
  { id: 5, name: 'Neurology', code: 'NEUR', description: 'Brain & Nervous System Care', doctorCount: 2, active: true },
  { id: 6, name: 'Dermatology', code: 'DERM', description: 'Skin & Allergy Management', doctorCount: 3, active: true },
];

export const initialDoctors = [
  { id: 101, name: 'Dr. Sarah Jenkins', email: 's.jenkins@hospital.org', phone: '+1 555-0101', departmentId: 1, departmentName: 'Cardiology', roomNo: 'Room 102', experience: '12 Years', status: 'Active', consultationTime: '15 mins' },
  { id: 102, name: 'Dr. Robert Chen', email: 'r.chen@hospital.org', phone: '+1 555-0102', departmentId: 2, departmentName: 'General OPD', roomNo: 'Room 205', experience: '8 Years', status: 'Active', consultationTime: '10 mins' },
  { id: 103, name: 'Dr. Emily Vance', email: 'e.vance@hospital.org', phone: '+1 555-0103', departmentId: 3, departmentName: 'Orthopedics', roomNo: 'Room 310', experience: '15 Years', status: 'Active', consultationTime: '20 mins' },
  { id: 104, name: 'Dr. Michael Ross', email: 'm.ross@hospital.org', phone: '+1 555-0104', departmentId: 4, departmentName: 'Pediatrics', roomNo: 'Room 108', experience: '10 Years', status: 'Active', consultationTime: '15 mins' },
  { id: 105, name: 'Dr. Anita Patel', email: 'a.patel@hospital.org', phone: '+1 555-0105', departmentId: 5, departmentName: 'Neurology', roomNo: 'Room 401', experience: '14 Years', status: 'Active', consultationTime: '25 mins' },
  { id: 106, name: 'Dr. David Miller', email: 'd.miller@hospital.org', phone: '+1 555-0106', departmentId: 2, departmentName: 'General OPD', roomNo: 'Room 206', experience: '6 Years', status: 'Active', consultationTime: '10 mins' },
];

export const initialPatients = [
  { id: 201, name: 'John Doe', email: 'patient@hospital.org', phone: '+1 555-9011', age: 42, gender: 'Male', chronicConditions: 'Hypertension, Type 2 Diabetes' },
  { id: 202, name: 'Alice Smith', email: 'alice.smith@example.com', phone: '+1 555-9012', age: 29, gender: 'Female', chronicConditions: 'Asthma' },
  { id: 203, name: 'Robert Johnson', email: 'robert.j@example.com', phone: '+1 555-9013', age: 65, gender: 'Male', chronicConditions: 'Coronary Artery Disease, Arthritis' },
  { id: 204, name: 'Emma Watson', email: 'emma.w@example.com', phone: '+1 555-9014', age: 34, gender: 'Female', chronicConditions: 'None' },
  { id: 205, name: 'Carlos Mendez', email: 'carlos.m@example.com', phone: '+1 555-9015', age: 58, gender: 'Male', chronicConditions: 'High Cholesterol' },
];

export const initialAppointments = [
  {
    id: 'APT-1001',
    patientId: 201,
    patientName: 'John Doe',
    patientPhone: '+1 555-9011',
    patientAge: 42,
    patientGender: 'Male',
    doctorId: 101,
    doctorName: 'Dr. Sarah Jenkins',
    departmentId: 1,
    departmentName: 'Cardiology',
    date: '2026-08-30',
    token: 'CARD-001',
    priority: 'High',
    priorityScore: 82,
    consultationTime: '09:30 AM',
    status: 'Checked In',
    checkInTime: '09:12 AM',
    symptoms: 'Chest discomfort, mild shortness of breath during exertion.',
    isEmergency: false
  },
  {
    id: 'APT-1002',
    patientId: 202,
    patientName: 'Alice Smith',
    patientPhone: '+1 555-9012',
    patientAge: 29,
    patientGender: 'Female',
    doctorId: 102,
    doctorName: 'Dr. Robert Chen',
    departmentId: 2,
    departmentName: 'General OPD',
    date: '2026-08-30',
    token: 'GOPD-002',
    priority: 'Medium',
    priorityScore: 54,
    consultationTime: '09:45 AM',
    status: 'Waiting',
    checkInTime: null,
    symptoms: 'Persistent dry cough and mild fever for 3 days.',
    isEmergency: false
  },
  {
    id: 'APT-1003',
    patientId: 203,
    patientName: 'Robert Johnson',
    patientPhone: '+1 555-9013',
    patientAge: 65,
    patientGender: 'Male',
    doctorId: 103,
    doctorName: 'Dr. Emily Vance',
    departmentId: 3,
    departmentName: 'Orthopedics',
    date: '2026-08-30',
    token: 'ORTH-003',
    priority: 'Emergency',
    priorityScore: 96,
    consultationTime: '10:00 AM',
    status: 'In Consultation',
    checkInTime: '09:40 AM',
    symptoms: 'Severe joint pain following a fall, unable to bear weight.',
    isEmergency: true
  },
  {
    id: 'APT-1004',
    patientId: 204,
    patientName: 'Emma Watson',
    patientPhone: '+1 555-9014',
    patientAge: 34,
    patientGender: 'Female',
    doctorId: 104,
    doctorName: 'Dr. Michael Ross',
    departmentId: 4,
    departmentName: 'Pediatrics',
    date: '2026-08-30',
    token: 'PEDS-004',
    priority: 'Low',
    priorityScore: 28,
    consultationTime: '10:30 AM',
    status: 'Scheduled',
    checkInTime: null,
    symptoms: 'Routine growth checkup and vaccination counseling.',
    isEmergency: false
  },
  {
    id: 'APT-1005',
    patientId: 205,
    patientName: 'Carlos Mendez',
    patientPhone: '+1 555-9015',
    patientAge: 58,
    patientGender: 'Male',
    doctorId: 102,
    doctorName: 'Dr. Robert Chen',
    departmentId: 2,
    departmentName: 'General OPD',
    date: '2026-08-30',
    token: 'GOPD-005',
    priority: 'Medium',
    priorityScore: 61,
    consultationTime: '11:00 AM',
    status: 'Completed',
    checkInTime: '10:45 AM',
    symptoms: 'Fasting blood sugar review and routine prescription renewal.',
    isEmergency: false
  }
];

export const initialOPDSessions = [
  {
    id: 1,
    doctorId: 101,
    doctorName: 'Dr. Sarah Jenkins',
    departmentName: 'Cardiology',
    date: '2026-08-30',
    startTime: '09:00 AM',
    endTime: '01:00 PM',
    consultationDuration: 15, // in minutes
    capacity: 20,
    booked: 14,
    remaining: 6,
    status: 'Active'
  },
  {
    id: 2,
    doctorId: 102,
    doctorName: 'Dr. Robert Chen',
    departmentName: 'General OPD',
    date: '2026-08-30',
    startTime: '09:00 AM',
    endTime: '02:00 PM',
    consultationDuration: 10,
    capacity: 30,
    booked: 24,
    remaining: 6,
    status: 'Active'
  },
  {
    id: 3,
    doctorId: 103,
    doctorName: 'Dr. Emily Vance',
    departmentName: 'Orthopedics',
    date: '2026-08-30',
    startTime: '10:00 AM',
    endTime: '02:00 PM',
    consultationDuration: 20,
    capacity: 15,
    booked: 12,
    remaining: 3,
    status: 'Active'
  }
];

export const initialEmergencies = [
  {
    id: 'EMG-901',
    patientName: 'Robert Johnson',
    phone: '+1 555-9013',
    department: 'Orthopedics',
    doctor: 'Dr. Emily Vance',
    location: 'Triage Room 2',
    timestamp: '2026-08-30 09:35 AM',
    symptoms: 'Severe traumatic fall, acute lower limb pain.',
    status: 'Active Alert',
    triageScore: 'P1 - Immediate'
  },
  {
    id: 'EMG-902',
    patientName: 'David Wright',
    phone: '+1 555-8844',
    department: 'Cardiology',
    doctor: 'Dr. Sarah Jenkins',
    location: 'Emergency Bay 1',
    timestamp: '2026-08-30 08:50 AM',
    symptoms: 'Acute chest pain radiating to left arm, sweating.',
    status: 'Transferred to ICU',
    triageScore: 'P1 - Critical'
  }
];

export const initialNotifications = [
  {
    id: 1,
    userId: 201,
    type: 'Appointment',
    title: 'Appointment Confirmed',
    message: 'Your appointment with Dr. Sarah Jenkins (Cardiology) is confirmed for 2026-08-30 at 09:30 AM.',
    time: '10 mins ago',
    unread: true
  },
  {
    id: 2,
    userId: 201,
    type: 'Token',
    title: 'Token Assigned',
    message: 'Token CARD-001 has been issued to you. Please report to Desk 2 upon arrival.',
    time: '35 mins ago',
    unread: true
  },
  {
    id: 3,
    userId: 201,
    type: 'Queue',
    title: 'Queue Position Update',
    message: 'You are 2nd in line for Dr. Sarah Jenkins. Estimated wait time: 15 minutes.',
    time: '1 hour ago',
    unread: false
  },
  {
    id: 4,
    userId: 201,
    type: 'Emergency',
    title: 'Emergency Priority Update',
    message: 'High priority queue status assigned based on symptom assessment.',
    time: '2 hours ago',
    unread: false
  }
];

export const initialSettings = {
  bookingCutoffTime: '17:00',
  nextDayBookingRules: 'Allow next-day bookings up to 24 hours prior to OPD start time.',
  highPriorityThreshold: 75,
  mediumPriorityThreshold: 45,
  emergencyAutoOverride: true,
  maxDailyBookingsPerPatient: 2,
  walkinReservedPercentage: 20,
  queueGenerationMode: 'AI Dynamic Triage'
};

export const initialCapacity = {
  normalBookingCapacity: 120,
  walkinCapacity: 30,
  totalCapacity: 150,
  currentBookedNormal: 86,
  currentBookedWalkin: 18,
  utilizationRate: '69.3%'
};

export const initialWalkinConfig = {
  reservedSlots: 30,
  availableSlots: 12,
  usedSlots: 18,
  allowSameDayWalkins: true,
  walkinStartTime: '08:30 AM'
};

export const initialStatistics = {
  totalAppointments: 104,
  completedAppointments: 68,
  cancelledAppointments: 6,
  noShows: 4,
  priorityDistribution: { Emergency: 8, High: 32, Medium: 44, Low: 20 },
  departmentStats: [
    { department: 'Cardiology', total: 28, completed: 20 },
    { department: 'General OPD', total: 42, completed: 30 },
    { department: 'Orthopedics', total: 18, completed: 10 },
    { department: 'Pediatrics', total: 16, completed: 8 }
  ],
  doctorStats: [
    { name: 'Dr. Sarah Jenkins', department: 'Cardiology', patientsSeen: 20, avgTime: '14 mins' },
    { name: 'Dr. Robert Chen', department: 'General OPD', patientsSeen: 30, avgTime: '9 mins' },
    { name: 'Dr. Emily Vance', department: 'Orthopedics', patientsSeen: 10, avgTime: '18 mins' }
  ],
  capacityUtilization: 69.3
};

// LocalStorage Persistence Helpers for Mock Data
export const getStorageData = (key, initial) => {
  try {
    const item = localStorage.getItem(`opd_${key}`);
    return item ? JSON.parse(item) : initial;
  } catch (_e) {
    return initial;
  }
};

export const setStorageData = (key, data) => {
  try {
    localStorage.setItem(`opd_${key}`, JSON.stringify(data));
  } catch (_e) {
    // Ignore storage quota errors
  }
};

