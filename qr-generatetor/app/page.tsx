import QRCodeGenerator from "@/components/qr-code-generator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import QRCodeHistory from "@/components/qr-code-history"

export default function Home() {
  return (
    <div className="relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2 z-0"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full filter blur-3xl translate-x-1/3 -translate-y-1/3 z-0"></div>
      <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-pink-500/10 rounded-full filter blur-3xl z-0"></div>

      <div className="container mx-auto px-4 py-10 relative z-10">
        <h1 className="text-4xl font-bold text-center mb-2 text-slate-800 dark:text-slate-100 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          QR Code Generator
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-300 mb-8">
          Create customized QR codes with different patterns and colors
        </p>

        <Tabs defaultValue="generator" className="max-w-4xl mx-auto" key="qr-code-tabs">
          <TabsList className="grid w-full grid-cols-2 mb-8 backdrop-blur-sm bg-white/30 dark:bg-slate-900/30 border border-white/40 dark:border-slate-700/40">
            <TabsTrigger value="generator">Generator</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="generator" className="min-h-[400px]">
            <QRCodeGenerator />
          </TabsContent>
          <TabsContent value="history" className="min-h-[400px]">
            <QRCodeHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

