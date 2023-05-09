export function following(specifier: string | number): string | undefined {
  if (typeof specifier == 'number') return process.argv[specifier+1]
  let preIndex = process.argv.findIndex(arg => arg == specifier)
  if (preIndex != -1) return process.argv[preIndex+1]
}
