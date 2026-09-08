/**
 * ScholarPulse - Student Information & Academic Performance System
 * Core Application Engine & CRUD Controller
 */

// Initial Seed Data (Used for localStorage or when reset is requested)
const SEED_STUDENTS = [
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

class StorageManager {
  constructor() {
    this.storageKey = 'scholarpulse_students_v1';
    this.apiAvailable = false;
  }

  async init() {
    try {
      const res = await fetch('/api/students', { method: 'GET', signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          this.apiAvailable = true;
          this.saveLocal(data.data);
          return data.data;
        }
      }
    } catch {
      // Backend not running or static mode; fallback to localStorage
      this.apiAvailable = false;
    }

    return this.getLocal();
  }

  getLocal() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        this.saveLocal(SEED_STUDENTS);
        return [...SEED_STUDENTS];
      }
      return JSON.parse(stored);
    } catch {
      return [...SEED_STUDENTS];
    }
  }

  saveLocal(students) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(students));
    } catch (err) {
      console.error('LocalStorage write error:', err);
    }
  }

  async create(student) {
    if (this.apiAvailable) {
      try {
        const res = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(student)
        });
        if (res.ok) {
          const result = await res.json();
          if (result.success) return result.data;
        }
      } catch (err) {
        console.warn('API create error, using local storage fallback', err);
      }
    }

    const current = this.getLocal();
    const created = {
      ...student,
      id: 'std_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      createdAt: new Date().toISOString()
    };
    current.unshift(created);
    this.saveLocal(current);
    return created;
  }

  async update(id, updates) {
    if (this.apiAvailable) {
      try {
        const res = await fetch(`/api/students/${encodeURIComponent(id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        if (res.ok) {
          const result = await res.json();
          if (result.success) return result.data;
        }
      } catch (err) {
        console.warn('API update error, using local storage fallback', err);
      }
    }

    const current = this.getLocal();
    const index = current.findIndex(s => s.id === id);
    if (index !== -1) {
      current[index] = { ...current[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveLocal(current);
      return current[index];
    }
    return null;
  }

  async delete(id) {
    if (this.apiAvailable) {
      try {
        const res = await fetch(`/api/students/${encodeURIComponent(id)}`, { method: 'DELETE' });
        if (res.ok) {
          const result = await res.json();
          if (result.success) return true;
        }
      } catch (err) {
        console.warn('API delete error, using local storage fallback', err);
      }
    }

    let current = this.getLocal();
    current = current.filter(s => s.id !== id);
    this.saveLocal(current);
    return true;
  }

  async reset() {
    if (this.apiAvailable) {
      try {
        await fetch('/api/students/reset', { method: 'POST' });
      } catch (err) {
        console.warn('API reset failed', err);
      }
    }
    this.saveLocal(SEED_STUDENTS);
    return [...SEED_STUDENTS];
  }
}

// Global Application Controller
class App {
  constructor() {
    this.storage = new StorageManager();
    this.students = [];
    this.selectedIds = new Set();

    // Filters & Pagination State
    this.state = {
      searchQuery: '',
      department: 'ALL',
      year: 'ALL',
      status: 'ALL',
      sortField: 'createdAt',
      sortDirection: 'desc',
      currentPage: 1,
      pageSize: 10,
      activeView: 'table', // 'table' | 'card'
      targetStudentIdForDelete: null
    };

    this.cacheDom();
    this.init();
  }

  cacheDom() {
    // Top Bar & Controls
    this.apiStatusChip = document.getElementById('apiStatusChip');
    this.apiStatusLabel = document.getElementById('apiStatusLabel');
    this.themeToggleBtn = document.getElementById('themeToggleBtn');
    this.exportDropdownBtn = document.getElementById('exportDropdownBtn');
    this.exportDropdownMenu = document.getElementById('exportDropdownMenu');
    this.exportCsvBtn = document.getElementById('exportCsvBtn');
    this.exportJsonBtn = document.getElementById('exportJsonBtn');
    this.resetDataBtn = document.getElementById('resetDataBtn');
    this.openAddModalBtn = document.getElementById('openAddModalBtn');

    // KPI Summary
    this.statTotalStudents = document.getElementById('statTotalStudents');
    this.statActiveRatio = document.getElementById('statActiveRatio');
    this.statEnrolledDetail = document.getElementById('statEnrolledDetail');
    this.statAvgGpa = document.getElementById('statAvgGpa');
    this.statGpaGrade = document.getElementById('statGpaGrade');
    this.statAvgAttendance = document.getElementById('statAvgAttendance');
    this.statAttendanceBar = document.getElementById('statAttendanceBar');
    this.statHonorRollCount = document.getElementById('statHonorRollCount');

    // Search & Filter
    this.searchInput = document.getElementById('searchInput');
    this.clearSearchBtn = document.getElementById('clearSearchBtn');
    this.deptFilter = document.getElementById('deptFilter');
    this.yearFilter = document.getElementById('yearFilter');
    this.statusPills = document.querySelectorAll('.status-pill');
    this.tableViewBtn = document.getElementById('tableViewBtn');
    this.cardViewBtn = document.getElementById('cardViewBtn');

    // Views & Containers
    this.tableViewSection = document.getElementById('tableViewSection');
    this.cardViewSection = document.getElementById('cardViewSection');
    this.emptyState = document.getElementById('emptyState');
    this.studentsTable = document.getElementById('studentsTable');
    this.studentsTableBody = document.getElementById('studentsTableBody');
    this.selectAllCheckbox = document.getElementById('selectAllCheckbox');
    this.clearAllFiltersBtn = document.getElementById('clearAllFiltersBtn');

    // Bulk actions
    this.bulkActionBar = document.getElementById('bulkActionBar');
    this.selectedCount = document.getElementById('selectedCount');
    this.bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    this.deselectAllBtn = document.getElementById('deselectAllBtn');

    // Pagination
    this.paginationInfo = document.getElementById('paginationInfo');
    this.pageSizeSelect = document.getElementById('pageSizeSelect');
    this.prevPageBtn = document.getElementById('prevPageBtn');
    this.nextPageBtn = document.getElementById('nextPageBtn');
    this.pageNumbers = document.getElementById('pageNumbers');

    // Student Modal (Add/Edit)
    this.studentModal = document.getElementById('studentModal');
    this.modalTitle = document.getElementById('modalTitle');
    this.modalSubtitle = document.getElementById('modalSubtitle');
    this.closeStudentModalBtn = document.getElementById('closeStudentModalBtn');
    this.cancelStudentModalBtn = document.getElementById('cancelStudentModalBtn');
    this.studentForm = document.getElementById('studentForm');
    this.studentInternalId = document.getElementById('studentInternalId');
    this.avatarPreview = document.getElementById('avatarPreview');
    this.avatarColorInput = document.getElementById('avatarColorInput');
    this.colorPalette = document.getElementById('colorPalette');
    this.saveBtnText = document.getElementById('saveBtnText');

    // Form inputs
    this.fullNameInput = document.getElementById('fullNameInput');
    this.studentIdInput = document.getElementById('studentIdInput');
    this.emailInput = document.getElementById('emailInput');
    this.phoneInput = document.getElementById('phoneInput');
    this.departmentInput = document.getElementById('departmentInput');
    this.yearInput = document.getElementById('yearInput');
    this.statusInput = document.getElementById('statusInput');
    this.gpaInput = document.getElementById('gpaInput');
    this.attendanceInput = document.getElementById('attendanceInput');
    this.notesInput = document.getElementById('notesInput');

    // View Details Modal
    this.viewModal = document.getElementById('viewModal');
    this.closeViewModalBtn = document.getElementById('closeViewModalBtn');
    this.closeViewBtnSecondary = document.getElementById('closeViewBtnSecondary');
    this.viewEditStudentBtn = document.getElementById('viewEditStudentBtn');

    // Delete Modal
    this.deleteModal = document.getElementById('deleteModal');
    this.cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    this.confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    this.deleteTargetName = document.getElementById('deleteTargetName');
    this.deleteTargetId = document.getElementById('deleteTargetId');
    this.deleteModalTitle = document.getElementById('deleteModalTitle');
    this.deleteModalMessage = document.getElementById('deleteModalMessage');

    // Toasts
    this.toastContainer = document.getElementById('toastContainer');
  }

  async init() {
    this.initTheme();
    this.bindEvents();

    this.students = await this.storage.init();
    this.updateApiStatusIndicator();
    this.render();
  }

  updateApiStatusIndicator() {
    if (this.storage.apiAvailable) {
      this.apiStatusChip.classList.add('online');
      this.apiStatusLabel.textContent = 'REST API Connected';
    } else {
      this.apiStatusChip.classList.remove('online');
      this.apiStatusLabel.textContent = 'LocalStorage Mode';
    }
  }

  initTheme() {
    const savedTheme = localStorage.getItem('scholarpulse_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('scholarpulse_theme', next);
    this.showToast(`Switched to ${next} mode`, 'info');
  }

  bindEvents() {
    // Theme toggle
    this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());

    // Export Dropdown
    this.exportDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = this.exportDropdownBtn.closest('.dropdown');
      dropdown.classList.toggle('open');
      this.exportDropdownBtn.setAttribute('aria-expanded', dropdown.classList.contains('open'));
    });

    document.addEventListener('click', (e) => {
      if (!this.exportDropdownBtn.contains(e.target) && !this.exportDropdownMenu.contains(e.target)) {
        this.exportDropdownBtn.closest('.dropdown').classList.remove('open');
        this.exportDropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });

    this.exportCsvBtn.addEventListener('click', () => this.exportCsv());
    this.exportJsonBtn.addEventListener('click', () => this.exportJson());

    // Reset Data
    this.resetDataBtn.addEventListener('click', () => this.handleResetData());

    // Search
    let searchDebounce;
    this.searchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        this.state.searchQuery = e.target.value.trim().toLowerCase();
        this.clearSearchBtn.classList.toggle('hidden', !this.state.searchQuery);
        this.state.currentPage = 1;
        this.render();
      }, 150);
    });

    this.clearSearchBtn.addEventListener('click', () => {
      this.searchInput.value = '';
      this.state.searchQuery = '';
      this.clearSearchBtn.classList.add('hidden');
      this.state.currentPage = 1;
      this.render();
      this.searchInput.focus();
    });

    // Filters
    this.deptFilter.addEventListener('change', (e) => {
      this.state.department = e.target.value;
      this.state.currentPage = 1;
      this.render();
    });

    this.yearFilter.addEventListener('change', (e) => {
      this.state.year = e.target.value;
      this.state.currentPage = 1;
      this.render();
    });

    this.statusPills.forEach(pill => {
      pill.addEventListener('click', () => {
        this.statusPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.state.status = pill.dataset.status;
        this.state.currentPage = 1;
        this.render();
      });
    });

    this.clearAllFiltersBtn.addEventListener('click', () => {
      this.resetFilters();
    });

    // View switchers
    this.tableViewBtn.addEventListener('click', () => this.switchView('table'));
    this.cardViewBtn.addEventListener('click', () => this.switchView('card'));

    // Sorting columns
    document.querySelectorAll('.th-sortable').forEach(th => {
      th.addEventListener('click', () => {
        const field = th.dataset.sort;
        if (this.state.sortField === field) {
          this.state.sortDirection = this.state.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          this.state.sortField = field;
          this.state.sortDirection = field === 'gpa' || field === 'attendance' ? 'desc' : 'asc';
        }
        this.render();
      });
    });

    // Select all rows
    this.selectAllCheckbox.addEventListener('change', (e) => {
      const visible = this.getFilteredStudents();
      const pageStudents = this.getPagedStudents(visible);
      if (e.target.checked) {
        pageStudents.forEach(s => this.selectedIds.add(s.id));
      } else {
        pageStudents.forEach(s => this.selectedIds.delete(s.id));
      }
      this.updateBulkActionBar();
      this.renderTableBody(pageStudents);
    });

    // Bulk buttons
    this.bulkDeleteBtn.addEventListener('click', () => this.handleBulkDelete());
    this.deselectAllBtn.addEventListener('click', () => {
      this.selectedIds.clear();
      this.selectAllCheckbox.checked = false;
      this.updateBulkActionBar();
      this.render();
    });

    // Pagination Controls
    this.pageSizeSelect.addEventListener('change', (e) => {
      this.state.pageSize = parseInt(e.target.value, 10);
      this.state.currentPage = 1;
      this.render();
    });

    this.prevPageBtn.addEventListener('click', () => {
      if (this.state.currentPage > 1) {
        this.state.currentPage--;
        this.render();
      }
    });

    this.nextPageBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(this.getFilteredStudents().length / this.state.pageSize);
      if (this.state.currentPage < totalPages) {
        this.state.currentPage++;
        this.render();
      }
    });

    // Add Student Button
    this.openAddModalBtn.addEventListener('click', () => this.openAddStudentModal());

    // Modal close buttons
    this.closeStudentModalBtn.addEventListener('click', () => this.closeModal(this.studentModal));
    this.cancelStudentModalBtn.addEventListener('click', () => this.closeModal(this.studentModal));

    this.closeViewModalBtn.addEventListener('click', () => this.closeModal(this.viewModal));
    this.closeViewBtnSecondary.addEventListener('click', () => this.closeModal(this.viewModal));

    this.cancelDeleteBtn.addEventListener('click', () => this.closeModal(this.deleteModal));

    // Outside click to close modal
    [this.studentModal, this.viewModal, this.deleteModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal(modal);
      });
    });

    // Color swatches picker
    this.colorPalette.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        this.colorPalette.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        const color = swatch.dataset.color;
        this.avatarColorInput.value = color;
        this.avatarPreview.style.background = color;
      });
    });

    // Live avatar initials on name typing
    this.fullNameInput.addEventListener('input', (e) => {
      this.avatarPreview.textContent = this.getInitials(e.target.value) || 'ST';
    });

    // Student Form Submit
    this.studentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    // Delete Confirmation
    this.confirmDeleteBtn.addEventListener('click', () => this.executeDelete());

    // View Modal Edit action
    this.viewEditStudentBtn.addEventListener('click', () => {
      const studentId = this.viewEditStudentBtn.dataset.studentId;
      this.closeModal(this.viewModal);
      const student = this.students.find(s => s.id === studentId);
      if (student) this.openEditStudentModal(student);
    });
  }

  // ==========================================
  // Rendering & State Compute
  // ==========================================
  getFilteredStudents() {
    return this.students.filter(student => {
      // Search
      if (this.state.searchQuery) {
        const query = this.state.searchQuery;
        const matchesName = student.fullName.toLowerCase().includes(query);
        const matchesId = student.studentId.toLowerCase().includes(query);
        const matchesEmail = student.email.toLowerCase().includes(query);
        const matchesDept = student.department.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesEmail && !matchesDept) return false;
      }

      // Department
      if (this.state.department !== 'ALL' && student.department !== this.state.department) {
        return false;
      }

      // Year
      if (this.state.year !== 'ALL' && student.year !== this.state.year) {
        return false;
      }

      // Status
      if (this.state.status !== 'ALL' && student.status !== this.state.status) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let valA = a[this.state.sortField];
      let valB = b[this.state.sortField];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return this.state.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.state.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  getPagedStudents(filtered) {
    const start = (this.state.currentPage - 1) * this.state.pageSize;
    return filtered.slice(start, start + this.state.pageSize);
  }

  render() {
    this.renderKPIs();
    const filtered = this.getFilteredStudents();
    const paged = this.getPagedStudents(filtered);

    this.updateSortHeaders();
    this.updatePagination(filtered.length);

    const hasResults = filtered.length > 0;
    this.emptyState.classList.toggle('hidden', hasResults);

    if (this.state.activeView === 'table') {
      this.tableViewSection.classList.toggle('hidden', !hasResults);
      this.cardViewSection.classList.add('hidden');
      if (hasResults) this.renderTableBody(paged);
    } else {
      this.tableViewSection.classList.add('hidden');
      this.cardViewSection.classList.toggle('hidden', !hasResults);
      if (hasResults) this.renderCardsGrid(paged);
    }

    this.updateBulkActionBar();
  }

  renderKPIs() {
    const total = this.students.length;
    this.statTotalStudents.textContent = total;

    if (total === 0) {
      this.statActiveRatio.textContent = '0% active';
      this.statEnrolledDetail.textContent = 'No records in database';
      this.statAvgGpa.textContent = '0.00';
      this.statGpaGrade.textContent = 'N/A';
      this.statAvgAttendance.textContent = '0%';
      this.statAttendanceBar.style.width = '0%';
      this.statHonorRollCount.textContent = '0';
      return;
    }

    const activeCount = this.students.filter(s => s.status === 'Active').length;
    const activePercent = Math.round((activeCount / total) * 100);
    this.statActiveRatio.textContent = `${activePercent}% active`;
    this.statEnrolledDetail.textContent = `${activeCount} active, ${total - activeCount} on leave/inactive`;

    const totalGpa = this.students.reduce((acc, s) => acc + (parseFloat(s.gpa) || 0), 0);
    const avgGpa = (totalGpa / total).toFixed(2);
    this.statAvgGpa.textContent = avgGpa;
    this.statGpaGrade.textContent = this.getGpaTierLabel(avgGpa);

    const totalAtt = this.students.reduce((acc, s) => acc + (parseInt(s.attendance, 10) || 0), 0);
    const avgAtt = Math.round(totalAtt / total);
    this.statAvgAttendance.textContent = `${avgAtt}%`;
    this.statAttendanceBar.style.width = `${Math.min(100, Math.max(0, avgAtt))}%`;

    const honorRollCount = this.students.filter(s => parseFloat(s.gpa) >= 3.8).length;
    this.statHonorRollCount.textContent = honorRollCount;
  }

  renderTableBody(pagedStudents) {
    this.studentsTableBody.innerHTML = '';

    pagedStudents.forEach(student => {
      const isSelected = this.selectedIds.has(student.id);
      const tr = document.createElement('tr');
      if (isSelected) tr.classList.add('row-selected');

      const initials = this.getInitials(student.fullName);
      const gpaTierClass = this.getGpaTierClass(student.gpa);
      const statusClass = this.getStatusClass(student.status);

      tr.innerHTML = `
        <td class="td-checkbox">
          <input type="checkbox" class="row-checkbox" data-id="${student.id}" ${isSelected ? 'checked' : ''} aria-label="Select student ${this.escapeHtml(student.fullName)}">
        </td>
        <td>
          <span class="font-mono text-muted">${this.escapeHtml(student.studentId)}</span>
        </td>
        <td>
          <div class="profile-cell">
            <div class="avatar-badge" style="background: ${student.avatarColor || '#6366f1'}">${initials}</div>
            <div class="profile-info">
              <span class="profile-name" data-action="view" data-id="${student.id}">${this.escapeHtml(student.fullName)}</span>
              <span class="profile-email">${this.escapeHtml(student.email)}</span>
            </div>
          </div>
        </td>
        <td>
          <div class="dept-cell">
            <span class="dept-name">${this.escapeHtml(student.department)}</span>
            <span class="year-text">${this.escapeHtml(student.year)}</span>
          </div>
        </td>
        <td>
          <span class="gpa-tag ${gpaTierClass}">${Number(student.gpa).toFixed(2)}</span>
        </td>
        <td>
          <div class="attendance-cell">
            <span class="attendance-val">${student.attendance}%</span>
            <div class="mini-progress">
              <div class="mini-progress-fill" style="width: ${student.attendance}%; background: ${student.attendance >= 85 ? 'var(--success)' : student.attendance >= 75 ? 'var(--warning)' : 'var(--danger)'}"></div>
            </div>
          </div>
        </td>
        <td>
          <span class="status-badge ${statusClass}">${this.escapeHtml(student.status)}</span>
        </td>
        <td>
          <div class="action-buttons">
            <button class="action-btn view-btn-row" data-action="view" data-id="${student.id}" title="View Student Dossier">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
            <button class="action-btn edit-btn" data-action="edit" data-id="${student.id}" title="Edit Student Record">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </button>
            <button class="action-btn delete-btn" data-action="delete" data-id="${student.id}" title="Delete Record">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </td>
      `;

      // Event delegation inside row
      tr.querySelector('.row-checkbox').addEventListener('change', (e) => {
        if (e.target.checked) {
          this.selectedIds.add(student.id);
          tr.classList.add('row-selected');
        } else {
          this.selectedIds.delete(student.id);
          tr.classList.remove('row-selected');
        }
        this.updateBulkActionBar();
        this.updateSelectAllCheckbox(pagedStudents);
      });

      tr.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = btn.dataset.action;
          if (action === 'view') this.openViewModal(student);
          else if (action === 'edit') this.openEditStudentModal(student);
          else if (action === 'delete') this.confirmSingleDelete(student);
        });
      });

      this.studentsTableBody.appendChild(tr);
    });

    this.updateSelectAllCheckbox(pagedStudents);
  }

  renderCardsGrid(pagedStudents) {
    this.cardViewSection.innerHTML = '';

    pagedStudents.forEach(student => {
      const card = document.createElement('div');
      card.className = 'student-card';
      const initials = this.getInitials(student.fullName);
      const statusClass = this.getStatusClass(student.status);
      const gpaTierClass = this.getGpaTierClass(student.gpa);

      card.innerHTML = `
        <div class="card-top-row">
          <div class="card-avatar-wrap">
            <div class="avatar-badge" style="background: ${student.avatarColor || '#6366f1'}">${initials}</div>
            <div>
              <h3 class="profile-name" data-action="view">${this.escapeHtml(student.fullName)}</h3>
              <span class="font-mono text-muted" style="font-size: 0.75rem;">${this.escapeHtml(student.studentId)}</span>
            </div>
          </div>
          <span class="status-badge ${statusClass}">${this.escapeHtml(student.status)}</span>
        </div>

        <div class="card-dept-tag">
          <strong>${this.escapeHtml(student.department)}</strong> · ${this.escapeHtml(student.year)}
        </div>

        <div class="card-meta-row">
          <div class="card-meta-item">
            <span class="card-meta-label">GPA</span>
            <span class="card-meta-val"><span class="gpa-tag ${gpaTierClass}">${Number(student.gpa).toFixed(2)}</span></span>
          </div>
          <div class="card-meta-item">
            <span class="card-meta-label">Attendance</span>
            <span class="card-meta-val">${student.attendance}%</span>
          </div>
        </div>

        <div class="card-actions-row">
          <span class="profile-email text-muted">${this.escapeHtml(student.email)}</span>
          <div class="action-buttons">
            <button class="action-btn view-btn-row" data-action="view" title="View Profile">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
            <button class="action-btn edit-btn" data-action="edit" title="Edit Student">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </button>
            <button class="action-btn delete-btn" data-action="delete" title="Delete Student">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      `;

      card.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
          const action = btn.dataset.action;
          if (action === 'view') this.openViewModal(student);
          else if (action === 'edit') this.openEditStudentModal(student);
          else if (action === 'delete') this.confirmSingleDelete(student);
        });
      });

      this.cardViewSection.appendChild(card);
    });
  }

  updateSortHeaders() {
    document.querySelectorAll('.th-sortable').forEach(th => {
      th.classList.remove('sorted-asc', 'sorted-desc');
      if (th.dataset.sort === this.state.sortField) {
        th.classList.add(this.state.sortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc');
      }
    });
  }

  updatePagination(totalItems) {
    const totalPages = Math.max(1, Math.ceil(totalItems / this.state.pageSize));
    if (this.state.currentPage > totalPages) {
      this.state.currentPage = totalPages;
    }

    const start = totalItems === 0 ? 0 : (this.state.currentPage - 1) * this.state.pageSize + 1;
    const end = Math.min(totalItems, this.state.currentPage * this.state.pageSize);
    this.paginationInfo.textContent = `Showing ${start} to ${end} of ${totalItems} students`;

    this.prevPageBtn.disabled = this.state.currentPage <= 1;
    this.nextPageBtn.disabled = this.state.currentPage >= totalPages;

    this.pageNumbers.innerHTML = '';
    for (let p = 1; p <= totalPages; p++) {
      if (totalPages > 6 && Math.abs(p - this.state.currentPage) > 2 && p !== 1 && p !== totalPages) {
        if (p === 2 || p === totalPages - 1) {
          const span = document.createElement('span');
          span.textContent = '...';
          span.style.padding = '0 0.25rem';
          span.style.color = 'var(--text-muted)';
          this.pageNumbers.appendChild(span);
        }
        continue;
      }

      const btn = document.createElement('button');
      btn.className = `page-num ${p === this.state.currentPage ? 'active' : ''}`;
      btn.textContent = p;
      btn.addEventListener('click', () => {
        this.state.currentPage = p;
        this.render();
      });
      this.pageNumbers.appendChild(btn);
    }
  }

  updateSelectAllCheckbox(pagedStudents) {
    if (pagedStudents.length === 0) {
      this.selectAllCheckbox.checked = false;
      this.selectAllCheckbox.indeterminate = false;
      return;
    }
    const selectedOnPage = pagedStudents.filter(s => this.selectedIds.has(s.id)).length;
    this.selectAllCheckbox.checked = selectedOnPage === pagedStudents.length;
    this.selectAllCheckbox.indeterminate = selectedOnPage > 0 && selectedOnPage < pagedStudents.length;
  }

  updateBulkActionBar() {
    const count = this.selectedIds.size;
    if (count > 0) {
      this.bulkActionBar.classList.remove('hidden');
      this.selectedCount.textContent = count;
    } else {
      this.bulkActionBar.classList.add('hidden');
    }
  }

  switchView(viewName) {
    this.state.activeView = viewName;
    this.tableViewBtn.classList.toggle('active', viewName === 'table');
    this.cardViewBtn.classList.toggle('active', viewName === 'card');
    this.render();
  }

  resetFilters() {
    this.searchInput.value = '';
    this.clearSearchBtn.classList.add('hidden');
    this.deptFilter.value = 'ALL';
    this.yearFilter.value = 'ALL';
    this.statusPills.forEach(p => p.classList.toggle('active', p.dataset.status === 'ALL'));

    this.state.searchQuery = '';
    this.state.department = 'ALL';
    this.state.year = 'ALL';
    this.state.status = 'ALL';
    this.state.currentPage = 1;
    this.render();
    this.showToast('Filters reset to default', 'info');
  }

  // ==========================================
  // Modals & CRUD Operations
  // ==========================================
  openModal(modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeModal(modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  clearFormValidation() {
    document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  }

  suggestStudentId() {
    const numbers = this.students
      .map(s => {
        const match = s.studentId && s.studentId.match(/\d+$/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .filter(n => !isNaN(n));
    const nextNum = (numbers.length > 0 ? Math.max(...numbers) : 0) + 1;
    return `STU-2026-${String(nextNum).padStart(3, '0')}`;
  }

  openAddStudentModal() {
    this.clearFormValidation();
    this.studentForm.reset();
    this.studentInternalId.value = '';
    this.modalTitle.textContent = 'Register New Student';
    this.modalSubtitle.textContent = 'Add academic and personal profile details to student records.';
    this.saveBtnText.textContent = 'Register Student';

    // Set suggested ID
    this.studentIdInput.value = this.suggestStudentId();
    this.studentIdInput.disabled = false;

    // Pick first color
    const defaultColor = '#6366f1';
    this.avatarColorInput.value = defaultColor;
    this.avatarPreview.style.background = defaultColor;
    this.avatarPreview.textContent = 'ST';
    this.colorPalette.querySelectorAll('.color-swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.color === defaultColor);
    });

    this.statusInput.value = 'Active';
    this.yearInput.value = 'Freshman (1st Year)';
    this.gpaInput.value = '3.50';
    this.attendanceInput.value = '95';

    this.openModal(this.studentModal);
    setTimeout(() => this.fullNameInput.focus(), 150);
  }

  openEditStudentModal(student) {
    this.clearFormValidation();
    this.studentInternalId.value = student.id;
    this.modalTitle.textContent = 'Edit Student Record';
    this.modalSubtitle.textContent = `Updating information for ${student.fullName} (${student.studentId})`;
    this.saveBtnText.textContent = 'Save Changes';

    this.fullNameInput.value = student.fullName;
    this.studentIdInput.value = student.studentId;
    this.studentIdInput.disabled = false; // allow editing roll no if needed
    this.emailInput.value = student.email;
    this.phoneInput.value = student.phone || '';
    this.departmentInput.value = student.department;
    this.yearInput.value = student.year;
    this.statusInput.value = student.status;
    this.gpaInput.value = student.gpa;
    this.attendanceInput.value = student.attendance;
    this.notesInput.value = student.notes || '';

    const color = student.avatarColor || '#6366f1';
    this.avatarColorInput.value = color;
    this.avatarPreview.style.background = color;
    this.avatarPreview.textContent = this.getInitials(student.fullName);

    this.colorPalette.querySelectorAll('.color-swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.color === color);
    });

    this.openModal(this.studentModal);
    setTimeout(() => this.fullNameInput.focus(), 150);
  }

  validateForm() {
    this.clearFormValidation();
    let isValid = true;

    // Full Name
    const name = this.fullNameInput.value.trim();
    if (!name) {
      this.showFieldError('fullNameInput', 'fullNameError', 'Full name is required.');
      isValid = false;
    } else if (name.length < 2) {
      this.showFieldError('fullNameInput', 'fullNameError', 'Name must be at least 2 characters.');
      isValid = false;
    }

    // Student ID
    const studentId = this.studentIdInput.value.trim();
    if (!studentId) {
      this.showFieldError('studentIdInput', 'studentIdError', 'Student ID is required.');
      isValid = false;
    } else {
      // Check uniqueness
      const currentInternalId = this.studentInternalId.value;
      const duplicate = this.students.find(s => s.studentId.toLowerCase() === studentId.toLowerCase() && s.id !== currentInternalId);
      if (duplicate) {
        this.showFieldError('studentIdInput', 'studentIdError', 'This Student ID already exists.');
        isValid = false;
      }
    }

    // Email
    const email = this.emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      this.showFieldError('emailInput', 'emailError', 'Email address is required.');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      this.showFieldError('emailInput', 'emailError', 'Please enter a valid email address.');
      isValid = false;
    }

    // Department
    if (!this.departmentInput.value) {
      this.showFieldError('departmentInput', 'departmentError', 'Please select an academic department.');
      isValid = false;
    }

    // GPA
    const gpa = parseFloat(this.gpaInput.value);
    if (isNaN(gpa) || gpa < 0 || gpa > 4.00) {
      this.showFieldError('gpaInput', 'gpaError', 'GPA must be a number between 0.00 and 4.00');
      isValid = false;
    }

    // Attendance
    const att = parseInt(this.attendanceInput.value, 10);
    if (isNaN(att) || att < 0 || att > 100) {
      this.showFieldError('attendanceInput', 'attendanceError', 'Attendance must be between 0% and 100%');
      isValid = false;
    }

    return isValid;
  }

  showFieldError(inputId, errorId, msg) {
    const input = document.getElementById(inputId);
    const err = document.getElementById(errorId);
    if (input) input.classList.add('is-invalid');
    if (err) err.textContent = msg;
  }

  async handleFormSubmit() {
    if (!this.validateForm()) return;

    const id = this.studentInternalId.value;
    const payload = {
      fullName: this.fullNameInput.value.trim(),
      studentId: this.studentIdInput.value.trim().toUpperCase(),
      email: this.emailInput.value.trim().toLowerCase(),
      phone: this.phoneInput.value.trim(),
      department: this.departmentInput.value,
      year: this.yearInput.value,
      status: this.statusInput.value,
      gpa: parseFloat(this.gpaInput.value),
      attendance: parseInt(this.attendanceInput.value, 10),
      avatarColor: this.avatarColorInput.value || '#6366f1',
      notes: this.notesInput.value.trim()
    };

    if (id) {
      // UPDATE
      const updated = await this.storage.update(id, payload);
      if (updated) {
        const index = this.students.findIndex(s => s.id === id);
        if (index !== -1) this.students[index] = updated;
        this.showToast(`Updated record for ${updated.fullName}`, 'success');
      }
    } else {
      // CREATE
      const created = await this.storage.create(payload);
      if (created) {
        this.students.unshift(created);
        this.showToast(`Registered new student ${created.fullName}`, 'success');
      }
    }

    this.closeModal(this.studentModal);
    this.render();
  }

  // ==========================================
  // View Dossier Modal
  // ==========================================
  openViewModal(student) {
    document.getElementById('viewFullName').textContent = student.fullName;
    document.getElementById('viewStudentId').textContent = student.studentId;
    document.getElementById('viewAvatar').textContent = this.getInitials(student.fullName);
    document.getElementById('viewAvatar').style.background = student.avatarColor || '#6366f1';

    const statusBadge = document.getElementById('viewStatusBadge');
    statusBadge.textContent = student.status;
    statusBadge.className = `status-badge ${this.getStatusClass(student.status)}`;

    document.getElementById('viewGpa').textContent = Number(student.gpa).toFixed(2);
    document.getElementById('viewGpaBadge').textContent = this.getGpaTierLabel(student.gpa);
    document.getElementById('viewAttendance').textContent = `${student.attendance}%`;
    document.getElementById('viewDepartment').textContent = student.department;
    document.getElementById('viewYear').textContent = student.year;

    document.getElementById('viewEmail').textContent = student.email;
    document.getElementById('viewPhone').textContent = student.phone || 'Not provided';

    const createdDate = student.createdAt ? new Date(student.createdAt).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    }) : 'Active Record';
    document.getElementById('viewCreatedAt').textContent = createdDate;

    document.getElementById('viewNotes').textContent = student.notes || 'No academic notes recorded.';
    this.viewEditStudentBtn.dataset.studentId = student.id;

    this.openModal(this.viewModal);
  }

  // ==========================================
  // Deletions
  // ==========================================
  confirmSingleDelete(student) {
    this.state.targetStudentIdForDelete = student.id;
    this.state.isBulkDelete = false;

    this.deleteModalTitle.textContent = 'Confirm Student Deletion';
    this.deleteModalMessage.textContent = 'Are you sure you want to permanently delete this student record? This cannot be undone.';
    this.deleteTargetName.textContent = student.fullName;
    this.deleteTargetId.textContent = `${student.studentId} • ${student.department}`;
    document.getElementById('deletePreviewBox').classList.remove('hidden');

    this.openModal(this.deleteModal);
  }

  handleBulkDelete() {
    const count = this.selectedIds.size;
    if (count === 0) return;

    this.state.isBulkDelete = true;
    this.deleteModalTitle.textContent = `Confirm Bulk Deletion`;
    this.deleteModalMessage.textContent = `Are you sure you want to delete ${count} selected student record(s)? This action is permanent.`;
    document.getElementById('deletePreviewBox').classList.add('hidden');

    this.openModal(this.deleteModal);
  }

  async executeDelete() {
    if (this.state.isBulkDelete) {
      const idsToDelete = Array.from(this.selectedIds);
      for (const id of idsToDelete) {
        await this.storage.delete(id);
      }
      this.students = this.students.filter(s => !this.selectedIds.has(s.id));
      const deletedCount = this.selectedIds.size;
      this.selectedIds.clear();
      this.selectAllCheckbox.checked = false;
      this.closeModal(this.deleteModal);
      this.showToast(`Permanently deleted ${deletedCount} student records`, 'info');
      this.render();
    } else {
      const targetId = this.state.targetStudentIdForDelete;
      if (!targetId) return;

      const target = this.students.find(s => s.id === targetId);
      const name = target ? target.fullName : 'Student';

      await this.storage.delete(targetId);
      this.students = this.students.filter(s => s.id !== targetId);
      this.selectedIds.delete(targetId);

      this.closeModal(this.deleteModal);
      this.showToast(`Deleted ${name} from records`, 'info');
      this.render();
    }
  }

  async handleResetData() {
    if (confirm('Reset database to default demo students? All current customizations will be replaced with standard sample profiles.')) {
      this.students = await this.storage.reset();
      this.selectedIds.clear();
      this.selectAllCheckbox.checked = false;
      this.resetFilters();
      this.showToast('Database reset to initial sample student profiles', 'success');
    }
  }

  // ==========================================
  // Exports
  // ==========================================
  exportCsv() {
    const list = this.getFilteredStudents();
    if (list.length === 0) {
      return this.showToast('No students to export', 'error');
    }

    const headers = ['Student ID', 'Full Name', 'Email', 'Phone', 'Department', 'Year', 'GPA', 'Attendance %', 'Status', 'Notes', 'Created At'];
    const rows = list.map(s => [
      `"${(s.studentId || '').replace(/"/g, '""')}"`,
      `"${(s.fullName || '').replace(/"/g, '""')}"`,
      `"${(s.email || '').replace(/"/g, '""')}"`,
      `"${(s.phone || '').replace(/"/g, '""')}"`,
      `"${(s.department || '').replace(/"/g, '""')}"`,
      `"${(s.year || '').replace(/"/g, '""')}"`,
      s.gpa !== undefined ? s.gpa : '',
      s.attendance !== undefined ? s.attendance : '',
      `"${(s.status || '').replace(/"/g, '""')}"`,
      `"${(s.notes || '').replace(/"/g, '""')}"`,
      `"${(s.createdAt || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    this.downloadBlob(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }), `students_export_${Date.now()}.csv`);
    this.showToast(`Exported ${list.length} student records to CSV`, 'success');
  }

  exportJson() {
    const list = this.getFilteredStudents();
    if (list.length === 0) {
      return this.showToast('No students to export', 'error');
    }
    const jsonContent = JSON.stringify(list, null, 2);
    this.downloadBlob(new Blob([jsonContent], { type: 'application/json' }), `students_export_${Date.now()}.json`);
    this.showToast(`Exported ${list.length} student records to JSON`, 'success');
  }

  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ==========================================
  // Toast Notifications
  // ==========================================
  showToast(message, type = 'info', title = '') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
      if (!title) title = 'Success';
    } else if (type === 'error') {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
      if (!title) title = 'Error';
    } else {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
      if (!title) title = 'Notice';
    }

    toast.innerHTML = `
      ${iconSvg}
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${this.escapeHtml(message)}</div>
      </div>
      <button class="toast-close" aria-label="Dismiss notification">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => {
      this.removeToast(toast);
    });

    this.toastContainer.appendChild(toast);

    // Auto dismiss after 3.5s
    setTimeout(() => {
      this.removeToast(toast);
    }, 3500);
  }

  removeToast(toast) {
    if (!toast || !toast.parentElement) return;
    toast.classList.add('toast-hide');
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 200);
  }

  // ==========================================
  // Helper Utilities
  // ==========================================
  getInitials(name) {
    if (!name) return 'ST';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  getGpaTierClass(gpa) {
    const val = parseFloat(gpa);
    if (val >= 3.6) return 'gpa-high';
    if (val >= 3.0) return 'gpa-mid';
    return 'gpa-low';
  }

  getGpaTierLabel(gpa) {
    const val = parseFloat(gpa);
    if (val >= 3.8) return 'Dean\'s Honor';
    if (val >= 3.5) return 'Distinction';
    if (val >= 3.0) return 'Good Standing';
    return 'Academic Alert';
  }

  getStatusClass(status) {
    const s = (status || '').toLowerCase();
    if (s === 'active') return 'status-active';
    if (s === 'on leave') return 'status-leave';
    return 'status-inactive';
  }

  escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
