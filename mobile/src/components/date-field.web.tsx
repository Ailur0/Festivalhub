import { TextField } from '@/components/text-field';

type DateFieldProps = {
  label: string;
  value: string;
  onChange: (isoDate: string) => void;
  error?: string;
  required?: boolean;
  minimumDate?: Date;
};

// The native date picker isn't available on web, so the browser preview takes typed dates.
export function DateField({ label, value, onChange, error, required }: DateFieldProps) {
  return (
    <TextField
      label={label}
      value={value}
      onChangeText={onChange}
      placeholder="YYYY-MM-DD"
      error={error}
      required={required}
      autoCapitalize="none"
      inputMode="numeric"
    />
  );
}
