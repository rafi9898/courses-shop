import Link from "next/link";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-[10px] px-6 text-sm font-semibold transition duration-200 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-primary text-primary-foreground shadow-soft hover:bg-[#2f16d8]",
        variant === "secondary" && "border border-border bg-white text-foreground hover:border-primary hover:text-primary",
        variant === "ghost" && "bg-transparent text-foreground hover:bg-primary-soft hover:text-primary",
        className
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant = "primary",
  children,
  ...props
}: ComponentPropsWithoutRef<typeof Link> & {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
}) {
  return (
    <Link
      className={cn(
        "focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-[10px] px-6 text-sm font-semibold transition duration-200",
        variant === "primary" && "bg-primary text-primary-foreground shadow-soft hover:bg-[#2f16d8]",
        variant === "secondary" && "border border-border bg-white text-foreground hover:border-primary hover:text-primary",
        variant === "ghost" && "bg-transparent text-foreground hover:bg-primary-soft hover:text-primary",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
