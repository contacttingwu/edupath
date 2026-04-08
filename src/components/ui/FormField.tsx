interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

export function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  )
}

const inputBase =
  'w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 ' +
  'placeholder:text-slate-400 bg-white ' +
  'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ' +
  'disabled:bg-slate-50 disabled:text-slate-400 transition'

export const inputClass = inputBase
export const inputErrorClass = inputBase + ' border-rose-300 focus:ring-rose-500'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function Input({ error, className = '', ...props }: InputProps) {
  return (
    <input
      className={(error ? inputErrorClass : inputBase) + ' ' + className}
      {...props}
    />
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export function Textarea({ error, className = '', ...props }: TextareaProps) {
  return (
    <textarea
      rows={3}
      className={
        (error ? inputErrorClass : inputBase) +
        ' resize-none ' +
        className
      }
      {...props}
    />
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
}

export function Select({ error, className = '', children, ...props }: SelectProps) {
  return (
    <select
      className={(error ? inputErrorClass : inputBase) + ' ' + className}
      {...props}
    >
      {children}
    </select>
  )
}
