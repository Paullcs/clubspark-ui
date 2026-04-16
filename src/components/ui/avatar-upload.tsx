"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { CameraIcon, XIcon } from "lucide-react"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function centerSquareCrop(w: number, h: number): Crop {
  return centerCrop(makeAspectCrop({ unit: "%", width: 90 }, 1, w, h), w, h)
}

async function getCroppedCircleBlob(image: HTMLImageElement, crop: PixelCrop): Promise<Blob> {
  const canvas = document.createElement("canvas")
  const scaleX = image.naturalWidth  / image.width
  const scaleY = image.naturalHeight / image.height
  canvas.width  = crop.width
  canvas.height = crop.height
  const ctx = canvas.getContext("2d")!
  // Clip to circle
  ctx.beginPath()
  ctx.arc(crop.width / 2, crop.height / 2, crop.width / 2, 0, Math.PI * 2)
  ctx.clip()
  ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, crop.width, crop.height)
  return new Promise((res) => canvas.toBlob((b) => res(b!), "image/png", 0.95))
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type AvatarUploadSize = "sm" | "default" | "lg" | "xl"

export type AvatarUploadProps = {
  value?:     string | null
  onChange?:  (file: File | null) => void
  onUpload?:  (file: File) => void
  size?:      AvatarUploadSize
  maxSizeMb?: number
  disabled?:  boolean
  className?: string
}

const sizeMap: Record<AvatarUploadSize, string> = {
  sm:      "size-16",
  default: "size-24",
  lg:      "size-32",
  xl:      "size-40",
}

const iconSizeMap: Record<AvatarUploadSize, string> = {
  sm:      "size-4",
  default: "size-5",
  lg:      "size-6",
  xl:      "size-7",
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AvatarUpload({
  value,
  onChange,
  onUpload,
  size      = "default",
  maxSizeMb = 2,
  disabled,
  className,
}: AvatarUploadProps) {

  const [preview,      setPreview]      = React.useState<string | null>(value ?? null)
  const [srcForCrop,   setSrcForCrop]   = React.useState<string | null>(null)
  const [crop,         setCrop]         = React.useState<Crop>()
  const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>()
  const [cropOpen,     setCropOpen]     = React.useState(false)
  const [rawFile,      setRawFile]      = React.useState<File | null>(null)
  const [error,        setError]        = React.useState<string | null>(null)
  const imgRef = React.useRef<HTMLImageElement>(null)

  React.useEffect(() => { if (value !== undefined) setPreview(value) }, [value])

  const onDrop = React.useCallback((accepted: File[], rejected: any[]) => {
    setError(null)
    if (rejected.length) {
      setError(rejected[0].errors[0].code === "file-too-large" ? `Max ${maxSizeMb}MB` : "Invalid file type")
      return
    }
    const file = accepted[0]
    setRawFile(file)
    setSrcForCrop(URL.createObjectURL(file))
    setCropOpen(true)
  }, [maxSizeMb])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:   { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxSize:  maxSizeMb * 1024 * 1024,
    multiple: false,
    disabled,
  })

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    setCrop(centerSquareCrop(width, height))
  }

  async function handleConfirm() {
    if (!imgRef.current || !completedCrop || !rawFile) return
    const blob = await getCroppedCircleBlob(imgRef.current, completedCrop)
    const file = new File([blob], rawFile.name, { type: "image/png" })
    const url  = URL.createObjectURL(blob)
    setPreview(url)
    setCropOpen(false)
    onChange?.(file)
    onUpload?.(file)
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation()
    setPreview(null)
    setRawFile(null)
    onChange?.(null)
  }

  return (
    <>
      <div className={cn("flex flex-col items-center gap-3", className)}>
        <div
          {...getRootProps()}
          className={cn(
            "relative rounded-full overflow-hidden cursor-pointer group",
            "border-2 border-dashed border-border bg-muted",
            "transition-colors hover:border-primary/50 hover:bg-primary/5",
            isDragActive && "border-primary bg-primary/5",
            disabled && "opacity-50 cursor-not-allowed",
            sizeMap[size],
          )}
        >
          <input {...getInputProps()} />

          {preview ? (
            <>
              <img src={preview} alt="Avatar" className="size-full object-cover rounded-full" />
              {/* Hover overlay */}
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <CameraIcon className={cn("text-white", iconSizeMap[size])} />
              </div>
            </>
          ) : (
            <div className="size-full flex items-center justify-center">
              <CameraIcon className={cn("text-muted-foreground", iconSizeMap[size])} />
            </div>
          )}
        </div>

        {/* Remove button */}
        {preview && !disabled && (
          <Button type="button" variant="ghost" size="sm" onClick={handleRemove} className="text-muted-foreground hover:text-destructive">
            <XIcon className="size-3.5 mr-1" />Remove
          </Button>
        )}

        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      {/* ── Crop dialog ───────────────────────────────────────────────────── */}
      <Dialog open={cropOpen} onOpenChange={setCropOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Crop profile photo</DialogTitle>
          </DialogHeader>
          <div className="p-6 bg-muted rounded-lg flex items-center justify-center overflow-hidden max-h-[60vh]">
            {srcForCrop && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
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
            <Button variant="ghost" onClick={() => setCropOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirm}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
