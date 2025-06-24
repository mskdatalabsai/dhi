"use client";

import React, { useState } from "react";
import { ArrowRight, Play, Pause, Volume2 } from "lucide-react";

interface landHeroProps {
  isDark: boolean;
  videoPath?: string; // Optional video path prop
}

const LandHero = ({ isDark, videoPath }: landHeroProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * duration;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mb-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div>
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 text-sm font-medium rounded-full mb-4">
              DHITI — The AI That Truly Understands You
            </span>
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Discover the
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-teal-600">
                {" "}
                IT role{" "}
              </span>
              you were born to do
            </h1>
            <p
              className={`text-xl leading-relaxed mb-8 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              DHITI.AI uses an innovative survey to understand your unique
              strengths and passions. Our Generative AI-powered algorithms then
              analyze these inputs to recommend the ideal IT career paths where
              you&apos;ll not only succeed but truly thrive, ensuring
              you&apos;re leading the future of works.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={() => (window.location.href = "/payment")}
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-teal-600 text-white text-lg font-semibold rounded-xl hover:from-purple-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Discover Your Path
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("how-it-works");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className={`inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl border-2 transition-all duration-200 ${
                isDark
                  ? "bg-transparent text-white border-gray-600 hover:bg-gray-800"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              Watch Demo
              <Play className="ml-2 w-5 h-5" />
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full border-2 ${
                      isDark ? "border-gray-800" : "border-white"
                    } overflow-hidden ${
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-teal-500" />
                  </div>
                ))}
              </div>
              <div
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <span className="font-semibold">5,000+</span> professionals
                placed
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-yellow-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span
                className={`text-sm ml-2 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                4.9/5 rating
              </span>
            </div>
          </div>
        </div>

        {/* Right Content - Video Section */}
        <div className="relative">
          {/* Video Container */}
          <div
            className={`relative rounded-2xl overflow-hidden shadow-2xl border ${
              isDark
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
                : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
            }`}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            {/* Video Preview/Thumbnail */}
            <div className="aspect-video relative overflow-hidden">
              {videoPath ? (
                // Real video element
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  poster="/video-thumbnail.jpg" // Optional poster image
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={videoPath} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                // Fallback placeholder when no video is provided
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-teal-500 to-blue-600"></div>

                  {/* Overlay pattern for visual interest */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-4 w-32 h-32 bg-white rounded-full opacity-10"></div>
                    <div className="absolute bottom-8 right-8 w-24 h-24 bg-white rounded-full opacity-10"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full opacity-5"></div>
                  </div>

                  {/* Video Content Preview */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-2xl font-bold mb-2">
                        See DHITI.AI in Action
                      </h3>
                      <p className="text-lg opacity-90">
                        Watch how our AI transforms careers
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={handleVideoClick}
                  className={`w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-300 ${
                    isPlaying ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white ml-1" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </button>
              </div>

              {/* Video Controls Overlay */}
              <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 transition-opacity duration-300 ${
                  showControls || isPlaying ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="flex items-center gap-4 text-white">
                  <button
                    onClick={handleVideoClick}
                    className="hover:scale-110 transition-transform"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </button>

                  {/* Progress Bar */}
                  <div
                    className="flex-1 h-1 bg-white/20 rounded-full cursor-pointer"
                    onClick={handleProgressClick}
                  >
                    <div
                      className="h-full bg-white rounded-full transition-all duration-100"
                      style={{
                        width: `${
                          duration ? (currentTime / duration) * 100 : 0
                        }%`,
                      }}
                    ></div>
                  </div>

                  <button
                    className="hover:scale-110 transition-transform"
                    onClick={toggleMute}
                  >
                    <Volume2
                      className={`w-5 h-5 ${isMuted ? "opacity-50" : ""}`}
                    />
                  </button>

                  <span className="text-sm">
                    {videoPath ? formatTime(duration) : "2:34"}
                  </span>
                </div>
              </div>

              {/* Playing indicator */}
              {isPlaying && (
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    LIVE
                  </div>
                </div>
              )}
            </div>

            {/* Video Info Bar */}
            <div className={`p-4 ${isDark ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4
                    className={`font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    AI Career Assessment Demo
                  </h4>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    See how our platform works in 3 minutes
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      1.2k
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Share
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Caption */}
          <div className="text-center mt-4">
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              ↑ Watch our 3-minute demo to see DHITI.AI in action
            </p>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-teal-500 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-teal-400 to-purple-500 rounded-full opacity-20 blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default LandHero;
