import type { InputHTMLAttributes } from "react";
import { cn } from "./cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-14 w-full rounded-full border border-(--color-pine)/25 bg-white px-4 text-base text-(--color-slate) outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20",
        className,
      )}
      {...props}
    />
  );
}
