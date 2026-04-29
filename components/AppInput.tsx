// import { AppInputProps } from "@/types/components";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

type AppInputProps = TextInputProps;

export default function AppInput(props: AppInputProps) {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor="#999"
      {...props}
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