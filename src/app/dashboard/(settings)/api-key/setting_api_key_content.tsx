"use client";

import { Card } from "@/app/components/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { CheckIcon, ClipboardIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SettingApiKeyContentProps {
  apiKey: string;
}

export const SettingApiKeyContent = ({ apiKey }: SettingApiKeyContentProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(apiKey);
      toast.success("API key copied to clipboard!");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy API key!");
    }
  };

  return (
    <Card className="max-w-xl w-full">
      <div>
        <Label>Your API Key</Label>
        <div className="mt-1 relative">
          <Input type="password" value={apiKey} readOnly />
          <div className="absolute space-x-0.5 inset-y-0 right-0 flex items-center">
            <Button
              variant="outline"
              type="button"
              onClick={handleCopy}
              className="p-1 w-10 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {copied ? (
                <CheckIcon className="size-4 text-brand-900" />
              ) : (
                <ClipboardIcon className="size-4 text-brand-900" />
              )}
            </Button>
          </div>
        </div>
        <p className="mt-2 text-sm/6 text-gray-600">
          Keep your key secret and do not share it with anyone.
        </p>
      </div>
    </Card>
  );
};
