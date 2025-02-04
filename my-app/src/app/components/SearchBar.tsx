import { Input } from "./ui/input"

interface SearchBarProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

export default function SearchBar({ value, onChange, className }: SearchBarProps) {
  return (
    <Input
      type="text"
      placeholder="Search users by name or email..."
      value={value}
      onChange={onChange}
      className={className}
    />
  )
}