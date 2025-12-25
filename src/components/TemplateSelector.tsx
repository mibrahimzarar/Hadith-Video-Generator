import React from 'react'
import { Template } from '../data/templates'

interface TemplateSelectorProps {
  templates: Template[]
  onSelect: (index: number) => void
  selectedIndex: number | null
  onCustomUpload?: (imageUrl: string) => void
}

function TemplateSelector({ templates, onSelect, selectedIndex, onCustomUpload }: TemplateSelectorProps) {
  // Separate gradient and image templates
  const gradientTemplates = templates.filter(t => !t.imageUrl)
  const imageTemplates = templates.filter(t => t.imageUrl)
  const [customImage, setCustomImage] = React.useState<string | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setCustomImage(imageUrl)
        onCustomUpload?.(imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Select a Template</h2>
        <p className="text-gray-400 text-sm">Choose a beautiful background for your Hadith</p>
      </div>

      {/* Color Templates Section */}
      <div>
        <h3 className="text-lg font-semibold text-[#d4a853] mb-4 flex items-center gap-2">
          <span>🎨</span>
          Color Themes
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {gradientTemplates.map((template, index) => (
            <button
              key={template.id}
              onClick={() => onSelect(templates.indexOf(template))}
              className={`relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${
                selectedIndex === templates.indexOf(template)
                  ? 'ring-4 ring-[#d4a853] scale-[1.02]'
                  : 'ring-2 ring-transparent hover:ring-[#2d8a6b]/50'
              }`}
            >
              <div
                className="absolute inset-0"
                style={{ background: template.thumbnail }}
              />
              <div className="absolute inset-0 flex items-end p-3">
                <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 w-full">
                  <p className="text-white text-sm font-medium text-center">
                    {template.name}
                  </p>
                </div>
              </div>
              {selectedIndex === templates.indexOf(template) && (
                <div className="absolute top-2 right-2 bg-[#d4a853] rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Image Templates Section */}
      {imageTemplates.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#2d8a6b] to-transparent"></div>
            <h3 className="text-lg font-semibold text-[#d4a853] flex items-center gap-2">
              <span>✨</span>
            Images
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#2d8a6b] to-transparent"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {imageTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelect(templates.indexOf(template))}
                className={`relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 shadow-lg ${
                  selectedIndex === templates.indexOf(template)
                    ? 'ring-4 ring-[#d4a853] scale-[1.02] shadow-[#d4a853]/50'
                    : 'ring-2 ring-[#2d8a6b]/30 hover:ring-[#2d8a6b] hover:shadow-[#2d8a6b]/50'
                }`}
              >
                {template.imageUrl && (
                  <img
                    src={template.imageUrl}
                    alt={template.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                  <div className="rounded-lg px-3 py-2 w-full">
                    <p className="text-white text-sm font-medium text-center">
                      {template.name}
                    </p>
                  </div>
                </div>
                {selectedIndex === templates.indexOf(template) && (
                  <div className="absolute top-2 right-2 bg-[#d4a853] rounded-full p-1 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Background Upload Section */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4a853] to-transparent"></div>
          <h3 className="text-lg font-semibold text-[#d4a853] flex items-center gap-2">
            <span>📤</span>
            Custom Background Upload
          </h3>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4a853] to-transparent"></div>
        </div>
        
        <div className="bg-gradient-to-br from-[#1a5f4a]/20 to-[#0d3d2f]/20 rounded-2xl border-2 border-dashed border-[#d4a853]/50 p-8 text-center hover:border-[#d4a853] hover:bg-[#1a5f4a]/30 transition-all duration-300">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="custom-bg-upload"
          />
          <label htmlFor="custom-bg-upload" className="cursor-pointer flex flex-col items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#d4a853]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <div>
              <p className="text-white font-semibold">Upload Your Background</p>
              <p className="text-gray-400 text-sm mt-1">Click to select or drag and drop</p>
              <p className="text-gray-500 text-xs mt-2">PNG, JPG, WebP - Max 10MB</p>
            </div>
          </label>
        </div>

        {customImage && (
          <div className="mt-6">
            <p className="text-[#d4a853] font-semibold mb-3 flex items-center gap-2">
              <span>✓</span>
              Custom Background Preview
            </p>
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-[#d4a853]">
              <img
                src={customImage}
                alt="Custom background"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                <div className="rounded-lg px-3 py-2 w-full">
                  <p className="text-white text-sm font-medium text-center">Your Custom Background</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TemplateSelector
