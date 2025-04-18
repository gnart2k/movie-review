"use client"
import { Mic, MicOff } from 'lucide-react';
import React from 'react';
//@ts-ignore
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


const Dictaphone = ({ enableScript, isContinuous }: { enableScript: boolean, isContinuous: boolean }) => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return
    }

    const handleStartListen = () => {
        SpeechRecognition.startListening({ continuous: isContinuous ? isContinuous : false})
    }

    const handleStopListen = () => {
        SpeechRecognition.stopListening()
        !enableScript && resetTranscript()
    }
    

    return (
        <div>
            {
                listening ? (
                    <button type="button" className='p-2 rounded-full text-white bg-white/10' onClick={handleStopListen}>
                        <MicOff />
                    </button>
                ) : (
                    <button type="button" className='p-2 rounded-full text-white bg-white/10' onClick={handleStartListen}>
                        <Mic />
                    </button>
                )
            }
        </div>
    );
};
export default Dictaphone;