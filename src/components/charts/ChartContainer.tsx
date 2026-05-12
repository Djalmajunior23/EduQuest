import { ReactNode } from "react";
import { cn } from "../../lib/utils";

type ChartContainerProps = {
  children: ReactNode;
  height?: number;
  className?: string;
};

export function ChartContainer({ children, height = 300, className }: ChartContainerProps) {
  return (
    <div
      className={cn("w-full min-w-0", className)}
      style={{
        height,
        minHeight: height,
      }}
    >
      {children}
    </div>
  );
}
