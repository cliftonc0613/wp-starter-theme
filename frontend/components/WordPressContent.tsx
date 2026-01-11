"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const YouTubePlayer = dynamic(
  () => import("./YouTubePlayer").then((mod) => mod.YouTubePlayer),
  { ssr: false }
);

interface WordPressContentProps {
  html: string;
  className?: string;
}

interface YouTubeEmbed {
  id: string;
  videoId: string;
  autoplay: boolean;
  captions: boolean;
  captionLanguage: string;
  placeholder: string;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&"]+)/,
    /youtube\.com\/embed\/([^?"]+)/,
    /youtu\.be\/([^?"]+)/,
    /youtube-nocookie\.com\/embed\/([^?"]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function parseYouTubeEmbeds(html: string): { processedHtml: string; embeds: YouTubeEmbed[] } {
  const embeds: YouTubeEmbed[] = [];
  let processedHtml = html;
  let embedIndex = 0;

  // Helper to create embed entry
  const createEmbed = (src: string, match: string) => {
    const videoId = extractYouTubeId(src);
    if (videoId) {
      const id = `yt-embed-${embedIndex++}`;
      embeds.push({
        id,
        videoId,
        autoplay: src.includes("autoplay=1"),
        captions: src.includes("cc_load_policy=1"),
        captionLanguage: "en",
        placeholder: match,
      });
      return `<div data-youtube-placeholder="${id}" class="youtube-placeholder aspect-video"></div>`;
    }
    return null;
  };

  // Pattern 1: WordPress figure blocks with YouTube embeds (most common)
  // Matches: <figure class="wp-block-embed is-type-video is-provider-youtube...">
  const figurePattern = /<figure[^>]*class="[^"]*wp-block-embed[^"]*"[^>]*>[\s\S]*?<iframe[^>]*src="([^"]*(?:youtube|youtu\.be|youtube-nocookie)[^"]*)"[^>]*>[\s\S]*?<\/iframe>[\s\S]*?<\/figure>/gi;

  processedHtml = processedHtml.replace(figurePattern, (match, src) => {
    return createEmbed(src, match) || match;
  });

  // Pattern 2: WordPress embed wrapper divs
  const wrapperPattern = /<div[^>]*class="[^"]*wp-block-embed[^"]*"[^>]*>[\s\S]*?<iframe[^>]*src="([^"]*(?:youtube|youtu\.be|youtube-nocookie)[^"]*)"[^>]*>[\s\S]*?<\/iframe>[\s\S]*?<\/div>/gi;

  processedHtml = processedHtml.replace(wrapperPattern, (match, src) => {
    return createEmbed(src, match) || match;
  });

  // Pattern 3: Any standalone YouTube iframe (catch-all)
  const iframePattern = /<iframe[^>]*src="([^"]*(?:youtube\.com\/embed|youtu\.be|youtube-nocookie\.com\/embed)[^"]*)"[^>]*>[\s\S]*?<\/iframe>/gi;

  processedHtml = processedHtml.replace(iframePattern, (match, src) => {
    return createEmbed(src, match) || match;
  });

  // Pattern 4: Custom shortcode output [youtube_player id="..."]
  const shortcodePattern = /<div[^>]*data-youtube-player[^>]*data-video-id="([^"]+)"([^>]*)>[\s\S]*?<\/div>/gi;

  processedHtml = processedHtml.replace(shortcodePattern, (match, videoId, attrs) => {
    const id = `yt-embed-${embedIndex++}`;
    const autoplayMatch = attrs.match(/data-autoplay="([^"]*)"/);
    const captionsMatch = attrs.match(/data-captions="([^"]*)"/);
    const captionLangMatch = attrs.match(/data-caption-language="([^"]*)"/);

    embeds.push({
      id,
      videoId,
      autoplay: autoplayMatch?.[1] === "true" || autoplayMatch?.[1] === "1",
      captions: captionsMatch?.[1] === "true" || captionsMatch?.[1] === "1",
      captionLanguage: captionLangMatch?.[1] || "en",
      placeholder: match,
    });
    return `<div data-youtube-placeholder="${id}" class="youtube-placeholder aspect-video"></div>`;
  });

  // Pattern 5: Lite-youtube custom elements
  const liteYoutubePattern = /<lite-youtube[^>]*videoid="([^"]+)"[^>]*>[\s\S]*?<\/lite-youtube>/gi;

  processedHtml = processedHtml.replace(liteYoutubePattern, (match, videoId) => {
    const id = `yt-embed-${embedIndex++}`;
    embeds.push({
      id,
      videoId,
      autoplay: false,
      captions: false,
      captionLanguage: "en",
      placeholder: match,
    });
    return `<div data-youtube-placeholder="${id}" class="youtube-placeholder aspect-video"></div>`;
  });

  return { processedHtml, embeds };
}

