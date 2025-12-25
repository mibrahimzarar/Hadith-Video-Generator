export interface Template {
  id: number
  name: string
  thumbnail: string
  backgroundColor: string
  textColor: string
  referenceColor: string
  textPosition: {
    x: number
    y: number
    maxWidth: number
  }
  referencePosition: {
    x: number
    y: number
  }
  fontSize: number
  referenceFontSize: number
  imageUrl?: string // Optional image URL for user-uploaded templates
}

// Beautiful Islamic-themed gradient backgrounds
export const templates: Template[] = [
  {
    id: 1,
    name: 'Emerald Night',
    thumbnail: 'linear-gradient(135deg, #0d3d2f 0%, #1a5f4a 50%, #0d3d2f 100%)',
    backgroundColor: '#0d3d2f',
    textColor: '#e8dcc4',
    referenceColor: '#d4a853',
    textPosition: { x: 540, y: 400, maxWidth: 900 },
    referencePosition: { x: 540, y: 850 },
    fontSize: 42,
    referenceFontSize: 28,
  },
  {
    id: 2,
    name: 'Golden Dusk',
    thumbnail: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
    backgroundColor: '#16213e',
    textColor: '#f5f5f5',
    referenceColor: '#d4a853',
    textPosition: { x: 540, y: 400, maxWidth: 900 },
    referencePosition: { x: 540, y: 850 },
    fontSize: 42,
    referenceFontSize: 28,
  },
  {
    id: 3,
    name: 'Midnight Blue',
    thumbnail: 'linear-gradient(135deg, #0a0a1a 0%, #1a2744 50%, #0a0a1a 100%)',
    backgroundColor: '#1a2744',
    textColor: '#e0e0e0',
    referenceColor: '#7eb8da',
    textPosition: { x: 540, y: 400, maxWidth: 900 },
    referencePosition: { x: 540, y: 850 },
    fontSize: 42,
    referenceFontSize: 28,
  },
  {
    id: 4,
    name: 'Desert Sand',
    thumbnail: 'linear-gradient(135deg, #2c1810 0%, #4a3020 50%, #2c1810 100%)',
    backgroundColor: '#3d2817',
    textColor: '#f5e6d3',
    referenceColor: '#c9a66b',
    textPosition: { x: 540, y: 400, maxWidth: 900 },
    referencePosition: { x: 540, y: 850 },
    fontSize: 42,
    referenceFontSize: 28,
  },
  {
    id: 5,
    name: 'Royal Purple',
    thumbnail: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%)',
    backgroundColor: '#1f0f35',
    textColor: '#e8dff5',
    referenceColor: '#b68fd4',
    textPosition: { x: 540, y: 400, maxWidth: 900 },
    referencePosition: { x: 540, y: 850 },
    fontSize: 42,
    referenceFontSize: 28,
  },
  {
    id: 6,
    name: 'Ocean Depths',
    thumbnail: 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 50%, #0a1628 100%)',
    backgroundColor: '#0f2847',
    textColor: '#d4e5f7',
    referenceColor: '#5fa8d3',
    textPosition: { x: 540, y: 400, maxWidth: 900 },
    referencePosition: { x: 540, y: 850 },
    fontSize: 42,
    referenceFontSize: 28,
  },
  // Image Templates
  {
    id: 7,
    name: 'Template 1',
    thumbnail: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    referenceColor: '#d4a853',
    textPosition: { x: 540, y: 960, maxWidth: 900 },
    referencePosition: { x: 540, y: 1600 },
    fontSize: 52,
    referenceFontSize: 42,
    imageUrl: '/templates/1.jpeg',
  },
  {
    id: 8,
    name: 'Template 2',
    thumbnail: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    referenceColor: '#d4a853',
    textPosition: { x: 540, y: 960, maxWidth: 900 },
    referencePosition: { x: 540, y: 1600 },
    fontSize: 52,
    referenceFontSize: 42,
    imageUrl: '/templates/2.jpeg',
  },
  {
    id: 9,
    name: 'Template 3',
    thumbnail: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    referenceColor: '#d4a853',
    textPosition: { x: 540, y: 960, maxWidth: 900 },
    referencePosition: { x: 540, y: 1600 },
    fontSize: 52,
    referenceFontSize: 42,
    imageUrl: '/templates/3.jpeg',
  },
  {
    id: 10,
    name: 'Template 4',
    thumbnail: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    referenceColor: '#d4a853',
    textPosition: { x: 540, y: 960, maxWidth: 900 },
    referencePosition: { x: 540, y: 1600 },
    fontSize: 52,
    referenceFontSize: 42,
    imageUrl: '/templates/4.jpeg',
  },
  {
    id: 11,
    name: 'Template 5',
    thumbnail: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    referenceColor: '#d4a853',
    textPosition: { x: 540, y: 960, maxWidth: 900 },
    referencePosition: { x: 540, y: 1600 },
    fontSize: 52,
    referenceFontSize: 42,
    imageUrl: '/templates/5.jpeg',
  },
  {
    id: 12,
    name: 'Template 6',
    thumbnail: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    referenceColor: '#d4a853',
    textPosition: { x: 540, y: 960, maxWidth: 900 },
    referencePosition: { x: 540, y: 1600 },
    fontSize: 52,
    referenceFontSize: 42,
    imageUrl: '/templates/6.jpeg',
  },
  {
    id: 13,
    name: 'Template 7',
    thumbnail: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    referenceColor: '#d4a853',
    textPosition: { x: 540, y: 960, maxWidth: 900 },
    referencePosition: { x: 540, y: 1600 },
    fontSize: 52,
    referenceFontSize: 42,
    imageUrl: '/templates/7.jpeg',
  },
]
