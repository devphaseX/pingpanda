"use client";

import { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import createEventCategorySchema, {
  CreateEventCategoryInput,
} from "@/features/event_categories/schemas/create_event_categories";
import { Modal } from "./ui/modal";
import { useCreateEventCategory } from "@/features/event_categories/api/mutations/use_create_event_category";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const COLOUR_OPTIONS = [
  "#FF6B6B", // bg-[#FF6B6B] ring-[#FF6B6B] Bright Red
  "#4ECDC4", // bg-[#4ECDC4] ring-[#4ECDC4] Teal
  "#45B7D1", // bg-[#45B7D1] ring-[#45B7D1] Sky Blue
  "#FFA07A", // bg-[#FFA07A] ring-[#FFA07A] Light Salmon
  "#98D8C8", // bg-[#98D8C8] ring-[#98D8C8] Seafoam Green
  "#FDCB6E", // bg-[#FDCB6E] ring-[#FDCB6E] Mustard Yellow
  "#6C5CE7", // bg-[#6C5CE7] ring-[#6C5CE7] Soft Purple
  "#FF85A2", // bg-[#FF85A2] ring-[#FF85A2] Pink
  "#2ECC71", // bg-[#2ECC71] ring-[#2ECC71] Emerald Green
  "#E17055", // bg-[#E17055] ring-[#E17055] Terracotta
];

const EMOJI_OPTIONS = [
  { emoji: "💰", label: "Money (Sale)" },
  { emoji: "👤", label: "User (Sign-up)" },
  { emoji: "🎉", label: "Celebration" },
  { emoji: "📅", label: "Calendar" },
  { emoji: "🚀", label: "Launch" },
  { emoji: "📢", label: "Announcement" },
  { emoji: "🎓", label: "Graduation" },
  { emoji: "🏆", label: "Achievement" },
  { emoji: "💡", label: "Idea" },
  { emoji: "🔔", label: "Notification" },
];

export const CreateEventCategoryModal = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: createEventCategory, isPending: isCreatingEventCategory } =
    useCreateEventCategory();

  const form = useForm({
    resolver: zodResolver(createEventCategorySchema),
    defaultValues: {
      name: "",
      colour: "",
      emoji: "",
    },
  });

  const { errors } = form.formState;
  const colour = form.watch("colour");
  const selectedEmoji = form.watch("emoji");

  function onSubmit(data: CreateEventCategoryInput) {
    createEventCategory(data, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset();
      },
    });
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>

      <Modal
        showModal={isOpen}
        setShowModal={setIsOpen}
        className="max-w-xl p-8"
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h2 className="text-lg/7 font-medium tracking-tight text-gray-950">
              New Event Category
            </h2>
            <p className="text-sm/6 text-gray-600">
              Create a new category to organize your events.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                autoFocus
                id="name"
                {...form.register("name")}
                placeholder="e.g user-signup"
                className="w-full"
              />
              {errors.name ? (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="colour">Colour</Label>
              <div className="flex flex-wrap gap-3">
                {COLOUR_OPTIONS.map((preSelectColour) => (
                  <button
                    key={preSelectColour}
                    type="button"
                    className={cn(
                      `bg-[${preSelectColour}]`,
                      "size-10 rounded-full ring-2 ring-offset-2 transition-all",
                      colour === preSelectColour
                        ? "ring-brand-700 scale-100"
                        : "ring-transparent hover:scale-105",
                    )}
                    onClick={() => form.setValue("colour", preSelectColour)}
                  ></button>
                ))}
              </div>
              {errors.colour ? (
                <p className="mt-1 text-sm text-red-500">
                  {errors.colour.message}
                </p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="colour">Emoji</Label>
              <div className="flex flex-wrap gap-3">
                {EMOJI_OPTIONS.map(({ emoji, label }) => (
                  <button
                    key={emoji}
                    type="button"
                    className={cn(
                      "size-10 flex items-center justify-center text-xl rounded-md transition-all",
                      selectedEmoji === emoji
                        ? "bg-brand-100 ring-2 ring-brand-700 scale-110"
                        : "bg-brand-100 hover:bg-brand-200",
                    )}
                    onClick={() => form.setValue("emoji", emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              {errors.emoji ? (
                <p className="mt-1 text-sm text-red-500">
                  {errors.emoji.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isCreatingEventCategory}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreatingEventCategory}>
              Create category
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
