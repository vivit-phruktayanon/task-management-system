async function getTasks() {
  const res = await fetch("http://127.0.0.1:8000/api/tasks", {
    cache: "no-store"
  })

  return res.json()
}

export default async function TasksPage() {
  const tasks = await getTasks()

  return (
    <div>
      <h1>Task List</h1>

      <ul>
        {tasks.map((task: any) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  )
}