import { copyFile, mkdir } from 'node:fs/promises'

const output = new URL('../dist/', import.meta.url)

await mkdir(output, { recursive: true })
for (const file of ['index.css', 'tailwind.css']) {
  await copyFile(new URL(`../src/${file}`, import.meta.url), new URL(file, output))
}
