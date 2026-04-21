import { Slot } from "expo-router";
import { useEffect } from "react";
import 'react-native-reanimated';
import { useStore } from "../store/useStore";


export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const loadData = useStore((s) => s.loadData);

  useEffect(() => {
    loadData();
  }, []);

  return <Slot />;
}
