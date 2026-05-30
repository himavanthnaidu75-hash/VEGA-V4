import { useEffect, useRef, useCallback } from 'react';
import useVegaStore from '../store/useVegaStore';

const useWebSocket = () => {
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);
  const backoff = useRef(1000);

  const {
    setStatus, setPnl, setPositions,
    addSignal, updateTickers, setKilled
  } = useVegaStore();

  const connect = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Handle both dev and prod environments
    const host = window.location.hostname === 'localhost' ? 'localhost:8000' : window.location.host;
    const url = `${protocol}//${host}/ws`;

    console.log(`Connecting to ${url}...`);
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log('WebSocket Connected');
      setStatus('CONNECTED');
      backoff.current = 1000;
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'system_status':
          setStatus(message.data.status);
          break;
        case 'daily_pnl':
          setPnl(message.data.pnl, message.data.pct);
          break;
        case 'positions_update':
          setPositions(message.data);
          break;
        case 'new_signal':
          addSignal(message.data);
          break;
        case 'ticker_update':
          // message.data expected to be {symbol: price} or [{symbol, price}]
          updateTickers(message.data);
          break;
        case 'kill_event':
        case 'kill_switch':
          setKilled(true);
          break;
        default:
          break;
      }
    };

    ws.current.onclose = () => {
      setStatus('DISCONNECTED');
      console.log(`WebSocket Closed. Reconnecting in ${backoff.current}ms...`);
      reconnectTimeout.current = setTimeout(() => {
        connect();
        backoff.current = Math.min(backoff.current * 2, 30000);
      }, backoff.current);
    };

    ws.current.onerror = (err) => {
      console.error('WebSocket Error:', err);
      ws.current.close();
    };
  }, [setStatus, setPnl, setPositions, addSignal, updateTickers, setKilled]);

  useEffect(() => {
    connect();
    return () => {
      if (ws.current) ws.current.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [connect]);

  return ws.current;
};

export default useWebSocket;
