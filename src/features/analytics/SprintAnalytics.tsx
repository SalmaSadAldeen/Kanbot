import { useParams } from "react-router";
import { useSprints } from "../../hooks/useSprints.ts";
import { BurndownChart } from "./components/BurndownChart";
import { VelocityChart } from "./components/VelocityChart";
import { Spinner } from "../../components/ui/Spinner";

export function SprintAnalyticsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { allSprints, isLoading } = useSprints(projectId);

  const activeSprint = allSprints.find((s) => s.status === "active") || null;

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8 animate-fadeIn">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl">
          إحصائيات وتحليلات المشروع
        </h1>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          متابعة تقدم إنجاز السبرنت النشط ومخطط سرعة الإنجاز عبر السبرنتات
          المكتملة
        </p>
      </div>

      {/* جمع المكونين المنفصلين داخل الصفحة */}
      <div className="space-y-6">
        <BurndownChart activeSprint={activeSprint} />
        <VelocityChart sprints={allSprints} />
      </div>
    </div>
  );
}
