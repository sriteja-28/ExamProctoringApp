// src/__tests__/components/VideoProctor.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import VideoProctor from '../../components/VideoProctor';

// Polyfill MediaStream if not defined in Node environment
if (typeof MediaStream === 'undefined') {
  global.MediaStream = class MediaStream {};
}

describe('VideoProctor', () => {
  let originalPermissions;
  let originalMediaDevices;
  
  beforeEach(() => {
    // Save originals
    originalPermissions = navigator.permissions;
    originalMediaDevices = navigator.mediaDevices;
  });
  
  afterEach(() => {
    // Restore originals
    navigator.permissions = originalPermissions;
    navigator.mediaDevices = originalMediaDevices;
    jest.clearAllMocks();
  });
  
  test('renders video element when permissions are granted and getUserMedia succeeds', async () => {
    const onPermissionsGranted = jest.fn();
    
    // Mock permissions query to return 'granted'
    navigator.permissions = {
      query: jest.fn(() => Promise.resolve({ state: 'granted' })),
    };
    
    // Create a dummy media stream
    const dummyStream = new MediaStream();
    navigator.mediaDevices = {
      getUserMedia: jest.fn(() => Promise.resolve(dummyStream)),
    };
    
    render(<VideoProctor onPermissionsGranted={onPermissionsGranted} />);
    
    // Wait for the video element to appear
    await waitFor(() => {
      expect(screen.getByTestId('video-element')).toBeInTheDocument();
    });
    expect(onPermissionsGranted).toHaveBeenCalledWith(true);
  });
  
  test('displays error message when getUserMedia fails', async () => {
    const onPermissionsGranted = jest.fn();
    
    // Return 'granted' for permissions so requestMedia is attempted.
    navigator.permissions = {
      query: jest.fn(() => Promise.resolve({ state: 'granted' })),
    };
    
    // Simulate getUserMedia failure.
    navigator.mediaDevices = {
      getUserMedia: jest.fn(() => Promise.reject(new Error('getUserMedia error'))),
    };
    
    render(<VideoProctor onPermissionsGranted={onPermissionsGranted} />);
    
    // Wait for the error message to appear.
    const errorMessage = await screen.findByText(/Camera and microphone permissions are required\. Please allow permissions\./i);
    expect(errorMessage).toBeInTheDocument();
    expect(onPermissionsGranted).toHaveBeenCalledWith(false);
    
    // Ensure the "Allow Camera & Microphone" button is rendered.
    const allowButton = screen.getByRole('button', { name: /Allow Camera & Microphone/i });
    expect(allowButton).toBeInTheDocument();
  });
  
  test('clicking "Allow Camera & Microphone" button triggers requestMedia', async () => {
    const onPermissionsGranted = jest.fn();
    
    // Simulate denied permissions so that an error is shown.
    navigator.permissions = {
      query: jest.fn(() => Promise.resolve({ state: 'denied' })),
    };
    
    // For getUserMedia, simulate success when the button is clicked.
    const dummyStream = new MediaStream();
    navigator.mediaDevices = {
      getUserMedia: jest.fn(() => Promise.resolve(dummyStream)),
    };
    
    render(<VideoProctor onPermissionsGranted={onPermissionsGranted} />);
    
    // Wait for the error message prompting the user.
    await waitFor(() => {
      expect(screen.getByText(/Camera and microphone permissions are required\. Click "Allow" to continue\./i)).toBeInTheDocument();
    });
    
    // Click the "Allow Camera & Microphone" button within act.
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Allow Camera & Microphone/i }));
    });
    
    // Wait for the video element to appear.
    await waitFor(() => {
      expect(screen.getByTestId('video-element')).toBeInTheDocument();
    });
    expect(onPermissionsGranted).toHaveBeenCalledWith(true);
  });
});
