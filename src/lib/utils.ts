import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseColour = (colour: string) => {
  const hex = colour.startsWith("#") ? colour.slice(1) : colour;
  return parseInt(hex, 16);
};
