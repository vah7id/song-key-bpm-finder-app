import { PlayCircle } from '@mui/icons-material';
import { Typography } from '@mui/material';
import Image from 'next/image';
import { getSongKeyTitle } from '../SearchInput';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const DisplayTrack = ({
  currentTrack,
  audioRef,
  setDuration,
  progressBarRef,
  handleNext,
}) => {
  const onLoadedMetadata = () => {
    const seconds = audioRef.current.duration;
    setDuration(seconds);
    progressBarRef.current.max = seconds;
  };

  return (<>
    {(currentTrack && currentTrack.preview_url) ? <div>
      <audio
        src={currentTrack.preview_url}
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={handleNext}
      />
      <div className="audio-info">
        <div className="audio-image">
          {(currentTrack.album && currentTrack.album?.images && currentTrack.album.images[0].url) ? (
            <><div className='ovr' /><Image width={150} height={150} src={currentTrack.album.images[0].url} alt={currentTrack.name} /></>
          ) : (
            <div className="icon-wrapper">
              <span className="audio-icon">
                <PlayCircle />
              </span>
            </div>
          )}
        </div>
        <div className="text">
          <Typography noWrap={true}  className="title">{currentTrack.name}</Typography>
          <Typography noWrap={true} className='artistName'>{currentTrack.artists && currentTrack.artists[0].name}</Typography>
          <Typography mt={1} className='tempo' variant='caption'>
            <FiberManualRecordIcon  color={'error'} sx={{mr: 1,fontSize: '10px'}} />{ Math.round(currentTrack.tempo)} BPM / {getSongKeyTitle(currentTrack.key, currentTrack.mode)}  
           / {currentTrack.time_signature && currentTrack.time_signature + '/4'} bt</Typography>
        </div>
      </div>
    </div> : <></>}
    </>
  );
};
export default DisplayTrack;
