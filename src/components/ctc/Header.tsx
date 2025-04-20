"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileTooltipOpen, setMobileTooltipOpen] = useState<string | null>(
    null
  );

  // Handle mobile tooltip
  const handleMobileClick = (event: React.MouseEvent, id: string) => {
    // For mobile devices, show/hide tooltip on click
    if (window.innerWidth < 768) {
      event.preventDefault();
      setMobileTooltipOpen(mobileTooltipOpen === id ? null : id);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <Search className="w-6 h-6 text-primary" />
          <span className="font-detective text-xl">Crack-the-Case</span>
        </a>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Cases</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 w-[400px]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href="#"
                          onClick={(e) => handleMobileClick(e, "murder")}
                          className="block"
                        >
                          <NavigationMenuLink className="cursor-pointer hover:bg-accent p-2 rounded-md block">
                            Murder Mysteries
                          </NavigationMenuLink>
                        </a>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md"
                        forceMount={mobileTooltipOpen === "murder"}
                      >
                        Coming Soon
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href="#"
                          onClick={(e) => handleMobileClick(e, "heists")}
                          className="block"
                        >
                          <NavigationMenuLink className="cursor-pointer hover:bg-accent p-2 rounded-md block">
                            Heists
                          </NavigationMenuLink>
                        </a>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md"
                        forceMount={mobileTooltipOpen === "heists"}
                      >
                        Coming Soon
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href="#"
                          onClick={(e) => handleMobileClick(e, "coming-soon")}
                          className="block"
                        >
                          <NavigationMenuLink className="cursor-pointer hover:bg-accent p-2 rounded-md block">
                            Coming Soon
                          </NavigationMenuLink>
                        </a>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md"
                        forceMount={mobileTooltipOpen === "coming-soon"}
                      >
                        Coming Soon
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="#register">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Register Interest
                </NavigationMenuLink>
              </a>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Header;
