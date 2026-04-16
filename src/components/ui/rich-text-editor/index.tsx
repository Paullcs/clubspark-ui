"use client"

import * as React from "react"
import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import { TableKit } from "@tiptap/extension-table"
import Youtube from "@tiptap/extension-youtube"
import { cn } from "@/lib/utils"
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import "./editor.css"
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  ListIcon,
  ListOrderedIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  LinkIcon,
  ImageIcon,
  MinusIcon,
  QuoteIcon,
  TableIcon,
  PlayCircleIcon,
} from "lucide-react"

export type RichTextEditorVariant = "basic" | "rich"

export interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  variant?: RichTextEditorVariant
  onImageUpload?: (file: File) => Promise<string>
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-border mx-1" />
}

function ToolbarButton({ label, pressed, onPressedChange, children }: {
  label: string
  pressed: boolean
  onPressedChange: () => void
  children: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          size="sm"
          pressed={pressed}
          onPressedChange={onPressedChange}
          aria-label={label}
          className="focus-visible:ring-0 focus-visible:border-transparent"
        >
          {children}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

function LinkPopover({ editor }: { editor: Editor }) {
  const [open, setOpen] = React.useState(false)
  const [url, setUrl] = React.useState("")
  const [newTab, setNewTab] = React.useState(true)

  const handleOpen = () => {
    const existing = editor.getAttributes("link").href
    setUrl(existing || "")
    setNewTab(editor.getAttributes("link").target === "_blank")
    setOpen(true)
  }

  const handleApply = () => {
    if (!url) {
      editor.chain().focus().unsetLink().run()
    } else {
      editor.chain().focus().setLink({
        href: url,
        target: newTab ? "_blank" : null,
      }).run()
    }
    setOpen(false)
  }

  const handleRemove = () => {
    editor.chain().focus().unsetLink().run()
    setOpen(false)
  }

  return (
    <Tooltip>
      <Popover open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("link")}
              onPressedChange={handleOpen}
              aria-label="Link"
              className="focus-visible:ring-0 focus-visible:border-transparent"
            >
              <LinkIcon className="size-4" />
            </Toggle>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Link</TooltipContent>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>URL</Label>
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApply()}
                autoFocus
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="new-tab">Open in new tab</Label>
              <Switch id="new-tab" checked={newTab} onCheckedChange={setNewTab} />
            </div>
            <div className="flex gap-2 pt-1">
              <Button size="sm" className="flex-1" onClick={handleApply}>Apply</Button>
              {editor.isActive("link") && (
                <Button size="sm" variant="destructive-outline" onClick={handleRemove}>Remove</Button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </Tooltip>
  )
}

function YoutubePopover({ editor }: { editor: Editor }) {
  const [open, setOpen] = React.useState(false)
  const [url, setUrl] = React.useState("")

  const handleApply = () => {
    if (!url) return
    editor.commands.setYoutubeVideo({ src: url })
    setUrl("")
    setOpen(false)
  }

  return (
    <Tooltip>
      <Popover open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Toggle
              size="sm"
              pressed={false}
              onPressedChange={() => setOpen(!open)}
              aria-label="Embed YouTube video"
              className="focus-visible:ring-0 focus-visible:border-transparent"
            >
              <PlayCircleIcon className="size-4" />
            </Toggle>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Embed YouTube video</TooltipContent>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>YouTube URL</Label>
              <Input
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApply()}
                autoFocus
              />
            </div>
            <Button size="sm" className="w-full" onClick={handleApply}>Embed video</Button>
          </div>
        </PopoverContent>
      </Popover>
    </Tooltip>
  )
}

function HeadingSelect({ editor }: { editor: Editor }) {
  const getValue = () => {
    if (editor.isActive("heading", { level: 1 })) return "h1"
    if (editor.isActive("heading", { level: 2 })) return "h2"
    if (editor.isActive("heading", { level: 3 })) return "h3"
    return "p"
  }

  const handleChange = (value: string) => {
    if (value === "p") {
      editor.chain().focus().setParagraph().run()
    } else {
      const level = parseInt(value.replace("h", "")) as 1 | 2 | 3
      editor.chain().focus().toggleHeading({ level }).run()
    }
  }

  return (
    <Select value={getValue()} onValueChange={handleChange}>
      <SelectTrigger size="sm" className="w-36 min-w-[140px] h-8 focus:ring-0 focus:border-transparent">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="p">Normal</SelectItem>
        <SelectItem value="h1">Heading 1</SelectItem>
        <SelectItem value="h2">Heading 2</SelectItem>
        <SelectItem value="h3">Heading 3</SelectItem>
      </SelectContent>
    </Select>
  )
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  className,
  disabled = false,
  variant = "basic",
  onImageUpload,
}: RichTextEditorProps) {
  const isRich = variant === "rich"
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        bold: {},
        italic: {},
        strike: isRich ? {} : false,
        code: false,
        codeBlock: false,
        blockquote: isRich ? {} : false,
        horizontalRule: isRich ? {} : false,
        heading: isRich ? { levels: [1, 2, 3] } : false,
      }),
      Underline,
      TextAlign.configure({
        types: isRich ? ["heading", "paragraph"] : ["paragraph"],
      }),
      Placeholder.configure({ placeholder }),
      ...(isRich ? [
        Link.configure({
          openOnClick: false,
          HTMLAttributes: { rel: "noopener noreferrer" },
        }),
        Image,
        TableKit.configure({
          table: { resizable: false },
        }),
        Youtube.configure({
          width: 640,
          height: 480,
          HTMLAttributes: { class: "cs-youtube" },
        }),
      ] : []),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "cs-editor",
        style: "min-height: 300px",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  React.useEffect(() => {
    if (!editor) return
    if (value !== undefined && editor.getHTML() !== value) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  const handleImageClick = () => fileInputRef.current?.click()

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return
    try {
      let src: string
      if (onImageUpload) {
        src = await onImageUpload(file)
      } else {
        src = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
      }
      editor.chain().focus().setImage({ src }).run()
    } catch (err) {
      console.error("Image upload failed", err)
    }
    e.target.value = ""
  }

  if (!editor) return null

  return (
    <div
      className={cn(
        "border border-input rounded-md shadow-xs overflow-hidden",
        "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      {/* Toolbar */}
      <div className="cs-toolbar flex h-10 items-center gap-px border-b border-border px-2 bg-background overflow-x-auto flex-nowrap">

        {isRich && (
          <HeadingSelect editor={editor} />
        )}

        <ToolbarButton label="Bold" pressed={editor.isActive("bold")} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
          <BoldIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Italic" pressed={editor.isActive("italic")} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
          <ItalicIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Underline" pressed={editor.isActive("underline")} onPressedChange={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="size-4" />
        </ToolbarButton>

        {isRich && (
          <ToolbarButton label="Strikethrough" pressed={editor.isActive("strike")} onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
            <StrikethroughIcon className="size-4" />
          </ToolbarButton>
        )}

        <ToolbarDivider />

        {isRich && (
          <>
            <LinkPopover editor={editor} />
            <ToolbarDivider />
          </>
        )}

        <ToolbarButton label="Bullet list" pressed={editor.isActive("bulletList")} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
          <ListIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Ordered list" pressed={editor.isActive("orderedList")} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrderedIcon className="size-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton label="Align left" pressed={editor.isActive({ textAlign: "left" })} onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}>
          <AlignLeftIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Align centre" pressed={editor.isActive({ textAlign: "center" })} onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}>
          <AlignCenterIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Align right" pressed={editor.isActive({ textAlign: "right" })} onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}>
          <AlignRightIcon className="size-4" />
        </ToolbarButton>

        {isRich && (
          <>
            <ToolbarDivider />
            <ToolbarButton label="Blockquote" pressed={editor.isActive("blockquote")} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}>
              <QuoteIcon className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Horizontal rule" pressed={false} onPressedChange={() => editor.chain().focus().setHorizontalRule().run()}>
              <MinusIcon className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Insert table" pressed={editor.isActive("table")} onPressedChange={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
              <TableIcon className="size-4" />
            </ToolbarButton>
            <ToolbarDivider />
            <ToolbarButton label="Insert image" pressed={false} onPressedChange={handleImageClick}>
              <ImageIcon className="size-4" />
            </ToolbarButton>
            <YoutubePopover editor={editor} />
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
          </>
        )}

      </div>

      {/* Editor content */}
      <div className="bg-background">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default RichTextEditor
