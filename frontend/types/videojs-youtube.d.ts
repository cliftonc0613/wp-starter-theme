declare module "videojs-youtube" {
  import videojs from "video.js";

  interface YouTubeOptions {
    ytControls?: 0 | 1;
    rel?: 0 | 1;
    modestbranding?: 0 | 1;
    iv_load_policy?: 1 | 3;
    showinfo?: 0 | 1;
    customVars?: Record<string, string | number>;
  }

  module "video.js" {
    interface VideoJsPlayerOptions {
      youtube?: YouTubeOptions;
    }
  }

  export = videojs;
}
