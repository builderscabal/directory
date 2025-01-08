"use client"

import React, { type ComponentProps } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

type Props = ComponentProps<"button"> & {
  pendingText?: string
}

export function SubmitButton({ children, pendingText, ...props }: Props) {
  const { pending, action } = useFormStatus()

  const isPending = pending && action === props.formAction

  return (
    <StyledButton {...props} type="submit" aria-disabled={pending}>
      {isPending ? pendingText : children}
    </StyledButton>
  )
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const StyledButton: React.FC<ButtonProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <Button
      className={cn(
        "inline-flex flex-1 text-center items-center justify-center",
        //className
      )}
      style={{ backgroundClip: "padding-box" }}
      {...props}
    >
      <span className="mt-1 text-sm">{children}</span>
      <ArrowRight className="w-5 h-5 ml-1" />
    </Button>
  );
};