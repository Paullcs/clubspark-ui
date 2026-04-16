import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface LeaderboardItem {
  name:      string
  subtitle?: string
  value:     string
  avatar?:   string
}

interface LeaderboardProps {
  title?:       string
  description?: string
  items?:       LeaderboardItem[]
  className?:   string
}

const defaultItems: LeaderboardItem[] = [
  { name: "Wimbledon LTC",       subtitle: "London",        value: "£48,250", avatar: "https://i.pravatar.cc/40?img=1"  },
  { name: "Manchester Tennis",   subtitle: "North West",    value: "£42,100", avatar: "https://i.pravatar.cc/40?img=2"  },
  { name: "Edinburgh Sports",    subtitle: "Scotland",      value: "£38,750", avatar: "https://i.pravatar.cc/40?img=3"  },
  { name: "Bristol Racquet",     subtitle: "South West",    value: "£35,200", avatar: "https://i.pravatar.cc/40?img=4"  },
  { name: "Leeds Tennis Club",   subtitle: "Yorkshire",     value: "£31,800", avatar: "https://i.pravatar.cc/40?img=5"  },
]

function Leaderboard({ title = "Top Clubs", description = "Revenue leaderboard this month", items = defaultItems, className }: LeaderboardProps) {
  return (
    <Card className={cn("w-full max-w-2xl", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <span className="w-6 text-center text-sm font-medium text-muted-foreground">
              {index + 1}
            </span>
            <Avatar size="default">
              <AvatarImage src={item.avatar} alt={item.name} className="object-cover" />
              <AvatarFallback>
                {item.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
              {item.subtitle && (
                <p className="truncate text-sm text-muted-foreground">{item.subtitle}</p>
              )}
            </div>
            <span className="text-sm font-semibold tabular-nums text-foreground">{item.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export { Leaderboard, type LeaderboardItem, type LeaderboardProps }
