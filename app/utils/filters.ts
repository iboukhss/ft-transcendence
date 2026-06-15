export function transformLabelsToOptions<T extends Record<string, string>>(
  labelsMap: T
): { value: keyof T, label: string }[] {
  return Object.entries(labelsMap).map(([key, label]) => ({
    value: key as keyof T,
    label
  }))
}
