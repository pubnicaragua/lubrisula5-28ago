import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export function Logo({ showText = true, size = "md" }: LogoProps) {
  const sizes = {
    sm: { logo: 30, text: "text-lg" },
    md: { logo: 40, text: "text-xl" },
    lg: { logo: 50, text: "text-2xl" },
  }

  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="relative">
        <Image
          src="/autoflowx-logo.png"
          alt="AUTOFLOWX Logo"
          width={sizes[size].logo}
          height={sizes[size].logo}
          className="object-contain"
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-primary ${sizes[size].text}`}>AUTOFLOWX</span>
          {size !== "sm" && <span className="text-xs text-muted-foreground">FLEET AND WORKSHOP MANAGEMENT</span>}
        </div>
      )}
    </Link>
  )
}
