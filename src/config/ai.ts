/**
 * Centralized AI configuration.
 *
 * The model name, token budget, and enabled state are all driven by
 * environment variables. Never hard-code a model string in a controller.
 *
 * Usage:
 *   import { AI_CONFIG } from '../config/ai';
 *
 *   const response = await ai.models.generateContent({
 *     model: AI_CONFIG.model,
 *     contents: prompt,
 *   });
 *
 *   if (!AI_CONFIG.enabled) {
 *     return fallbackResponse;
 *   }
 */

export const AI_CONFIG = {
  /** The Gemini model to use. Override via GEMINI_MODEL env var. */
  model: process.env.GEMINI_MODEL ?? 'gemini-2.0-flash',

  /** Maximum tokens in generated response. */
  maxOutputTokens: parseInt(process.env.GEMINI_MAX_TOKENS ?? '2048', 10),

  /**
   * Whether the AI features are enabled.
   * False when GEMINI_API_KEY is missing or is the placeholder value.
   */
  enabled: Boolean(
    process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY'
  ),

  /** The API key itself (never log or expose this). */
  apiKey: process.env.GEMINI_API_KEY ?? '',
} as const;

export type AIConfig = typeof AI_CONFIG;
