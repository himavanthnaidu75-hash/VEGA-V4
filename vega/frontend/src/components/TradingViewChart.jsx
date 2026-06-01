import React, { useEffect, useRef } from 'react';

const TradingViewChart = ({ symbol = 'NSE:RELIANCE' }) => {
  const containerRef = useRef();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: '5',
      timezone: 'Asia/Kolkata',
      theme: 'dark',
      style: '1',
      locale: 'en',
      toolbar_bg: '#0C0C0E',
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: true,
      container_id: 'tradingview_vega',
      studies: [],
      show_popup_button: true,
      popup_width: '1000',
      popup_height: '650',
      support_host: 'https://www.tradingview.com'
    });

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      const widgetDiv = document.createElement('div');
      widgetDiv.id = 'tradingview_vega';
      widgetDiv.style.height = '100%';
      widgetDiv.style.width = '100%';
      containerRef.current.appendChild(widgetDiv);
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [symbol]);

  return (
    <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
  );
};

export default TradingViewChart;
