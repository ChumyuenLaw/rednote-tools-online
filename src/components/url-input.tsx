import { ChangeEvent, useState } from 'react'
import { Button } from '@/components/ui/button'

interface UrlInputProps {
  onSubmit: (url: string) => void
  isLoading?: boolean
  placeholder?: string
  className?: string
}

export function UrlInput({ onSubmit, isLoading = false, placeholder = '请输入小红书链接...', className = '' }: UrlInputProps) {
  const [value, setValue] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onSubmit(value.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 w-full max-w-xl ${className}`}>
      <input
        type="url"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
      />
      <Button 
        type="submit" 
        disabled={isLoading || !value.trim()}
        className="bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-90 transition-opacity"
      >
        {isLoading ? '处理中...' : '获取'}
      </Button>
    </form>
  )
} 