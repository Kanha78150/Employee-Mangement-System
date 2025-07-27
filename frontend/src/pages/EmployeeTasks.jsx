import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function EmployeeTasks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch employee tasks
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["employeeTasks", user?.id],
    queryFn: async () => (await api.get(`/tasks/employee/${user.id}`)).data,
  });

  // Update task status
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) =>
      (await api.put(`/tasks/update/${id}`, { status })).data,
    onSuccess: () => queryClient.invalidateQueries(["employeeTasks", user?.id]),
  });

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Tasks</h2>
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="border-b">
            <th className="p-2">Title</th>
            <th className="p-2">Description</th>
            <th className="p-2">Status</th>
            <th className="p-2">Update</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className="border-b">
              <td className="p-2">{task.title}</td>
              <td className="p-2">{task.description}</td>
              <td className="p-2">{task.status}</td>
              <td className="p-2">
                <select
                  className="border p-1"
                  value={task.status}
                  onChange={(e) =>
                    updateStatus.mutate({
                      id: task._id,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
