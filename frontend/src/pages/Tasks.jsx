import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";
import Loader from "../UI/Loader";

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

  const { data: employees, isLoading: empLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => (await api.get("/employees")).data,
  });

  const assignTask = useMutation({
    mutationFn: async (newTask) =>
      (await api.post("/tasks/assign", newTask)).data,
    onSuccess: () => {
      toast.success("Task assigned successfully!");
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

  if (empLoading) return <Loader />;

  return (
    <div className="p-4 overflow-auto h-screen">
      <h2 className="text-4xl font-bold mb-6 text-left">Assign Task</h2>
      <form
        onSubmit={handleAssign}
        className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded shadow grid gap-4 rounded-xl shadow-lg border border-blue-200 "
      >
        <div>
          <label className="block mb-1 font-medium">Select Employee</label>
          <select
            className="border border-blue-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
        </div>

        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            className="border border-blue-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Title"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            className="border border-blue-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Description"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Remarks (optional)</label>
          <textarea
            className="border border-blue-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Remarks (optional)"
            value={task.reMarks}
            onChange={(e) => setTask({ ...task, reMarks: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Task Date</label>
          <input
            className="border border-blue-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            type="date"
            value={task.taskDate}
            onChange={(e) => setTask({ ...task, taskDate: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Start Time</label>
          <input
            className="border border-blue-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            type="time"
            value={task.startTime}
            onChange={(e) => setTask({ ...task, startTime: e.target.value })}
            required
            min="09:00"
            max="21:00"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">End Time</label>
          <input
            className="border border-blue-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            type="time"
            value={task.endTime}
            onChange={(e) => setTask({ ...task, endTime: e.target.value })}
            required
            min="09:00"
            max="21:00"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Organization</label>
          <input
            className="border border-blue-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Organization"
            value={task.organization}
            onChange={(e) => setTask({ ...task, organization: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Priority</label>
          <select
            className="border border-blue-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={task.priority}
            onChange={(e) => setTask({ ...task, priority: e.target.value })}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition">
          Assign Task
        </button>
      </form>
    </div>
  );
}
