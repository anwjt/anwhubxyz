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

  // Optimize the QR code component for better performance
  useEffect(() => {
    // Cleanup function to prevent memory leaks
    return () => {
      if (qrCodeRef.current) {
        // Clean up any resources if needed
      }
    }
  }, [])

  useEffect(() => {
    if (!ref.current) return

    // Optimize the getDotsOptions function
    const getDotsOptions = () => {
      const color = colors[3] || fgColor

      switch (dotType) {
        case "circle":
          return { type: "dots", color }
        case "rounded-square":
          return { type: "rounded", color }
        case "extra-rounded":
          return { type: "extra-rounded", color }
        case "diamond":
          return { type: "classy-rounded", color }
        default:
          return { type: "square", color }
      }
    }

    // Map corner square options
    const getCornerSquareOptions = () => {
      let type = "square"

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
      let type = "square"

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
  }, [value, size, bgColor, fgColor, level, includeMargin, pattern, dotType, colors])

  return <div ref={ref} />
}

