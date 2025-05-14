"use client"

import { CheckCircle, Circle } from "lucide-react"

const ExerciseSelector = ({ exercises, activeIndex, onChange }) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-2">
        {exercises.map((exercise, index) => (
          <button
            key={exercise.id}
            className={`flex-1 px-4 py-3 rounded-md transition-colors ${
              activeIndex === index
                ? "bg-primary text-white"
                : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={() => onChange(index)}
          >
            <div className="flex items-center gap-2">
              {exercise.completed ? (
                <CheckCircle size={16} className={activeIndex === index ? "text-white" : "text-green-500"} />
              ) : (
                <Circle size={16} className={activeIndex === index ? "text-white" : "text-gray-400"} />
              )}
              <div className="text-left">
                <div className="font-medium">{exercise.title}</div>
                <div
                  className={`text-xs ${activeIndex === index ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}
                >
                  {exercise.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((activeIndex + 1) / exercises.length) * 100}%` }}
          ></div>
        </div>
        <div className="pt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          Quest {activeIndex + 1} of {exercises.length}
        </div>
      </div>
    </div>
  )
}

export default ExerciseSelector
