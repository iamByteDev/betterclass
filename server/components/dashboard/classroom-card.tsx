import { motion } from "motion/react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { ClassroomCardActions } from "./classroom-card-actions"
import { Doc } from "@/convex/_generated/dataModel"

const AVATAR_COLORS = [
  "bg-blue-500/15 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  "bg-violet-500/15 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  "bg-orange-500/15 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
  "bg-pink-500/15 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300",
  "bg-cyan-500/15 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300",
]

function getAvatarColor(id: string) {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

interface ClassroomCardProps {
  room: Doc<"classrooms">
  index: number
}
export function ClassroomCard({ room, index }: ClassroomCardProps) {
  return (
    <motion.div
      key={room._id}
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.2,
        delay: index * 0.05,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      <Link
        href={`/app/classroom/${room._id}`}
        className="block transition-transform duration-160 ease-out active:scale-[0.99]"
      >
        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader>
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-md font-heading text-sm font-semibold ${getAvatarColor(room._id)}`}
              >
                {room.name.charAt(0).toUpperCase()}
              </div>
              <CardTitle className="truncate">{room.name}</CardTitle>
            </div>
            <CardAction>
              <ClassroomCardActions classroomId={room._id} name={room.name} />
            </CardAction>
          </CardHeader>
        </Card>
      </Link>
    </motion.div>
  )
}
