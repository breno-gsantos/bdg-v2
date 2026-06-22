'use client'

import { logoutAction } from "@/actions/auth/logout-action"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface LogoutButtonProps extends React.ComponentProps<typeof Button>{}

export function LogoutButton(props: LogoutButtonProps) {
  return (
    <Button {...props} onClick={async () => await logoutAction() }>
      <LogOut className="size-4" />
    </Button>
  )
}