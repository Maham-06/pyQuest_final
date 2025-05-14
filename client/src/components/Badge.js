const Badge = ({ icon, name, description, size = "medium", earned = true }) => {
  const sizeClass = {
    small: "w-10 h-10",
    medium: "w-16 h-16",
    large: "w-24 h-24",
  }[size]

  return (
    <div className="flex flex-col items-center">
      <div
        className={`${sizeClass} rounded-full flex items-center justify-center mb-2 ${
          earned ? "bg-yellow-300 dark:bg-yellow-600" : "bg-gray-200 dark:bg-gray-700 opacity-50"
        }`}
      >
        <span className="text-2xl">{icon || "🏆"}</span>
      </div>
      <span className="font-medium text-center">{name}</span>
      {description && <span className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">{description}</span>}
    </div>
  )
}

export default Badge
