// import { useState } from "react";
// import { Link, useNavigate, useSearchParams } from "react-router";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import type { FieldPath } from "react-hook-form";
// import { ArrowRight, CheckCircle2, CircleAlert, Kanban, LockKeyhole, Mail, UserRound } from "lucide-react";
// import { ApiError } from "../../api/client";
// import { login as loginRequest, register as registerRequest } from "../../api/api";
// import type { LoginRequest, RegisterRequest } from "../../types/api";
// import { useAuth } from "./AuthProvider";
// import { loginSchema, registerSchema } from "./authSchemas";
// import type { LoginFormData, RegisterFormData } from "./authSchemas";

// function AuthFrame({ children, mode }: { children: React.ReactNode; mode: "login" | "register" }) {
//   return (
//     <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
//       <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
//         <section className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
//           <div className="w-full max-w-md">
//             <Link to="/login" className="mb-10 inline-flex items-center gap-2.5 rounded-md text-lg font-bold tracking-tight text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 dark:text-white dark:focus-visible:ring-indigo-900">
//               <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white"><Kanban size={22} /></span>
//               Kanbot
//             </Link>
//             <div className="mb-8">
//               <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">{mode === "login" ? "Welcome back" : "Get started"}</p>
//               <h1 className="m-0 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">{mode === "login" ? "Sign in to Kanbot" : "Create your account"}</h1>
//               <p className="mt-3 text-base text-slate-500 dark:text-slate-400">{mode === "login" ? "Pick up where you left off and keep your sprint moving." : "Plan your work, track your sprint, and make progress."}</p>
//             </div>
//             {children}
//           </div>
//         </section>
//         <aside className="relative hidden flex-1 overflow-hidden bg-indigo-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
//           <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border-[64px] border-white/10" />
//           <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full border-[64px] border-white/10" />
//           <div className="relative z-10 flex items-center gap-3 text-sm font-medium text-indigo-100"><CheckCircle2 size={18} /> Your sprint, in focus</div>
//           <div className="relative z-10 max-w-lg py-12">
//             <div className="mb-6 flex gap-2"><span className="h-2 w-8 rounded-full bg-white" /><span className="h-2 w-2 rounded-full bg-white/40" /><span className="h-2 w-2 rounded-full bg-white/40" /></div>
//             <blockquote className="text-4xl font-semibold leading-tight tracking-tight">“A clearer plan makes room for better work.”</blockquote>
//             <p className="mt-6 text-indigo-100">Keep your backlog tidy, your sprint realistic, and your next step obvious.</p>
//           </div>
//           <p className="relative z-10 text-sm text-indigo-100">Simple project planning for the work that matters.</p>
//         </aside>
//       </div>
//     </main>
//   );
// }

// function ApiAlert({ message, onDismiss }: { message: string; onDismiss: () => void }) {
//   if (!message) return null;
//   return <div role="alert" className="mb-5 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"><CircleAlert className="mt-0.5 shrink-0" size={18} /><span className="flex-1">{message}</span><button aria-label="Dismiss error" type="button" onClick={onDismiss} className="rounded text-red-700 hover:text-red-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-red-300">×</button></div>;
// }

// function AuthInput({ label, id, type = "text", icon: Icon, error, registration, autoComplete }: {
//   label: string; id: string; type?: string; icon: typeof Mail; error?: string;
//   registration: ReturnType<ReturnType<typeof useForm>['register']>; autoComplete: string;
// }) {
//   return <div>
//     <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
//     <div className="relative">
//       <Icon aria-hidden="true" size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
//       <input id={id} type={type} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...registration} className={`h-12 w-full rounded-md border bg-white pl-11 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 dark:bg-slate-800 dark:text-slate-50 ${error ? "border-red-500 focus:ring-red-100 dark:focus:ring-red-950" : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 dark:border-slate-700 dark:focus:ring-indigo-950"}`} />
//     </div>
//     {error && <p id={`${id}-error`} className="mt-1 text-xs font-medium text-red-500">{error}</p>}
//   </div>;
// }

// export function LoginPage() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [params] = useSearchParams();
//   const [apiMessage, setApiMessage] = useState(() => params.get("expired") === "1" ? "Your session has expired. Please log in again." : "");
//   const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });
//   const onSubmit = async (data: LoginFormData) => {
//     setApiMessage("");
//     try {
//       const credentials: LoginRequest = data;
//       const response = await loginRequest(credentials);
//       login(response.token, response.user);
//       const redirect = params.get("redirect");
//       navigate(redirect?.startsWith("/") ? redirect : "/projects", { replace: true });
//     } catch (error) {
//       setApiMessage(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
//     }
//   };
//   return <AuthFrame mode="login"><ApiAlert message={apiMessage} onDismiss={() => setApiMessage("")} />
//     <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//       <AuthInput id="email" label="Email address" type="email" icon={Mail} autoComplete="email" registration={register("email")} error={errors.email?.message} />
//       <AuthInput id="password" label="Password" type="password" icon={LockKeyhole} autoComplete="current-password" registration={register("password")} error={errors.password?.message} />
//       <button type="submit" disabled={isSubmitting} className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-indigo-900">
//         {isSubmitting && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}{isSubmitting ? "Signing in…" : "Sign in"}{!isSubmitting && <ArrowRight size={17} />}
//       </button>
//     </form>
//     <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">New to Kanbot? <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">Create an account</Link></p>
//   </AuthFrame>;
// }

// export function RegisterPage() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [apiMessage, setApiMessage] = useState("");
//   const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema), defaultValues: { name: "", email: "", password: "", confirmPassword: "" } });
//   const onSubmit = async (data: RegisterFormData) => {
//     setApiMessage("");
//     const payload: RegisterRequest = { name: data.name, email: data.email, password: data.password };
//     try {
//       const response = await registerRequest(payload);
//       login(response.token, response.user);
//       navigate("/projects", { replace: true });
//     } catch (error) {
//       if (error instanceof ApiError) {
//         for (const detail of error.details ?? []) {
//           const path = detail.path as FieldPath<RegisterFormData>;
//           setError(path, { type: "server", message: detail.message });
//         }
//         setApiMessage(error.message);
//       } else setApiMessage("Something went wrong. Please try again.");
//     }
//   };
//   return <AuthFrame mode="register"><ApiAlert message={apiMessage} onDismiss={() => setApiMessage("")} />
//     <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//       <AuthInput id="name" label="Full name" icon={UserRound} autoComplete="name" registration={register("name")} error={errors.name?.message} />
//       <AuthInput id="email" label="Email address" type="email" icon={Mail} autoComplete="email" registration={register("email")} error={errors.email?.message} />
//       <AuthInput id="password" label="Password" type="password" icon={LockKeyhole} autoComplete="new-password" registration={register("password")} error={errors.password?.message} />
//       <AuthInput id="confirmPassword" label="Confirm password" type="password" icon={LockKeyhole} autoComplete="new-password" registration={register("confirmPassword")} error={errors.confirmPassword?.message} />
//       <button type="submit" disabled={isSubmitting} className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-indigo-900">
//         {isSubmitting && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}{isSubmitting ? "Creating account…" : "Create account"}{!isSubmitting && <ArrowRight size={17} />}
//       </button>
//     </form>
//     <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">Already have an account? <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">Sign in</Link></p>
//     <p className="mt-4 text-center text-xs text-slate-400">By creating an account, you agree to use Kanbot responsibly.</p>
//   </AuthFrame>;
// }
