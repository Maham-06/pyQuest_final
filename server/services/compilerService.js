/*
const axios = require("axios")
const { supabase } = require("../config/supabase")

// Environment variables
const JDOODLE_CLIENT_ID = process.env.JDOODLE_CLIENT_ID
const JDOODLE_CLIENT_SECRET = process.env.JDOODLE_CLIENT_SECRET
const JDOODLE_API_URL = "https://api.jdoodle.com/v1/execute"

// Use JDoodle API to execute Python code
const executePythonCode = async (code, input = "") => {
  try {
    // Check if JDoodle credentials are available
    if (!JDOODLE_CLIENT_ID || !JDOODLE_CLIENT_SECRET) {
      console.warn("JDoodle credentials not found. Using mock execution.")
      return mockExecutePythonCode(code, input)
    }

    const response = await axios.post(JDOODLE_API_URL, {
      clientId: JDOODLE_CLIENT_ID,
      clientSecret: JDOODLE_CLIENT_SECRET,
      script: code,
      language: "python3",
      versionIndex: "4", // Python 3.10
      stdin: input,
    })

    return {
      success: true,
      output: response.data.output,
      cpuTime: response.data.cpuTime,
      memory: response.data.memory,
    }
  } catch (error) {
    console.error("Error executing Python code:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Error executing code",
      error: error.message,
    }
  }
}

// Mock execution for development or when JDoodle credentials are not available
const mockExecutePythonCode = (code, input = "") => {
  console.log("Mock executing Python code:", code)
  console.log("Input:", input)

  // Simple mock execution - in a real implementation, you would use a proper Python interpreter
  let output = "Mock execution result:\n"

  try {
    // Very basic simulation of Python execution
    if (code.includes("print(")) {
      const printMatches = code.match(/print$$(.*?)$$/g)
      if (printMatches) {
        printMatches.forEach((match) => {
          const content = match.substring(6, match.length - 1)
          // Handle simple string literals
          if (content.startsWith('"') && content.endsWith('"')) {
            output += content.substring(1, content.length - 1) + "\n"
          } else if (content.startsWith("'") && content.endsWith("'")) {
            output += content.substring(1, content.length - 1) + "\n"
          } else {
            // For variables or expressions, just echo them
            output += `[Value of: ${content}]\n`
          }
        })
      }
    } else if (input && code.includes("input(")) {
      output += `Using input: ${input}\n`
      output += "Mock result based on input\n"
    } else {
      output += "Code executed successfully with no output.\n"
    }

    // Add some basic error detection
    if (code.includes("syntax error")) {
      throw new Error("SyntaxError: invalid syntax")
    }
  } catch (error) {
    return {
      success: false,
      output: `Error: ${error.message}`,
    }
  }

  return {
    success: true,
    output,
    cpuTime: "0.01",
    memory: "8192",
  }
}

// Test Python code against test cases
const testPythonCode = async (code, testCases) => {
  try {
    // If no test cases provided, return success
    if (!testCases || testCases.length === 0) {
      return {
        success: true,
        message: "No test cases to run",
        results: [],
        allPassed: true,
        stars: 3,
      }
    }

    const results = []
    let passedCount = 0

    // Run each test case
    for (const testCase of testCases) {
      const { input, expectedOutput, description } = testCase

      // Execute code with test case input
      const executionResult = await executePythonCode(code, input)

      if (!executionResult.success) {
        results.push({
          passed: false,
          description: description || "Test case",
          input,
          expectedOutput,
          actualOutput: executionResult.output || "Execution error",
          error: executionResult.message,
        })
        continue
      }

      // Clean output (remove trailing newlines, etc.)
      const cleanedActualOutput = executionResult.output.trim()
      const cleanedExpectedOutput = expectedOutput.trim()

      // Compare output
      const passed = cleanedActualOutput === cleanedExpectedOutput

      if (passed) {
        passedCount++
      }

      results.push({
        passed,
        description: description || "Test case",
        input,
        expectedOutput: cleanedExpectedOutput,
        actualOutput: cleanedActualOutput,
      })
    }

    // Calculate stars based on passed tests
    const passRatio = passedCount / testCases.length
    let stars = 0
    if (passRatio === 1) {
      stars = 3 // All tests passed
    } else if (passRatio >= 0.7) {
      stars = 2 // At least 70% passed
    } else if (passRatio >= 0.4) {
      stars = 1 // At least 40% passed
    }

    return {
      success: true,
      results,
      allPassed: passedCount === testCases.length,
      passedCount,
      totalCount: testCases.length,
      stars,
    }
  } catch (error) {
    console.error("Error testing Python code:", error)
    return {
      success: false,
      message: error.message || "Error testing code",
      results: [],
      allPassed: false,
      stars: 0,
    }
  }
}

module.exports = {
  executePythonCode,
  testPythonCode,
}
*/

