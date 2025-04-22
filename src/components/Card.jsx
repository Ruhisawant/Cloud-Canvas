export default function Card({ children, className = "" }) {
    return (
      <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
        {children}
      </div>
    );
  }
  
  export function Badge({ children, className = "" }) {
    return (
      <span className={`bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded-full ${className}`}>
        {children}
      </span>
    );
  }
  
  export function Button({ 
    children, 
    variant = "default", 
    size = "default", 
    type = "button",
    className = "", 
    onClick 
  }) {
    const variantClasses = {
      default: "bg-sky-500 text-white hover:bg-sky-600",
      outline: "bg-transparent border border-gray-300 hover:bg-gray-50",
      destructive: "bg-red-500 text-white hover:bg-red-600",
      ghost: "bg-transparent hover:bg-gray-100"
    };
    
    const sizeClasses = {
      default: "px-4 py-2",
      sm: "px-3 py-1 text-sm",
      lg: "px-6 py-3 text-lg",
      icon: "p-2"
    };
    
    const baseClasses = "rounded-md font-medium transition-colors";
    
    return (
      <button
        type={type}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }