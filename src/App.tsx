import React, { useState, useRef, useCallback } from 'react'
import TemplateSelector from './components/TemplateSelector'
import HadithInput from './components/HadithInput'
import ImagePreview from './components/ImagePreview'
import AudioUploader from './components/AudioUploader'
import VideoGenerator from './components/VideoGenerator'
import { templates } from './data/templates'

export interface HadithData {
  text: string
  reference: string
}

export type TextColor = 'white' | 'black'
export type AspectRatio = '9:16' | '1:1'
export type UrduFont = 'noto' | 'amiri'

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [hadithData, setHadithData] = useState<HadithData>({ text: '', reference: '' })
  const [textColor, setTextColor] = useState<TextColor>('white')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16')
  const [urduFont, setUrduFont] = useState<UrduFont>('noto')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleCustomUpload = (imageUrl: string) => {
    setCustomBackgroundUrl(imageUrl)
    // Create a temporary template for custom background
    const customTemplate = {
      id: 999,
      name: 'Custom Background',
      thumbnail: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      backgroundColor: '#1a1a1a',
      textColor: '#ffffff' as TextColor,
      referenceColor: '#d4a853',
      textPosition: { x: 540, y: 960, maxWidth: 900 },
      referencePosition: { x: 540, y: 1600 },
      fontSize: 52,
      referenceFontSize: 42,
      imageUrl: imageUrl,
    }
    // Add custom template to the beginning for selection
    setSelectedTemplate(-1) // Special index for custom
    setCurrentStep(2)
  }

  const handleTemplateSelect = (templateIndex: number) => {
    setSelectedTemplate(templateIndex)
    setCurrentStep(2)
  }

  const handleHadithSubmit = (data: HadithData) => {
    setHadithData(data)
    // Clear previous image so new one gets generated
    setGeneratedImage(null)
    setCurrentStep(3)
  }

  const handleImageGenerated = useCallback((imageDataUrl: string) => {
    setGeneratedImage(imageDataUrl)
  }, [])

  const handleAudioUpload = (file: File) => {
    setAudioFile(file)
    setCurrentStep(4)
  }

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetApp = () => {
    setCurrentStep(1)
    setSelectedTemplate(null)
    setHadithData({ text: '', reference: '' })
    setAudioFile(null)
    setGeneratedImage(null)
    setCustomBackgroundUrl(null)
  }

  return (
    <div className="min-h-screen bg-[#0f1419] text-white">
      {/* Header */}
      <header className="bg-[#1a2027] border-b border-[#2d8a6b]/30 px-4 py-4 sticky top-0 z-50">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <button
                onClick={goBack}
                className="p-2 rounded-full bg-[#252d36] hover:bg-[#2d8a6b]/20 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            <h1 className="text-xl font-semibold bg-gradient-to-r from-[#2d8a6b] to-[#d4a853] bg-clip-text text-transparent">
              Hadith Video Generator
            </h1>
          </div>
          {currentStep > 1 && (
            <button
              onClick={resetApp}
              className="text-sm text-[#d4a853] hover:text-[#e8c17a] transition-colors"
            >
              Start Over
            </button>
          )}
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-[#1a2027] px-4 py-3 border-b border-[#252d36]">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all ${
                  step === currentStep
                    ? 'bg-[#2d8a6b] text-white scale-110'
                    : step < currentStep
                    ? 'bg-[#1a5f4a] text-white'
                    : 'bg-[#252d36] text-gray-500'
                }`}
              >
                {step < currentStep ? '✓' : step}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {currentStep === 1 && (
          <TemplateSelector
            templates={templates}
            onSelect={handleTemplateSelect}
            selectedIndex={selectedTemplate}
            onCustomUpload={handleCustomUpload}
          />
        )}

        {currentStep === 2 && selectedTemplate !== null && (
          <HadithInput
            initialData={hadithData}
            onSubmit={handleHadithSubmit}
            textColor={textColor}
            onTextColorChange={setTextColor}
            aspectRatio={aspectRatio}
            onAspectRatioChange={setAspectRatio}
            urduFont={urduFont}
            onUrduFontChange={setUrduFont}
          />
        )}

        {currentStep === 3 && (selectedTemplate !== null || customBackgroundUrl) && (
          <div className="space-y-6">
            <ImagePreview
              template={selectedTemplate === -1 ? {
                id: 999,
                name: 'Custom Background',
                thumbnail: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                backgroundColor: '#1a1a1a',
                textColor: '#ffffff',
                referenceColor: '#d4a853',
                textPosition: { x: 540, y: 960, maxWidth: 900 },
                referencePosition: { x: 540, y: 1600 },
                fontSize: 52,
                referenceFontSize: 42,
                imageUrl: customBackgroundUrl || undefined,
              } : templates[selectedTemplate!]}
              hadithData={hadithData}
              textColor={textColor}
              aspectRatio={aspectRatio}
              urduFont={urduFont}
              canvasRef={canvasRef}
              onImageGenerated={handleImageGenerated}
            />
            <AudioUploader onUpload={handleAudioUpload} audioFile={audioFile} />
          </div>
        )}

        {currentStep === 4 && generatedImage && audioFile && (
          <VideoGenerator
            imageDataUrl={generatedImage}
            audioFile={audioFile}
            onReset={resetApp}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1a2027] border-t border-[#252d36] px-4 py-4 mt-auto">
        <div className="max-w-lg mx-auto text-center text-xs text-gray-500">
          Create beautiful Hadith videos for sharing
        </div>
      </footer>
    </div>
  )
}

export default App
