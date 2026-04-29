export type AppInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export type AppButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;

};