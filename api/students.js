let students = [
  {
    id: 'std_1',
    studentId: 'STU-2026-001',
    fullName: 'Sophia Montgomery',
    email: 'sophia.montgomery@university.edu',
    phone: '+1 (555) 234-5678',
    department: 'Computer Science',
    year: 'Senior (4th Year)',
    gpa: 3.92,
    attendance: 98,
    status: 'Active',
    avatarColor: '#6366f1',
    notes: 'Dean\'s Honor List, Lead AI Research Assistant.',
    createdAt: '2024-08-15T09:00:00.000Z'
  },
  {
    id: 'std_2',
    studentId: 'STU-2026-002',
    fullName: 'Liam Chen',
    email: 'liam.chen@university.edu',
    phone: '+1 (555) 345-6789',
    department: 'Data Science',
    year: 'Junior (3rd Year)',
    gpa: 3.78,
    attendance: 94,
    status: 'Active',
    avatarColor: '#06b6d4',
    notes: 'Competitive programming team captain.',
    createdAt: '2024-09-01T10:30:00.000Z'
  },
  {
    id: 'std_3',
    studentId: 'STU-2026-003',
    fullName: 'Aria Patel',
    email: 'aria.patel@university.edu',
    phone: '+1 (555) 456-7890',
    department: 'Mechanical Engineering',
    year: 'Sophomore (2nd Year)',
    gpa: 3.45,
    attendance: 88,
    status: 'Active',
    avatarColor: '#ec4899',
    notes: 'Robotics Club president, working on autonomous rovers.',
    createdAt: '2024-10-10T14:15:00.000Z'
  },
  {
    id: 'std_4',
    studentId: 'STU-2026-004',
    fullName: 'Marcus Vance',
    email: 'marcus.vance@university.edu',
    phone: '+1 (555) 567-8901',
    department: 'Business Administration',
    year: 'Senior (4th Year)',
    gpa: 3.15,
    attendance: 79,
    status: 'On Leave',
    avatarColor: '#f59e0b',
    notes: 'Semester internship at venture capital firm.',
    createdAt: '2024-11-05T11:00:00.000Z'
  },
  {
    id: 'std_5',
    studentId: 'STU-2026-005',
    fullName: 'Elena Rostova',
    email: 'elena.rostova@university.edu',
    phone: '+1 (555) 678-9012',
    department: 'Electrical Engineering',
    year: 'Freshman (1st Year)',
    gpa: 3.88,
    attendance: 96,
    status: 'Active',
    avatarColor: '#10b981',
    notes: 'High school valedictorian, semiconductor scholarship.',
    createdAt: '2025-01-12T08:45:00.000Z'
  },
  {
    id: 'std_6',
    studentId: 'STU-2026-006',
    fullName: 'Jordan Taylor',
    email: 'jordan.taylor@university.edu',
    phone: '+1 (555) 789-0123',
    department: 'Biotechnology',
    year: 'Junior (3rd Year)',
    gpa: 2.85,
    attendance: 72,
    status: 'Inactive',
    avatarColor: '#8b5cf6',
    notes: 'Academic counseling scheduled.',
    createdAt: '2025-02-01T16:20:00.000Z'
  },
  {
    id: 'std_7',
    studentId: 'STU-2026-007',
    fullName: 'Zackary Brooks',
    email: 'zackary.brooks@university.edu',
    phone: '+1 (555) 890-1234',
    department: 'Computer Science',
    year: 'Sophomore (2nd Year)',
    gpa: 3.65,
    attendance: 91,
    status: 'Active',
    avatarColor: '#3b82f6',
    notes: 'Cybersecurity hackathon runner-up.',
    createdAt: '2025-02-14T13:00:00.000Z'
  },
  {
    id: 'std_8',
    studentId: 'STU-2026-008',
    fullName: 'Mia Kawaguchi',
    email: 'mia.kawaguchi@university.edu',
    phone: '+1 (555) 901-2345',
    department: 'Graphic Design & UI',
    year: 'Senior (4th Year)',
    gpa: 3.95,
    attendance: 99,
    status: 'Active',
    avatarColor: '#f43f5e',
    notes: 'Designed university centenary visual identity.',
    createdAt: '2025-03-01T15:10:00.000Z'
  }
];

