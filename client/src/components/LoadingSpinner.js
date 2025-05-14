const LoadingSpinner = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "h-6 w-6 border-2",
    medium: "h-10 w-10 border-3",
    large: "h-16 w-16 border-4",
  }

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-t-transparent border-primary`}></div>
    </div>
  )
}

export default LoadingSpinner
