import { cva, VariantProps } from "class-variance-authority";
import { Variant } from "motion/react";

const spinnerVariants = cva(
  "border-4 rounded-full border-brand-200 border-t-brand-700 animate-spin duration-700",

  {
    variants: {
      size: {
        sm: "size-4 border-2",
        md: "size-6 border-4",
        lg: "size-8 border-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type LoadingSpinnerProps = {
  className?: string;
} & VariantProps<typeof spinnerVariants>;

const LoadingSpinner = ({ className, size }: LoadingSpinnerProps) => {
  return (
    <div className="flex justify-center items-center">
      <div className={spinnerVariants({ size, className })}></div>
    </div>
  );
};

export { LoadingSpinner };
