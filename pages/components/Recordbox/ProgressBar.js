import { Slider, styled } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';


 const IOSSlider = styled(Slider)(({ theme }) => ({
  color: '#3880ff',
  height: 80,
  marginTop: 24,
  padding: '0px 0 !important',
  '& .MuiSlider-thumb': {
    height: 20,
    width: 20,
    backgroundColor: '#fff',
    boxShadow: iOSBoxShadow,
    '&:focus, &:hover, &.Mui-active': {
      boxShadow:
        '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
  },
  '& .MuiSlider-valueLabel': {
    fontSize: 12,
    fontWeight: 'normal',
    top: -6,
    backgroundColor: 'unset',
    color: theme.palette.text.primary,
    '&:before': {
      display: 'none',
    },
    '& *': {
      background: 'transparent',
      color:  '#000',
    },
  },
  '& .MuiSlider-track': {
    border: 'none',
    borderRadius: 0,
    backgroundColor: 'transparent'
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: 'transparent',
  },
  '& .MuiSlider-mark': {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    '&.MuiSlider-markActive': {
      opacity: 1,
      backgroundColor: '#bfbfbf',
    },
  },
}));

const ProgressBar = ({
  progressBarRef,
  audioRef,
  ws,
  preview_url,
  timeProgress,
  duration,
}) => {
  const [time, setTime] = useState(0);

  const handleProgressChange = (event, newValue) => {
    event.preventDefault();
    setTime(newValue)
    audioRef.current.currentTime = newValue
    if(ws) {
     // console.log(ws.getCurrentTime());
      if(ws.getCurrentTime() !== newValue) {
        let tmp = newValue - ws.getCurrentTime();
        ws.skip(tmp)
      }
    }
    if(progressBarRef && progressBarRef.current && progressBarRef.current.value) {
      audioRef.current.currentTime = progressBarRef.current.value;
    }
  };

  useEffect(() => {
    if(Math.round(timeProgress) !== time && time < 29) {
      setTime(Math.round(timeProgress))
    }
  }, [timeProgress, time]);

  if(ws) {
    ws.on('finish', async () => {
      setTime(0)
    });
  }

  const formatTime = (time) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const formatMinutes =
        minutes < 10 ? `0${minutes}` : `${minutes}`;
      const seconds = Math.floor(time % 60);
      const formatSeconds =
        seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${formatMinutes}:${formatSeconds}`;
    }
    return '00:00';
  };

  return (
    <div className="progress">
      <span className="time start">00:00</span>
      <IOSSlider
          aria-label="Tempo2"
          defaultValue={0}
        
          onChange={handleProgressChange}
          ref={progressBarRef} value={time}
    
          min={0} max={29} step={0.5}
          valueLabelDisplay={'off'}
          />
      <span className="time current">{formatTime(timeProgress)}</span>

    </div>
  );
};

export default ProgressBar;
