/*
"use client"

import { useState, useEffect } from "react"
import api from "../services/api"

const PythonCompiler = ({ initialCode, instructions, testCases, levelId, onComplete }) => {
  const [code, setCode] = useState(initialCode || "# Write your code here\n\n")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState("code")
  const [testResults, setTestResults] = useState([])
  const [timeSpent, setTimeSpent] = useState(0)
  const [timer, setTimer] = useState(null)

  // Start timer when component mounts
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1)
    }, 1000)

    setTimer(interval)

    // Clear interval when component unmounts
    return () => clearInterval(interval)
  }, [])

  // Run code
  const runCode = async () => {
    try {
      setIsRunning(true)
      setOutput("Running code...")
      setActiveTab("output")

      const response = await api.post("/api/compiler/execute", { code })

      setOutput(response.data.output)
    } catch (error) {
      setOutput(`Error: ${error.response?.data?.message || error.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  // Run tests
  const runTests = async () => {
    try {
      setIsRunning(true)
      setOutput("Running tests...")
      setActiveTab("output")

      // Save current code
      await api.post(`/api/levels/${levelId}/submit`, {
        code,
        timeSpent,
      })

      // Run tests
      const response = await api.post("/api/compiler/test", {
        levelId,
        code,
      })

      setTestResults(response.data.results)

      let outputText = "Test Results:\n\n"
      response.data.results.forEach((result, index) => {
        outputText += `Test ${index + 1}: ${result.description}\n`
        outputText += `${result.passed ? "✅ Passed" : "❌ Failed"}\n`

        if (!result.passed) {
          outputText += `Expected: ${result.expectedOutput}\n`
          outputText += `Actual: ${result.actualOutput || "Error"}\n`
        }

        outputText += "\n"
      })

      outputText += `Overall: ${response.data.allPassed ? "All tests passed! 🎉" : "Some tests failed."}\n`
      outputText += `Stars earned: ${"★".repeat(response.data.stars)}${"☆".repeat(3 - response.data.stars)}\n`

      setOutput(outputText)

      // If all tests passed, complete the level
      if (response.data.allPassed) {
        const completeResponse = await api.post(`/api/levels/${levelId}/complete`, {
          code,
          timeSpent,
          stars: response.data.stars,
        })

        // Clear timer
        if (timer) {
          clearInterval(timer)
        }

        // Call onComplete callback
        if (onComplete) {
          onComplete(completeResponse.data)
        }
      }
    } catch (error) {
      setOutput(`Error: ${error.response?.data?.message || error.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="mb-4 bg-yellow-100 dark:bg-yellow-900 p-4 rounded-md">
        <p className="text-sm">{instructions}</p>
      </div>

      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 ${activeTab === "code" ? "border-b-2 border-primary font-medium" : ""}`}
          onClick={() => setActiveTab("code")}
        >
          Code
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "output" ? "border-b-2 border-primary font-medium" : ""}`}
          onClick={() => setActiveTab("output")}
        >
          Output
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        {activeTab === "code" ? (
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-4 font-mono text-sm bg-gray-100 dark:bg-gray-800 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
        ) : (
          <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-800 rounded-md p-4">
            <pre className="font-mono text-sm whitespace-pre-wrap">{output || "Run your code to see output here"}</pre>

            {testResults.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h3 className="font-bold mb-2">Test Results:</h3>
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-start gap-2 mb-2">
                    {result.passed ? (
                      <span className="text-green-500">✅</span>
                    ) : (
                      <span className="text-red-500">❌</span>
                    )}
                    <p
                      className={
                        result.passed ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      }
                    >
                      {result.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={runCode}
          disabled={isRunning}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Run Code
        </button>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Submit Solution
        </button>
      </div>
    </div>
  )
}

export default PythonCompiler
*/
/*
"use client"

import { useState, useEffect } from "react"
import api from "../services/api"
import { useToast } from "../context/ToastContext"

const PythonCompiler = ({ initialCode, instructions, testCases, levelId, onComplete }) => {
  const [code, setCode] = useState(initialCode || "# Write your Python code here")
  const [output, setOutput] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const { addToast } = useToast()

  useEffect(() => {
    // Set initial code when component mounts or initialCode changes
    if (initialCode) {
      setCode(initialCode)
    }

    // Start timer for tracking time spent on level
    setStartTime(Date.now())

    return () => {
      // Submit time spent when component unmounts
      submitTimeSpent()
    }
  }, [initialCode])

  const submitTimeSpent = async () => {
    if (!startTime || !levelId) return

    const timeSpent = Math.floor((Date.now() - startTime) / 1000) // Time in seconds

    try {
      await api.post(`/api/levels/${levelId}/submit`, {
        code,
        timeSpent,
      })
    } catch (err) {
      console.error("Error submitting time spent:", err)
    }
  }

  const handleExecute = async () => {
    setIsExecuting(true)
    setOutput("")

    try {
      const response = await api.post("/api/compiler/execute", {
        code,
        input: "",
      })

      if (response.data.success) {
        setOutput(response.data.output)
      } else {
        setOutput(`Error: ${response.data.message || "Failed to execute code"}`)
      }
    } catch (err) {
      console.error("Error executing code:", err)
      setOutput(`Error: ${err.response?.data?.message || "Failed to execute code"}`)
    } finally {
      setIsExecuting(false)
    }
  }

  const handleTest = async () => {
    setIsTesting(true)
    setOutput("")

    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000) // Time in seconds

      const response = await api.post("/api/compiler/test", {
        levelId,
        code,
        timeSpent,
      })

      if (response.data.success) {
        // Format test results
        const results = response.data.results
        let outputText = "Test Results:\n\n"

        results.forEach((result, index) => {
          outputText += `Test ${index + 1}: ${result.passed ? "✅ Passed" : "❌ Failed"}\n`
          outputText += `Description: ${result.description}\n`
          outputText += `Input: ${result.input}\n`
          outputText += `Expected: ${result.expectedOutput}\n`
          outputText += `Actual: ${result.actualOutput}\n\n`
        })

        outputText += `Overall: ${response.data.allPassed ? "All tests passed!" : "Some tests failed."}\n`
        outputText += `Stars earned: ${"⭐".repeat(response.data.stars)}\n`

        setOutput(outputText)

        // If all tests passed, call onComplete
        if (response.data.allPassed && onComplete) {
          onComplete(response.data)
        }
      } else {
        setOutput(`Error: ${response.data.message || "Failed to test code"}`)
      }
    } catch (err) {
      console.error("Error testing code:", err)
      setOutput(`Error: ${err.response?.data?.message || "Failed to test code"}`)
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Instructions</h3>
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md text-sm">
          {instructions || "Write a Python program to solve the challenge."}
        </div>
      </div>

      <div className="flex-grow mb-4">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-64 p-3 font-mono text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
          spellCheck="false"
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleExecute}
          disabled={isExecuting || isTesting}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
        >
          {isExecuting ? "Running..." : "Run Code"}
        </button>

        <button
          onClick={handleTest}
          disabled={isExecuting || isTesting}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md disabled:opacity-50"
        >
          {isTesting ? "Testing..." : "Submit & Test"}
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Output</h3>
        <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm h-40 overflow-auto whitespace-pre-wrap">
          {output || "Code output will appear here..."}
        </pre>
      </div>
    </div>
  )
}

export default PythonCompiler
*/

