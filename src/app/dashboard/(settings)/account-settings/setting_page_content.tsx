"use client";

import { Card } from "@/app/components/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { useSetDiscordId } from "@/features/users/api/mutations/use_set_discord_id";
import Link from "next/link";
import { useState } from "react";

interface AccountSettingsProps {
  discordId?: string;
}

export const AccountSettings = ({
  discordId: initialDiscordId,
}: AccountSettingsProps) => {
  const [discordId, setDiscordId] = useState(initialDiscordId ?? "");
  const { mutate: setDiscordIdMutation, isPending } = useSetDiscordId();

  return (
    <Card className="max-w-xl w-full space-y-4">
      <div>
        <Label>Discord ID</Label>
        <Input
          className="mt-1"
          value={discordId}
          onChange={(e) => setDiscordId(e.target.value)}
          placeholder="Enter your Discord ID"
        />
      </div>

      <p className="mt-2 text-sm/6 text-gray-600">
        Don't know how to find your Discord ID? Check out this guide.
        <Link href="/#" className="text-brand-600 hover:text-brand-500">
          Learn how to obtain it here
        </Link>
      </p>

      <div className="pt-4">
        <Button
          onClick={() =>
            setDiscordIdMutation({ json: { discord_id: discordId } })
          }
        >
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </Card>
  );
};
