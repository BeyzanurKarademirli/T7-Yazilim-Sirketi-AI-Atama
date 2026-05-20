export const translations = {
  en: {
    dashboard: "Dashboard",
    employees: "Employees",
<<<<<<< HEAD
    tasks: "Tasks",
    departments: "Departments",
    projects: "Projects",
    askAi: "Ask AI",
    settings: "Settings",

    askAiDescription: "Ask questions about employees, tasks, departments, and projects.",
    askAiWelcome:
      "Hello! I can answer questions about your organization using dashboard data. Try one of the suggestions below or type your own question.",
    askAiPlaceholder: "Ask about employees, tasks, or projects...",
    askAiSend: "Send",
    askAiThinking: "Thinking...",
    askAiClearChat: "Clear chat",
    askAiSuggestionEmployees: "How many employees do we have?",
    askAiSuggestionSalary: "What is the total salary?",
    askAiSuggestionTasks: "How many tasks are in progress?",
    askAiSuggestionProjects: "List our projects",
    askAiSuggestionAssign: "Who should be assigned to a task?",
    askAiError: "Could not reach the AI service. Showing a local answer.",

    loginTitle: "Sign in",
    loginSubtitle: "Enter your credentials to access the dashboard.",
    username: "Username",
    password: "Password",
    signIn: "Sign in",
    loginDefaultHint: "Default: admin / admin1234 — change anytime in Settings.",
    errorInvalidCredentials: "Invalid username or password.",
    errorWrongPassword: "Current password is incorrect.",
    errorPasswordMismatch: "New passwords do not match.",
    errorPasswordTooShort: "Password must be at least 6 characters.",
    toastLoggedOut: "Signed out successfully.",
    signOut: "Sign out",
    signOutDescription: "End your current session and return to the login screen.",

    brandTitle: "Employee Admin",
    brandSubtitle: "Management Dashboard",
    brandTitleAi: "AI Atama",
    brandSubtitleAi: "Admin Panel",
    navAssignTask: "Assign Task",
    navAssignmentLog: "Assignment Log",
    pageSubAssign: "Define a task and review AI suggestions",
    pageSubDashboard: "Team workload distribution",
    pageSubEmployees: "Add employees and edit profiles",
    pageSubLog: "All decisions are recorded and cannot be deleted",
    pageSubSettings: "Profile, algorithm and system preferences",
    groqApiActive: "Groq API active",
    taskInfoSection: "Task information",
    taskCategory: "Category",
    taskDescription: "Description",
    getAiSuggestion: "Get AI Suggestion",
    unavailableRemoved: "Unavailable employees removed",
    aiSuggestions: "AI suggestions",
    candidateCount: "candidates",
    accept: "Accept",
    reject: "Reject",
    assignedBadge: "Assigned",
    assignedFlash: "assigned to task — logged",
    rejectedFlash: "rejected",
    priorityCritical: "Critical",
    activeTasksMetric: "Active tasks",
    acceptRate: "Acceptance rate",
    acceptRateTarget: "target ≥ 65%",
    stdDeviation: "Std. deviation σ",
    thresholdExceeded: "threshold exceeded",
    workloadDistribution: "Workload distribution",
    onLeave: "On leave",
    criticalLoad: "Critical",
    busyLoad: "Busy",
    newEmployeeSection: "Add new employee",
    currentEmployeesSection: "Current employees",
    employeesCount: "employees",
    skillsRequired: "Skills *",
    addSkillRow: "Add skill",
    addEmployeeBtn: "Add employee",
    clearForm: "Clear",
    maxCapacity: "Max. capacity",
    assignmentRoleEmployee: "Employee",
    assignmentRoleScrum: "Scrum Master",
    availableBadge: "Available",
    employeeAddedOk: "Employee added successfully!",
    employeeProfileUpdatedOk: "Profile updated!",
    errorNameRequired: "Full name is required.",
    errorEmailInvalid: "Enter a valid email.",
    errorSkillsRequired: "Add at least one skill.",
    logEmpty: "No records yet",
    logImmutable: "All decisions — cannot be deleted",
    scoreLabel: "Score",
    settingsProfile: "Profile",
    settingsAlgorithm: "Algorithm",
    algorithmWeights: "Scoring weights",
    skillWeightLabel: "Skill weight",
    workWeightLabel: "Workload weight",
    weightsMustSum: "Total weight must equal 100%.",
=======
    departments: "Departments",
    projects: "Projects",
    settings: "Settings",

    brandTitle: "Employee Admin",
    brandSubtitle: "Management Dashboard",
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8

    overview: "Overview of your organization.",

    openMenu: "Open menu",
    notifications: "Notifications",
    newEmployee: "New Employee",
    searchEmployees: "Search employees...",

    totalEmployees: "Total Employees",
    totalSalary: "Total Salary",
    averageSalary: "Average Salary",
    employeesInProjects: "Employees in Projects",

    departmentEng: "Engineering",
    departmentHr: "HR",
    departmentFin: "Finance",
    departmentOps: "Operations",

    roleFrontendEngineer: "Frontend Engineer",
    roleBackendEngineer: "Backend Engineer",
    roleFullstackEngineer: "Fullstack Engineer",
    roleHrSpecialist: "HR Specialist",
    roleAccountant: "Accountant",
    roleManager: "Manager",

    name: "Name",
    email: "Email",
    department: "Department",
    salary: "Salary",
    role: "Role",
    actions: "Actions",

    namePlaceholder: "e.g. Ada Lovelace",
    emailPlaceholder: "e.g. ada@company.com",
    salaryPlaceholder: "e.g. 85000",

    addEmployee: "Add Employee",
    editEmployee: "Edit Employee",
    deleteEmployee: "Delete Employee",

    addEmployeeDesc: "Fill in the details to create a new employee.",
    editEmployeeDesc: "Update the employee details.",

    cancel: "Cancel",
    saveChanges: "Save changes",

    noEmployees: "No employees yet. Click “Add Employee” to create your first record.",
    employeesDescription: "Manage employee records, departments, and compensation.",
<<<<<<< HEAD
    tasksDescription: "Assign tasks to employees and track sprint progress.",
=======
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
    departmentsDescription: "Manage departments and reporting structure.",
    settingsDescription: "Configure your dashboard preferences.",

    totalsEmployeesLabel: "Total employees",
    totalsSalaryLabel: "Total salary",

    toastEmployeeCreated: "Employee created",
    toastEmployeeUpdated: "Employee updated",
    toastEmployeeDeleted: "Employee deleted",
<<<<<<< HEAD
    toastEmployeeAvailable: "Marked as available",
    toastEmployeeOnLeave: "Marked as on leave",
    toastTaskAssigned: "Task assigned",
    toastTaskRejected: "Suggestion rejected",
=======
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8

    addDepartment: "Add Department",
    deleteDepartment: "Delete Department",
    departmentName: "Department name",
    departmentNamePlaceholder: "e.g. Marketing",
    noDepartments: "No departments yet.",

    toastDepartmentAdded: "Department added",
    toastDepartmentDeleted: "Department deleted",

<<<<<<< HEAD
    // Tasks
    taskAssignment: "Task Assignment",
    addTask: "Add Task",
    deleteTask: "Delete Task",
    taskTitle: "Task title",
    taskTitlePlaceholder: "e.g. Prepare dashboard widgets",
    taskStatus: "Status",
    dueDate: "Due date",
    priority: "Priority",
    assignee: "Assignee",
    noTasks: "No tasks yet.",
    statusTodo: "Todo",
    statusInProgress: "In Progress",
    statusDone: "Done",
    priorityLow: "Low",
    priorityMedium: "Medium",
    priorityHigh: "High",

    // Employee profile
    employeeProfile: "Employee Profile",
    employeeProfileDescription: "Detailed summary and related projects of the employee.",
    viewProfile: "View profile",
    backToEmployees: "Back to employees",
    noProjectsForEmployee: "No project assignment yet.",
    seeTaskBoardHint: "Track details from the Tasks page.",
    activeTasks: "Active tasks",

=======
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
    // Projects
    projectsDescription: "Manage projects, groups, and employee assignments.",
    addProject: "Add Project",
    projectName: "Project name",
    projectDescription: "Description",
    groupName: "Group name",
    addGroup: "Add Group",
    assignEmployee: "Assign Employee",
    selectEmployee: "Select employee",
    deleteProject: "Delete Project",
    totalGroups: "Total groups",
    toastProjectCreated: "Project created",
    toastProjectDeleted: "Project deleted",
    toastGroupCreated: "Group created",
    toastEmployeeAssigned: "Employee assigned",
    toastEmployeeRemoved: "Employee removed",

    // Settings tabs
    userSettings: "User Settings",
    appearance: "Appearance",
    language: "Language",
    systemSettings: "System Settings",
    security: "Security",
    dataBackup: "Data & Backup",

    // Settings: user
    editProfile: "Edit profile",
    profilePicture: "Profile picture",
    changePassword: "Change password",
    currentPassword: "Current password",
    newPassword: "New password",
    confirmPassword: "Confirm password",
    updatePassword: "Update password",
    notificationsPrefs: "Notification preferences",
    notifyByEmail: "Email notifications",
    notifyByToast: "Toast notifications",
    saveProfile: "Save profile",

    // Settings: appearance
    theme: "Theme",
    themeSystem: "System",
    themeLight: "Light",
    themeDark: "Dark",
    darkMode: "Dark Mode",
    fontSize: "Font size",
    fontSizeSm: "Small",
    fontSizeMd: "Medium",
    fontSizeLg: "Large",
    collapseSidebar: "Collapse sidebar",

    // Settings: language
    selectLanguage: "Select language",
    english: "English",
    turkish: "Turkish",

    // Settings: system
    manageRoles: "Manage roles",
    cardsVisibility: "Cards visibility",

    // Settings: security
    enable2fa: "Enable 2FA",
    lastLogin: "Last login",
    logoutAll: "Logout from all devices",

    // Settings: data & backup
    exportJson: "Export JSON",
    exportCsv: "Export CSV",
    importJson: "Import JSON",
    resetData: "Reset dashboard data",
    importHint: "Import employees and departments from a JSON file.",

    toastSaved: "Saved",
    toastPasswordUpdated: "Password updated",
    toastLanguageUpdated: "Language updated",
    toastExported: "Exported",
    toastImported: "Imported",
    toastReset: "Data reset",
    saved: "Saved",

<<<<<<< HEAD
    // Analytics
    employeesByDepartment: "Employees by Department",
    taskStatusDistribution: "Task Status Distribution",

    errorUnknown: "Something went wrong.",
    errorDuplicateEmail: "This email is already registered.",
=======
    errorUnknown: "Something went wrong.",
    errorDuplicateEmail: "This email is already used.",
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
    errorEmployeeNotFound: "Employee not found.",
    errorDepartmentInUse: "This department is assigned to employees.",
    errorDuplicateDepartment: "This department already exists.",
  },
  tr: {
    dashboard: "Panel",
    employees: "Çalışanlar",
<<<<<<< HEAD
    tasks: "Görevler",
    departments: "Departmanlar",
    projects: "Projeler",
    askAi: "AI'a Sor",
    settings: "Ayarlar",

    askAiDescription:
      "Çalışanlar, görevler, departmanlar ve projeler hakkında soru sorun.",
    askAiWelcome:
      "Merhaba! Paneldeki verileri kullanarak kurumunuz hakkında sorularınızı yanıtlayabilirim. Aşağıdaki önerilerden birini deneyin veya kendi sorunuzu yazın.",
    askAiPlaceholder: "Çalışan, görev veya proje hakkında sorun...",
    askAiSend: "Gönder",
    askAiThinking: "Düşünüyor...",
    askAiClearChat: "Sohbeti temizle",
    askAiSuggestionEmployees: "Kaç çalışanımız var?",
    askAiSuggestionSalary: "Toplam maaş ne kadar?",
    askAiSuggestionTasks: "Kaç görev devam ediyor?",
    askAiSuggestionProjects: "Projelerimizi listele",
    askAiSuggestionAssign: "Bir göreve kim atanmalı?",
    askAiError: "AI servisine ulaşılamadı. Yerel yanıt gösteriliyor.",

    loginTitle: "Giriş yap",
    loginSubtitle: "Panele erişmek için bilgilerinizi girin.",
    username: "Kullanıcı adı",
    password: "Şifre",
    signIn: "Giriş yap",
    loginDefaultHint: "Varsayılan: admin / admin1234 — Ayarlar'dan değiştirebilirsiniz.",
    errorInvalidCredentials: "Kullanıcı adı veya şifre hatalı.",
    errorWrongPassword: "Mevcut şifre yanlış.",
    errorPasswordMismatch: "Yeni şifreler eşleşmiyor.",
    errorPasswordTooShort: "Şifre en az 6 karakter olmalıdır.",
    toastLoggedOut: "Çıkış yapıldı.",
    signOut: "Çıkış yap",
    signOutDescription: "Oturumunuzu sonlandırın ve giriş ekranına dönün.",

    brandTitle: "Personel Yönetimi",
    brandSubtitle: "Yönetim Paneli",
    brandTitleAi: "AI Atama",
    brandSubtitleAi: "Yönetici Paneli",
    navAssignTask: "Görev Ata",
    navAssignmentLog: "Atama Logu",
    pageSubAssign: "Yeni görev tanımla, AI önerilerini gör",
    pageSubDashboard: "Ekip iş yükü dağılımı",
    pageSubEmployees: "Çalışan ekle, profil düzenle",
    pageSubLog: "Tüm kararlar kaydedilir, silinemez",
    pageSubSettings: "Profil, algoritma ve sistem tercihleri",
    groqApiActive: "Groq API aktif",
    taskInfoSection: "Görev bilgileri",
    taskCategory: "Kategori",
    taskDescription: "Açıklama",
    getAiSuggestion: "AI Önerisi Al",
    unavailableRemoved: "Müsait olmayan çalışanlar çıkarıldı",
    aiSuggestions: "AI önerileri",
    candidateCount: "aday",
    accept: "Kabul",
    reject: "Red",
    assignedBadge: "Atandı",
    assignedFlash: "göreve atandı — log kaydedildi",
    rejectedFlash: "reddedildi",
    priorityCritical: "Kritik",
    activeTasksMetric: "Aktif görev",
    acceptRate: "Kabul oranı",
    acceptRateTarget: "hedef ≥ %65",
    stdDeviation: "Std. sapma σ",
    thresholdExceeded: "eşik aşıldı",
    workloadDistribution: "İş yükü dağılımı",
    onLeave: "İzinli",
    criticalLoad: "Kritik",
    busyLoad: "Yoğun",
    newEmployeeSection: "Yeni çalışan ekle",
    currentEmployeesSection: "Mevcut çalışanlar",
    employeesCount: "çalışan",
    skillsRequired: "Yetkinlikler *",
    addSkillRow: "Yetkinlik ekle",
    addEmployeeBtn: "Çalışanı Ekle",
    clearForm: "Temizle",
    maxCapacity: "Maks. kapasite",
    assignmentRoleEmployee: "Çalışan",
    assignmentRoleScrum: "Scrum Master",
    availableBadge: "Müsait",
    employeeAddedOk: "Çalışan başarıyla eklendi!",
    employeeProfileUpdatedOk: "Profil güncellendi!",
    errorNameRequired: "Ad Soyad zorunludur.",
    errorEmailInvalid: "Geçerli bir e-posta girin.",
    errorSkillsRequired: "En az bir yetkinlik ekleyin.",
    logEmpty: "Henüz kayıt yok",
    logImmutable: "Tüm kararlar — silinemez",
    scoreLabel: "Skor",
    settingsProfile: "Profil",
    settingsAlgorithm: "Algoritma",
    algorithmWeights: "Puanlama ağırlıkları",
    skillWeightLabel: "Yetkinlik ağırlığı",
    workWeightLabel: "İş yükü ağırlığı",
    weightsMustSum: "Toplam ağırlık %100 olmalı.",
=======
    departments: "Departmanlar",
    projects: "Projeler",
    settings: "Ayarlar",

    brandTitle: "Personel Yönetimi",
    brandSubtitle: "Yönetim Paneli",
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8

    overview: "Kurumunuzun genel görünümü.",

    openMenu: "Menüyü aç",
    notifications: "Bildirimler",
    newEmployee: "Yeni Çalışan",
    searchEmployees: "Çalışan ara...",

    totalEmployees: "Toplam Çalışan",
    totalSalary: "Toplam Maaş",
    averageSalary: "Ortalama Maaş",
    employeesInProjects: "Projelerdeki Çalışanlar",

    departmentEng: "Mühendislik",
    departmentHr: "İK",
    departmentFin: "Finans",
    departmentOps: "Operasyon",

    roleFrontendEngineer: "Frontend Mühendisi",
    roleBackendEngineer: "Backend Mühendisi",
    roleFullstackEngineer: "Fullstack Mühendisi",
    roleHrSpecialist: "İK Uzmanı",
    roleAccountant: "Muhasebeci",
    roleManager: "Yönetici",

    name: "Ad Soyad",
    email: "E-posta",
    department: "Departman",
    salary: "Maaş",
    role: "Rol",
    actions: "İşlemler",

    namePlaceholder: "örn. Ada Lovelace",
    emailPlaceholder: "örn. ada@sirket.com",
    salaryPlaceholder: "örn. 85000",

    addEmployee: "Çalışan Ekle",
    editEmployee: "Çalışan Düzenle",
    deleteEmployee: "Çalışanı Sil",

    addEmployeeDesc: "Yeni bir çalışan eklemek için bilgileri doldurun.",
    editEmployeeDesc: "Çalışan bilgilerini güncelleyin.",

    cancel: "İptal",
    saveChanges: "Değişiklikleri kaydet",

    noEmployees: "Henüz çalışan yok. İlk kaydı oluşturmak için “Çalışan Ekle”ye tıklayın.",
    employeesDescription: "Çalışan kayıtlarını, departmanları ve ücretleri yönetin.",
<<<<<<< HEAD
    tasksDescription: "Çalışanlara görev atayın ve sprint ilerlemesini takip edin.",
=======
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
    departmentsDescription: "Departmanları ve raporlama yapısını yönetin.",
    settingsDescription: "Panel tercihlerinizi yapılandırın.",

    totalsEmployeesLabel: "Toplam çalışan",
    totalsSalaryLabel: "Toplam maaş",

    toastEmployeeCreated: "Çalışan eklendi",
    toastEmployeeUpdated: "Çalışan güncellendi",
    toastEmployeeDeleted: "Çalışan silindi",
<<<<<<< HEAD
    toastEmployeeAvailable: "Müsait olarak işaretlendi",
    toastEmployeeOnLeave: "İzinli olarak işaretlendi",
    toastTaskAssigned: "Görev atandı",
    toastTaskRejected: "Öneri reddedildi",
=======
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8

    addDepartment: "Departman Ekle",
    deleteDepartment: "Departmanı Sil",
    departmentName: "Departman adı",
    departmentNamePlaceholder: "örn. Pazarlama",
    noDepartments: "Henüz departman yok.",

    toastDepartmentAdded: "Departman eklendi",
    toastDepartmentDeleted: "Departman silindi",

<<<<<<< HEAD
    // Tasks
    taskAssignment: "Görev Atama",
    addTask: "Görev Ekle",
    deleteTask: "Görevi Sil",
    taskTitle: "Görev başlığı",
    taskTitlePlaceholder: "örn. Dashboard bileşenlerini hazırla",
    taskStatus: "Durum",
    dueDate: "Bitiş tarihi",
    priority: "Öncelik",
    assignee: "Atanan kişi",
    noTasks: "Henüz görev yok.",
    statusTodo: "Yapılacak",
    statusInProgress: "Devam ediyor",
    statusDone: "Tamamlandı",
    priorityLow: "Düşük",
    priorityMedium: "Orta",
    priorityHigh: "Yüksek",

    // Employee profile
    employeeProfile: "Çalışan Profili",
    employeeProfileDescription: "Çalışanın detaylı özeti ve bağlı olduğu projeler.",
    viewProfile: "Profili Gör",
    backToEmployees: "Çalışanlara dön",
    noProjectsForEmployee: "Henüz proje ataması yok.",
    seeTaskBoardHint: "Detaylar için Görevler sayfasını kullanın.",
    activeTasks: "Aktif görevler",

=======
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
    // Projects
    projectsDescription: "Projeleri, grupları ve çalışan atamalarını yönetin.",
    addProject: "Proje Ekle",
    projectName: "Proje adı",
    projectDescription: "Açıklama",
    groupName: "Grup adı",
    addGroup: "Grup Ekle",
    assignEmployee: "Çalışan Ata",
    selectEmployee: "Çalışan seç",
    deleteProject: "Projeyi Sil",
    totalGroups: "Toplam grup",
    toastProjectCreated: "Proje oluşturuldu",
    toastProjectDeleted: "Proje silindi",
    toastGroupCreated: "Grup oluşturuldu",
    toastEmployeeAssigned: "Çalışan atandı",
    toastEmployeeRemoved: "Çalışan kaldırıldı",

    // Settings tabs
    userSettings: "Kullanıcı Ayarları",
    appearance: "Görünüm",
    language: "Dil",
    systemSettings: "Sistem Ayarları",
    security: "Güvenlik",
    dataBackup: "Veri & Yedekleme",

    // Settings: user
    editProfile: "Profili düzenle",
    profilePicture: "Profil fotoğrafı",
    changePassword: "Şifre değiştir",
    currentPassword: "Mevcut şifre",
    newPassword: "Yeni şifre",
    confirmPassword: "Yeni şifre (tekrar)",
    updatePassword: "Şifreyi güncelle",
    notificationsPrefs: "Bildirim tercihleri",
    notifyByEmail: "E-posta bildirimleri",
    notifyByToast: "Bildirim (toast)",
    saveProfile: "Profili kaydet",

    // Settings: appearance
    theme: "Tema",
    themeSystem: "Sistem",
    themeLight: "Açık",
    themeDark: "Koyu",
    darkMode: "Karanlık Mod",
    fontSize: "Yazı boyutu",
    fontSizeSm: "Küçük",
    fontSizeMd: "Orta",
    fontSizeLg: "Büyük",
    collapseSidebar: "Kenar çubuğunu daralt",

    // Settings: language
    selectLanguage: "Dil seç",
    english: "İngilizce",
    turkish: "Türkçe",

    // Settings: system
    manageRoles: "Rolleri yönet",
    cardsVisibility: "Kart görünürlüğü",

    // Settings: security
    enable2fa: "2FA etkinleştir",
    lastLogin: "Son giriş",
    logoutAll: "Tüm cihazlardan çıkış yap",

    // Settings: data & backup
    exportJson: "JSON dışa aktar",
    exportCsv: "CSV dışa aktar",
    importJson: "JSON içe aktar",
    resetData: "Panel verisini sıfırla",
    importHint: "JSON dosyasından çalışan ve departmanları içe aktarın.",

    toastSaved: "Kaydedildi",
    toastPasswordUpdated: "Şifre güncellendi",
    toastLanguageUpdated: "Dil güncellendi",
    toastExported: "Dışa aktarıldı",
    toastImported: "İçe aktarıldı",
    toastReset: "Veriler sıfırlandı",
    saved: "Kaydedildi",

<<<<<<< HEAD
    // Analytics
    employeesByDepartment: "Departmana Göre Çalışan",
    taskStatusDistribution: "Görev Durumu Dağılımı",

    errorUnknown: "Bir şeyler ters gitti.",
    errorDuplicateEmail: "Bu e-posta zaten kayıtlı.",
=======
    errorUnknown: "Bir şeyler ters gitti.",
    errorDuplicateEmail: "Bu e-posta zaten kullanılıyor.",
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
    errorEmployeeNotFound: "Çalışan bulunamadı.",
    errorDepartmentInUse: "Bu departman çalışanlara atanmış.",
    errorDuplicateDepartment: "Bu departman zaten mevcut.",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

