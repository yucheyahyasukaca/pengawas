import { Node, mergeAttributes } from "@tiptap/core";

export interface YouTubeOptions {
  HTMLAttributes: Record<string, any>;
  width: number;
  height: number;
  allowFullscreen: boolean;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    youtube: {
      /**
       * Insert a YouTube video
       */
      setYouTubeVideo: (options: { src: string }) => ReturnType;
    };
  }
}

// Extract YouTube video ID from various URL formats
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export const YouTube = Node.create<YouTubeOptions>({
  name: "youtube",

  addOptions() {
    return {
      HTMLAttributes: {},
      width: 640,
      height: 360,
      allowFullscreen: true,
    };
  },

  group: "block",

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: this.options.width,
      },
      height: {
        default: this.options.height,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-youtube-video]",
        getAttrs: (node) => {
          if (typeof node === "string") return false;
          const div = node as HTMLElement;
          const iframe = div.querySelector("iframe");
          if (!iframe) return false;
          return {
            src: iframe.getAttribute("src"),
          };
        },
      },
      {
        tag: "iframe[src*='youtube.com']",
        getAttrs: (node) => {
          if (typeof node === "string") return false;
          const iframe = node as HTMLIFrameElement;
          const src = iframe.getAttribute("src") || "";
          const videoId = extractYouTubeId(src);
          if (!videoId) return false;
          return {
            src: `https://www.youtube.com/embed/${videoId}`,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { src } = HTMLAttributes;
    if (!src) return ["div", { "data-youtube-video": true }];

    const videoId = extractYouTubeId(src);
    if (!videoId) return ["div", { "data-youtube-video": true }];

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    const width = this.options.width;
    const height = this.options.height;

    return [
      "div",
      {
        "data-youtube-video": true,
        class: "youtube-embed-wrapper",
        style: `width: 100%; max-width: ${width}px; margin: 1rem auto;`,
      },
      [
        "div",
        {
          style: "position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);",
        },
        [
          "iframe",
          mergeAttributes(
            {
              width: "100%",
              height: "100%",
              src: embedUrl,
              frameborder: "0",
              allow:
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
              allowfullscreen: this.options.allowFullscreen ? "true" : undefined,
              style: "position: absolute; top: 0; left: 0; width: 100%; height: 100%;",
            },
            this.options.HTMLAttributes,
          ),
        ],
      ],
    ];
  },

  addCommands() {
    return {
      setYouTubeVideo:
        (options: { src: string }) =>
        ({ commands }) => {
          const videoId = extractYouTubeId(options.src);
          if (!videoId) {
            return false;
          }

          return commands.insertContent({
            type: this.name,
            attrs: {
              src: `https://www.youtube.com/embed/${videoId}`,
            },
          });
        },
    };
  },
});

