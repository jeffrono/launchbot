"use client";

import type { RichMessage } from "@/types/chat";
import { TextBubble } from "./TextBubble";
import { ButtonGroup } from "./ButtonGroup";
import { Checklist } from "./Checklist";
import { StepGuide } from "./StepGuide";
import { OptionCards } from "./OptionCards";
import { FileDropzone } from "./FileDropzone";
import { ProgressWidget } from "./ProgressWidget";
import { VideoEmbed } from "./VideoEmbed";
import { ImageDisplay } from "./ImageDisplay";
import { InfoBox } from "./InfoBox";
import { QuickReply } from "./QuickReply";
import { Carousel } from "./Carousel";
import { IframeEmbed } from "./IframeEmbed";
import { StepByStep } from "./StepByStep";
import { GifEmbed } from "./GifEmbed";
import { TextInput } from "./TextInput";

interface MessageRendererProps {
  messages: RichMessage[];
  onAction: (value: string, label?: string) => void;
  onFileUpload: (files: File[]) => void;
  isLatest: boolean;
}

export function MessageRenderer({
  messages,
  onAction,
  onFileUpload,
  isLatest,
}: MessageRendererProps) {
  return (
    <div className="space-y-3">
      {messages.map((msg, i) => {
        switch (msg.type) {
          case "text":
            return <TextBubble key={i} content={msg.content} role="assistant" />;
          case "buttons":
            return (
              <ButtonGroup
                key={i}
                options={msg.options}
                onSelect={onAction}
                disabled={!isLatest}
              />
            );
          case "checklist":
            return <Checklist key={i} title={msg.title} items={msg.items} />;
          case "step_guide":
            return <StepGuide key={i} title={msg.title} steps={msg.steps} />;
          case "option_cards":
            return (
              <OptionCards
                key={i}
                title={msg.title}
                cards={msg.cards}
                onSelect={onAction}
                disabled={!isLatest}
              />
            );
          case "file_dropzone":
            return (
              <FileDropzone
                key={i}
                label={msg.label}
                acceptedTypes={msg.acceptedTypes}
                onUpload={onFileUpload}
              />
            );
          case "progress_widget":
            return <ProgressWidget key={i} label={msg.label} status={msg.status} />;
          case "video_embed":
            return <VideoEmbed key={i} url={msg.url} title={msg.title} />;
          case "image_display":
            return <ImageDisplay key={i} url={msg.url} caption={msg.caption} />;
          case "info_box":
            return <InfoBox key={i} content={msg.content} variant={msg.variant} />;
          case "quick_reply":
            return (
              <QuickReply
                key={i}
                options={msg.options}
                onSelect={onAction}
                disabled={!isLatest}
              />
            );
          case "carousel":
            return (
              <Carousel
                key={i}
                slides={msg.slides}
                onComplete={(v) => onAction(v)}
                continueLabel={msg.continueLabel}
              />
            );
          case "iframe_embed":
            return (
              <IframeEmbed
                key={i}
                url={msg.url}
                title={msg.title}
                height={msg.height}
                onComplete={(v) => onAction(v)}
              />
            );
          case "step_by_step":
            return (
              <StepByStep
                key={i}
                title={msg.title}
                steps={msg.steps}
                onComplete={(v) => onAction(v)}
              />
            );
          case "gif":
            return <GifEmbed key={i} url={msg.url} alt={msg.alt} />;
          case "text_input":
            return (
              <TextInput
                key={i}
                label={msg.label}
                placeholder={msg.placeholder}
                validation={msg.validation}
                submitLabel={msg.submitLabel}
                onSubmit={(v) => onAction(v)}
                disabled={!isLatest}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
