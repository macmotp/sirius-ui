import { compileScript, parse } from '@vue/compiler-sfc'
import ts from 'typescript'
import { existsSync } from 'node:fs'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// Compile the actual demo SFCs for the existing Vue test renderer. This exercises
// client setup/input handlers rather than duplicating their behavior in fixtures.
export async function loadDemo() {
  const directory = await mkdtemp(resolve(tmpdir(), 'sirius-demo-tests-'))
  const compiled = new Map()
  async function compile(path) {
    if (compiled.has(path)) return compiled.get(path)
    const output = resolve(directory, `${compiled.size}.mjs`)
    compiled.set(path, output)
    const source = await readFile(path, 'utf8')
    const content = extname(path) === '.vue'
      ? compileScript(parse(source, { filename: path }).descriptor, { id: path, inlineTemplate: true }).content
      : source
    let code = ts.transpileModule(content, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
    const imports = [...code.matchAll(/from\s+['"]([^'"]+)['"]/g)]
    for (const match of imports) {
      const specifier = match[1]
      let url
      if (specifier.startsWith('.')) {
        let dependency = resolve(dirname(path), specifier)
        if (!extname(dependency)) dependency += '.ts'
        if (!existsSync(dependency)) throw new Error(`Missing demo dependency: ${dependency}`)
        url = pathToFileURL(await compile(dependency)).href
      } else url = import.meta.resolve(specifier)
      code = code.replace(match[0], `from '${url}'`)
    }
    await writeFile(output, code)
    return output
  }
  return {
    async component(name) {
      const path = fileURLToPath(new URL(`../../../apps/dashboard/src/${name}`, import.meta.url))
      return (await import(pathToFileURL(await compile(path)).href)).default
    },
    async module(name) {
      const path = fileURLToPath(new URL(`../../../apps/dashboard/src/${name}`, import.meta.url))
      return import(pathToFileURL(await compile(path)).href)
    },
    close: () => rm(directory, { recursive: true, force: true }),
  }
}
