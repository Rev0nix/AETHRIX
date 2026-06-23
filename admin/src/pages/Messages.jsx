import { useEffect, useState } from "react";
import api from "../services/api";

export default function Messages() {
  const [messages, setMessages] = useState([]);

  const loadMessages = async () => {
    try {
      const res = await api.get("/contact");
      setMessages(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await api.delete(`/contact/${id}`);
      loadMessages();
    } catch (err) {
      alert("Could not delete message");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Customer Messages ({messages.length})
      </h1>

      <div className="overflow-x-auto bg-white/5 rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/60">
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Message</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {messages.map((m) => (
              <tr key={m._id} className="border-b border-white/5">
                <td className="p-4">{m.name}</td>
                <td className="p-4">{m.email}</td>
                <td className="p-4">{m.message}</td>
                <td className="p-4">
                  {new Date(m.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => deleteMessage(m._id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {messages.length === 0 && (
          <div className="p-10 text-center text-white/40">
            No customer messages yet.
          </div>
        )}
      </div>
    </div>
  );
}