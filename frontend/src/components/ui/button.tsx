import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "dark";
};

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return <button className={cn("button", `button-${variant}`, className)} {...props} />;
}
