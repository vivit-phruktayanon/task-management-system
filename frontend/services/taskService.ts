import { http } from "./http"

export type Task = {
  id: number
  title: string
  description?: string
  status: "todo" | "doing" | "done"
}

export function getTasks() {
  return http.get<Task[]>("/tasks")
}

export function createTaskApi(title: string) {
  return http.post<Task>("/tasks", { title })
}

export function deleteTaskApi(id: number) {
  return http.del<void>(`/tasks/${id}`)
}

export function updateTaskApi(id: number, data: Partial<Task>) {
  return http.put<Task>(`/tasks/${id}`, data)
}