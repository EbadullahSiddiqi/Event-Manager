"use client";

import { UserButton, useUser, SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { User, Settings, CreditCard, LogOut } from "lucide-react";

export function UserNav() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (isLoaded && isSignedIn && user) {
    return (
      <div className="flex items-center gap-3">
        <span className="hidden md:inline-block text-xs font-medium text-muted-foreground">
          {user.primaryEmailAddress?.emailAddress}
        </span>
        <UserButton afterSignOutUrl="/" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-primary/20 hover:ring-primary">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.imageUrl || ""} alt={user?.fullName || "User"} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {user?.firstName?.[0] || "EP"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.fullName || "Jane Event Coordinator"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.primaryEmailAddress?.emailAddress || "jane@eventflow.io"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" /> Profile & Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className="cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" /> Subscription & Plan
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/sign-in" className="cursor-pointer text-destructive">
            <LogOut className="mr-2 h-4 w-4" /> Log out / Switch Account
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}