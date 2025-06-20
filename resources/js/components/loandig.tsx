import { Loader2 } from "lucide-react"

export function Loading() {
  return (
    <div className=" inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
        {/* This div is used to cover the entire screen with a semi-transparent background and blur effect
        fixed */}
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Chargement en cours...</p>
      </div>
    </div>
  )
}