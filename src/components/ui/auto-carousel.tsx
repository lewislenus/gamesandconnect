"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Cloudinary image collections from the codebase
export const CLOUDINARY_IMAGES = {
  gallery: [
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1344_y4iq2a.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1414_ij80mu.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1424_f0harp.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1679_ovnanp.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1623_olhksw.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1656_yoiklo.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1677_v8n5nu.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1684_pv0ohb.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1758_mj5kho.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1776_eob5jv.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/back_k2fwpf.jpg"
  ],
  teamRed: [
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915392/_MG_2318_w7a9ad.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915394/_MG_2325_gnzypr.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915395/_MG_2328_mxh9bc.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915396/_MG_2332_jdnbcx.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915397/_MG_2401_awcjgd.jpg"
  ],
  teamGreen: [
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915398/_MG_2403_hknyss.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915399/_MG_2214_zq4dzb.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915389/_MG_2356_nlkxwl.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915382/_MG_2210_swxpme.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746918852/_MG_2336_mxnylu.jpg"
  ],
  teamBlue: [
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915379/_MG_1921_pihzka.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915386/_MG_2024_pquwqm.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915387/_MG_2004_rjoyrt.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915377/_MG_1906_yggfep.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915390/_MG_2169_sjbmts.jpg"
  ],
  teamYellow: [
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915378/_MG_1828_k5cwrw.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915378/_MG_1814_jmfzwz.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915379/_MG_1839_tuxcjm.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915376/_MG_1784_vkfxoc.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915386/_MG_1999_btpwql.jpg"
  ],
  all: [] as string[] // Will be populated below
}

// Combine all images for a complete collection
CLOUDINARY_IMAGES.all = [
  ...CLOUDINARY_IMAGES.gallery,
  ...CLOUDINARY_IMAGES.teamRed,
  ...CLOUDINARY_IMAGES.teamGreen,
  ...CLOUDINARY_IMAGES.teamBlue,
  ...CLOUDINARY_IMAGES.teamYellow
]

interface AutoCarouselProps {
  images?: string[]
  collection?: keyof typeof CLOUDINARY_IMAGES
  autoScrollInterval?: number
  showControls?: boolean
  showDots?: boolean
  className?: string
  imageClassName?: string
  pauseOnHover?: boolean
}

export function AutoCarousel({
  images: propImages,
  collection = "gallery",
  autoScrollInterval = 3000,
  showControls = true,
  showDots = true,
  className,
  imageClassName,
  pauseOnHover = true,
}: AutoCarouselProps) {
  // Use prop images if provided, otherwise use the specified collection
  const images = propImages || CLOUDINARY_IMAGES[collection]
  
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(true)
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

  // Auto scroll functionality
  React.useEffect(() => {
    if (isPlaying && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
      }, autoScrollInterval)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, images.length, autoScrollInterval])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPlaying(false)
    }
  }

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPlaying(true)
    }
  }

  if (!images || images.length === 0) {
    return <div className="text-center text-muted-foreground">No images to display</div>
  }

  return (
    <div
      className={cn("relative w-full overflow-hidden rounded-lg", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Single image container */}
      <div className="relative h-full">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500 ease-in-out",
            imageClassName
          )}
          loading="eager"
        />
      </div>

      {/* Navigation controls */}
      {showControls && images.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 backdrop-blur-sm"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous image</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 backdrop-blur-sm"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next image</span>
          </Button>
        </>
      )}

      {/* Dots indicator */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                index === currentIndex
                  ? "bg-primary scale-125"
                  : "bg-primary/50 hover:bg-primary/70"
              )}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Play/Pause button */}
      <Button
        variant="outline"
        size="sm"
        className="absolute top-2 right-2 bg-background/80 hover:bg-background/90 backdrop-blur-sm"
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? "⏸" : "▶"}
        <span className="sr-only">{isPlaying ? "Pause" : "Play"} carousel</span>
      </Button>
    </div>
  )
}
