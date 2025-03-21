"use client"

import { useEffect, useRef } from "react"
import QRCodeStyling from "qr-code-styling"

interface QRCodeProps {
  value: string
  size: number
  bgColor: string
  fgColor: string
  level: string
  includeMargin: boolean
  pattern: string
  dotType: string
  colors: string[]
}

// Define proper types for the QR code library
type DotType = "square" | "dots" | "rounded" | "classy" | "classy-rounded" | "extra-rounded"
type CornerSquareType = "square" | "dot" | "extra-rounded" | "classy"
type CornerDotType = "square" | "dot" | "rounded" | "classy"

export default function QRCode({
  value,
  size,
  bgColor,
  fgColor,
  level,
  includeMargin,
  pattern,
  dotType,
  colors,
}: QRCodeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const qrCodeRef = useRef<QRCodeStyling | null>(null)

  useEffect(() => {
    if (!ref.current) return

    // Map pattern to QR code styling options
    const getDotsOptions = () => {
      let dotTypeValue: DotType = "square"
      
      switch (dotType) {
        case "circle":
          dotTypeValue = "dots"
          break
        case "rounded-square":
          dotTypeValue = "rounded"
          break
        case "extra-rounded":
          dotTypeValue = "extra-rounded"
          break
        case "diamond":
          dotTypeValue = "classy-rounded"
          break
        default:
          dotTypeValue = "square"
      }
      
      return {
        type: dotTypeValue,
        color: colors[3] || fgColor,
      }
    }

    // Map corner square options
    const getCornerSquareOptions = () => {
      let type: CornerSquareType = "square"

      if (pattern === "dots") {
        type = "dot"
      } else if (pattern === "rounded" || pattern === "classy-rounded") {
        type = "extra-rounded"
      } else if (pattern === "classy") {
        type = "classy"
      }

      return {
        type,
        color: colors[0] || fgColor,
      }
    }

    // Map corner dot options
    const getCornerDotOptions = () => {
      let type: CornerDotType = "square"

      if (pattern === "dots") {
        type = "dot"
      } else if (pattern === "rounded" || pattern === "classy-rounded") {
        type = "rounded"
      } else if (pattern === "classy") {
        type = "classy"
      }

      return {
        type,
        color: colors[1] || fgColor,
      }
    }

    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling({
        width: size,
        height: size,
        data: value,
        margin: includeMargin ? 10 : 0,
        qrOptions: {
          errorCorrectionLevel: level as any,
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.4,
          margin: 0,
        },
        dotsOptions: getDotsOptions(),
        cornersSquareOptions: getCornerSquareOptions(),
        cornersDotOptions: getCornerDotOptions(),
        backgroundOptions: {
          color: bgColor,
        },
      })

      qrCodeRef.current.append(ref.current)
    } else {
      qrCodeRef.current.update({
        data: value,
        dotsOptions: getDotsOptions(),
        cornersSquareOptions: getCornerSquareOptions(),
        cornersDotOptions: getCornerDotOptions(),
      })
    }
    
    // Expose the QR code instance to the window for download access
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window._qrCodeInstance = qrCodeRef.current;
    }
  }, [value, size, bgColor, fgColor, level, includeMargin, pattern, dotType, colors])

  return <div ref={ref} id="qr-code-container" />
}
