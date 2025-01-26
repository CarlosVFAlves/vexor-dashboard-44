import { Bell, ChevronDown, User, Sun, Moon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export const TopBar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="h-16 border-b border-secondary flex items-center justify-between px-4 bg-background">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">Vexor</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              Líder de Equipa
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Vendedor</DropdownMenuItem>
            <DropdownMenuItem>Líder de Equipa</DropdownMenuItem>
            <DropdownMenuItem>Backoffice</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs flex items-center justify-center">
            3
          </span>
        </Button>

        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};