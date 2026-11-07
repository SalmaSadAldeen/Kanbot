import { useParams } from "react-router";
import { AiDrawer } from "./components/AiDrawer";
import { GenerateTodosDialog } from "./components/GenerateTodosDialog";
import { PlanSprintDialog } from "./components/PlanSprintDialog";
import { SprintSummaryDialog } from "./components/SprintSummaryDialog";
export function AiRoot() {
  const { projectId } = useParams();
  if (!projectId) return null;
  return (
    <>
      <AiDrawer />
      <GenerateTodosDialog />
      <PlanSprintDialog />
      <SprintSummaryDialog />
    </>
  );
}
