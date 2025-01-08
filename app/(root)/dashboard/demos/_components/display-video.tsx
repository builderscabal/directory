const DisplayVideo = ({ url }: any) => {
  const getEmbedUrl = (url: any) => {
    if (url.includes("youtu.be")) {
      const videoId = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtube.com")) {
      const videoId = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("vimeo.com")) {
      const videoId = url.split("vimeo.com/")[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    if (url.includes("loom.com")) {
      const videoId = url.split("loom.com/share/")[1];
      return `https://www.loom.com/embed/${videoId}`;
    }
    if (url.includes("dailymotion.com")) {
      const videoId = url.split("video/")[1];
      return `https://www.dailymotion.com/embed/video/${videoId}`;
    }
    if (url.includes("wistia.com")) {
      const videoId = url.split("wistia.com/medias/")[1];
      return `https://fast.wistia.com/embed/medias/${videoId}`;
    }
    if (url.includes("facebook.com")) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}`;
    }
    if (url.includes("twitch.tv")) {
      const channelName = url.split("twitch.tv/")[1];
      return `https://player.twitch.tv/?channel=${channelName}&parent=example.com`;
    }
    if (url.includes("tiktok.com")) {
      return `https://www.tiktok.com/embed/${url.split("/").pop()}`;
    }
    if (url.includes("instagram.com")) {
      return `${url}embed`;
    }
    if (url.includes("brightcove.com")) {
      return `${url}/embed`;
    }
    if (url.includes("jwplayer.com")) {
      const videoId = url.split("videos/")[1];
      return `https://cdn.jwplayer.com/players/${videoId}`;
    }
    if (url.includes("twitter.com")) {
      return `https://twitframe.com/show?url=${encodeURIComponent(url)}`;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(url);

  return embedUrl ? (
    <iframe
      width="100%"
      height="160px"
      className="rounded-xl"
      src={embedUrl}
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  ) : (
    <video controls width="100%" height="360px" className="rounded-xl">
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default DisplayVideo;