export function WordPressContent({ html, className = "" }: WordPressContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [embeds, setEmbeds] = useState<YouTubeEmbed[]>([]);
  const [processedHtml, setProcessedHtml] = useState(html);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const { processedHtml: newHtml, embeds: newEmbeds } = parseYouTubeEmbeds(html);
    setProcessedHtml(newHtml);
    setEmbeds(newEmbeds);
  }, [html]);

  useEffect(() => {
    if (!mounted || !containerRef.current || embeds.length === 0) return;

    embeds.forEach((embed) => {
      const placeholder = containerRef.current?.querySelector(
        `[data-youtube-placeholder="${embed.id}"]`
      );

      if (placeholder && !placeholder.hasAttribute("data-hydrated")) {
        placeholder.setAttribute("data-hydrated", "true");
      }
    });
  }, [mounted, embeds, processedHtml]);

  return (
    <div ref={containerRef} className={className}>
      <div dangerouslySetInnerHTML={{ __html: processedHtml }} />

      {mounted && embeds.map((embed) => (
        <YouTubePlayerPortal
          key={embed.id}
          targetId={embed.id}
          videoId={embed.videoId}
          autoplay={embed.autoplay}
          captions={embed.captions}
          captionLanguage={embed.captionLanguage}
          containerRef={containerRef}
        />
      ))}
    </div>
  );
}

interface YouTubePlayerPortalProps {
  targetId: string;
  videoId: string;
  autoplay: boolean;
  captions: boolean;
  captionLanguage: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function YouTubePlayerPortal({
  targetId,
  videoId,
  autoplay,
  captions,
  captionLanguage,
  containerRef,
}: YouTubePlayerPortalProps) {
  const [target, setTarget] = useState<Element | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const element = containerRef.current.querySelector(
        `[data-youtube-placeholder="${targetId}"]`
      );
      setTarget(element);
    }
  }, [containerRef, targetId]);

  useEffect(() => {
    if (!target) return;

    // Clear the placeholder content and add the player wrapper
    target.innerHTML = "";
    const wrapper = document.createElement("div");
    wrapper.className = "youtube-player-wrapper my-6";
    target.appendChild(wrapper);

    // Mount the player into the wrapper
    const playerContainer = document.createElement("div");
    wrapper.appendChild(playerContainer);

    // We need to render the YouTubePlayer into this container
    // Since we can't use createPortal easily here, we'll use a different approach
    target.setAttribute("data-video-mounted", "true");
  }, [target]);

  if (!target) return null;

  // Render the player in place using CSS to position it
  return (
    <div
      className="youtube-player-inline"
      style={{ display: "contents" }}
      ref={(el) => {
        if (el && target) {
          // Move this element into the placeholder
          const existing = target.querySelector(".youtube-player-inline");
          if (!existing) {
            target.innerHTML = "";
            target.appendChild(el);
            el.style.display = "block";
          }
        }
      }}
    >
      <div className="my-6">
        <YouTubePlayer
          videoId={videoId}
          autoplay={autoplay}
          muted={autoplay}
          captions={captions}
          captionLanguage={captionLanguage}
        />
      </div>
    </div>
  );
}

export default WordPressContent;
