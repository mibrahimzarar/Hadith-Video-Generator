import React, { useEffect, useRef, useState } from 'react'
import { Template } from '../data/templates'
import { HadithData, TextColor, AspectRatio, UrduFont } from '../App'

interface ImagePreviewProps {
  template: Template
  hadithData: HadithData
  textColor: TextColor
  aspectRatio: AspectRatio
  urduFont: UrduFont
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  onImageGenerated: (dataUrl: string) => void
}

// Font configurations
const FONTS = {
  noto: {
    name: 'Noto Nastaliq Urdu',
    url: 'https://fonts.gstatic.com/s/notonastaliqurdu/v20/LhWNMUPbN-oZdNFcBy1-DJYsEoTq5pudQ9L940pGPkB3Qt_-DK2f2-_8mEw.woff2',
    fallback: 'Arial'
  },
  amiri: {
    name: 'Amiri Quran',
    url: 'https://fonts.gstatic.com/s/amiriquran/v7/_Xmo-Hk0rD6DbUL4_vH8Zq5t.woff2',
    fallback: 'Georgia'
  }
}

function ImagePreview({ template, hadithData, textColor, aspectRatio, urduFont, canvasRef, onImageGenerated }: ImagePreviewProps) {
  const localCanvasRef = useRef<HTMLCanvasElement>(null)
  const [isReady, setIsReady] = useState(false)

  // Load font and generate image
  useEffect(() => {
    let isMounted = true

    const generateImage = async () => {
      // Load selected font
      const fontConfig = FONTS[urduFont]
      try {
        const font = new FontFace(fontConfig.name, `url(${fontConfig.url})`)
        await font.load()
        document.fonts.add(font)
      } catch (e) {
        console.log('Font load attempted:', e)
      }

      // Small delay to ensure font is applied
      await new Promise(resolve => setTimeout(resolve, 150))

      if (!isMounted) return

      const canvas = localCanvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const fontFamily = `"${fontConfig.name}", ${fontConfig.fallback}, sans-serif`

      // Set canvas size based on aspect ratio
      if (aspectRatio === '9:16') {
        canvas.width = 1080
        canvas.height = 1920
      } else {
        canvas.width = 1080
        canvas.height = 1080
      }

      const width = canvas.width
      const height = canvas.height

      // Draw background image if it exists
      if (template.imageUrl) {
        try {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.src = template.imageUrl
          
          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              ctx.drawImage(img, 0, 0, width, height)
              resolve()
            }
            img.onerror = () => {
              // If image fails, use fallback color
              console.log('Image load failed, using fallback')
              resolve()
            }
          })
        } catch (e) {
          console.log('Image error:', e)
          // Continue with fallback
        }
      } else {
        // Draw background gradient for color templates
        const gradient = ctx.createLinearGradient(0, 0, width, height)
        const baseColor = template.backgroundColor
        const darkerColor = adjustColor(baseColor, -20)
        
        gradient.addColorStop(0, darkerColor)
        gradient.addColorStop(0.5, baseColor)
        gradient.addColorStop(1, darkerColor)
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
      }

      // Add decorative pattern
      drawDecorativePattern(ctx, width, height, textColor === 'white' ? '#ffffff' : '#000000')

      // Determine text colors
      const mainTextColor = textColor === 'white' ? '#ffffff' : '#1a1a1a'
      const refTextColor = textColor === 'white' ? '#d4a853' : '#8B6914'

      // Calculate text positioning
      const centerX = width / 2
      const centerY = height / 2
      const maxTextWidth = width - 120
      const fontSize = aspectRatio === '9:16' ? 52 : 44
      const refFontSize = aspectRatio === '9:16' ? 42 : 36
      const lineHeight = fontSize * 2.4

      // Draw the Hadith text
      if (hadithData.text) {
        ctx.save()
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        // Add text shadow
        ctx.shadowColor = textColor === 'white' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.5)'
        ctx.shadowBlur = 25
        ctx.shadowOffsetX = 4
        ctx.shadowOffsetY = 4
        
        ctx.fillStyle = mainTextColor
        ctx.font = `bold ${fontSize}px ${fontFamily}`
        
        // Word wrap the text
        const lines = wrapText(ctx, hadithData.text, maxTextWidth)
        const totalTextHeight = lines.length * lineHeight
        const startY = centerY - totalTextHeight / 2 + lineHeight / 2

        lines.forEach((line, index) => {
          ctx.fillText(line, centerX, startY + index * lineHeight)
        })
        ctx.restore()
      }

      // Draw reference
      if (hadithData.reference) {
        ctx.save()
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = refTextColor
        ctx.shadowBlur = 20
        ctx.fillStyle = refTextColor
        ctx.font = `bold ${refFontSize}px ${fontFamily}`
        
        // Position reference closer to text (not at very bottom)
        const refY = aspectRatio === '9:16' ? centerY + 350 : centerY + 200
        ctx.fillText(`— ${hadithData.reference} —`, centerX, refY)
        ctx.restore()
      }

      // Draw decorative borders
      drawDecorativeBorder(ctx, width, height, refTextColor, aspectRatio)

      // Generate image data URL
      const dataUrl = canvas.toDataURL('image/png')
      
      if (isMounted) {
        onImageGenerated(dataUrl)
        setIsReady(true)
      }
    }

    generateImage()

    return () => {
      isMounted = false
    }
  }, [template, hadithData, textColor, aspectRatio, urduFont, onImageGenerated])

  const aspectClass = aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-square'

  return (
    <div className="bg-[#1a2027] rounded-2xl p-4 border border-[#252d36]">
      <h3 className="text-lg font-medium text-[#d4a853] mb-3">Your Hadith Image</h3>
      <div className={`${aspectClass} rounded-xl overflow-hidden bg-[#252d36] relative`}>
        <canvas
          ref={localCanvasRef}
          className={`w-full h-full object-contain ${isReady ? 'opacity-100' : 'opacity-0'}`}
        />
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#2d8a6b] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-400 text-sm">Generating image...</p>
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        {aspectRatio} format ready for download
      </p>
    </div>
  )
}

