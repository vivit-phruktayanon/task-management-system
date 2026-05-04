"use client"

import { useEffect, useState } from "react"
import {
    getTasks,
    createTaskApi,
    deleteTaskApi,
    updateTaskApi,
    Task
} from "@/services/taskService"
import toast from "react-hot-toast"

export default function TasksPage() {

    const [tasks, setTasks] = useState<any[]>([])
    const [title, setTitle] = useState("")
    const [editingTask, setEditingTask] = useState<any>(null)
    const [editTitle, setEditTitle] = useState("")
    const todoTasks = tasks.filter((t: any) => t.status === "todo")
    const doingTasks = tasks.filter((t: any) => t.status === "doing")
    const doneTasks = tasks.filter((t: any) => t.status === "done")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchTasks()
    }, [])

    async function fetchTasks() {
        try {
            setLoading(true)
            const data = await getTasks()
            setTasks(data)
        } catch (e: any) {
            alert(e.message)
        } finally {
            setLoading(false)
        }
    }

    async function createTask(e: any) {
        e.preventDefault()

        try {
            setLoading(true)

            await createTaskApi(title)

            toast.success("Task created")
            setTitle("")
            await fetchTasks()

        } catch (e: any) {
            toast.error(e.message || "Create failed")

        } finally {
            setLoading(false)
        }
    }

    function startEdit(task: any) {
        setEditingTask(task)
        setEditTitle(task.title)
    }

    async function updateTask(e: any) {
        e.preventDefault()

        try {
            setLoading(true)

            await updateTaskApi(editingTask.id, {
                title: editTitle
            })

            toast.success("Task updated")
            setEditingTask(null)
            await fetchTasks()

        } catch (e: any) {
            toast.error("Update failed")

        } finally {
            setLoading(false)
        }
    }

    async function deleteTask(id: number) {
        try {
            setLoading(true)

            await deleteTaskApi(id)

            toast.success("Task deleted")
            await fetchTasks()

        } catch (e: any) {
            toast.error("Delete failed")

        } finally {
            setLoading(false)
        }
    }

    async function moveToNext(task: any) {
        try {
            setLoading(true)

            const next =
                task.status === "todo" ? "doing" :
                    task.status === "doing" ? "done" : "todo"

            await updateTaskApi(task.id, { status: next })

            toast.success("Status updated")
            await fetchTasks()

        } finally {
            setLoading(false)
        }
    }

    function TaskCard({ task }: any) {
        return (
            <div style={{
                background: "#1e293b",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "16px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
            }}>
                <div>{task.title}</div>

                <div style={{ marginTop: 10, display: "flex", gap: 8 }}>

                    <button disabled={loading} onClick={() => moveToNext(task)}>➡️</button>

                    <button disabled={loading} onClick={() => startEdit(task)}>✏️</button>

                    <button disabled={loading} onClick={() => deleteTask(task.id)}>🗑️</button>

                </div>

            </div>
        )
    }

    return (
        <div>

            {editingTask ? (

                <form onSubmit={updateTask}>

                    <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                    />

                    <button type="submit">
                        Update
                    </button>

                </form>

            ) : (
                <form onSubmit={createTask}>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Task title"
                    />

                    <button disabled={loading}>
                        {loading ? "Saving..." : "Add Task"}
                    </button>
                </form>
            )}
            <div style={{
                display: "flex",
                gap: "20px",
                marginTop: "20px",
                alignItems: "flex-start"
            }}>
                {/* TODO */}
                <div style={{
                    flex: 1,
                    background: "#0f172a",
                    padding: "10px",
                    borderRadius: "8px",
                    minHeight: "300px"
                }}>
                    <h3>Todo</h3>
                    {todoTasks.length === 0 && (
                        <p style={{ opacity: 0.5 }}>No tasks</p>
                    )}
                    {todoTasks.map((t: any) => <TaskCard key={t.id} task={t} />)}
                </div>

                {/* DOING */}
                <div style={{
                    flex: 1,
                    background: "#0f172a",
                    padding: "10px",
                    borderRadius: "8px",
                    minHeight: "300px"
                }}>
                    <h3>Doing</h3>

                    {doingTasks.length === 0 && (
                        <p style={{ opacity: 0.5 }}>No tasks</p>
                    )}
                    {doingTasks.map((t: any) => <TaskCard key={t.id} task={t} />)}
                </div>

                {/* DONE */}
                <div style={{
                    flex: 1,
                    background: "#0f172a",
                    padding: "10px",
                    borderRadius: "8px",
                    minHeight: "300px"
                }}>
                    <h3>Done</h3>
                    {doneTasks.length === 0 && (
                        <p style={{ opacity: 0.5 }}>No tasks</p>
                    )}
                    {doneTasks.map((t: any) => <TaskCard key={t.id} task={t} />)}
                </div>

            </div>
        </div>
    )
}