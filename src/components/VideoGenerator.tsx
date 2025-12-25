import React, { useState, useEffect, useRef } from 'react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

interface VideoGeneratorProps {
  imageDataUrl: string
  audioFile: File
  onReset: () => void
}

function VideoGenerator({ imageDataUrl, audioFile, onReset }: VideoGeneratorProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'processing' | 'done' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [progressText, setProgressText] = useState('')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const ffmpegRef = useRef<FFmpeg | null>(null)
  const [audioDuration, setAudioDuration] = useState<number>(0)
  const loadedRef = useRef(false)

  useEffect(() => {
    // Get audio duration
    const audio = new Audio()
    audio.src = URL.createObjectURL(audioFile)
    audio.onloadedmetadata = () => {
      setAudioDuration(audio.duration)
    }
  }, [audioFile])

  const loadFFmpeg = async () => {
    if (ffmpegRef.current && loadedRef.current) return ffmpegRef.current

    const ffmpeg = new FFmpeg()
    
    ffmpeg.on('progress', ({ progress, time }) => {
      const pct = Math.min(99, Math.round(progress * 100))
      setProgress(pct)
      if (time > 0) {
        setProgressText(`Processing: ${Math.round(time / 1000000)}s encoded`)
      }
    })

    ffmpeg.on('log', ({ message }) => {
      console.log('FFmpeg:', message)
    })

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
    
    setProgressText('Downloading video processor...')
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })

    ffmpegRef.current = ffmpeg
    loadedRef.current = true
    return ffmpeg
  }

  const generateVideo = async () => {
    try {
      setStatus('loading')
      setProgress(0)
      setErrorMessage('')

      const ffmpeg = await loadFFmpeg()
      
      setStatus('processing')
      setProgressText('Preparing files...')

      // Convert base64 image to file
      const imageResponse = await fetch(imageDataUrl)
      const imageBlob = await imageResponse.blob()
      
      // Write image file
      setProgressText('Loading image...')
      await ffmpeg.writeFile('input.png', await fetchFile(imageBlob))
      
      // Write audio file
      setProgressText('Loading audio...')
      await ffmpeg.writeFile('audio.mp3', await fetchFile(audioFile))

      // Get audio duration for video length
      const duration = audioDuration || 30

      setProgressText('Creating video... This is the main step')

      // Create video from image + audio
      // Optimized for speed with ultrafast preset
      await ffmpeg.exec([
        '-loop', '1',
        '-i', 'input.png',
        '-i', 'audio.mp3',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',      // Fastest encoding
        '-tune', 'stillimage',
        '-crf', '28',                 // Lower quality = faster (18-28 range)
        '-c:a', 'aac',
        '-b:a', '128k',               // Lower bitrate for speed
        '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart',    // Optimize for web playback
        '-shortest',
        '-t', String(Math.ceil(duration)),
        'output.mp4'
      ])

      // Read the output file
      setProgressText('Finalizing video...')
      setProgress(99)
      const data = await ffmpeg.readFile('output.mp4')
      const videoBlob = new Blob([data], { type: 'video/mp4' })
      const url = URL.createObjectURL(videoBlob)
      
      // Cleanup temporary files
      try {
        await ffmpeg.deleteFile('input.png')
        await ffmpeg.deleteFile('audio.mp3')
        await ffmpeg.deleteFile('output.mp4')
      } catch (e) {
        // Ignore cleanup errors
      }
      
      setVideoUrl(url)
      setProgress(100)
      setStatus('done')

    } catch (error) {
      console.error('Error generating video:', error)
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to generate video')
    }
  }

  const downloadVideo = () => {
    if (videoUrl) {
      const a = document.createElement('a')
      a.href = videoUrl
      a.download = 'hadith-video.mp4'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Preview Section */}
      <div className="bg-[#1a2027] rounded-2xl p-4 border border-[#252d36]">
        <h3 className="text-lg font-medium text-[#d4a853] mb-3">Your Hadith Video</h3>
        
        {status === 'done' && videoUrl ? (
          <video
            src={videoUrl}
            controls
            className="w-full rounded-xl"
            style={{ maxHeight: '400px' }}
          />
        ) : (
          <img
            src={imageDataUrl}
            alt="Hadith Preview"
            className="w-full rounded-xl"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
        )}

        {audioDuration > 0 && (
          <p className="text-sm text-gray-400 mt-2 text-center">
            Video duration: {formatDuration(audioDuration)}
          </p>
        )}
      </div>

      {/* Status & Actions */}
      <div className="bg-[#1a2027] rounded-2xl p-5 border border-[#252d36]">
        {status === 'idle' && (
          <button
            onClick={generateVideo}
            className="w-full py-4 rounded-xl font-medium text-lg bg-gradient-to-r from-[#1a5f4a] to-[#2d8a6b] text-white hover:shadow-lg hover:shadow-[#2d8a6b]/25 transition-all"
          >
            Create Video
          </button>
        )}

        {status === 'loading' && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-[#2d8a6b] border-t-transparent rounded-full animate-spin" />
              <span className="text-white">Loading video processor...</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">This may take a moment on first use</p>
          </div>
        )}

        {status === 'processing' && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-white font-medium">Creating your video...</p>
              <p className="text-[#2d8a6b] text-sm mt-1">{progressText}</p>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div className="text-xs text-gray-400">Progress</div>
                <div className="text-xs text-[#2d8a6b]">{progress}%</div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded-full bg-[#252d36]">
                <div
                  style={{ width: `${progress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#1a5f4a] to-[#2d8a6b] transition-all duration-300"
                />
              </div>
            </div>
          </div>
        )}

        {status === 'done' && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-[#2d8a6b]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Video created successfully!</span>
            </div>

            <button
              onClick={downloadVideo}
              className="w-full py-4 rounded-xl font-medium text-lg bg-gradient-to-r from-[#d4a853] to-[#e8c17a] text-[#1a2027] hover:shadow-lg hover:shadow-[#d4a853]/25 transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Video
            </button>

            <button
              onClick={onReset}
              className="w-full py-3 rounded-xl font-medium text-[#d4a853] border border-[#d4a853]/30 hover:bg-[#d4a853]/10 transition-all"
            >
              Create Another
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Failed to create video</span>
            </div>
            {errorMessage && (
              <p className="text-sm text-gray-400 text-center">{errorMessage}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={generateVideo}
                className="flex-1 py-3 rounded-xl font-medium bg-[#252d36] text-white hover:bg-[#2d3742] transition-all"
              >
                Try Again
              </button>
              <button
                onClick={onReset}
                className="flex-1 py-3 rounded-xl font-medium text-[#d4a853] border border-[#d4a853]/30 hover:bg-[#d4a853]/10 transition-all"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-[#252d36] rounded-xl p-4 text-sm">
        <div className="flex gap-3">
          <div className="text-[#d4a853] mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-300">Your video is processed entirely in your browser.</p>
            <p className="text-gray-500 mt-1">No data is uploaded. {loadedRef.current ? 'Video processor is cached - faster next time!' : 'First video may take longer to load.'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoGenerator
