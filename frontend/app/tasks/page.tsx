"use client"

import { useState } from "react"

export default function TasksPage() {
  const [title,setTitle] = useState("")

  return (
    <div>

      <h1>Task List</h1>

      <form>
        <input
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          placeholder="Task title"
        />

        <button type="submit">Add Task</button>
      </form>

    </div>
  )
}