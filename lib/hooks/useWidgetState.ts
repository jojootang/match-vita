// lib/hooks/useWidgetState.ts
import { useState, useEffect } from 'react';

export function useWidgetState() {
  const [widgetState, setWidgetState] = useState({
    isVisible: true,
    position: 'bottom-right' as 'top-right' | 'bottom-right' | 'floating',
    lastHidden: null as Date | null,
    preferences: {
      showChallenges: true,
      showTips: true,
      showReminders: true,
      showStreak: true
    }
  });

  useEffect(() => {
    // โหลด preferences จาก localStorage
    const savedState = localStorage.getItem('widget_state');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      
      // ตรวจสอบว่าซ่อนไว้ 24 ชั่วโมงหรือยัง
      if (parsed.lastHidden) {
        const lastHidden = new Date(parsed.lastHidden);
        const now = new Date();
        const hoursHidden = (now.getTime() - lastHidden.getTime()) / (1000 * 60 * 60);
        
        if (hoursHidden < 24) {
          setWidgetState(prev => ({ ...prev, isVisible: false }));
          return;
        }
      }
      
      setWidgetState(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  const updateWidgetState = (updates: Partial<typeof widgetState>) => {
    const newState = { ...widgetState, ...updates };
    setWidgetState(newState);
    localStorage.setItem('widget_state', JSON.stringify(newState));
  };

  const hideWidgetFor24Hours = () => {
    updateWidgetState({
      isVisible: false,
      lastHidden: new Date()
    });
  };

  const toggleVisibility = () => {
    updateWidgetState({
      isVisible: !widgetState.isVisible
    });
  };

  const updatePreferences = (preferences: Partial<typeof widgetState.preferences>) => {
    updateWidgetState({
      preferences: { ...widgetState.preferences, ...preferences }
    });
  };

  return {
    widgetState,
    hideWidgetFor24Hours,
    toggleVisibility,
    updatePreferences
  };
}