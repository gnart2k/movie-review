"use client"
import Dictaphone from '@/components/Dictaphone';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import React from 'react';
//@ts-ignore
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

//@ts-ignore
const Test = () => {
  const {
    transcript,
} = useSpeechRecognition()

  return (
    <div className={"bg-white h-screen w-screen flex justify-center items-center"}>
      <div className = "mt-8">
      </div>
      new series
    </div>

  );
};
export default Test;