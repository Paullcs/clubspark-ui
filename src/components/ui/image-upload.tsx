"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { UploadCloudIcon, XIcon, CropIcon, ImageIcon } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type ImageUploadProps = {
  value?:        string | null          // current image URL (for controlled usage)
  onChange?:     (file: File | null) => void
  onUpload?:     (file: File) => void   // fired when user confirms crop / selects image
  aspectRatio?:  number                 // e.g. 1 for square, 16/9 for landscape
  maxSizeMb?:    number                 // default 2
  accept?:       Record<string, string[]>
  placeholder?:  string
  className?:    string
  disabled?:     boolean
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

export function ImageUpload({
  value,
  onChange,
  onUpload,
  aspectRatio,
  maxSizeMb   = 2,
  accept      = { "image/jpeg": [], "image/png": [], "image/webp": [] },
  placeholder = "Drag & drop or click to upload",
  className,
  disabled,
}: ImageUploadProps) {

  const [preview,    setPreview]    = React.useState<string | null>(value ?? null)
  const [srcForCrop, setSrcForCrop] = React.useState<string | null>(null)
  const [crop,       setCrop]       = React.useState<Crop>()
  const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>()
  const [error,      setError]      = React.useState<string | null>(null)
  const [cropOpen,   setCropOpen]   = React.useState(false)
  const [rawFile,    setRawFile]    = React.useState<File | null>(null)
  const imgRef = React.useRef<HTMLImageElement>(null)

  // Keep preview in sync with controlled value
  React.useEffect(() => { if (value !== undefined) setPreview(value) }, [value])

  const onDrop = React.useCallback((accepted: File[], rejected: any[]) => {
    setError(null)
    if (rejected.length) {
      const err = rejected[0].errors[0]
      if (err.code === "file-too-large") setError(`File must be under ${maxSizeMb}MB`)
      else setError("Invalid file type")
      return
    }
    const file = accepted[0]
    setRawFile(file)
    const url = URL.createObjectURL(file)
    setSrcForCrop(url)
    setCropOpen(true)
  }, [maxSizeMb])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize: maxSizeMb * 1024 * 1024,
    multiple: false,
    disabled,
  })

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    if (aspectRatio) {
      setCrop(centerAspectCrop(width, height, aspectRatio))
    } else {
      setCrop({ unit: "%", x: 0, y: 0, width: 100, height: 100 })
    }
  }

  async function handleCropConfirm() {
    if (!imgRef.current || !completedCrop || !rawFile) return
    const blob = await getCroppedBlob(imgRef.current, completedCrop)
    const croppedFile = new File([blob], rawFile.name, { type: "image/jpeg" })
    const url = URL.createObjectURL(blob)
    setPreview(url)
    setCropOpen(false)
    onChange?.(croppedFile)
    onUpload?.(croppedFile)
  }

  function handleSkipCrop() {
    if (!rawFile || !srcForCrop) return
    setPreview(srcForCrop)
    setCropOpen(false)
    onChange?.(rawFile)
    onUpload?.(rawFile)
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation()
    setPreview(null)
    setRawFile(null)
    setSrcForCrop(null)
    onChange?.(null)
  }

  return (
    <>
      <div className={cn("w-full", className)}>
        {preview ? (
          // ── Preview state ──────────────────────────────────────────────
          <div className="relative group rounded-lg overflow-hidden border border-border w-full aspect-video bg-muted">
            <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => { setSrcForCrop(preview); setCropOpen(true) }}
              >
                <CropIcon className="size-3.5 mr-1.5" />Crop
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleRemove}
              >
                <XIcon className="size-3.5 mr-1.5" />Remove
              </Button>
            </div>
          </div>
        ) : (
          // ── Dropzone state ─────────────────────────────────────────────
          <div
            {...getRootProps()}
            className={cn(
              "w-full rounded-lg border-2 border-dashed border-border bg-transparent",
              "flex flex-col items-center justify-center gap-3 px-6 py-10 text-center cursor-pointer",
              "transition-colors hover:border-primary/50 hover:bg-primary/5",
              isDragActive && "border-primary bg-primary/5",
              disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            <input {...getInputProps()} />
            <div className="flex size-12 items-center justify-center rounded-full border border-border bg-muted">
              <UploadCloudIcon className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{placeholder}</p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG or WebP · max {maxSizeMb}MB
              </p>
            </div>
          </div>
        )}
        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      </div>

      {/* ── Crop dialog ──────────────────────────────────────────────────── */}
      <Dialog open={cropOpen} onOpenChange={setCropOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop image</DialogTitle>
          </DialogHeader>
          <div className="p-6 bg-muted rounded-lg flex items-center justify-center overflow-hidden max-h-[60vh]">
            {srcForCrop && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspectRatio}
                className="max-h-[60vh]"
              >
                <img
                  ref={imgRef}
                  src={srcForCrop}
                  onLoad={onImageLoad}
                  className="max-h-[60vh] w-auto"
                  alt="Crop preview"
                />
              </ReactCrop>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={handleSkipCrop}>Skip crop</Button>
            <Button onClick={handleCropConfirm}>Apply crop</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
