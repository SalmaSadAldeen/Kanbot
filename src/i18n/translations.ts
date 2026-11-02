export type Language = "en" | "ar";

export const translations = {
  en: {
    brand: "Kanbot",
    workspaceOverview: "Workspace Overview",
    nav: {
      dashboard: "Dashboard",
      projects: "Projects",
      myTasks: "My Tasks",
      settings: "Settings",
    },
    user: {
      profile: "Profile",
      guest: "User",
    },
    auth: {
      logout: "Sign out",
      logoutTitle: "Sign out confirmation",
      logoutMessage: "Are you sure you want to sign out from Kanbot?",
      logoutDesc:
        "You will need to log in again to access your projects and sprints.",
      cancel: "Cancel",
    },
    topbar: {
      toggleSidebar: "Toggle sidebar",
      switchLangToEn: "Switch interface language to English",
      switchLangToAr: "Switch interface language to Arabic",
      kanbotLogoAlt: "Kanbot",
    },
    theme: {
      toDark: "Switch to Dark Mode",
      toLight: "Switch to Light Mode",
    },
    footer: "Kanbot v1.0.0 © 2026",
    projectsPage: {
      workspace: "Workspace",
      title: "Projects",
      subtitle:
        "Organize your software projects, sprints, and track task progress.",
      newProject: "New Project",
      stats: {
        projects: "Projects",
        totalTodos: "Total Tasks",
        activeSprints: "Active Sprints",
      },
      undoDelete: {
        message: 'Project "{name}" deleted',
        action: "Undo",
      },
      loading: "Loading projects...",
      errorTitle: "Failed to load projects",
      retry: "Retry",
      emptyTitle: "No projects yet",
      emptyDesc:
        "Create your first project to organize tasks and track your team's progress.",
      emptyAction: "Create First Project",
      card: {
        noActiveSprint: "No active sprint",
        noDescription: "No project description.",
        tasksCount: " tasks",
        backlogCount: " in backlog",
        boardButton: "Board",
        editTitle: "Edit Project",
        deleteTitle: "Delete Project",
      },
      deleteConfirm: {
        title: "Confirm Delete Project",
        message:
          'Are you sure you want to delete the project "{name}"? This will permanently delete all its tasks and sprints.',
        confirm: "Delete",
        cancel: "Cancel",
      },
      validation: {
        nameRequired: "Project name is required.",
        nameMax: "Name must not exceed 80 characters.",
        keyFormat: "Use 2 to 6 uppercase English letters.",
        descMax: "Description must not exceed 500 characters.",
        conflictKey:
          "Project key is already in use, please choose another one.",
        genericError: "Failed to save project. Please try again.",
      },
      dialog: {
        createTitle: "Create New Project",
        editTitle: "Edit Project",
        nameLabel: "Project Name",
        namePlaceholder: "e.g. Resource Management System",
        keyLabel: "Project Key (Key)",
        keyPlaceholder: "e.g. KAN",
        keyHint:
          "Optional: 2 to 6 uppercase letters. Auto-generated if left empty. Changing the key doesn't affect existing task keys.",
        descLabel: "Description",
        descPlaceholder: "Brief description of project goals...",
        cancel: "Cancel",
        save: "Save Changes",
        create: "Create Project",
      },
    },
  },
  ar: {
    brand: "kanbotُ",
    workspaceOverview: "نظرة عامة على مساحة العمل",
    nav: {
      dashboard: "لوحة التحكم",
      projects: "المشاريع",
      myTasks: "مهامي",
      settings: "الإعدادات",
    },
    user: {
      profile: "الملف الشخصي",
      guest: "مستخدم",
    },
    auth: {
      logout: "تسجيل الخروج",
      logoutTitle: "تأكيد تسجيل الخروج",
      logoutMessage: "هل أنت متأكد أنك تريد تسجيل الخروج من تطبيق Kanbot؟",
      logoutDesc:
        "ستحتاج إلى إدخال بيانات الدخول مرة أخرى للوصول إلى مشاريعك وسبرنتاتك.",
      cancel: "إلغاء",
    },
    topbar: {
      toggleSidebar: "تبديل الشريط الجانبي",
      switchLangToEn: "تغيير لغة الواجهة إلى الإنجليزية",
      switchLangToAr: "تغيير لغة الواجهة إلى العربية",
      kanbotLogoAlt: "kanbot",
    },
    theme: {
      toDark: "التفعيل للوضع الليلي",
      toLight: "التفعيل للوضع النهاري",
    },
    footer: "kanbot v1.0.0 © 2026",
    projectsPage: {
      workspace: "مساحة العمل",
      title: "المشاريع",
      subtitle: "نظّم مشاريعك البرمجيّة، السبرنتات، وتابع تقدم العمل.",
      newProject: "مشروع جديد",
      stats: {
        projects: "المشاريع",
        totalTodos: "إجمالي المهام",
        activeSprints: "السبرنتات النشطة",
      },
      undoDelete: {
        message: 'تم حذف المشروع "{name}"',
        action: "تراجع",
      },
      loading: "جاري تحميل المشاريع...",
      errorTitle: "تعذّر تحميل المشاريع",
      retry: "إعادة المحاولة",
      emptyTitle: "لا توجد مشاريع حتى الآن",
      emptyDesc:
        "أنشئ مشروعك الأول لتنظيم المهام ومتابعة تقدم فريقك باحترافية.",
      emptyAction: "إنشاء المشروع الأول",
      card: {
        noActiveSprint: "لا يوجد سبرنت نشط",
        noDescription: "لا يوجد وصف للمشروع.",
        tasksCount: "مهمة",
        backlogCount: " في قائمة الانتظار",
        boardButton: "لوحة العمل",
        editTitle: "تعديل المشروع",
        deleteTitle: "حذف المشروع",
      },
      deleteConfirm: {
        title: "تأكيد حذف المشروع",
        message:
          'هل أنت متأكد من حذف المشروع "{name}"؟ سيؤدي ذلك إلى حذف جميع مهامه وسبرنتاته نهائياً.',
        confirm: "حذف نهائي",
        cancel: "إلغاء",
      },
      validation: {
        nameRequired: "اسم المشروع مطلوب.",
        nameMax: "يجب ألا يتجاوز الاسم 80 حرفاً.",
        keyFormat: "استخدم من حرفين إلى 6 أحرف إنجليزية كبيرة.",
        descMax: "يجب ألا يتجاوز الوصف 500 حرف.",
        conflictKey: "معرف المشروع (Key) مستخدم مسبقاً، يرجى اختيار معرف فريد.",
        genericError: "تعذّر حفظ المشروع. حاول مرة أخرى.",
      },
      dialog: {
        createTitle: "إنشاء مشروع جديد",
        editTitle: "تعديل المشروع",
        nameLabel: "اسم المشروع",
        namePlaceholder: "مثال: نظام إدارة الموارد",
        keyLabel: "معرّف المشروع (Key)",
        keyPlaceholder: "مثال: KAN",
        keyHint:
          "اختياري: من 2 إلى 6 أحرف إنجليزية. يُنشأ تلقائياً عند تركه فارغاً. تغيير المعرّف لا يغيّر مفاتيح المهام الموجودة.",
        descLabel: "الوصف",
        descPlaceholder: "وصف مختصر لأهداف المشروع...",
        cancel: "إلغاء",
        save: "حفظ التغييرات",
        create: "إنشاء المشروع",
      },
    },
  },
} as const;

export type TranslationKeys = typeof translations.en;