// Helper function to adjust color brightness
function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.min(255, Math.max(0, (num >> 16) + amt))
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt))
  const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt))
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

// Word wrap function
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const metrics = ctx.measureText(testLine)
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }
  
  if (currentLine) {
    lines.push(currentLine)
  }
  
  return lines
}

// Draw decorative pattern
function drawDecorativePattern(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {
  ctx.save()
  ctx.globalAlpha = 0.03
  ctx.strokeStyle = color
  ctx.lineWidth = 1

  for (let i = 0; i < 20; i++) {
    const x = (width / 20) * i
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  const vLines = Math.round(height / (width / 20))
  for (let i = 0; i < vLines; i++) {
    const y = (height / vLines) * i
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }

  ctx.restore()
}

// Draw decorative border
function drawDecorativeBorder(ctx: CanvasRenderingContext2D, width: number, height: number, color: string, aspectRatio: string) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 4
  ctx.globalAlpha = 0.6

  const margin = 50
  const topLine = aspectRatio === '9:16' ? 80 : 60
  const bottomLine = height - topLine

  ctx.beginPath()
  ctx.moveTo(margin, topLine)
  ctx.lineTo(width - margin, topLine)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(margin, bottomLine)
  ctx.lineTo(width - margin, bottomLine)
  ctx.stroke()

  const cornerSize = 35
  
  // Top-left
  ctx.beginPath()
  ctx.moveTo(margin, topLine + cornerSize)
  ctx.lineTo(margin, topLine)
  ctx.lineTo(margin + cornerSize, topLine)
  ctx.stroke()

  // Top-right
  ctx.beginPath()
  ctx.moveTo(width - margin - cornerSize, topLine)
  ctx.lineTo(width - margin, topLine)
  ctx.lineTo(width - margin, topLine + cornerSize)
  ctx.stroke()

  // Bottom-left
  ctx.beginPath()
  ctx.moveTo(margin, bottomLine - cornerSize)
  ctx.lineTo(margin, bottomLine)
  ctx.lineTo(margin + cornerSize, bottomLine)
  ctx.stroke()

  // Bottom-right
  ctx.beginPath()
  ctx.moveTo(width - margin - cornerSize, bottomLine)
  ctx.lineTo(width - margin, bottomLine)
  ctx.lineTo(width - margin, bottomLine - cornerSize)
  ctx.stroke()

  // Islamic stars
  const starY = aspectRatio === '9:16' ? 160 : 120
  drawIslamicStar(ctx, width / 2, starY, 40, color)
  drawIslamicStar(ctx, width / 2, height - starY, 40, color)

  ctx.restore()
}

// Draw Islamic star
function drawIslamicStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.globalAlpha = 0.5
  
  const points = 8
  const outerRadius = size
  const innerRadius = size * 0.4
  
  ctx.beginPath()
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius
    const angle = (Math.PI / points) * i - Math.PI / 2
    const x = cx + Math.cos(angle) * radius
    const y = cy + Math.sin(angle) * radius
    
    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.closePath()
  ctx.stroke()
  ctx.restore()
}

export default ImagePreview
