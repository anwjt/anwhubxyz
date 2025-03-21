"use client"

import { useState, useRef, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Download, Save, Shuffle, Wand2 } from "lucide-react"
import { useTheme } from "next-themes"
import QRCode from "@/components/custom-qr-code"

const patterns = [
  { value: "squares", label: "Squares" },
  { value: "dots", label: "Dots" },
  { value: "rounded", label: "Rounded" },
  { value: "classy", label: "Classy" },
  { value: "classy-rounded", label: "Classy Rounded" },
]

const dotTypes = [
  { value: "square", label: "Square" },
  { value: "circle", label: "Circle" },
  { value: "rounded-square", label: "Rounded Square" },
  { value: "extra-rounded", label: "Extra Rounded" },
  { value: "diamond", label: "Diamond" },
]

const colorPresets = [
  { value: "default", label: "Default", colors: ["#000000"] },
  { value: "blue", label: "Blue", colors: ["#1E40AF", "#3B82F6", "#93C5FD", "#DBEAFE"] },
  { value: "green", label: "Green", colors: ["#166534", "#22C55E", "#86EFAC", "#DCFCE7"] },
  { value: "purple", label: "Purple", colors: ["#581C87", "#9333EA", "#D8B4FE", "#F3E8FF"] },
  { value: "red", label: "Red", colors: ["#991B1B", "#EF4444", "#FCA5A5", "#FEE2E2"] },
  { value: "gradient", label: "Gradient", colors: ["#6366F1", "#8B5CF6", "#D946EF", "#F43F5E"] },
  { value: "random", label: "Random", colors: [] },
  { value: "custom", label: "Custom", colors: [] },
]

