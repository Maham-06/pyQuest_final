"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"

interface TestCase {
  input: string
  expectedOutput: string
  description: string
}

interface PythonCompilerProps {
  initialCode: string
  instructions: string
  testCases: TestCase[]
}

export function PythonCompiler({ initialCode, instructions, testCases }: PythonCompilerProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[]>([])

  const runCode = () => {
    setIsRunning(true)
    setOutput("Running code...")

    // In a real implementation, this would send the code to a backend service
    // that would execute the Python code and return the result
    setTimeout(() => {
      setOutput("Hello, Python!")
      setIsRunning(false)
    }, 1000)
  }

  const runTests = () => {
    setIsRunning(true)
    setOutput("Running tests...")

    // Simulate test execution
    setTimeout(() => {
      // This is just a simulation - in a real app, you'd actually run the code against test cases
      const results = testCases.map((test) => {
        const passed = code.includes('message = "Hello, Python!"') && code.includes("print(message)")
        return {
          passed,
          message: passed ? `Test passed: ${test.description}` : `Test failed: Expected "${test.expectedOutput}"`,
        }
      })

      setTestResults(results)
      setOutput(results.map((r) => r.message).join("\n"))
      setIsRunning(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="mb-4">
        <Alert>
          <AlertDescription>{instructions}</AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="code" className="flex-1 flex flex-col">
        <TabsList>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="output">Output</TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="flex-1 flex flex-col">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-4 font-mono text-sm bg-secondary/20 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </TabsContent>

        <TabsContent value="output" className="flex-1">
          <ScrollArea className="h-full w-full bg-secondary/20 rounded-md p-4">
            <pre className="font-mono text-sm whitespace-pre-wrap">{output || "Run your code to see output here"}</pre>

            {testResults.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h3 className="font-bold mb-2">Test Results:</h3>
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-start gap-2 mb-2">
                    {result.passed ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <p className={result.passed ? "text-green-600" : "text-red-600"}>{result.message}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2 mt-4">
        <Button onClick={runCode} disabled={isRunning} className="flex-1">
          Run Code
        </Button>
        <Button onClick={runTests} disabled={isRunning} variant="outline" className="flex-1">
          Submit Solution
        </Button>
      </div>
    </div>
  )
}
