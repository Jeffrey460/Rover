let socket = null

export function connectWebSocket(onMessage, onStatusChange) {
  const notify = (status) => {
    if (typeof onStatusChange === 'function') onStatusChange(status)
  }

  notify('connecting')
  socket = new WebSocket('ws://localhost:5000')

  socket.onopen = () => {
    notify('connected')
  }

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data)
    onMessage(message)
  }

  socket.onerror = (err) => {
    console.error('WebSocket error:', err)
    notify('disconnected')
  }

  socket.onclose = () => {
    console.log('WebSocket closed — reconnecting in 3s')
    notify('disconnected')
    setTimeout(() => connectWebSocket(onMessage, onStatusChange), 3000)
  }
}

export function sendMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message))
  } else {
    console.error('WebSocket is not open')
  }
}


