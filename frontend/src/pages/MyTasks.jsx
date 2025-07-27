import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../auth/AuthContext"; // ✅ FIXED IMPORT

export default function MyTasks() {
  const { user } = useAuth(); // ✅ Get logged-in employee info
  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myTasks"],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:3000/api/tasks/employee/${user?.id}`, // ✅ use user.id
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      return res.data || [];
    },
    enabled: !!user?.id, // ✅ prevents query before login
  });

  const mutation = useMutation({
    mutationFn: async ({ taskId, status }) => {
      await axios.put(
        `http://localhost:3000/api/tasks/update/${taskId}`,
        { status },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
    },
    onSuccess: () => queryClient.invalidateQueries(["myTasks"]),
  });

  if (isLoading) return <p>Loading your tasks...</p>;
  if (error) return <p>Error loading tasks</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">My Tasks</h1>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Title</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Update</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td className="border p-2">{task.title}</td>
              <td className="border p-2">{task.description}</td>
              <td className="border p-2">{task.status}</td>
              <td className="border p-2">
                <select
                  defaultValue={task.status}
                  onChange={(e) =>
                    mutation.mutate({
                      taskId: task._id,
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
