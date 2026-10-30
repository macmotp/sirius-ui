import type { SFileUploadProps, SFileUploadRejection } from './SFileUpload.types'

export function fileKey(file: File) { return JSON.stringify([file.name, file.size, file.type, file.lastModified]) }
export function fileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
function accepts(file: File, accept = '') {
  const rules = accept.toLowerCase().split(',').map(value => value.trim()).filter(Boolean)
  return !rules.length || rules.some(rule => rule.startsWith('.') ? file.name.toLowerCase().endsWith(rule)
    : rule.endsWith('/*') ? file.type.toLowerCase().startsWith(rule.slice(0, -1)) : file.type.toLowerCase() === rule)
}
export function selectFiles(current: File[], incoming: File[], props: SFileUploadProps) {
  const files = props.multiple ? [...current] : []
  const rejected: SFileUploadRejection[] = []
  const limit = props.multiple ? (Number.isFinite(props.maxFiles) ? Math.max(0, Math.floor(props.maxFiles!)) : Infinity) : 1
  for (const file of incoming) {
    const reason = !accepts(file, props.accept) ? 'type'
      : props.maxSize !== undefined && Number.isFinite(props.maxSize) && file.size > Math.max(0, props.maxSize) ? 'size'
      : files.some(item => fileKey(item) === fileKey(file)) ? 'duplicate'
      : files.length >= limit ? 'count' : undefined
    if (reason) rejected.push({ file, reason })
    else files.push(file)
  }
  // A rejected replacement must not discard an existing single selection.
  return { files: !props.multiple && !files.length ? [...current] : files, rejected }
}
