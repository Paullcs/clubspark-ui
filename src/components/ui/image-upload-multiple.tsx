"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { UploadCloudIcon, XIcon, CropIcon } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type UploadedImage = {
  id:      string
  file:    File
  preview: string
}

export type ImageUploadMultipleProps = {
  onChange?:    (files: File[]) => void
  onUpload?:    (files: File[]) => void
  maxFiles?:    number
  maxSizeMb?:   number
  aspectRatio?: number
  accept?:      Record<string, string[]>
  placeholder?: string
  className?:   string
  disabled?:    boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function centerAspectCrop(w: number, h: number, aspect: number): Crop {
  return centerCrop(makeAspectCrop({ unit: "%", width: 90 }, aspect, w, h), w, h)
}

async function getCroppedBlob(image: HTMLImageElement, crop: PixelCrop): Promise<Blob> {
  const canvas = document.createElement("canvas")
  const scaleX = image.naturalWidth  / image.width
  const scaleY = image.naturalHeight / image.height
  canvas.width  = crop.width
  canvas.height = crop.height
  const ctx = canvas.getContext("2d")!
  ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, crop.width, crop.height)
  return new Promise((res) => canvas.toBlob((b) => res(b!), "image/jpeg", 0.95))
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ImageUploadMultiple({
  onChange,
  onUpload,
  maxFiles    = 10,
  maxSizeMb   = 2,
  aspectRatio,
  accept      = { "image/jpeg": [], "image/png": [], "image/webp": [] },
  placeholder = "Drag & drop or click to add images",
  className,
  disabled,
}: ImageUploadMultipleProps) {

  const [images,       setImages]       = React.useState<UploadedImage[]>([])
  const [error,        setError]        = React.useState<string | null>(null)
  const [cropOpen,     setCropOpen]     = React.useState(false)
  const [cropTarget,   setCropTarget]   = React.useState<UploadedImage | null>(null)
  const [crop,         setCrop]         = React.useState<Crop>()
  const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>()
  const imgRef = React.useRef<HTMLImageElement>(null)

  function notify(imgs: UploadedImage[]) {
    const files = imgs.map((i) => i.file)
    onChange?.(files)
  }

  const onDrop = React.useCallback((accepted: File[], rejected: any[]) => {
    setError(null)
    if (rejected.length) {
      const err = rejected[0].errors[0]
      if (err.code === "file-too-large") setError(`Files must be under ${maxSizeMb}MB`)
      else if (err.code === "too-many-files") setError(`Maximum ${maxFiles} images`)
      else setError("Invalid file type")
      return
    }
    const newImages: UploadedImage[] = accepted.map((file) => ({
      id:      crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }))
    setImages((prev) => {
      const updated = [...prev, ...newImages].slice(0, maxFiles)
      notify(updated)
      return updated
    })
  }, [maxFiles, maxSizeMb])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize:  maxSizeMb * 1024 * 1024,
    maxFiles: maxFiles,
    multiple: true,
    disabled,
  })

  function handleRemove(id: string) {
    setImages((prev) => {
      const updated = prev.filter((i) => i.id !== id)
      notify(updated)
      return updated
    })
  }

  function handleCropOpen(img: UploadedImage) {
    setCropTarget(img)
    setCropOpen(true)
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    setCrop(aspectRatio
      ? centerAspectCrop(width, height, aspectRatio)
      : { unit: "%", x: 5, y: 5, width: 90, height: 90 }
    )
  }

  async function handleCropConfirm() {
    if (!imgRef.current || !completedCrop || !cropTarget) return
    const blob = await getCroppedBlob(imgRef.current, completedCrop)
    const croppedFile = new File([blob], cropTarget.file.name, { type: "image/jpeg" })
    const url = URL.createObjectURL(blob)
    setImages((prev) => {
      const updated = prev.map((i) => i.id === cropTarget.id ? { ...i, file: croppedFile, preview: url } : i)
      notify(updated)
      return updated
    })
    setCropOpen(false)
    setCropTarget(null)
  }

  function handleUpload() {
    onUpload?.(images.map((i) => i.file))
  }

  return (
    <>
      <div className={cn("w-full space-y-4", className)}>

        {/* ── Dropzone ────────────────────────────────────────────────── */}
        <div
          {...getRootProps()}
          className={cn(
            "w-full rounded-lg border-2 border-dashed border-border bg-transparent",
            "flex flex-col items-center justify-center gap-3 px-6 py-8 text-center cursor-pointer",
            "transition-colors hover:border-primary/50 hover:bg-primary/5",
            isDragActive && "border-primary bg-primary/5",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <input {...getInputProps()} />
          <div className="flex size-10 items-center justify-center rounded-full border border-border bg-muted">
            <UploadCloudIcon className="size-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{placeholder}</p>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG or WebP · max {maxSizeMb}MB · up to {maxFiles} images
            </p>
          </div>
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}

        {/* ── Image grid ──────────────────────────────────────────────── */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative group aspect-square rounded-md overflow-hidden border border-border bg-muted">
                <img src={img.preview} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCropOpen(img)}
                    className="flex size-7 items-center justify-center rounded-md bg-white/20 hover:bg-white/30 text-white transition-colors"
                  >
                    <CropIcon className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(img.id)}
                    className="flex size-7 items-center justify-center rounded-md bg-destructive/80 hover:bg-destructive text-white transition-colors"
                  >
                    <XIcon className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Submit ──────────────────────────────────────────────────── */}
        {images.length > 0 && onUpload && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{images.length} image{images.length !== 1 ? "s" : ""} selected</p>
            <Button onClick={handleUpload}>Upload {images.length} image{images.length !== 1 ? "s" : ""}</Button>
          </div>
        )}

      </div>

      {/* ── Crop dialog ─────────────────────────────────────────────────── */}
      <Dialog open={cropOpen} onOpenChange={setCropOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop image</DialogTitle>
          </DialogHeader>
          <div className="p-6 bg-muted rounded-lg flex items-center justify-center overflow-hidden max-h-[60vh]">
            {cropTarget && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspectRatio}
                className="max-h-[60vh]"
              >
                <img
                  ref={imgRef}
                  src={cropTarget.preview}
                  onLoad={onImageLoad}
                  className="max-h-[60vh] w-auto"
                  alt="Crop preview"
                />
              </ReactCrop>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCropOpen(false)}>Cancel</Button>
            <Button onClick={handleCropConfirm}>Apply crop</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
