export interface SFileUploadProps {
  label: string
  description?: string
  accept?: string
  multiple?: boolean
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  maxFiles?: number
  /** Maximum bytes per file. Client checks are hints; validate again on the server. */
  maxSize?: number
  browseLabel?: string
  removeLabel?: string
}
export type SFileUploadRejectReason = 'type' | 'size' | 'count' | 'duplicate'
export interface SFileUploadRejection { file: File; reason: SFileUploadRejectReason }
