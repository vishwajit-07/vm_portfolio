'use client';
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion, MotionProps } from "framer-motion";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[11px] text-sm font-medium transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default: "bg-orange-500 text-white shadow-premium hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:bg-orange-600",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-white/10 text-white hover:bg-white/5",
        secondary: "bg-white/5 text-white hover:bg-white/10",
        ghost: "hover:bg-white/5 text-white",
        link: "text-orange-500 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  forwardedAs?: 'motion';
  whileHover?: MotionProps['whileHover'];
  whileTap?: MotionProps['whileTap'];
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, forwardedAs, whileHover, whileTap, ...props }, ref) => {
    if (forwardedAs === 'motion') {
      return (
        <motion.button
          whileHover={whileHover}
          whileTap={whileTap || { scale: 0.97 }}
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref as any}
          {...props as any}
        />
      );
    }
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
