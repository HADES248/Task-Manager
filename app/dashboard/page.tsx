"use client";

import { useState, useEffect, ChangeEvent, useMemo, JSX, SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

type FilterType = "all" | "active" | "completed";

export default function Dashboard(): JSX.Element {
  const router = useRouter();
  const { accessToken, setAccessToken } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch Tasks
  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
      return;
    }

    async function fetchTasks() {
      try {
        const res = await fetch("http://localhost:5000/api/tasks", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });

        if (res.status === 401) {
          const refreshRes = await fetch("http://localhost:5000/api/auth/refresh", {
            method: "POST",
            credentials: "include",
          });


          if (!refreshRes.ok) {
            setAccessToken(null);
            router.push("/login");
            return;
          }

          const refreshData = await refreshRes.json();
          setAccessToken(refreshData.accessToken);

          return fetchTasks();
        }
        const data = await res.json();
        setTasks(data.tasks || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, [accessToken]);

  // Add Task
  const addTask = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title: newTask }),
        credentials: "include",
      });

      if (res.status === 401) {
        // access token expired → refresh
        const refreshRes = await fetch("http://localhost:5000/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (!refreshRes.ok) {
          setAccessToken(null);
          router.push("/login");
          return;
        }

        const refreshData = await refreshRes.json();
        setAccessToken(refreshData.accessToken);

        // Retry adding task
        return addTask(e);
      }
      const data = await res.json();
      setTasks((prev) => [...prev, data]);
      setNewTask("");
    } catch (err) {
      console.error(err);
    }
  };

  const editTask = async (id: number) => {
    if (!editingTaskTitle.trim()) return;

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title: editingTaskTitle }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update task");

      const updated = await res.json();

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );

      setEditingTaskId(null);
      setEditingTaskTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Complete
  const toggleTask = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            completed: !task.completed,
          }),
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to update task");
      const updated = await res.json();
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? updated : t
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Task
  const deleteTask = async (id: number) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to delete task");

      setTasks((prev) =>
        prev.filter((task) => task.id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Client-side Filter + Search
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

  const logout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setAccessToken(null);
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <main className="h-dvh flex items-center justify-center">
        <p>Loading tasks...</p>
      </main>
    );
  }

  return (
  <main className="h-dvh bg-(--background) px-4 py-10">
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Your Tasks</h1>
        <button
          onClick={logout}
          className="text-sm text-primary hover:underline"
        >
          Logout
        </button>
      </div>

      {/* Add Task Form */}
      <form onSubmit={addTask} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Add new task..."
          value={newTask}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-transparent border border-(--border-color)"
        />
        <button
          type="submit"
          className="bg-primary px-4 rounded-lg text-white text-sm"
        >
          Add
        </button>
      </form>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="px-3 py-2 rounded-lg border border-(--border-color)"
        />
        <div className="flex gap-2">
          {(["all", "active", "completed"] as FilterType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-md text-xs capitalize border ${
                filter === type
                  ? "bg-primary text-white border-primary"
                  : "border-(--border-color)"
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
          <p className="text-sm text-center">No matching tasks found.</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              {/* Task Title + Edit Mode */}
              <div className="flex-1 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  readOnly
                  onClick={() => toggleTask(task.id)}
                  className="cursor-pointer"
                />

                {editingTaskId === task.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      editTask(task.id);
                    }}
                    className="flex gap-2 flex-1"
                  >
                    <input
                      type="text"
                      value={editingTaskTitle}
                      onChange={(e) => setEditingTaskTitle(e.target.value)}
                      className="flex-1 px-2 py-1 border rounded"
                    />
                    <button
                      type="submit"
                      className="bg-primary text-white px-3 rounded"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTaskId(null);
                        setEditingTaskTitle("");
                      }}
                      className="px-3 rounded border"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <span
                    className={`text-sm cursor-pointer ${task.completed ? "line-through" : ""}`}
                    onDoubleClick={() => {
                      setEditingTaskId(task.id);
                      setEditingTaskTitle(task.title);
                    }}
                  >
                    {task.title}
                  </span>
                )}
              </div>

              {/* Delete Button (only if not editing) */}
              {editingTaskId !== task.id && (
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-xs text-red-500"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  </main>
);
}