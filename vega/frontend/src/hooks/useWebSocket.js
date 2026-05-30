import { useEffect, useRef } from 'react';
import useVegaStore from '../store/useVegaStore';

const useWebSocket = () => {
  const ws = useRef(null);
  const { setStatus, setPnl, setPositions, addSignal } = useVegaStore();

  useEffect(() => {
    const connect = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const url = `${protocol}//${window.location.host}/ws`;
      ws.current = new WebSocket(url);

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
          case 'kill_switch':
            setStatus('KILLED');
            break;
          default:
            break;
        }
      };

      ws.current.onclose = () => {
        setTimeout(connect, 3000);
      };
    };

    connect();
    return () => ws.current?.close();
  }, [setStatus, setPnl, setPositions, addSignal]);

  return ws.current;
};

export default useWebSocket;
