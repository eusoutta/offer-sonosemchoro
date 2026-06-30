import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { VideoProgress } from '../lib/types';

export function useVideoProgress(videoId: string, dayNumber: number, totalSeconds: number) {
  const [progress, setProgress] = useState<VideoProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const saveTimeoutRef = useRef<number | null>(null);
  const lastSavedSeconds = useRef(0);

  // Load existing progress
  useEffect(() => {
    const loadProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('video_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('video_id', videoId)
        .maybeSingle();

      if (!error && data) {
        setProgress(data as VideoProgress);
        lastSavedSeconds.current = data.segundos_assistidos;
      }
      setIsLoading(false);
    };

    loadProgress();
  }, [videoId]);

  // Debounced save - every 10 seconds
  const saveProgress = useCallback(async (currentSeconds: number) => {
    // Only save if at least 5 seconds have passed since last save
    if (Math.abs(currentSeconds - lastSavedSeconds.current) < 5) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Clear any pending save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce: wait 2 seconds before saving
    saveTimeoutRef.current = window.setTimeout(async () => {
      const completed = currentSeconds >= totalSeconds * 0.9;

      const { error } = await supabase
        .from('video_progress')
        .upsert({
          user_id: user.id,
          video_id: videoId,
          day_number: dayNumber,
          segundos_assistidos: currentSeconds,
          total_segundos: totalSeconds,
          completed: completed,
          completed_at: completed ? new Date().toISOString() : null,
          last_watched_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,video_id',
        });

      if (!error) {
        lastSavedSeconds.current = currentSeconds;
        setProgress(prev => prev ? {
          ...prev,
          segundos_assistidos: currentSeconds,
          completed: completed,
        } : null);
      }
    }, 2000);
  }, [videoId, dayNumber, totalSeconds]);

  // Handle time update from player
  const handleTimeUpdate = useCallback((currentTime: number) => {
    const seconds = Math.floor(currentTime);
    saveProgress(seconds);
  }, [saveProgress]);

  // Get resume point
  const getResumePoint = useCallback((): number => {
    return progress?.segundos_assistidos || 0;
  }, [progress]);

  // Check if completed
  const isCompleted = useCallback((): boolean => {
    return progress?.completed || false;
  }, [progress]);

  // Get progress percentage
  const getProgressPercent = useCallback((): number => {
    if (!progress) return 0;
    return Math.round((progress.segundos_assistidos / progress.total_segundos) * 100);
  }, [progress]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    progress,
    isLoading,
    handleTimeUpdate,
    getResumePoint,
    isCompleted,
    getProgressPercent,
    saveProgress,
  };
}

// Hook for getting aggregated progress for a user
export function useUserProgress() {
  const [totalWatched, setTotalWatched] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [completedVideos, setCompletedVideos] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('video_progress')
        .select('*')
        .eq('user_id', user.id);

      if (!error && data) {
        setTotalVideos(data.length);
        setCompletedVideos(data.filter(v => v.completed).length);
        const totalSeconds = data.reduce((sum, v) => sum + v.segundos_assistidos, 0);
        setTotalWatched(totalSeconds);
      }
      setIsLoading(false);
    };

    fetchProgress();
  }, []);

  const courseProgressPercent = totalVideos > 0
    ? Math.round((completedVideos / totalVideos) * 100)
    : 0;

  return {
    totalWatched,
    totalVideos,
    completedVideos,
    courseProgressPercent,
    isLoading,
  };
}
