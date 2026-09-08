const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'students-data.json');

const INITIAL_STUDENTS = [
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
    createdAt: new Date('2024-08-15').toISOString()
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
    createdAt: new Date('2024-09-01').toISOString()
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
    createdAt: new Date('2024-10-10').toISOString()
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
    createdAt: new Date('2024-11-05').toISOString()
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
    createdAt: new Date('2025-01-12').toISOString()
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
    notes: 'Academic warning letter issued; tutoring scheduled.',
    createdAt: new Date('2025-02-01').toISOString()
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
    createdAt: new Date('2025-02-14').toISOString()
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
    createdAt: new Date('2025-03-01').toISOString()
  }
];

// Helper: Read or initialize data
function loadStudents() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_STUDENTS, null, 2), 'utf8');
      return INITIAL_STUDENTS;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading students data:', err);
    return INITIAL_STUDENTS;
  }
}

function saveStudents(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving students data:', err);
    return false;
  }
}

// MIME Types map
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // --- REST API ENDPOINTS ---
  if (pathname.startsWith('/api/students')) {
    const students = loadStudents();

    // GET /api/students
    if (req.method === 'GET' && pathname === '/api/students') {
      return sendJson(res, 200, { success: true, data: students });
    }

    // POST /api/students/reset
    if (req.method === 'POST' && pathname === '/api/students/reset') {
      saveStudents(INITIAL_STUDENTS);
      return sendJson(res, 200, { success: true, message: 'Database reset to initial demo state', data: INITIAL_STUDENTS });
    }

    // POST /api/students (Create)
    if (req.method === 'POST' && pathname === '/api/students') {
      try {
        const body = await parseRequestBody(req);
        if (!body.fullName || !body.email || !body.department) {
          return sendJson(res, 400, { success: false, error: 'Full Name, Email, and Department are required fields.' });
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
        saveStudents(students);
        return sendJson(res, 201, { success: true, message: 'Student registered successfully', data: newStudent });
      } catch (err) {
        return sendJson(res, 400, { success: false, error: 'Malformed JSON payload' });
      }
    }

    // PUT /api/students/:id (Update)
    const matchPut = pathname.match(/^\/api\/students\/([^/]+)$/);
    if (req.method === 'PUT' && matchPut) {
      const studentId = matchPut[1];
      try {
        const body = await parseRequestBody(req);
        const index = students.findIndex(s => s.id === studentId || s.studentId === studentId);

        if (index === -1) {
          return sendJson(res, 404, { success: false, error: `Student not found with ID ${studentId}` });
        }

        const updatedStudent = {
          ...students[index],
          ...body,
          id: students[index].id, // preserve immutable ID
          gpa: body.gpa !== undefined ? parseFloat(body.gpa) : students[index].gpa,
          attendance: body.attendance !== undefined ? parseInt(body.attendance, 10) : students[index].attendance,
          updatedAt: new Date().toISOString()
        };

        students[index] = updatedStudent;
        saveStudents(students);
        return sendJson(res, 200, { success: true, message: 'Student details updated successfully', data: updatedStudent });
      } catch (err) {
        return sendJson(res, 400, { success: false, error: 'Malformed JSON payload' });
      }
    }

    // DELETE /api/students/:id (Delete)
    const matchDelete = pathname.match(/^\/api\/students\/([^/]+)$/);
    if (req.method === 'DELETE' && matchDelete) {
      const studentId = matchDelete[1];
      const index = students.findIndex(s => s.id === studentId || s.studentId === studentId);

      if (index === -1) {
        return sendJson(res, 404, { success: false, error: `Student not found with ID ${studentId}` });
      }

      const deleted = students.splice(index, 1)[0];
      saveStudents(students);
      return sendJson(res, 200, { success: true, message: 'Student record deleted successfully', data: deleted });
    }

    return sendJson(res, 404, { success: false, error: 'API route not found' });
  }

  // --- STATIC FILE SERVING ---
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  
  // Security check: ensure path stays within __dirname
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA feel or 404
      filePath = path.join(__dirname, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Internal Server Error');
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

// Initialize storage file if not present
loadStudents();

server.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🎓 ScholarPulse - Student CRUD System is running!`);
  console.log(`🚀 Web Interface & REST API: http://localhost:${PORT}`);
  console.log(`===================================================`);
});
