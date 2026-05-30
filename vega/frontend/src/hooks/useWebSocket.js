import { useEffect, useRef } from 'react';
import useVegaStore from '../store/useVegaStore';

const useWebSocket = () => {
  const ws = useRef(null);
  const { setStatus, setPnl, setPositions, addSignal, updateTicker } = useVegaStore();

  useEffect(() => {
    const connect = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host === 'localhost:5173' ? 'localhost:8000' : window.location.host;
      const url = `${protocol}//${host}/ws`;
      ws.current = new WebSocket(url);

      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        switch (message.type) {
          case 'system_status': setStatus(message.data.status); break;
          case 'daily_pnl': setPnl(message.data.pnl, message.data.pct); break;
          case 'positions_update': setPositions(message.data); break;
          case 'new_signal': addSignal(message.data); break;
          case 'ticker_update': updateTicker(message.data.symbol, message.data.price); break;
          case 'kill_switch': setStatus('KILLED'); break;
          default: break;
        }
      };
      ws.current.onclose = () => setTimeout(connect, 3000);
    };
    connect();
    return () => ws.current?.close();
  }, []);

  return ws.current;
};

export default useWebSocket;
