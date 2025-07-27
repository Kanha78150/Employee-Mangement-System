import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "../api/axiosInstance";

export default function Tasks() {
  const queryClient = useQueryClient();
  const [task, setTask] = useState({
    employeeId: "",
    title: "",
    description: "",
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
      setTask({ employeeId: "", title: "", description: "" });
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

      {/* Assign Task Form */}
      <form
        onSubmit={handleAssign}
        className="bg-white p-4 rounded shadow mb-6"
      >
        <select
          className="border p-2 w-full mb-2"
          value={task.employeeId}
          onChange={(e) => setTask({ ...task, employeeId: e.target.value })}
        >
          <option value="">Select Employee</option>
          {employees.employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name} ({emp.employeeId})
            </option>
          ))}
        </select>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Task Title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
        />
        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Task Description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
        ></textarea>
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Assign Task
        </button>
      </form>
    </div>
  );
}
