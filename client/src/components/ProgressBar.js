const ProgressBar = ({ value, max = 100, showLabel = true, height = "normal", color = "primary" }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const heightClass = {
    small: "h-1",
    normal: "h-2",
    large: "h-4",
  }[height]

  const colorClass = {
    primary: "bg-primary",
    green: "bg-green-500",
    blue: "bg-blue-500",
    red: "bg-red-500",
  }[color]

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1 text-sm">
          <span>
            {value} / {max}
          </span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full ${heightClass} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
        <div
          className={`${heightClass} ${colorClass} rounded-full transition-all duration-300 ease-in-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar
