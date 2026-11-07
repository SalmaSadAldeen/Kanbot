import { z } from "zod";
import { useAppStore } from "../../store/useAppStore";

// دالة مساعدة بسيطة لجلب الرسائل حسب اللغة الحالية
const getMessages = () => {
  const lang = useAppStore.getState().lang;
  if (lang === "ar") {
    return {
      emailRequired: "البريد الإلكتروني مطلوب",
      emailInvalid: "يرجى إدخال بريد إلكتروني صالح",
      passwordRequired: "كلمة المرور مطلوبة",
      nameRequired: "الاسم الكامل مطلوب",
      nameMax: "يجب ألا يتجاوز الاسم الكامل 80 حرفاً",
      passwordMin: "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
      passwordMax: "يجب ألا تتجاوز كلمة المرور 200 حرف",
      confirmRequired: "يرجى تأكيد كلمة المرور",
      passwordsMatch: "كلمتا المرور غير متطابقتين",
    };
  }
  return {
    emailRequired: "Email address is required",
    emailInvalid: "Please enter a valid email address",
    passwordRequired: "Password is required",
    nameRequired: "Full name is required",
    nameMax: "Full name must not exceed 80 characters",
    passwordMin: "Password must be at least 8 characters long",
    passwordMax: "Password must not exceed 200 characters",
    confirmRequired: "Please confirm your password",
    passwordsMatch: "Passwords do not match",
  };
};

// مخطط تسجيل الدخول (Login Schema)
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, {
      get message() {
        return getMessages().emailRequired;
      },
    })
    .email({
      get message() {
        return getMessages().emailInvalid;
      },
    }),
  password: z.string().min(1, {
    get message() {
      return getMessages().passwordRequired;
    },
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// مخطط تسجيل الحساب (Register Schema)
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, {
        get message() {
          return getMessages().nameRequired;
        },
      })
      .max(80, {
        get message() {
          return getMessages().nameMax;
        },
      }),
    email: z
      .string()
      .min(1, {
        get message() {
          return getMessages().emailRequired;
        },
      })
      .email({
        get message() {
          return getMessages().emailInvalid;
        },
      }),
    password: z
      .string()
      .min(8, {
        get message() {
          return getMessages().passwordMin;
        },
      })
      .max(200, {
        get message() {
          return getMessages().passwordMax;
        },
      }),
    confirmPassword: z.string().min(1, {
      get message() {
        return getMessages().confirmRequired;
      },
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    get message() {
      return getMessages().passwordsMatch;
    },
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
