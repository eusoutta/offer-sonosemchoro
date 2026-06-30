import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2, Upload, Volume2 } from 'lucide-react';
import { Button } from './ui/button';
import { saveCustomAudio, getCustomAudio, deleteCustomAudio } from '../lib/audioStorage';
import { useVibrate } from '../hooks/useVibrate';

export function CustomAudioSetup({ isNightMode }: { isNightMode: boolean }) {
  const { vibrate } = useVibrate();
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Load existing custom audio if any
    getCustomAudio().then(blob => {
      if (blob) {
        setAudioUrl(URL.createObjectURL(blob));
      }
    });

    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        await saveCustomAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      vibrate(50);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Não foi possível aceder ao microfone. Verifica as permissões.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      vibrate(100);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      await saveCustomAudio(file);
    }
  };

  const deleteAudio = async () => {
    if (window.confirm('Tem certeza que quer apagar o áudio gravado?')) {
      await deleteCustomAudio();
      setAudioUrl(null);
      setIsPlaying(false);
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    }
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current || !audioUrl) return;

    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
      audioPlayerRef.current.onended = () => setIsPlaying(false);
    }
  };

  return (
    <div className={`p-5 rounded-2xl ${isNightMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg border border-gray-100/10`}>
      <div className="flex items-center gap-3 mb-2">
        <Volume2 className={`w-6 h-6 ${isNightMode ? 'text-coral-400' : 'text-coral-500'}`} />
        <div>
          <h3 className="font-bold">Áudio de Ninar (Personalizado)</h3>
        </div>
      </div>
      
      <p className={`text-xs mb-4 leading-relaxed ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
        A voz da mãe transmite segurança. Grave um áudio dizendo algo como <i>"Shhhh, a mamã está aqui, podes dormir"</i> ou cante uma canção de embalar curta. O aplicativo tocará este som se o bebé acordar de madrugada.
      </p>

      <div className="flex flex-col gap-4">
        {audioUrl ? (
          <div className={`p-4 rounded-xl flex items-center justify-between ${isNightMode ? 'bg-gray-700' : 'bg-coral-50'}`}>
            <audio ref={audioPlayerRef} src={audioUrl} />
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={togglePlayback}
                className={`w-12 h-12 rounded-full border-2 ${isNightMode ? 'border-coral-400 text-coral-400 hover:bg-gray-600' : 'border-coral-400 text-coral-500 bg-white'}`}
              >
                {isPlaying ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
              </Button>
              <div>
                <p className="font-medium text-sm">Áudio gravado</p>
                <p className={`text-xs ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>Pronto para usar</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={deleteAudio}
              className={`text-red-400 hover:text-red-500 hover:bg-red-50 ${isNightMode ? 'hover:bg-red-900/20' : ''}`}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/30' 
                  : isNightMode ? 'bg-coral-500/20 text-coral-400 hover:bg-coral-500/30' : 'bg-coral-50 text-coral-600 hover:bg-coral-100'
              }`}
            >
              {isRecording ? (
                <>
                  <Square className="w-5 h-5 fill-current" /> Parar
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" /> Gravar Voz
                </>
              )}
            </Button>

            <div className="relative flex-1">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button
                className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 font-semibold ${
                  isNightMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Upload className="w-5 h-5" /> Upload
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
