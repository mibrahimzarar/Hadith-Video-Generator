import React, { useRef, useState, useEffect } from 'react'

interface AudioUploaderProps {
  onUpload: (file: File) => void
  audioFile: File | null
}

function AudioUploader({ onUpload, audioFile }: AudioUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  
  // Voice Recording States
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioWave, setAudioWave] = useState<number[]>([30, 40, 35, 50, 45, 55, 40, 60, 45, 50, 35, 55, 40, 45, 50])
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationRef = useRef<number | null>(null)

  const handleFileSelect = (file: File) => {
    // Accept audio files and video files that contain audio (MPEG, MOV)
    const validTypes = [
      'audio/',
      'video/mpeg',
      'video/quicktime',
      'video/mp4',
      'application/octet-stream' // For some .mov files
    ]
    const validExtensions = ['.mp3', '.wav', '.m4a', '.ogg', '.aac', '.flac', '.wma', '.mpeg', '.mpg', '.mov', '.mp4']
    
    const isValidType = validTypes.some(type => file.type.startsWith(type) || file.type === type)
    const isValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    
    if (file && (isValidType || isValidExtension)) {
      setAudioUrl(URL.createObjectURL(file))
      onUpload(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Set up audio analyser for waveform
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 32
      source.connect(analyser)
      analyserRef.current = analyser
      
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, { type: 'audio/webm' })
        setAudioUrl(URL.createObjectURL(audioBlob))
        onUpload(audioFile)
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
      // Start waveform animation
      const updateWaveform = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
          analyserRef.current.getByteFrequencyData(dataArray)
          const normalizedWave = Array.from(dataArray.slice(0, 15)).map(v => Math.max(20, (v / 255) * 80))
          setAudioWave(normalizedWave)
        }
        animationRef.current = requestAnimationFrame(updateWaveform)
      }
      updateWaveform()
      
    } catch (err) {
      console.error('Error accessing microphone:', err)
      alert('Could not access microphone. Please allow microphone permission.')
    }
  }
  
  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <div className="bg-[#1a2027] rounded-2xl p-5 border border-[#252d36]">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-[#d4a853]">🎵</span>
        Add Audio
      </h2>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.m4a,.ogg,.aac,.flac,.wma,.mpeg,.mpg,.mov,.mp4,video/mpeg,video/quicktime"
        onChange={handleInputChange}
        className="hidden"
      />

      {!audioFile ? (
        <div className="space-y-6">
          {/* Voice Recording Section - WhatsApp Style */}
          <div className="bg-gradient-to-br from-[#1a5f4a]/20 to-[#0d3d2f]/20 rounded-2xl p-6 border border-[#2d8a6b]/30">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#d4a853]">🎙️</span>
              <h3 className="text-white font-semibold">Record Audio</h3>
            </div>
            
            {isRecording ? (
              <div className="flex flex-col items-center gap-4">
                {/* Recording indicator */}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-400 font-medium">Recording...</span>
                  <span className="text-white font-mono text-lg ml-2">{formatDuration(recordingTime)}</span>
                </div>
                
                {/* Waveform visualization */}
                <div className="flex items-center justify-center gap-1 h-16 px-4">
                  {audioWave.map((height, index) => (
                    <div
                      key={index}
                      className="w-1.5 bg-gradient-to-t from-[#2d8a6b] to-[#d4a853] rounded-full transition-all duration-75"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                
                {/* Stop button */}
                <button
                  onClick={stopRecording}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 hover:scale-105 transition-transform"
                >
                  <div className="w-6 h-6 bg-white rounded"></div>
                </button>
                <p className="text-gray-400 text-sm">Tap to stop</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                {/* Static waveform preview */}
                <div className="flex items-center justify-center gap-1 h-12 px-4 opacity-30">
                  {[30, 50, 40, 60, 45, 70, 50, 65, 40, 55, 35, 60, 45, 50, 40].map((height, index) => (
                    <div
                      key={index}
                      className="w-1.5 bg-[#2d8a6b] rounded-full"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                
                {/* Mic button */}
                <button
                  onClick={startRecording}
                  className="w-20 h-20 rounded-full bg-gradient-to-r from-[#1a5f4a] to-[#2d8a6b] flex items-center justify-center shadow-lg shadow-[#2d8a6b]/30 hover:scale-105 hover:shadow-xl hover:shadow-[#2d8a6b]/40 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
                <p className="text-gray-400 text-sm">Tap to record</p>
              </div>
            )}
          </div>
          
          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#353d46] to-transparent"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#353d46] to-transparent"></div>
          </div>
          
          {/* File Upload Section */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-[#2d8a6b] bg-[#2d8a6b]/10'
                : 'border-[#353d46] hover:border-[#2d8a6b]/50'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#252d36] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#d4a853]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Upload audio file</p>
                <p className="text-gray-500 text-xs mt-1">MP3, WAV, M4A, OGG, MPEG, MOV</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Audio Info Card */}
          <div className="bg-[#252d36] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#1a5f4a] to-[#2d8a6b] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{audioFile.name}</p>
                <p className="text-gray-500 text-sm">{formatFileSize(audioFile.size)}</p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-[#d4a853] hover:text-[#e8c17a] text-sm"
              >
                Change
              </button>
            </div>
          </div>

          {/* Audio Preview */}
          {audioUrl && (
            <div className="bg-[#252d36] rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-2">Preview</p>
              <audio
                controls
                src={audioUrl}
                className="w-full h-10"
                style={{ filter: 'invert(1) hue-rotate(180deg)' }}
              />
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={() => onUpload(audioFile)}
            className="w-full py-4 rounded-xl font-medium text-lg bg-gradient-to-r from-[#1a5f4a] to-[#2d8a6b] text-white hover:shadow-lg hover:shadow-[#2d8a6b]/25 transition-all"
          >
            Generate Video
          </button>
        </div>
      )}
    </div>
  )
}

export default AudioUploader
