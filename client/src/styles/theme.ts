import { tokens, type Tokens } from "@/styles/tokens";

/**
 * The styled-components theme is the token bridge, verbatim. There is exactly
 * one token source (globals.css) and both styling systems read from it.
 */
export const theme: Tokens = tokens;

export type AppTheme = Tokens;
