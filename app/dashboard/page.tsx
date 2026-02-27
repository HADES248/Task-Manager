"use client";

import { useState, ChangeEvent, useMemo, JSX, SyntheticEvent } from "react";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

type FilterType = "all" | "active" | "completed";

export default function Dashboard(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Build login page", completed: false },
    { id: 2, title: "Setup backend API", completed: true },
    { id: 3, title: "Design dashboard UI", completed: false },
  ]);

  const [newTask, setNewTask] = useState<string>("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState<string>("");
  const addTask = (e: SyntheticEvent<HTMLFormElement> ): void => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now(),
      title: newTask,
      completed: false,
    };

    setTasks((prev) => [...prev, task]);
    setNewTask("");
  };

  const toggleTask = (id: number): void => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = (id: number): void => {
    setTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (filter === "active") return !task.completed;
        if (filter === "completed") return task.completed;
        return true;
      })
      .filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase())
      );
  }, [tasks, filter, search]);

  return (
    <main className="h-dvh bg-(--background) px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">
            Your Tasks
          </h1>
          <button className="text-sm text-primary hover:underline">
            Logout
          </button>
        </div>

        {/* Add Task */}
        <form onSubmit={addTask} className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Add new task..."
            value={newTask}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewTask(e.target.value)
            }
            className="flex-1 px-3 py-2 rounded-lg bg-transparent border border-(--border-color) focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <button
            type="submit"
            className="bg-primary px-4 rounded-lg text-white text-sm hover:opacity-90 transition"
          >
            Add
          </button>
        </form>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          {/* Search */}
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            className="px-3 py-2 rounded-lg bg-transparent border border-(--border-color) focus:outline-none focus:ring-2 focus:ring-primary text-sm w-full sm:w-1/2"
          />

          {/* Filters */}
          <div className="flex gap-2">
            {(["all", "active", "completed"] as FilterType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1 rounded-md text-xs capitalize border transition
                  ${
                    filter === type
                      ? "bg-primary text-white border-primary"
                      : "border-(--border-color) hover:bg-(--background-soft)"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <p className="text-(--muted) text-sm text-center mt-10">
              No matching tasks found.
            </p>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 rounded-lg border border-(--border-color) bg-(--background-soft)"
              >
                <div
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    readOnly
                    className="accent-primary"
                  />
                  <span
                    className={`text-sm ${
                      task.completed
                        ? "line-through text-(--muted)"
                        : ""
                    }`}
                  >
                    {task.title}
                  </span>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}