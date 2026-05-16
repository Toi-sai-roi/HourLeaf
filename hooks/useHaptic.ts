// hooks/useHaptic.ts
import * as Haptics from 'expo-haptics';

export const useHaptic = () => {
  const lightImpact = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const mediumImpact = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  
  const heavyImpact = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };
  
  const success = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };
  
  const error = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };
  
  return { lightImpact, mediumImpact, heavyImpact, success, error };
};