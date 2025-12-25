import React, { useState, useEffect } from 'react'
import { HadithData, TextColor, AspectRatio, UrduFont } from '../App'

interface HadithInputProps {
  initialData: HadithData
  onSubmit: (data: HadithData) => void
  textColor: TextColor
  onTextColorChange: (color: TextColor) => void
  aspectRatio: AspectRatio
  onAspectRatioChange: (ratio: AspectRatio) => void
  urduFont: UrduFont
  onUrduFontChange: (font: UrduFont) => void
}

function HadithInput({ initialData, onSubmit, textColor, onTextColorChange, aspectRatio, onAspectRatioChange, urduFont, onUrduFontChange }: HadithInputProps) {
  const [hadithText, setHadithText] = useState(initialData.text)
  const [reference, setReference] = useState(initialData.reference)

  useEffect(() => {
    setHadithText(initialData.text)
    setReference(initialData.reference)
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (hadithText.trim()) {
      onSubmit({ text: hadithText, reference })
    }
  }

  const isValid = hadithText.trim().length > 0

  return (
    <div className="bg-[#1a2027] rounded-2xl p-5 border border-[#252d36]">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-[#d4a853]">📜</span>
        Enter Hadith Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Hadith Text */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Hadith Text (Urdu)
          </label>
          <textarea
            value={hadithText}
            onChange={(e) => setHadithText(e.target.value)}
            placeholder="حدیث کا متن یہاں لکھیں..."
            className="urdu-text w-full h-40 bg-[#252d36] border border-[#353d46] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-[#2d8a6b] focus:ring-2 focus:ring-[#2d8a6b]/20 outline-none transition-all resize-none text-lg"
            dir="rtl"
          />
          <p className="text-xs text-gray-500 mt-1 text-right">
            {hadithText.length} characters
          </p>
        </div>

        {/* Reference */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Reference (حوالہ)
          </label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="مثال: صحیح بخاری، حدیث نمبر ١"
            className="urdu-text w-full bg-[#252d36] border border-[#353d46] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-[#2d8a6b] focus:ring-2 focus:ring-[#2d8a6b]/20 outline-none transition-all"
            dir="rtl"
          />
        </div>

        {/* Text Color Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Text Color
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onTextColorChange('white')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                textColor === 'white'
                  ? 'bg-white text-black ring-2 ring-[#d4a853]'
                  : 'bg-[#252d36] text-white border border-[#353d46] hover:border-[#2d8a6b]/50'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white border border-gray-300"></span>
              White
            </button>
            <button
              type="button"
              onClick={() => onTextColorChange('black')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                textColor === 'black'
                  ? 'bg-[#1a1a1a] text-white ring-2 ring-[#d4a853]'
                  : 'bg-[#252d36] text-white border border-[#353d46] hover:border-[#2d8a6b]/50'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-black border border-gray-600"></span>
              Black
            </button>
          </div>
        </div>

        {/* Aspect Ratio Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Image Ratio
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onAspectRatioChange('9:16')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                aspectRatio === '9:16'
                  ? 'bg-[#2d8a6b] text-white ring-2 ring-[#d4a853]'
                  : 'bg-[#252d36] text-white border border-[#353d46] hover:border-[#2d8a6b]/50'
              }`}
            >
              <div className="w-4 h-7 border-2 border-current rounded-sm"></div>
              9:16
            </button>
            <button
              type="button"
              onClick={() => onAspectRatioChange('1:1')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                aspectRatio === '1:1'
                  ? 'bg-[#2d8a6b] text-white ring-2 ring-[#d4a853]'
                  : 'bg-[#252d36] text-white border border-[#353d46] hover:border-[#2d8a6b]/50'
              }`}
            >
              <div className="w-5 h-5 border-2 border-current rounded-sm"></div>
              1:1
            </button>
          </div>
        </div>

        {/* Font Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Urdu Font Style
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onUrduFontChange('noto')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                urduFont === 'noto'
                  ? 'bg-[#2d8a6b] text-white ring-2 ring-[#d4a853]'
                  : 'bg-[#252d36] text-white border border-[#353d46] hover:border-[#2d8a6b]/50'
              }`}
            >
              <span className="text-lg">Nastaliq</span>
            </button>
            <button
              type="button"
              onClick={() => onUrduFontChange('amiri')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                urduFont === 'amiri'
                  ? 'bg-[#2d8a6b] text-white ring-2 ring-[#d4a853]'
                  : 'bg-[#252d36] text-white border border-[#353d46] hover:border-[#2d8a6b]/50'
              }`}
            >
              <span className="text-lg">Amiri</span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-4 rounded-xl font-medium text-lg transition-all ${
            isValid
              ? 'bg-gradient-to-r from-[#1a5f4a] to-[#2d8a6b] text-white hover:shadow-lg hover:shadow-[#2d8a6b]/25'
              : 'bg-[#252d36] text-gray-500 cursor-not-allowed'
          }`}
        >
          Preview Hadith
        </button>
      </form>
    </div>
  )
}

export default HadithInput
