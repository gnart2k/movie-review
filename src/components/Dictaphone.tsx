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
        return <span></span>;
    }

    const handleStartListen = () => {
        SpeechRecognition.startListening({ continuous: isContinuous ? isContinuous : false})
    }

    const handleStopListen = () => {
        SpeechRecognition.stopListening()
        !enableScript && resetTranscript()
    }
    

    return (
        <div className={""}>
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
            {/* <button onClick={resetTranscript}>Reset</button>
            <p>{transcript}</p> */}
        </div>
    );
};
export default Dictaphone;