/*
"use client"

import { useState, useEffect } from "react"
import { useToast } from "../context/ToastContext"
import levelService from "../services/levelService"

const PythonCompiler = ({ initialCode, instructions, testCases, levelId, onComplete }) => {
  const [code, setCode] = useState(initialCode || "# Write your Python code here")
  const [output, setOutput] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const { addToast } = useToast()

  useEffect(() => {
    // Set initial code when component mounts or initialCode changes
    if (initialCode) {
      setCode(initialCode)
    }

    // Start timer for tracking time spent on level
    setStartTime(Date.now())

    return () => {
      // Submit time spent when component unmounts
      submitTimeSpent()
    }
  }, [initialCode])

  const submitTimeSpent = async () => {
    if (!startTime || !levelId) return

    const timeSpent = Math.floor((Date.now() - startTime) / 1000) // Time in seconds

    try {
      await levelService.submitSolution(levelId, code, timeSpent)
    } catch (err) {
      console.error("Error submitting time spent:", err)
    }
  }

  const handleExecute = async () => {
    setIsExecuting(true)
    setOutput("")

    try {
      // For now, we'll simulate execution with a mock response
      // In a real implementation, you would call your backend API
      setTimeout(() => {
        setOutput(`Executing code...\n\n${code}\n\nOutput:\nHello, world!`)
        setIsExecuting(false)
      }, 1000)
    } catch (err) {
      console.error("Error executing code:", err)
      setOutput(`Error: ${err.message || "Failed to execute code"}`)
      setIsExecuting(false)
    }
  }

  const handleTest = async () => {
    setIsTesting(true)
    setOutput("")

    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000) // Time in seconds

      // For now, we'll simulate testing with a mock response
      // In a real implementation, you would call your backend API
      setTimeout(() => {
        // Simulate successful test results
        const results = [
          {
            passed: true,
            description: "Test basic functionality",
            input: "5",
            expectedOutput: "25",
            actualOutput: "25",
          },
          {
            passed: true,
            description: "Test with zero",
            input: "0",
            expectedOutput: "0",
            actualOutput: "0",
          },
          {
            passed: true,
            description: "Test with negative number",
            input: "-5",
            expectedOutput: "25",
            actualOutput: "25",
          },
        ]

        const allPassed = results.every((r) => r.passed)
        const stars = allPassed ? 3 : results.filter((r) => r.passed).length

        let outputText = "Test Results:\n\n"

        results.forEach((result, index) => {
          outputText += `Test ${index + 1}: ${result.passed ? "✅ Passed" : "❌ Failed"}\n`
          outputText += `Description: ${result.description}\n`
          outputText += `Input: ${result.input}\n`
          outputText += `Expected: ${result.expectedOutput}\n`
          outputText += `Actual: ${result.actualOutput}\n\n`
        })

        outputText += `Overall: ${allPassed ? "All tests passed!" : "Some tests failed."}\n`
        outputText += `Stars earned: ${"⭐".repeat(stars)}\n`

        setOutput(outputText)
        setIsTesting(false)

        // If all tests passed, call onComplete
        if (allPassed && onComplete) {
          // In a real implementation, you would call your backend API to complete the level
          levelService.completeLevel(levelId, code, timeSpent, stars).then((response) => {
            if (response.success) {
              onComplete({
                stars,
                xpEarned: response.xpEarned || 100,
                earnedBadges: response.earnedBadges || [],
                nextLevel: response.nextLevel,
              })
            } else {
              addToast(response.message || "Failed to complete level", "error")
            }
          })
        }
      }, 1500)
    } catch (err) {
      console.error("Error testing code:", err)
      setOutput(`Error: ${err.message || "Failed to test code"}`)
      setIsTesting(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Instructions</h3>
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md text-sm">
          {instructions || "Write a Python program to solve the challenge."}
        </div>
      </div>

      <div className="flex-grow mb-4">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-64 p-3 font-mono text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
          spellCheck="false"
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleExecute}
          disabled={isExecuting || isTesting}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
        >
          {isExecuting ? "Running..." : "Run Code"}
        </button>

        <button
          onClick={handleTest}
          disabled={isExecuting || isTesting}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md disabled:opacity-50"
        >
          {isTesting ? "Testing..." : "Submit & Test"}
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Output</h3>
        <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm h-40 overflow-auto whitespace-pre-wrap">
          {output || "Code output will appear here..."}
        </pre>
      </div>
    </div>
  )
}

export default PythonCompiler
*/


