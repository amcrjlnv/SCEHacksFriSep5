import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  htmlFor?: string;
}

export function FormField({ 
  label, 
  description, 
  error, 
  required = false, 
  children, 
  htmlFor 
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label 
        htmlFor={htmlFor} 
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      {description && (
        <p className="text-sm text-muted-foreground" id={htmlFor ? `${htmlFor}-description` : undefined}>
          {description}
        </p>
      )}
      
      {children}
      
      {error && (
        <p className="text-sm text-destructive" role="alert" id={htmlFor ? `${htmlFor}-error` : undefined}>
          {error}
        </p>
      )}
    </div>
  );
}