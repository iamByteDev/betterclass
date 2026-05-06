import Link from "next/link"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { type Organization } from "better-auth/plugins"
import { getInitials } from "@/lib/utils"

export function OrganizationCard({ org }: { org: Organization }) {
  return (
    <Link
      key={org.id}
      href={`/app/schools/${org.slug}/general`}
      className="group outline-none"
    >
      <Card className="h-full transition-shadow duration-150 group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              {org.logo && <AvatarImage src={org.logo} alt={org.name} />}
              <AvatarFallback>{getInitials(org.name)}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col gap-0.5">
              <CardTitle className="truncate">{org.name}</CardTitle>
              <CardDescription className="truncate">{org.slug}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Joined{" "}
            {new Date(org.createdAt).toLocaleDateString("en-GB", {
              month: "short",
              year: "numeric",
            })}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
