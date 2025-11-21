import { useEffect, useRef } from 'react';
import { useProjectStore } from '../stores/useProjectStore';
import { debounce } from '../lib/utils';

export const useAutoSave = (data: any, delay: number = 1000) => {
  const { setSaveStatus } = useProjectStore();
  const previousDataRef = useRef<string>();

  useEffect(() => {
    const currentData = JSON.stringify(data);
    
    // Skip if data hasn't changed
    if (previousDataRef.current === currentData) {
      return;
    }

    previousDataRef.current = currentData;

    // Set saving status
    setSaveStatus('saving');

    // Debounced save simulation
    const debouncedSave = debounce(() => {
      // Simulate save
      setTimeout(() => {
        setSaveStatus('saved');
        
        // Reset to idle after 2 seconds
        setTimeout(() => {
          setSaveStatus('idle');
        }, 2000);
      }, 500);
    }, delay);

    debouncedSave();
  }, [data, delay, setSaveStatus]);
};

