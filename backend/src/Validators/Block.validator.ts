import { z } from "zod";

// ========================== BLOCK VALIDATOR ==========================

// Create Block
export const createBlockSchema = z
  .object({
    blockerId: z.string().uuid({
      message: "Invalid blocker ID format (must be UUID).",
    }),
    blockedId: z.string().uuid({
      message: "Invalid blocked ID format (must be UUID).",
    }),
  })
  .refine(
    (data) => data.blockerId !== data.blockedId,
    {
      message: "You cannot block yourself.",
      path: ["blockedId"], // highlight this field in the error
    }
  );

// Remove Block
export const unblockSchema = z.object({
  blockerId: z.string().uuid({
    message: "Invalid blocker ID format (must be UUID).",
  }),
  blockedId: z.string().uuid({
    message: "Invalid blocked ID format (must be UUID).",
  }),
});

// ========================== TYPES ==========================
export type CreateBlockInput = z.infer<typeof createBlockSchema>;
export type UnblockInput = z.infer<typeof unblockSchema>;
