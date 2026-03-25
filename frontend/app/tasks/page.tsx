"use client"

import { useState } from "react"

export default function TasksPage() {

    const [tasks,setTasks] = useState<any[]>([])
    const [title, setTitle] = useState("")

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

                    <button onClick={() => deleteTask(task.id)}>
                        Delete
                    </button>

                </div>
            ))}
        </div>
    )
}