// Structured response types for rich chat messages

export type ChatMessageType =
  | "text"
  | "buttons"
  | "checklist"
  | "step_guide"
  | "option_cards"
  | "file_dropzone"
  | "progress_widget"
  | "video_embed"
  | "image_display"
  | "info_box"
  | "quick_reply"
  | "carousel"
  | "iframe_embed"
  | "step_by_step"
  | "gif";

export interface TextMessage {
  type: "text";
  content: string;
}

export interface ButtonOption {
  label: string;
  value: string;
  recommended?: boolean;
}

export interface ButtonsMessage {
  type: "buttons";
  options: ButtonOption[];
}

export interface ChecklistMessage {
  type: "checklist";
  title: string;
  items: string[];
}

export interface StepGuideMessage {
  type: "step_guide";
  title: string;
  steps: { title: string; description: string }[];
}

export interface OptionCard {
  title: string;
  description: string;
  recommended?: boolean;
  value: string;
}

export interface OptionCardsMessage {
  type: "option_cards";
  title: string;
  cards: OptionCard[];
}

export interface FileDropzoneMessage {
  type: "file_dropzone";
  label: string;
  acceptedTypes?: string[];
}

export interface ProgressWidgetMessage {
  type: "progress_widget";
  label: string;
  status: "loading" | "complete" | "error";
}

export interface VideoEmbedMessage {
  type: "video_embed";
  url: string;
  title?: string;
}

export interface ImageDisplayMessage {
  type: "image_display";
  url: string;
  caption?: string;
}

export interface InfoBoxMessage {
  type: "info_box";
  content: string;
  variant?: "info" | "tip" | "warning";
}

export interface QuickReplyMessage {
  type: "quick_reply";
  options: string[];
}

export interface CarouselSlide {
  title: string;
  content: string;
  emoji?: string;
  bgColor?: string;
  imageUrl?: string;
}

export interface CarouselMessage {
  type: "carousel";
  slides: CarouselSlide[];
  continueLabel?: string;
}

export interface IframeEmbedMessage {
  type: "iframe_embed";
  url: string;
  title: string;
  height?: number;
}

export interface StepByStepMessage {
  type: "step_by_step";
  title: string;
  steps: { title: string; description: string; imageUrl?: string }[];
}

export interface GifMessage {
  type: "gif";
  url: string;
  alt?: string;
}

export type RichMessage =
  | TextMessage
  | ButtonsMessage
  | ChecklistMessage
  | StepGuideMessage
  | OptionCardsMessage
  | FileDropzoneMessage
  | ProgressWidgetMessage
  | VideoEmbedMessage
  | ImageDisplayMessage
  | InfoBoxMessage
  | QuickReplyMessage
  | CarouselMessage
  | IframeEmbedMessage
  | StepByStepMessage
  | GifMessage;

export interface SideTip {
  content: string;
  icon?: string;
}

export interface BotResponse {
  messages: RichMessage[];
  sideTip?: SideTip;
  moduleUpdate?: {
    moduleSlug: string;
    status: "in_progress" | "completed" | "punted" | "partially_complete";
    collectedData?: Record<string, unknown>;
  };
}

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  richContent?: RichMessage[];
  sideTip?: SideTip;
  timestamp: string;
  imageUrl?: string; // for screenshot/image messages
}