const INITIAL_BACKUP = JSON.parse(JSON.stringify(students));

function getBody(req) {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') {
      return resolve(req.body);
    }
    if (typeof req.body === 'string' && req.body) {
      try { return resolve(JSON.parse(req.body)); } catch { return resolve({}); }
    }
    let data = '';
    req.on('data', chunk => { data += chunk.toString(); });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch { resolve({}); }
    });
    req.on('error', () => resolve({}));
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const url = req.url || '';
  const query = req.query || {};

  let studentId = query.id || null;
  if (!studentId) {
    const match = url.match(/\/api\/students\/([^/?#]+)/);
    if (match) studentId = match[1];
  }

  // POST /api/students/reset
  if (req.method === 'POST' && (url.includes('/reset') || query.action === 'reset')) {
    students = JSON.parse(JSON.stringify(INITIAL_BACKUP));
    return res.status(200).json({ success: true, message: 'Database reset successfully', data: students });
  }

  // GET /api/students
  if (req.method === 'GET') {
    if (studentId) {
      const student = students.find(s => s.id === studentId || s.studentId === studentId);
      if (!student) return res.status(404).json({ success: false, error: 'Student not found' });
      return res.status(200).json({ success: true, data: student });
    }
    return res.status(200).json({ success: true, data: students });
  }

  // POST /api/students
  if (req.method === 'POST') {
    const body = await getBody(req);
    if (!body.fullName || !body.email || !body.department) {
      return res.status(400).json({ success: false, error: 'Full Name, Email, and Department are required.' });
    }

    const newStudent = {
      id: 'std_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      studentId: body.studentId || `STU-2026-${String(students.length + 1).padStart(3, '0')}`,
      fullName: body.fullName.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone ? body.phone.trim() : '',
      department: body.department,
      year: body.year || '1st Year (Freshman)',
      gpa: parseFloat(body.gpa) || 0.0,
      attendance: parseInt(body.attendance, 10) || 100,
      status: body.status || 'Active',
      avatarColor: body.avatarColor || '#6366f1',
      notes: body.notes ? body.notes.trim() : '',
      createdAt: new Date().toISOString()
    };

    students.unshift(newStudent);
    return res.status(201).json({ success: true, message: 'Student registered successfully', data: newStudent });
  }

  // PUT /api/students/:id
  if (req.method === 'PUT') {
    if (!studentId) {
      return res.status(400).json({ success: false, error: 'Student ID is required for update' });
    }
    const body = await getBody(req);
    const index = students.findIndex(s => s.id === studentId || s.studentId === studentId);
    if (index === -1) {
      return res.status(404).json({ success: false, error: `Student not found with ID ${studentId}` });
    }

    students[index] = {
      ...students[index],
      ...body,
      id: students[index].id,
      gpa: body.gpa !== undefined ? parseFloat(body.gpa) : students[index].gpa,
      attendance: body.attendance !== undefined ? parseInt(body.attendance, 10) : students[index].attendance,
      updatedAt: new Date().toISOString()
    };

    return res.status(200).json({ success: true, message: 'Student updated successfully', data: students[index] });
  }

  // DELETE /api/students/:id
  if (req.method === 'DELETE') {
    if (!studentId) {
      return res.status(400).json({ success: false, error: 'Student ID is required for deletion' });
    }
    const index = students.findIndex(s => s.id === studentId || s.studentId === studentId);
    if (index === -1) {
      return res.status(404).json({ success: false, error: `Student not found with ID ${studentId}` });
    }

    const deleted = students.splice(index, 1)[0];
    return res.status(200).json({ success: true, message: 'Student deleted successfully', data: deleted });
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
};
