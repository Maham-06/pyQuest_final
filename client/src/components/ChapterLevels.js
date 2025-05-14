/*
"use client"
import { useNavigate } from "react-router-dom"
import { Lock, CheckCircle, Circle } from "lucide-react"

const ChapterLevels = ({ levels, chapterId }) => {
  const navigate = useNavigate()

  const handleLevelClick = (levelId, isLocked) => {
    if (isLocked) return
    navigate(`/chapter/${chapterId}/level/${levelId}`)
  }

  return (
    <div className="overflow-auto pr-4 max-h-[800px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map((level, index) => (
          <div
            key={level.id}
            className={`level-card cursor-pointer hover:shadow-lg bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 ${
              level.isLocked ? "opacity-70 cursor-not-allowed" : ""
            }`}
            onClick={() => handleLevelClick(level.id, level.isLocked)}
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{level.title}</h3>
                {level.isLocked ? (
                  <Lock size={18} className="text-gray-400" />
                ) : (
                  <div className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">Level {index + 1}</div>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{level.description}</p>

              <div className="space-y-2 mb-4">
                <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                  Quests
                </h4>
                {level.exercises &&
                  level.exercises.map((exercise, i) => (
                    <div key={exercise.id} className="flex items-center gap-2">
                      {exercise.completed ? (
                        <CheckCircle size={14} className="text-green-500" />
                      ) : (
                        <Circle size={14} className="text-gray-400" />
                      )}
                      <span className="text-sm">{exercise.title}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="px-4 pb-4">
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{
                    width: level.progress?.completed ? "100%" : level.progress?.attempts ? "50%" : "0%",
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs">
                <span>
                  {level.isLocked
                    ? "Locked"
                    : level.progress?.completed
                      ? "Completed"
                      : level.progress?.attempts
                        ? "In Progress"
                        : "Not Started"}
                </span>
                {level.progress?.completed && (
                  <span className="flex">
                    {Array.from({ length: level.progress.stars }).map((_, i) => (
                      <span key={i} className="text-yellow-500">
                        ★
                      </span>
                    ))}
                    {Array.from({ length: 3 - (level.progress.stars || 0) }).map((_, i) => (
                      <span key={i} className="text-gray-300 dark:text-gray-600">
                        ★
                      </span>
                    ))}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChapterLevels
*/
import { Link } from "react-router-dom"
import { Lock, CheckCircle, Circle, Star } from "lucide-react"

const ChapterLevels = ({ levels, chapterId }) => {
  if (!levels || levels.length === 0) {
    return <p className="text-center py-8">No levels found for this chapter.</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {levels.map((level, index) => (
        <div
          key={level.id}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${
            level.isLocked ? "opacity-70" : ""
          }`}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">{level.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{level.description}</p>
              </div>
              <div className="flex items-center">
                {level.progress?.completed ? (
                  <CheckCircle className="text-green-500" size={24} />
                ) : (
                  <Circle className="text-gray-400" size={24} />
                )}
              </div>
            </div>

            {level.progress && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>
                    {level.progress.stars > 0 ? (
                      <div className="flex">
                        {Array.from({ length: level.progress.stars }).map((_, i) => (
                          <Star key={i} className="text-yellow-500 fill-yellow-500" size={16} />
                        ))}
                        {Array.from({ length: 3 - level.progress.stars }).map((_, i) => (
                          <Star key={i} className="text-gray-300" size={16} />
                        ))}
                      </div>
                    ) : (
                      "Not started"
                    )}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${level.progress.completed ? 100 : level.progress.attempts > 0 ? 30 : 0}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {level.exercises ? `${level.exercises.length} exercises` : "Multiple exercises"}
              </div>
              {level.isLocked ? (
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Lock size={16} className="mr-1" />
                  <span className="text-sm">Complete previous level</span>
                </div>
              ) : (
                <Link
                  to={`/chapter/${chapterId}/level/${level.id}`}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md text-sm"
                >
                  {level.progress?.completed
                    ? "Review Level"
                    : level.progress?.attempts > 0
                      ? "Continue"
                      : "Start Level"}
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChapterLevels
