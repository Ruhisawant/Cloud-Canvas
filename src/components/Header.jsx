import { Link } from "react-router-dom";
import { Cloud, PlusCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Cloud className="h-6 w-6 text-sky-500" />
          <span>CloudSpotters</span>
        </Link>
        
        <Link 
          to="/create" 
          className="bg-sky-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-sky-600 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Post</span>
        </Link>
      </div>
    </header>
  );
}