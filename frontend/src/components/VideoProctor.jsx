import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';

const VideoProctor = ({ onPermissionsGranted = () => {} }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState('');
  const [permissionState, setPermissionState] = useState('');

  const checkPermissions = async () => {
    try {
      const cameraPerm = await navigator.permissions.query({ name: 'camera' });
      const micPerm = await navigator.permissions.query({ name: 'microphone' });

      setPermissionState(`${cameraPerm.state}, ${micPerm.state}`);

      if (cameraPerm.state === 'granted' && micPerm.state === 'granted') {
        requestMedia();
      } else if (cameraPerm.state === 'prompt' || micPerm.state === 'prompt') {
        requestMedia();
      } else {
        setError('Camera and microphone permissions are required. Click "Allow" to continue.');
      }
    } catch (err) {
      console.error('Permissions query error:', err);
      setError('Error checking permissions. Please enable camera and microphone.');
    }
  };

  const requestMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError('');
      onPermissionsGranted(true);
    } catch (err) {
      console.error('getUserMedia error:', err);
      setError('Camera and microphone permissions are required. Please allow permissions.');
      onPermissionsGranted(false);
    }
  }, [onPermissionsGranted]);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  return (
    <Box sx={{ textAlign: 'center', p: { xs: 1, sm: 2 } }}>
      {error ? (
        <Box>
          <Typography color="error" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={requestMedia}
            sx={{ mt: 2, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Allow Camera & Microphone
          </Button>
        </Box>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted
          style={{ width: '100%', maxWidth: '300px', border: '1px solid #ccc' }}
        />
      )}
    </Box>
  );
};

export default VideoProctor;