"use client"

import { useState, useEffect } from "react"
import { useToast } from "../context/ToastContext"
import api from "../services/api"

const PythonCompiler = ({ initialCode, instructions, testCases, levelId, onComplete }) => {
  const [code, setCode] = useState(initialCode || "# Write your Python code here")
  const [output, setOutput] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const { addToast } = useToast()

  useEffect(() => {
    // Set initial code when component mounts or initialCode changes
    if (initialCode) {
      setCode(initialCode)
    }

    // Start timer for tracking time spent on level
    setStartTime(Date.now())

    return () => {
      // Submit time spent when component unmounts
      submitTimeSpent()
    }
  }, [initialCode])

  const submitTimeSpent = async () => {
    if (!startTime || !levelId) return

    const timeSpent = Math.floor((Date.now() - startTime) / 1000) // Time in seconds

    try {
      await api.post(`/api/levels/${levelId}/submit`, {
        code,
        timeSpent,
      })
    } catch (err) {
      console.error("Error submitting time spent:", err)
    }
  }

  const handleExecute = async () => {
    setIsExecuting(true)
    setOutput("Running your code...")

    try {
      const response = await api.post("/api/compiler/execute", {
        code,
        input: "",
      })

      if (response.data.success) {
        setOutput(response.data.output || "No output")
      } else {
        setOutput(`Error: ${response.data.message || "Failed to execute code"}`)
      }
    } catch (err) {
      console.error("Error executing code:", err)
      setOutput(`Error: ${err.response?.data?.message || err.message || "Failed to execute code"}`)
    } finally {
      setIsExecuting(false)
    }
  }

  const handleTest = async () => {
    setIsTesting(true)
    setOutput("Testing your code...")

    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000) // Time in seconds

      const response = await api.post("/api/compiler/test", {
        levelId,
        code,
        timeSpent,
      })

      if (response.data.success) {
        // Format test results
        const results = response.data.results || []
        let outputText = "Test Results:\n\n"

        if (results.length === 0) {
          outputText += "No test cases were run.\n"
        } else {
          results.forEach((result, index) => {
            outputText += `Test ${index + 1}: ${result.passed ? "✅ Passed" : "❌ Failed"}\n`
            outputText += `Description: ${result.description || "Test case"}\n`
            outputText += `Input: ${result.input || "(none)"}\n`
            outputText += `Expected: ${result.expectedOutput || ""}\n`
            outputText += `Actual: ${result.actualOutput || ""}\n\n`
          })

          outputText += `Overall: ${response.data.allPassed ? "All tests passed!" : "Some tests failed."}\n`
          outputText += `Stars earned: ${"⭐".repeat(response.data.stars || 0)}\n`
        }

        setOutput(outputText)

        // If all tests passed, call onComplete
        if (response.data.allPassed && onComplete) {
          onComplete({
            stars: response.data.stars || 0,
            xpEarned: response.data.xpEarned || 0,
            earnedBadges: response.data.earnedBadges || [],
            nextLevel: response.data.nextLevel,
          })
        }
      } else {
        setOutput(`Error: ${response.data.message || "Failed to test code"}`)
      }
    } catch (err) {
      console.error("Error testing code:", err)
      setOutput(`Error: ${err.response?.data?.message || err.message || "Failed to test code"}`)
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Instructions</h3>
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md text-sm">
          {instructions || "Write a Python program to solve the challenge."}
        </div>
      </div>

      <div className="flex-grow mb-4">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-64 p-3 font-mono text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
          spellCheck="false"
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleExecute}
          disabled={isExecuting || isTesting}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
        >
          {isExecuting ? "Running..." : "Run Code"}
        </button>

        <button
          onClick={handleTest}
          disabled={isExecuting || isTesting}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md disabled:opacity-50"
        >
          {isTesting ? "Testing..." : "Submit & Test"}
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Output</h3>
        <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm h-40 overflow-auto whitespace-pre-wrap">
          {output || "Code output will appear here..."}
        </pre>
      </div>
    </div>
  )
}

export default PythonCompiler
