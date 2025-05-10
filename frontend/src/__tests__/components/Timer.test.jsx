// src/__tests__/components/Timer.test.jsx
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Timer from '../../components/Timer';

describe('Timer Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  
  test('renders initial time correctly', () => {
    const onTimeUp = jest.fn();
    render(<Timer initialSeconds={10} onTimeUp={onTimeUp} />);
    expect(screen.getByText(/Time Remaining:\s*10 seconds/i)).toBeInTheDocument();
  });
  
  test('decrements time every second', () => {
    const onTimeUp = jest.fn();
    render(<Timer initialSeconds={5} onTimeUp={onTimeUp} />);
    
    // Fast-forward 1 second within act.
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText(/Time Remaining:\s*4 seconds/i)).toBeInTheDocument();
    
    // Fast-forward another 2 seconds within act.
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getByText(/Time Remaining:\s*2 seconds/i)).toBeInTheDocument();
  });
  
  test('calls onTimeUp when time reaches zero', () => {
    const onTimeUp = jest.fn();
    render(<Timer initialSeconds={3} onTimeUp={onTimeUp} />);
    
    // Fast-forward 3 seconds within act to reach 0.
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(onTimeUp).toHaveBeenCalled();
  });
});
