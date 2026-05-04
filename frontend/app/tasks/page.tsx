"use client"

import { useEffect, useState } from "react"

export default function TasksPage() {

    const [tasks, setTasks] = useState<any[]>([])
    const [title, setTitle] = useState("")
    const [editingTask, setEditingTask] = useState<any>(null)
    const [editTitle, setEditTitle] = useState("")


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

    return (
        <div>

            <h1>Task List</h1>

            <form onSubmit={createTask}>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title"
                />

                <button type="submit">Add Task</button>
            </form>

            {tasks.map((task: any) => (
                <div key={task.id}>

                    <span>{task.title}</span>
                    <span>{task.status}</span>
                    <button onClick={() => startEdit(task)}>
                        Edit
                    </button>

                    <button onClick={() => deleteTask(task.id)}>
                        Delete
                    </button>
                    <button onClick={() => toggleStatus(task)}>
                        {task.status}
                    </button>
                </div>
            ))}
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
        </div>
    )
}