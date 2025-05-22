"use client"

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export function Search() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search events...</span>
        <span className="sr-only">Search events</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search events, guests, and tasks..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Events">
            <CommandItem>Summer Wedding - Johnson</CommandItem>
            <CommandItem>Corporate Retreat - TechCorp</CommandItem>
            <CommandItem>Birthday Gala - Smith</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Guests">
            <CommandItem>Sarah Johnson</CommandItem>
            <CommandItem>Michael Brown</CommandItem>
            <CommandItem>Emily Davis</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Vendors">
            <CommandItem>Elegant Catering</CommandItem>
            <CommandItem>City Lights Photography</CommandItem>
            <CommandItem>Sound Masters DJ</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}