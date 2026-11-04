import { useQuery } from "@tanstack/react-query";
import { getSprintBoard } from "../api/sprints"; // أو مسار الـ API الخاص بالسبرنتات
import type { SprintBoardResponse } from "../types/api";

export function useBoard(sprintId: string | undefined) {
  return useQuery<SprintBoardResponse>({
    queryKey: ["sprints", sprintId, "board"],
    queryFn: () => getSprintBoard(sprintId!),
    enabled: Boolean(sprintId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}