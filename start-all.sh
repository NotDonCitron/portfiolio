#!/bin/bash

echo "🚀 Starting Portfolio Website..."
echo "================================"

# Start Backend
echo "📡 Starting Backend Server (port 5000)..."
cd backend
source venv/bin/activate 2>/dev/null || echo "⚠️  venv not found, creating..."
python -m venv venv 2>/dev/null
source venv/bin/activate
pip install -q -r requirements.txt
python app.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 3

# Check backend health
if curl -s http://localhost:5000/health > /dev/null; then
  echo "✅ Backend started successfully"
else
  echo "❌ Backend failed to start"
  exit 1
fi

# Start Frontend
echo "🎨 Starting Frontend Server (port 5173)..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "================================"
echo "✅ Both servers running!"
echo ""
echo "📡 Backend:  http://localhost:5000"
echo "🌐 Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Cleanup on exit
trap "echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM

# Wait for both processes
wait
