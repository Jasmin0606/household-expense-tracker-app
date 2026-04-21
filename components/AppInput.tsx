import { AppInputProps } from "@/types/components";
import { StyleSheet, TextInput } from "react-native";



export default function AppInput({ value, onChangeText, placeholder }: AppInputProps  ) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#999"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
});