'use client'

import React, { useState, useEffect } from "react";
import {CirclePause, CircleStop, Play} from "lucide-react"
import { useTTSStore } from "@/app/store/TTSStore";

const SpeechComponent = ({ text, ttsIndex}: { text: string, ttsIndex: number}) =>{

      const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
      const [selectedVoice, setSelectedVoice] = useState<string>("");
      const [rate, setRate] = useState<number>(1);
      const [volume, setVolume] = useState<number>(1);
      const [showSettings, setShowSettings] = useState<boolean>(false);
      const isPlay = useTTSStore(state => state.items[ttsIndex]?.isPlaying)
      const setPlay = useTTSStore(state => state.setPlay)
      const setStop = useTTSStore(state => state.setStop)

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
        handlePause()
        setSelectedVoice(voiceName);
        handlePlay()
      };

      const handlePlay = () => {
        const synth = window.speechSynthesis;
        console.log('play')
        if(synth.paused){
          synth.resume()
        }else{
          handleStop();
        }
        setPlay(ttsIndex)
        const utterance = new SpeechSynthesisUtterance(text);
        const selected = voices.find((voice) => voice.name === selectedVoice);
        if (selected) {
          utterance.voice = selected;
        }
        utterance.rate = rate;
        utterance.volume = volume;
        synth.speak(utterance);
        utterance.onend = () => {
          setStop(ttsIndex);
        };
      };

      const handleStop = () => {
        const synth = window.speechSynthesis;
        setStop(ttsIndex);
        synth.cancel();
      };

      const handlePause = () => {
        const synth = window.speechSynthesis;
        setStop(ttsIndex)
        // setPause(ttsIndex)
        synth.pause();
      };

      const handleRateChange = (e:any) =>{
        setRate(parseFloat(e.target.value))
      }
      return (
        <div className="text-white rounded-lg shadow-xl p-1 flex bg-gray-700 rounded-lg mt-2 mx-2">
          {/* Left Section: Controls and Progress */}
          <div className="flex flex-col items-center mr-6 mt-2">
            {/* Controls Section */}
            <div className="flex items-center space-x-4 mb-4 mt-2 cursor-pointer">
              {!isPlay ? (
                <div
                  className=" text-white font-bold rounded-full w-12 h-12 flex items-center justify-center focus:outline-none"
                  onClick={handlePlay}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play-icon lucide-play"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                </div>
              ) : (
                <div
                className=" text-white font-bold rounded-full w-12 h-12 flex items-center justify-center focus:outline-none"
                  onClick={handlePause}
                >
                  <CirclePause/>
                </div>
              )}
              <div
              className=" text-white font-bold rounded-full w-12 h-12 flex items-center justify-center focus:outline-none"
                  onClick={handleStop}
                >
                <CircleStop/>
              </div>
            </div>
          </div>

          {/* Right Section: Settings */}
          <div className="flex justify-between">
              <div className="flex justify-between">
                  <div className="w-full mr-8 p-4">
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
                <div className="w-full mt-2">
                  <label htmlFor="rate" className="block text-sm font-medium text-gray-300">
                    Speed
                  </label>
                  <input
                    type="range"
                    id="rate"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={rate}
                    onChange={(e) => handleRateChange(e)}
                    className="w-full bg-gray-800 rounded-full h-2 appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0.5x</span>
                    <span>1x</span>
                    <span>1.5x</span>
                  </div>
                </div>
              </div>
          </div>
        </div>
      );
    };

export default SpeechComponent