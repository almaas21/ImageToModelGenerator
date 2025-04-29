import { cn } from "@/lib/utils";
import { Axis3d } from "lucide-react";

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  return (
    <header className={cn("bg-primary text-primary-foreground py-4 px-6", className)}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Axis3d className="h-6 w-6" />
          <h1 className="text-xl font-bold">3D Model Generator</h1>
        </div>
        
        <div className="hidden md:flex items-center gap-4 text-sm">
          <span>Generate 3D models from images or text prompts</span>
        </div>
      </div>
    </header>
  );
}
