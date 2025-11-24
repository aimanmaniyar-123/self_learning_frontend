import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, AlertCircle, Server } from 'lucide-react';
import { testConnection } from '../utils/api';

export function BackendTest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    runTest();
  }, []);

  const runTest = async () => {
    setTesting(true);
    setResult(null);
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UX
    
    const testResult = await testConnection();
    setResult(testResult);
    setTesting(false);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Backend Connection Test</h1>
          <p className="text-gray-600">Test connection to your FastAPI backend</p>
        </div>

        {/* Connection Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Server className="w-6 h-6 text-gray-600" />
              <div>
                <div className="text-gray-900">Backend Status</div>
                <p className="text-sm text-gray-600">http://localhost:8000</p>
              </div>
            </div>
            <button
              onClick={runTest}
              disabled={testing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
              Test Connection
            </button>
          </div>

          {testing && (
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-blue-900">Testing connection to backend...</span>
            </div>
          )}

          {!testing && result && (
            <>
              {result.success ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="text-green-900">✅ Backend Connected Successfully!</div>
                      <p className="text-sm text-green-700">Status: {result.status}</p>
                    </div>
                  </div>
                  <div className="text-sm text-green-800 mt-2">
                    Your FastAPI backend is running and accessible. You can now use all features.
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <XCircle className="w-6 h-6 text-red-600" />
                    <div>
                      <div className="text-red-900">❌ Cannot Connect to Backend</div>
                      <p className="text-sm text-red-700">{result.details}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-red-800 mt-2 mb-4">
                    Error: {result.error}
                  </div>

                  {/* Troubleshooting Steps */}
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <span className="text-gray-900">Troubleshooting Steps:</span>
                    </div>
                    <ol className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 shrink-0">1.</span>
                        <div>
                          <strong>Check if backend is running:</strong>
                          <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                            python main.py{'\n'}# or{'\n'}uvicorn main:app --reload
                          </pre>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 shrink-0">2.</span>
                        <div>
                          <strong>Verify backend is on port 8000:</strong>
                          <div className="mt-1 text-gray-600">
                            Open <code className="px-1 py-0.5 bg-gray-100 rounded">http://localhost:8000</code> in your browser
                          </div>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 shrink-0">3.</span>
                        <div>
                          <strong>Enable CORS in FastAPI:</strong>
                          <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
{`from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)`}
                          </pre>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 shrink-0">4.</span>
                        <div>
                          <strong>Check backend URL:</strong>
                          <div className="mt-1 text-gray-600">
                            Edit <code className="px-1 py-0.5 bg-gray-100 rounded">/utils/api.ts</code> line 2 if your backend uses a different URL
                          </div>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 shrink-0">5.</span>
                        <div>
                          <strong>Check firewall/antivirus:</strong>
                          <div className="mt-1 text-gray-600">
                            Make sure port 8000 is not blocked
                          </div>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-gray-900 mb-2">Backend Documentation</div>
            <p className="text-sm text-gray-600 mb-3">
              Check your FastAPI backend docs
            </p>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              Open API Docs →
            </a>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-gray-900 mb-2">Health Endpoint</div>
            <p className="text-sm text-gray-600 mb-3">
              Test the health check endpoint
            </p>
            <a
              href="http://localhost:8000/health"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              Test /health →
            </a>
          </div>
        </div>

        {/* Sample Backend Code */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-gray-900 mb-3">Sample FastAPI Backend Setup</div>
          <p className="text-sm text-gray-600 mb-4">
            If you haven't set up CORS yet, here's a minimal example:
          </p>
          <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-xs overflow-x-auto">
{`from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}

@app.get("/api/agents")
def get_agents():
    return [
        {
            "id": "agent-1",
            "name": "Test Agent",
            "status": "active",
            "type": "Classification"
        }
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)`}
          </pre>
        </div>
      </div>
    </div>
  );
}