export default function QRCodeGenerator() {
  const [url, setUrl] = useState("https://example.com")
  const [pattern, setPattern] = useState("squares")
  const [dotType, setDotType] = useState("square")
  const [colorScheme, setColorScheme] = useState("default")
  const [colors, setColors] = useState<string[]>(["#000000", "#333333", "#666666", "#999999"])
  const [customColors, setCustomColors] = useState<string[]>(["#000000", "#333333", "#666666", "#999999"])
  const [saving, setSaving] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [qrCodeKey, setQrCodeKey] = useState(Date.now()) // Force re-render of QR code
  const qrRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const { theme } = useTheme()

  useEffect(() => {
    if (colorScheme === "custom") {
      setColors(customColors)
    } else if (colorScheme === "random") {
      handleRandomColors()
    } else {
      const preset = colorPresets.find((p) => p.value === colorScheme)
      if (preset) {
        setColors(preset.colors)
      }
    }
  }, [colorScheme])

  // Force QR code to re-render when pattern or dotType changes
  useEffect(() => {
    setQrCodeKey(Date.now())
  }, [pattern, dotType])

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...customColors]
    newColors[index] = color
    setCustomColors(newColors)
    if (colorScheme === "custom") {
      setColors(newColors)
    }
  }

  // Generate pastel color
  const generatePastelColor = () => {
    const hue = Math.floor(Math.random() * 360)
    const saturation = 65 + Math.floor(Math.random() * 15) // 65-80%
    const lightness = 75 + Math.floor(Math.random() * 15) // 75-90%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }

  // Generate AI-inspired harmonious colors
  const generateHarmoniousColors = () => {
    // Base hue for the color scheme
    const baseHue = Math.floor(Math.random() * 360)

    // Generate colors for positioning squares (top-left, top-right, bottom-left)
    const positioningSquareColors = [
      // Top-left positioning square - slightly darker
      `hsl(${baseHue}, 70%, 45%)`,
      // Top-right positioning square - complementary color
      `hsl(${(baseHue + 180) % 360}, 70%, 45%)`,
      // Bottom-left positioning square - triadic color
      `hsl(${(baseHue + 120) % 360}, 70%, 45%)`,
    ]

    // Generate pastel color for main data modules
    const mainColor = `hsl(${(baseHue + 60) % 360}, 65%, 80%)`

    return [...positioningSquareColors, mainColor]
  }

  const handleRandomColors = () => {
    const randomColors = generateHarmoniousColors()
    setColors(randomColors)
    if (colorScheme === "custom") {
      setCustomColors(randomColors)
    }
  }

  const handleAIColors = () => {
    // More sophisticated AI-inspired color generation
    // Golden ratio color scheme (approximated by 137.5 degrees)
    const baseHue = Math.floor(Math.random() * 360)
    const goldenAngle = 137.5

    const aiColors = [
      `hsl(${baseHue}, 70%, 45%)`, // Base color
      `hsl(${(baseHue + goldenAngle) % 360}, 70%, 50%)`, // Golden ratio offset
      `hsl(${(baseHue + goldenAngle * 2) % 360}, 65%, 55%)`, // Double offset
      `hsl(${(baseHue + goldenAngle * 3) % 360}, 60%, 75%)`, // Triple offset (pastel)
    ]

    setColors(aiColors)
    setColorScheme("custom")
    setCustomColors(aiColors)
  }

  const getSvgString = (): string => {
    if (!qrRef.current) return ""
    const svg = qrRef.current.querySelector("div > svg")
    if (!svg) return ""
    return new XMLSerializer().serializeToString(svg)
  }

  const downloadQRCode = async (format: "png" | "svg") => {
    try {
      setDownloading(format)

      if (!qrRef.current) {
        throw new Error("QR code reference is not available")
      }
      
      // The qr-code-styling library creates an SVG inside the div
      // We need to select it with the correct path
      const svg = qrRef.current.querySelector("div > svg")
      if (!svg) {
        throw new Error("SVG element not found. Try refreshing the page.")
      }

      // Set viewBox if not present to ensure proper scaling
      if (!svg.getAttribute('viewBox')) {
        const width = svg.getAttribute('width') || '200'
        const height = svg.getAttribute('height') || '200'
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
      }

      // Create a clone of the SVG to avoid modifying the original
      const clonedSvg = svg.cloneNode(true) as SVGElement
      
      // Ensure the SVG has the correct attributes for standalone use
      clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
      if (!clonedSvg.getAttribute('width')) {
        clonedSvg.setAttribute('width', '200')
      }
      if (!clonedSvg.getAttribute('height')) {
        clonedSvg.setAttribute('height', '200')
      }
      
      const svgData = new XMLSerializer().serializeToString(clonedSvg)
      const fileName = `qrcode-${new Date().getTime()}`

      if (format === "svg") {
        // Download as SVG
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
        const svgUrl = URL.createObjectURL(svgBlob)
        
        const downloadLink = document.createElement("a")
        downloadLink.href = svgUrl
        downloadLink.download = `${fileName}.svg`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        
        // Clean up the URL object
        setTimeout(() => URL.revokeObjectURL(svgUrl), 100)
        
        toast({
          title: "QR Code downloaded as SVG",
          description: "Your QR code has been downloaded successfully",
        })
      } else {
        // Download as PNG
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        
        if (!ctx) {
          throw new Error("Could not get canvas context")
        }
        
        // Set canvas dimensions (use the SVG's dimensions if available)
        const svgWidth = parseInt(clonedSvg.getAttribute('width') || '200', 10)
        const svgHeight = parseInt(clonedSvg.getAttribute('height') || '200', 10)
        
        // Use high resolution for better quality
        const scale = 4
        canvas.width = svgWidth * scale
        canvas.height = svgHeight * scale
        
        // Create a new image element
        const img = new Image()
        img.crossOrigin = "anonymous"
        
        // Convert SVG to data URL
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
        const svgUrl = URL.createObjectURL(svgBlob)
        
        // Wait for the image to load
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = (e) => {
            console.error("Image load error:", e)
            reject(new Error("Failed to load SVG image"))
          }
          img.src = svgUrl
        })
        
        // Draw white background and SVG on canvas
        ctx.scale(scale, scale) // Scale up for higher resolution
        ctx.fillStyle = "#FFFFFF"
        ctx.fillRect(0, 0, svgWidth, svgHeight)
        ctx.drawImage(img, 0, 0, svgWidth, svgHeight)
        
        // Get the PNG data URL
        const pngUrl = canvas.toDataURL("image/png")
        
        // Create and trigger download
        const downloadLink = document.createElement("a")
        downloadLink.href = pngUrl
        downloadLink.download = `${fileName}.png`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        
        // Clean up resources
        URL.revokeObjectURL(svgUrl)
        
        toast({
          title: "QR Code downloaded as PNG",
          description: "Your QR code has been downloaded successfully",
        })
      }
    } catch (error) {
      console.error(`Error downloading QR code as ${format}:`, error)
      toast({
        title: `Error downloading QR code`,
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      })
    } finally {
      setDownloading(null)
    }
  }

  const getClientIp = async (): Promise<string> => {
    try {
      const response = await fetch("https://api.ipify.org?format=json")
      const data = await response.json()
      return data.ip
    } catch (error) {
      console.error("Error fetching IP:", error)
      return "unknown"
    }
  }

  const saveQRCode = async () => {
    try {
      setSaving(true)

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        throw new Error(sessionError.message)
      }

      const userId = sessionData?.session?.user?.id
      const ipAddress = await getClientIp()
      const svgData = getSvgString()

      const { error } = await supabase.from("qr_codes").insert({
        url,
        pattern,
        color_1: colors[0] || "#000000",
        color_2: colors[1] || null,
        color_3: colors[2] || null,
        color_4: colors[3] || null,
        user_id: userId,
        ip_address: ipAddress,
        svg_data: svgData,
      })

      if (error) throw error

      toast({
        title: "QR Code saved",
        description: "Your QR code has been saved to history",
      })
    } catch (error) {
      console.error("Error saving QR code:", error)
      toast({
        title: "Error saving QR code",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="backdrop-blur-sm bg-white/30 dark:bg-slate-900/30 border border-white/40 dark:border-slate-700/40 shadow-xl">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="Enter URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pattern">QR Pattern</Label>
              <Select value={pattern} onValueChange={setPattern}>
                <SelectTrigger
                  id="pattern"
                  className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40"
                >
                  <SelectValue placeholder="Select pattern" />
                </SelectTrigger>
                <SelectContent>
                  {patterns.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dotType">Dot Type</Label>
              <Select value={dotType} onValueChange={setDotType}>
                <SelectTrigger
                  id="dotType"
                  className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40"
                >
                  <SelectValue placeholder="Select dot type" />
                </SelectTrigger>
                <SelectContent>
                  {dotTypes.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="colorScheme">Color Scheme</Label>
              <Select value={colorScheme} onValueChange={setColorScheme}>
                <SelectTrigger
                  id="colorScheme"
                  className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40"
                >
                  <SelectValue placeholder="Select color scheme" />
                </SelectTrigger>
                <SelectContent>
                  {colorPresets.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {colorScheme === "custom" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Custom Colors (4)</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRandomColors}
                      className="flex items-center gap-1 backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40"
                    >
                      <Shuffle size={14} />
                      Random
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAIColors}
                      className="flex items-center gap-1 backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40"
                    >
                      <Wand2 size={14} />
                      AI Colors
                    </Button>
                  </div>
                </div>

                {customColors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: color }} />
                    <Input
                      type="color"
                      value={color}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      className="w-16 h-8 p-0 overflow-hidden"
                    />
                    <Slider
                      defaultValue={[0]}
                      max={360}
                      step={1}
                      value={[Number.parseInt(color.replace(/^hsl\((\d+),.+$/, "$1") || "0")]}
                      onValueChange={(value) => {
                        const hue = value[0]
                        const currentColor = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
                        const saturation = currentColor ? currentColor[2] : "70"
                        const lightness = currentColor ? currentColor[3] : "50"
                        handleColorChange(index, `hsl(${hue}, ${saturation}%, ${lightness}%)`)
                      }}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-col backdrop-blur-sm bg-white/30 dark:bg-slate-900/30 border border-white/40 dark:border-slate-700/40 shadow-xl">
        <CardContent className="flex flex-col items-center justify-center pt-6 h-full">
          <div
            ref={qrRef}
            className="bg-white p-4 rounded-lg shadow-md mb-4"
            style={{ backgroundColor: theme === "dark" ? "#fff" : "#fff" }}
          >
            <QRCode
              key={qrCodeKey}
              value={url || "https://example.com"}
              size={200}
              bgColor={"#ffffff"}
              fgColor={colors[0]}
              level={"H"}
              includeMargin={true}
              pattern={pattern}
              dotType={dotType}
              colors={colors}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <Button
              onClick={() => downloadQRCode("png")}
              disabled={downloading === "png"}
              className="flex items-center gap-2 backdrop-blur-sm bg-primary/80 hover:bg-primary/90"
            >
              <Download size={16} />
              {downloading === "png" ? "Downloading..." : "Download PNG"}
            </Button>
            <Button
              onClick={() => downloadQRCode("svg")}
              disabled={downloading === "svg"}
              variant="outline"
              className="flex items-center gap-2 backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40"
            >
              <Download size={16} />
              {downloading === "svg" ? "Downloading..." : "Download SVG"}
            </Button>
            <Button
              onClick={saveQRCode}
              variant="secondary"
              disabled={saving}
              className="flex items-center gap-2 backdrop-blur-sm bg-secondary/80 hover:bg-secondary/90"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save to History"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
