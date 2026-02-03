"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { LogOut, User } from "lucide-react";

type AppHeaderProps = {
  title: string;
};

const userAvatar = PlaceHolderImages.find((p) => p.id === "user-avatar");

export function AppHeader({ title }: AppHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="font-headline text-xl font-semibold text-foreground">
          {title}
        </h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={userAvatar?.imageUrl}
                data-ai-hint={userAvatar?.imageHint}
                alt="User Avatar"
              />
              <AvatarFallback>SME</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">SME Owner</p>
              <p className="text-xs leading-none text-muted-foreground">
                sme.owner@example.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
