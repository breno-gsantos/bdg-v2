import Link from "next/link";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface DashboardWrapperProps {
  children: React.ReactNode;
  title: string;
  description: string;
  btnTitle: string;
  backHref: string;
}

export function DashboardWrapper({ children, btnTitle, description, title, backHref }: DashboardWrapperProps) {
  return (
    <main className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="dashboardTitle">{title}</h1>
          <p className="dashboardDescription">{description}</p>
        </div>
        <div className="flex gap-4">
          <Button asChild className="bg-primary">
            <Link href={backHref}>
              <Plus className="size-4" />
              {btnTitle}
            </Link>
          </Button>
        </div>
      </div>

      {children}
    </main>
  )
}