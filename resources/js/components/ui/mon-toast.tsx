"use client"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function SonnerDemo({ 
    message, 
    description, 
    actionLabel, 
    onAction 
}: {
    message: string;
    description: string;
    actionLabel: string;
    onAction: () => void;
}) {
    return (
        <Button
            variant="outline"
            onClick={() =>
                toast(message, {
                    description,
                    action: {
                        label: actionLabel,
                        onClick: onAction,
                    },
                })
            }
        >
            Show Toast
        </Button>
    )
}