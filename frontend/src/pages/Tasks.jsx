import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "../api/axiosInstance";

export default function Tasks() {
  const queryClient = useQueryClient();
  const [task, setTask] = useState({
    employeeId: "",
    title: "",
    description: "",
    reMarks: "",
    taskDate: "",
    startTime: "",
    endTime: "",
    organization: "",
    priority: "Medium",
  });

  // Fetch employees (to assign task)
  const { data: employees, isLoading: empLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => (await api.get("/employees")).data,
  });

  // Assign task mutation
  const assignTask = useMutation({
    mutationFn: async (newTask) =>
      (await api.post("/tasks/assign", newTask)).data,
    onSuccess: () => {
      alert("Task assigned successfully!");
      queryClient.invalidateQueries(["employees"]);
      setTask({
        employeeId: "",
        title: "",
        description: "",
        reMarks: "",
        taskDate: "",
        startTime: "",
        endTime: "",
        organization: "",
        priority: "Medium",
      });
    },
  });

  const handleAssign = (e) => {
    e.preventDefault();
    assignTask.mutate(task);
  };

  if (empLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Assign Task</h2>
      <form
        onSubmit={handleAssign}
        className="bg-white p-4 rounded shadow mb-6 grid gap-2"
      >
        <select
          className="border p-2"
          value={task.employeeId}
          onChange={(e) => setTask({ ...task, employeeId: e.target.value })}
          required
        >
          <option value="">Select Employee</option>
          {employees.employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name} ({emp.employeeId})
            </option>
          ))}
        </select>

        <input
          className="border p-2"
          placeholder="Title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          required
        />

        <textarea
          className="border p-2"
          placeholder="Description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          required
        />

        <textarea
          className="border p-2"
          placeholder="Remarks (optional)"
          value={task.reMarks}
          onChange={(e) => setTask({ ...task, reMarks: e.target.value })}
        />

        <input
          className="border p-2"
          type="date"
          value={task.taskDate}
          onChange={(e) => setTask({ ...task, taskDate: e.target.value })}
          required
        />

        <input
          className="border p-2"
          type="time"
          value={task.startTime}
          onChange={(e) => setTask({ ...task, startTime: e.target.value })}
          required
          min="09:00"
          max="21:00"
        />

        <input
          className="border p-2"
          type="time"
          value={task.endTime}
          onChange={(e) => setTask({ ...task, endTime: e.target.value })}
          required
          min="09:00"
          max="21:00"
        />

        <input
          className="border p-2"
          placeholder="Organization"
          value={task.organization}
          onChange={(e) => setTask({ ...task, organization: e.target.value })}
          required
        />

        <select
          className="border p-2"
          value={task.priority}
          onChange={(e) => setTask({ ...task, priority: e.target.value })}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Assign Task
        </button>
      </form>
    </div>
  );
}
