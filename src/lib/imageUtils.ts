/**
 * Compresses an image file and converts it to WebP format using HTML5 Canvas.
 * @param file The original image file
 * @param maxWidth The maximum width of the output image (default 1920)
 * @param quality The quality of the WebP image (0 to 1, default 0.8)
 * @returns A Promise that resolves to the compressed WebP File, or the original file if compression fails
 */
export const compressImageToWebp = async (file: File, maxWidth = 1920, quality = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    // Return original if it's not an image or is already webp and we don't want to force conversion
    if (!file.type.startsWith('image/')) {
      resolve(file)
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)
    
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(file) // Fallback to original
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file) // Fallback to original
              return
            }
            
            // Create a new File object with the webp extension
            const originalName = file.name
            const newName = originalName.replace(/\.[^/.]+$/, '') + '.webp'
            
            const newFile = new File([blob], newName, {
              type: 'image/webp',
              lastModified: Date.now(),
            })
            
            resolve(newFile)
          },
          'image/webp',
          quality
        )
      }
      
      img.onerror = () => resolve(file) // Fallback to original on error
    }
    
    reader.onerror = () => resolve(file) // Fallback to original on error
  })
}
