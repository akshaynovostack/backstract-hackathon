import { Search, Bell, Settings, User, Plus } from "lucide-react";
import Button from "../ui/Button";

export default function Header() {
  return (
    <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search tasks..."
            className="pl-10 pr-4 py-2 border rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="primary" className="flex items-center gap-2">
          <Plus size={16} />
          Create
        </Button>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Bell size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Settings size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <User size={20} />
        </div>
      </div>
    </header>
  );
}