const axios = require("axios")
const { supabase } = require("../config/supabase")

// Environment variables
const JDOODLE_CLIENT_ID = process.env.JDOODLE_CLIENT_ID
const JDOODLE_CLIENT_SECRET = process.env.JDOODLE_CLIENT_SECRET
const JDOODLE_API_URL = "https://api.jdoodle.com/v1/execute"

// Use JDoodle API to execute Python code
const executePythonCode = async (code, input = "") => {
  try {
    // Check if JDoodle credentials are available
    if (!JDOODLE_CLIENT_ID || !JDOODLE_CLIENT_SECRET) {
      console.warn("JDoodle credentials not found. Using mock execution.")
      return mockExecutePythonCode(code, input)
    }

    const response = await axios.post(JDOODLE_API_URL, {
      clientId: JDOODLE_CLIENT_ID,
      clientSecret: JDOODLE_CLIENT_SECRET,
      script: code,
      language: "python3",
      versionIndex: "4", // Python 3.10
      stdin: input,
    })

    return {
      success: true,
      output: response.data.output || "",
      cpuTime: response.data.cpuTime,
      memory: response.data.memory,
    }
  } catch (error) {
    console.error("Error executing Python code:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Error executing code",
      error: error.message,
      output: "Error executing code",
    }
  }
}

// Mock execution for development or when JDoodle credentials are not available
const mockExecutePythonCode = (code, input = "") => {
  console.log("Mock executing Python code:", code)
  console.log("Input:", input)

  // Simple mock execution - in a real implementation, you would use a proper Python interpreter
  let output = "Mock execution result:\n"

  try {
    // Very basic simulation of Python execution
    if (code.includes("print(")) {
      const printMatches = code.match(/print$$(.*?)$$/g)
      if (printMatches) {
        printMatches.forEach((match) => {
          const content = match.substring(6, match.length - 1)
          // Handle simple string literals
          if (content.startsWith('"') && content.endsWith('"')) {
            output += content.substring(1, content.length - 1) + "\n"
          } else if (content.startsWith("'") && content.endsWith("'")) {
            output += content.substring(1, content.length - 1) + "\n"
          } else {
            // For variables or expressions, just echo them
            output += `[Value of: ${content}]\n`
          }
        })
      }
    } else if (input && code.includes("input(")) {
      output += `Using input: ${input}\n`
      output += "Mock result based on input\n"
    } else {
      output += "Code executed successfully with no output.\n"
    }

    // Add some basic error detection
    if (code.includes("syntax error")) {
      throw new Error("SyntaxError: invalid syntax")
    }
  } catch (error) {
    return {
      success: false,
      output: `Error: ${error.message}`,
    }
  }

  return {
    success: true,
    output,
    cpuTime: "0.01",
    memory: "8192",
  }
}

// Test Python code against test cases
const testPythonCode = async (code, testCases) => {
  try {
    // If no test cases provided, return success
    if (!testCases || testCases.length === 0) {
      return {
        success: true,
        message: "No test cases to run",
        results: [],
        allPassed: true,
        stars: 3,
      }
    }

    const results = []
    let passedCount = 0

    // Run each test case
    for (const testCase of testCases) {
      // Ensure testCase has all required properties
      const input = testCase.input || ""
      const expectedOutput = testCase.expected_output || "Hello, World!"
      const description = testCase.description || "Test case"

      // Execute code with test case input
      const executionResult = await executePythonCode(code, input)

      if (!executionResult.success) {
        results.push({
          passed: false,
          description,
          input,
          expectedOutput,
          actualOutput: executionResult.output || "Execution error",
          error: executionResult.message,
        })
        continue
      }

      // Clean output (remove trailing newlines, etc.)
      const cleanedActualOutput = (executionResult.output || "").trim()
      const cleanedExpectedOutput = expectedOutput.trim()

      // Compare output
      const passed = cleanedActualOutput === cleanedExpectedOutput

      if (passed) {
        passedCount++
      }

      results.push({
        passed,
        description,
        input,
        expectedOutput: cleanedExpectedOutput,
        actualOutput: cleanedActualOutput,
      })
    }

    // Calculate stars based on passed tests
    const passRatio = passedCount / testCases.length
    let stars = 0
    if (passRatio === 1) {
      stars = 3 // All tests passed
    } else if (passRatio >= 0.7) {
      stars = 2 // At least 70% passed
    } else if (passRatio >= 0.4) {
      stars = 1 // At least 40% passed
    }

    return {
      success: true,
      results,
      allPassed: passedCount === testCases.length,
      passedCount,
      totalCount: testCases.length,
      stars,
    }
  } catch (error) {
    console.error("Error testing Python code:", error)
    return {
      success: false,
      message: error.message || "Error testing code",
      results: [],
      allPassed: false,
      stars: 0,
    }
  }
}

module.exports = {
  executePythonCode,
  testPythonCode,
}
