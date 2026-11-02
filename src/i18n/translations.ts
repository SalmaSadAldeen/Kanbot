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
        tasksCount: "{total} tasks",
        backlogCount: "{count} in backlog",
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
    brand: "كانبوت",
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
    theme: {
      toDark: "التفعيل للوضع الليلي",
      toLight: "التفعيل للوضع النهاري",
    },
    footer: "كانبوت v1.0.0 © 2026",
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
        tasksCount: "{total} مهمة",
        backlogCount: "{count} في قائمة الانتظار",
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
