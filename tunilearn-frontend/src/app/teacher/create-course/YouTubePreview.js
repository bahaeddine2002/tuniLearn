'use client';

export default function YouTubePreview({ url, videoId }) {
  if (!videoId) return null;

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700">Preview:</div>
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="aspect-video bg-black rounded overflow-hidden">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video preview"
          />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Video ID: {videoId}
        </div>
      </div>
    </div>
  );
}
