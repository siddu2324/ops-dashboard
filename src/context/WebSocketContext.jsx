// src/context/WebSocketContext.jsx
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";

// ----- Mock WebSocket Service -----
class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.onmessage = null;
    this.onopen = null;
    this.onclose = null;
    this.onerror = null;
    this.readyState = 0; // CONNECTING
    this._interval = null;
    this._eventCounter = 0;

    // Simulate connection opening
    setTimeout(() => {
      this.readyState = 1; // OPEN
      if (this.onopen) this.onopen({ target: this });
      // Start sending mock messages
      this._interval = setInterval(() => {
        if (this.readyState === 1) {
          this._sendMockMessage();
        }
      }, 5000 + Math.random() * 5000);
    }, 300);
  }

  _sendMockMessage() {
    const types = ["alert", "trace", "log"];
    const type = types[Math.floor(Math.random() * types.length)];
    const data = {
      type,
      payload: this._generatePayload(type),
      timestamp: new Date().toISOString(),
    };
    this._eventCounter++;
    if (this.onmessage) {
      this.onmessage({ data: JSON.stringify(data) });
    }
  }

  _generatePayload(type) {
    if (type === "alert") {
      const severities = ["critical", "warning", "info"];
      const names = ["CPU spike", "Memory high", "Service down", "Latency spike", "Error rate", "SSL expiry"];
      return {
        id: Date.now(),
        name: names[Math.floor(Math.random() * names.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        status: "firing",
        threshold: "80%",
        lastTriggered: "Just now",
      };
    }
    if (type === "trace") {
      const services = ["api-gateway", "auth-service", "order-service"];
      return {
        id: `trace-${Date.now()}`,
        service: services[Math.floor(Math.random() * services.length)],
        duration: 100 + Math.floor(Math.random() * 900),
        status: Math.random() > 0.2 ? "success" : "error",
        spans: [],
        timestamp: new Date().toISOString(),
      };
    }
    if (type === "log") {
      const messages = ["User login", "Order placed", "Payment failed", "Cache miss", "DB query slow"];
      const severities = ["info", "warn", "error"];
      return {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        severity: severities[Math.floor(Math.random() * severities.length)],
        service: "api-gateway",
        message: messages[Math.floor(Math.random() * messages.length)],
      };
    }
    return {};
  }

  send(data) {
    console.log("MockWebSocket sent:", data);
  }

  close() {
    this.readyState = 2; // CLOSING
    clearInterval(this._interval);
    setTimeout(() => {
      this.readyState = 3; // CLOSED
      if (this.onclose) this.onclose({ target: this });
    }, 100);
  }
}

// ----- Context -----
const WebSocketContext = createContext(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [lastMessage, setLastMessage] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const connect = () => {
    setConnectionStatus("connecting");
    const ws = new MockWebSocket("ws://mock-server");
    wsRef.current = ws;

    ws.onopen = () => {
      setConnectionStatus("connected");
      toast.success("WebSocket connected", { duration: 3000 });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
        // Toast notifications removed for critical and warning alerts
      } catch (e) {
        console.error("Failed to parse WebSocket message", e);
      }
    };

    ws.onclose = () => {
      setConnectionStatus("disconnected");
      toast.error("WebSocket disconnected", { duration: 3000 });
      // Attempt reconnect after 5 seconds
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 5000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("error");
    };
  };

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, []);

  const sendMessage = (data) => {
    if (wsRef.current && wsRef.current.readyState === 1) {
      wsRef.current.send(JSON.stringify(data));
    }
  };

  const value = {
    connectionStatus,
    lastMessage,
    sendMessage,
    reconnect: connect,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};