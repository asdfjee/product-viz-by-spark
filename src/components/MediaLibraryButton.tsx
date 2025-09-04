import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Image } from '@phosphor-icons/react'
import MediaLibraryModal from './MediaLibraryModal'

interface MediaLibraryButtonProps {
  onMediaSelected: (url: string) => void
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  children?: React.ReactNode
}

const MediaLibraryButton: React.FC<MediaLibraryButtonProps> = ({
  onMediaSelected,
  variant = 'outline',
  size = 'default',
  className,
  children
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleMediaSelected = (url: string) => {
    onMediaSelected(url)
    setIsModalOpen(false)
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsModalOpen(true)}
      >
        <Image className="w-4 h-4" />
        {children || 'Media Library'}
      </Button>

      <MediaLibraryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectMedia={handleMediaSelected}
      />
    </>
  )
}

export default MediaLibraryButton