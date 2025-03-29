'use client'

import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";

// Load useSpeech động để tránh lỗi SSR
const SpeechComponent = dynamic(() =>
  import("react-text-to-speech").then((mod) => {
    return function WrappedComponent({ text }: { text: string }) {
      const {
        Text,
        speechStatus,
        start,
        pause,
        stop,
      } = mod.useSpeech({ text });

      const [progress, setProgress] = useState<number>(0);
      const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
      const [selectedVoice, setSelectedVoice] = useState<string>("");
      const [rate, setRate] = useState<number>(1);
      const [volume, setVolume] = useState<number>(1);
      const [showSettings, setShowSettings] = useState<boolean>(false);
      const [showVoiceSetting, setShowVoiceSetting] = useState<boolean>(true);
      const [showVolumeSetting, setShowVolumeSetting] = useState<boolean>(true);
      const [showRateSetting, setShowRateSetting] = useState<boolean>(true);

      // Load danh sách giọng đọc
      useEffect(() => {
        const synth = window.speechSynthesis;
        const loadVoices = () => {
          const availableVoices = synth.getVoices();
          setVoices(availableVoices);
          if (availableVoices.length > 0) {
            availableVoices[0] && setSelectedVoice(availableVoices[0].name);
          }
        };

        synth.onvoiceschanged = loadVoices;
        loadVoices();
      }, []);

      // Chọn giọng nói và phát
      const handleVoiceChange = (voiceName: string) => {
        setSelectedVoice(voiceName);
      };

      // Tùy chỉnh phát giọng nói
      const handlePlay = () => {
        stop(); // Dừng phát hiện tại trước khi phát mới
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        const selected = voices.find((voice) => voice.name === selectedVoice);
        if (selected) {
          utterance.voice = selected;
        }
        utterance.rate = rate; // Cập nhật tốc độ
        utterance.volume = volume; // Cập nhật âm lượng
        synth.speak(utterance);
      };

      const handleStop = () => {
        // stop(); // We are not using the hook's stop function as per the requirement
        const synth = window.speechSynthesis;
        synth.cancel(); // This will immediately stop any currently speaking utterance
        // Optionally, you can reset the progress bar here if needed
        // setProgress(0);
      };

      const toggleSettings = () => {
        setShowSettings(!showSettings);
      };

      return (
        <div className="text-white rounded-lg shadow-xl p-2  flex">
          {/* Left Section: Controls and Progress */}
          <div className="flex flex-col items-center mr-6">
            {/* Controls Section */}
            <div className="flex items-center space-x-4 mb-4">
              {speechStatus !== "started" ? (
                <div
                  className=" text-white font-bold rounded-full w-12 h-12 flex items-center justify-center focus:outline-none"
                  onClick={handlePlay}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div
                  className="font-bold rounded-full w-12 h-12 flex items-center justify-center focus:outline-none"
                  onClick={handleStop}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div
                className="text-white font-bold rounded-full w-12 h-12 flex items-center justify-center focus:outline-none"
                onClick={handleStop}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Section: Settings */}
          <div className="flex flex-col justify-between">
            {/* Toggle Settings div */}
            <div
              onClick={toggleSettings}
              className="hover:bg-gray-700 text-white rounded-md p-2 mt-2 focus:outline-none"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </div>

            {showSettings && (
              <div className="space-y-4">
                {/* Toggle Visibility of Settings */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-400">Voice</label>
                  <input
                    type="checkbox"
                    checked={showVoiceSetting}
                    onChange={() => setShowVoiceSetting(!showVoiceSetting)}
                    className="form-checkbox h-4 w-4 text-green-500 focus:ring-green-500 border-gray-700 rounded bg-gray-800"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-400">Speed</label>
                  <input
                    type="checkbox"
                    checked={showRateSetting}
                    onChange={() => setShowRateSetting(!showRateSetting)}
                    className="form-checkbox h-4 w-4 text-green-500 focus:ring-green-500 border-gray-700 rounded bg-gray-800"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-400">Volume</label>
                  <input
                    type="checkbox"
                    checked={showVolumeSetting}
                    onChange={() => setShowVolumeSetting(!showVolumeSetting)}
                    className="form-checkbox h-4 w-4 text-green-500 focus:ring-green-500 border-gray-700 rounded bg-gray-800"
                  />
                </div>

                {/* Voice Selection */}
                {showVoiceSetting && (
                  <div className="w-full">
                    <label htmlFor="voice" className="block text-sm font-medium text-gray-300">
                      Voice
                    </label>
                    <div className="mt-1">
                      <select
                        id="voice"
                        className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-700 rounded-md bg-gray-800 text-white"
                        onChange={(e) => handleVoiceChange(e.target.value)}
                        value={selectedVoice}
                      >
                        {voices.map((voice, index) => (
                          <option key={index} value={voice.name}>
                            {voice.name} ({voice.lang})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Rate Control */}
                {showRateSetting && (
                  <div className="w-full">
                    <label htmlFor="rate" className="block text-sm font-medium text-gray-300">
                      Speed
                    </label>
                    <input
                      type="range"
                      id="rate"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={rate}
                      onChange={(e) => setRate(parseFloat(e.target.value))}
                      className="w-full bg-gray-800 rounded-full h-2 appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0.5x</span>
                      <span>1x</span>
                      <span>2x</span>
                    </div>
                  </div>
                )}

                {/* Volume Control */}
                {showVolumeSetting && (
                  <div className="w-full">
                    <label htmlFor="volume" className="block text-sm font-medium text-gray-300">
                      Volume
                    </label>
                    <input
                      type="range"
                      id="volume"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-full bg-gray-800 rounded-full h-2 appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Mute</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    };
  }),
  { ssr: false }
);

export default SpeechComponent