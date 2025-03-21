"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Trash2, ExternalLink, FileDown } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns"

interface QRCode {
  id: string
  url: string
  pattern: string
  color_1: string
  color_2: string | null
  color_3: string | null
  color_4: string | null
  created_at: string
  ip_address: string | null
  svg_data: string | null
}

export default function QRCodeHistory() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<{ id: string; format: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchQRCodes()
  }, [])

  const fetchQRCodes = async () => {
    try {
      setLoading(true)

      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData?.session?.user?.id

      let query = supabase.from("qr_codes").select("*").order("created_at", { ascending: false })

      if (userId) {
        query = query.eq("user_id", userId)
      }

      const { data, error } = await query

      if (error) throw error
      setQrCodes(data || [])
    } catch (error) {
      console.error("Error fetching QR codes:", error)
      toast({
        title: "Error loading history",
        description: "Could not load your QR code history",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadQRCode = async (id: string, format: "png" | "svg") => {
    try {
      setDownloading({ id, format })
      const qrCode = qrCodes.find((qr) => qr.id === id)
      if (!qrCode || !qrCode.svg_data) {
        throw new Error("QR code data not found")
      }

      const container = document.getElementById(`qr-${id}`)
      const svg = container?.querySelector("svg")
      if (!svg) {
        throw new Error("SVG element not found")
      }

      // Get the SVG dimensions
      const width = parseInt(svg.getAttribute("width") || "300")
      const height = parseInt(svg.getAttribute("height") || "300")
      const viewBox = svg.getAttribute("viewBox")?.split(" ").map(Number) || [0, 0, width, height]

      // Create a new SVG with explicit dimensions and viewBox
      const svgData = new XMLSerializer().serializeToString(svg)
      const svgWithDimensions = svgData.replace(
        /<svg([^>]*)>/,
        `<svg$1 width="${width}" height="${height}" viewBox="${viewBox.join(' ')}">`
      )

      if (format === "svg") {
        // Download as SVG
        const svgBlob = new Blob([svgWithDimensions], { type: "image/svg+xml;charset=utf-8" })
        const svgUrl = URL.createObjectURL(svgBlob)

        const downloadLink = document.createElement("a")
        downloadLink.download = `qrcode-${id}.svg`
        downloadLink.href = svgUrl
        downloadLink.click()

        URL.revokeObjectURL(svgUrl)
      } else {
        // Download as PNG with higher resolution
        const scale = 2 // Increase resolution
        const canvas = document.createElement("canvas")
        canvas.width = width * scale
        canvas.height = height * scale
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          throw new Error("Failed to get canvas context")
        }

        // Set scale for better quality
        ctx.scale(scale, scale)

        // Create a temporary SVG blob URL
        const svgBlob = new Blob([svgWithDimensions], { type: "image/svg+xml;charset=utf-8" })
        const svgUrl = URL.createObjectURL(svgBlob)

        // Load the image
        const img = new Image()
        img.width = width
        img.height = height
        img.crossOrigin = "anonymous"
        
        await new Promise((resolve, reject) => {
          img.onload = () => {
            ctx.fillStyle = "#FFFFFF"
            ctx.fillRect(0, 0, width, height)
            ctx.drawImage(img, 0, 0, width, height)
            resolve()
          }
          img.onerror = (e) => {
            console.error('Error loading image:', e)
            reject(new Error('Failed to load QR code image'))
          }
          img.src = svgUrl
        })

        try {
          // Get the PNG data URL with maximum quality
          const pngFile = canvas.toDataURL("image/png", 1.0)

          const downloadLink = document.createElement("a")
          downloadLink.download = `qrcode-${id}.png`
          downloadLink.href = pngFile
          downloadLink.style.display = "none"
          document.body.appendChild(downloadLink)
          setTimeout(() => {
            downloadLink.click()
            document.body.removeChild(downloadLink)
          }, 100)
        } finally {
          // Clean up resources
          URL.revokeObjectURL(svgUrl)
        }
      }

      toast({
        title: `QR Code downloaded as ${format.toUpperCase()}`,
        description: "Your QR code has been downloaded successfully",
      })
    } catch (error) {
      console.error(`Error downloading QR code as ${format}:`, error)
      toast({
        title: `Error downloading QR code`,
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setDownloading(null)
    }
  }

  const deleteQRCode = async (id: string) => {
    try {
      const { error } = await supabase.from("qr_codes").delete().eq("id", id)

      if (error) throw error

      setQrCodes(qrCodes.filter((qr) => qr.id !== id))
      toast({
        title: "QR code deleted",
        description: "The QR code has been removed from your history",
      })
    } catch (error) {
      console.error("Error deleting QR code:", error)
      toast({
        title: "Error deleting QR code",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }

  const renderQRCode = (qr: QRCode) => {
    if (qr.svg_data) {
      return (
        <div
          id={`qr-${qr.id}`}
          className="bg-white p-4 rounded-lg mb-3"
          dangerouslySetInnerHTML={{ __html: qr.svg_data }}
        />
      )
    }

    return (
      <div id={`qr-${qr.id}`} className="bg-white p-4 rounded-lg mb-3">
        <svg width="150" height="150" viewBox="0 0 150 150">
          <rect width="150" height="150" fill="#ffffff" />
          <text x="75" y="75" textAnchor="middle" fill={qr.color_1 || "#000000"}>
            QR Preview
          </text>
        </svg>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (qrCodes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No QR codes saved yet</h3>
        <p className="text-muted-foreground">Generate and save QR codes to see them here</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {qrCodes.map((qr) => (
        <Card
          key={qr.id}
          className="overflow-hidden backdrop-blur-sm bg-white/30 dark:bg-slate-900/30 border border-white/40 dark:border-slate-700/40 shadow-xl"
        >
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              {renderQRCode(qr)}

              <div className="w-full mb-3 space-y-2">
                <a
                  href={qr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center justify-center gap-1"
                >
                  {qr.url.length > 30 ? qr.url.substring(0, 30) + "..." : qr.url}
                  <ExternalLink size={14} />
                </a>

                <div className="text-xs text-center text-gray-500 space-y-1">
                  <p>Created: {format(new Date(qr.created_at), "MMM d, yyyy h:mm a")}</p>
                  {qr.ip_address && <p>IP: {qr.ip_address}</p>}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 w-full justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40"
                  onClick={() => downloadQRCode(qr.id, "png")}
                  disabled={downloading?.id === qr.id && downloading?.format === "png"}
                >
                  <Download size={16} className="mr-1" />
                  {downloading?.id === qr.id && downloading?.format === "png" ? "Downloading..." : "PNG"}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40"
                  onClick={() => downloadQRCode(qr.id, "svg")}
                  disabled={downloading?.id === qr.id && downloading?.format === "svg"}
                >
                  <FileDown size={16} className="mr-1" />
                  {downloading?.id === qr.id && downloading?.format === "svg" ? "Downloading..." : "SVG"}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-500 hover:text-red-600 backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border border-white/40 dark:border-slate-700/40">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this QR code from your history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteQRCode(qr.id)} className="bg-red-500 hover:bg-red-600">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

