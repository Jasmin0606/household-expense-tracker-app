import { AppButtonProps } from "@/types/components";
import { StyleSheet, Text, TouchableOpacity } from "react-native";



export default function AppButton({ title, onPress, disabled }: AppButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, disabled && { backgroundColor: "#ccc" },]} onPress={onPress} disabled={disabled}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
  },
});