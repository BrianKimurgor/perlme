import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";

// ─── Share Option Type System ──────────────────────────────────
// Each share target is a ShareOption. To add a new target (e.g. WhatsApp),
// create a new option object and add it to SHARE_OPTIONS.

export type ShareOptionId =
    | "repost"
    | "send_to_user"
    // Future options:
    // | "whatsapp"
    // | "sms"
    // | "copy_link"
    // | "more"
    ;

export interface ShareOption {
    id: ShareOptionId;
    label: string;
    description: string;
    icon: ComponentProps<typeof Ionicons>["name"];
    iconColor: string;
    /** If true, this option opens a user picker before executing */
    requiresUserPicker: boolean;
}

// ─── Registered Share Options ──────────────────────────────────
export const SHARE_OPTIONS: ShareOption[] = [
    {
        id: "repost",
        label: "Repost to Feed",
        description: "Share this post on your own feed",
        icon: "repeat-outline",
        iconColor: "#8e44ad",
        requiresUserPicker: false,
    },
    {
        id: "send_to_user",
        label: "Send to a Friend",
        description: "Share this post as a message",
        icon: "paper-plane-outline",
        iconColor: "#ff3366",
        requiresUserPicker: true,
    },
    // ── Add future share targets here ──
    // {
    //     id: "whatsapp",
    //     label: "WhatsApp",
    //     description: "Share via WhatsApp",
    //     icon: "logo-whatsapp",
    //     iconColor: "#25D366",
    //     requiresUserPicker: false,
    // },
    // {
    //     id: "sms",
    //     label: "SMS / Message",
    //     description: "Share via text message",
    //     icon: "chatbox-outline",
    //     iconColor: "#3b82f6",
    //     requiresUserPicker: false,
    // },
];
