type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
};

// react-native-web's Alert is a no-op, so the browser preview uses the native dialog.
export function confirmAction({ title, message, onConfirm }: ConfirmOptions) {
  if (window.confirm(`${title}\n\n${message}`)) onConfirm();
}
