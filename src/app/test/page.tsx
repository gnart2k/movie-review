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
    <div className={"bg-white"}>
      <Dictaphone enableScript={false} isContinuous={false}/>
      <div>
        {transcript}
      </div>

      <LanguageSwitcher/>
    </div>

  );
};
export default Test;