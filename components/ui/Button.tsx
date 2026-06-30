import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
};

const baseStyles =
  "inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60";

const variantStyles = {
  primary: "bg-(--color-maple-gold) text-(--color-forest-green) hover:opacity-90",
  secondary: "bg-(--color-forest-green) text-(--color-cream) hover:bg-(--color-pine)",
  ghost: "bg-transparent text-(--color-slate) hover:bg-[rgba(31,59,47,0.06)]",
};

const sizeStyles = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-6 text-base",
};

export function Button({ className, variant = "primary", size = "md", children, ...props }: ButtonProps) {
  return (
    <button className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)} {...props}>
      {children}
    </button>
  );
}
