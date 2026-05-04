"use client"

import { useEffect, useState } from "react"

export default function TasksPage() {

    const [tasks, setTasks] = useState<any[]>([])
    const [title, setTitle] = useState("")
    const [editingTask, setEditingTask] = useState<any>(null)
    const [editTitle, setEditTitle] = useState("")
    const todoTasks = tasks.filter((t: any) => t.status === "todo")
    const doingTasks = tasks.filter((t: any) => t.status === "doing")
    const doneTasks = tasks.filter((t: any) => t.status === "done")

    useEffect(() => {
        fetchTasks()
    }, [])

    async function fetchTasks() {
        const res = await fetch("http://127.0.0.1:8000/api/tasks")
        const data = await res.json()
        setTasks(data)
    }
    async function createTask(e: any) {
        e.preventDefault()

        await fetch("http://127.0.0.1:8000/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                title: title
            })
        })
        setTitle("")
        fetchTasks()
    }

    function startEdit(task: any) {
        setEditingTask(task)
        setEditTitle(task.title)
    }

    async function updateTask(e: any) {

        e.preventDefault()

        await fetch(`http://127.0.0.1:8000/api/tasks/${editingTask.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                title: editTitle
            })
        })

        setEditingTask(null)
        fetchTasks()

    }
    async function deleteTask(id: number) {
        await fetch(`http://127.0.0.1:8000/api/tasks/${id}`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json"
            }
        })

        fetchTasks()
    }

    async function toggleStatus(task: any) {

        const nextStatus =
            task.status === "todo" ? "doing" :
                task.status === "doing" ? "done" : "todo"

        await fetch(`http://127.0.0.1:8000/api/tasks/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                status: nextStatus
            })
        })

        fetchTasks()
    }

    function nextStatus(s: string) {
        return s === "todo" ? "doing" : s === "doing" ? "done" : "todo"
    }

    async function moveToNext(task: any) {
        await fetch(`http://127.0.0.1:8000/api/tasks/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ status: nextStatus(task.status) })
        })
        fetchTasks()
    }

    function TaskCard({ task }: any) {
        return (
            <div style={{
                background: "#1e293b",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "10px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
            }}>
                <div>{task.title}</div>

                <div style={{ marginTop: 10, display: "flex", gap: 8 }}>

                    <button onClick={() => moveToNext(task)}>➡️</button>

                    <button onClick={() => startEdit(task)}>✏️</button>

                    <button onClick={() => deleteTask(task.id)}>🗑️</button>

                </div>
                
            </div>
        )
    }

    return (
        <div>
            <form onSubmit={createTask}>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title"
                />

                <button type="submit">Add Task</button>
            </form>
            {editingTask && (

                    <form onSubmit={updateTask}>

                        <input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                        />

                        <button type="submit">
                            Update
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
                    {doneTasks.map((t: any) => <TaskCard key={t.id} task={t} />)}
                </div>

            </div>
        </div>
    )
}