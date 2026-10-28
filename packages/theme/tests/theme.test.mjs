import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import tailwindcss from '@tailwindcss/vite'
import { build } from 'vite'

test('the plain CSS export works independently of Tailwind', async () => {
  const css = await readFile(fileURLToPath(import.meta.resolve('@sirius-ui/theme')), 'utf8')

  assert.match(css, /color-scheme: light/)
  assert.match(css, /color-scheme: dark/)
  assert.doesNotMatch(css, /@(?:import|theme|custom-variant)\b/)
  assert.doesNotMatch(css, /box-sizing:/)
})

test('the published Tailwind entry generates runtime semantic utilities without a reset', async () => {
  const result = await build({
    configFile: false,
    root: fileURLToPath(new URL('.', import.meta.url)),
    plugins: [tailwindcss()],
    logLevel: 'silent',
    build: {
      write: false,
      minify: false,
      cssMinify: false,
      rollupOptions: {
        input: fileURLToPath(new URL('./fixture.css', import.meta.url)),
      },
    },
  })
  const css = result.output
    .filter((file) => file.type === 'asset' && file.fileName.endsWith('.css'))
    .map((file) => String(file.source))
    .join('\n')

  assert.match(css, /\.bg-primary\s*\{\s*background-color: var\(--sirius-primary\)/)
  assert.ok(css.includes('--tw-ring-color: var(--sirius-line)'), 'semantic ring color')
  for (const token of ['control', 'control-content', 'control-line', 'control-placeholder', 'control-focus', 'control-valid', 'control-invalid', 'shadow-xs']) {
    assert.ok(css.includes(`var(--sirius-${token})`), `${token} utility mapping`)
  }
  assert.ok(css.includes('--tw-ring-inset: inset'), 'inset ring utility')
  assert.match(css, /\.text-on-primary\s*\{\s*color: var\(--sirius-on-primary\)/)
  assert.match(css, /\.border-line\s*\{\s*border-color: var\(--sirius-line\)/)
  assert.match(css, /\.rounded-md\s*\{\s*border-radius: var\(--sirius-radius-md\)/)
  for (const role of ['warning', 'success', 'danger']) {
    assert.ok(css.includes(`background-color: var(--sirius-${role})`), `${role} fill utility`)
    assert.ok(css.includes(`color: var(--sirius-on-${role})`), `${role} foreground utility`)
    assert.ok(css.includes(`color: var(--sirius-${role}-content)`), `${role} soft foreground utility`)
  }
  assert.match(css, /\.rounded\s*\{\s*border-radius: var\(--sirius-radius\)/)
  for (const size of ['2xl', 'full', 'control']) {
    assert.ok(css.includes(`border-radius: var(--sirius-radius-${size})`), `${size} radius utility`)
  }
  assert.match(css, /calc\(var\(--sirius-spacing\) \* 4\)/)
  assert.match(css, /:root\[data-theme=["']?dark/)
  assert.doesNotMatch(css, /@(?:import|theme|custom-variant)\b/)
  assert.doesNotMatch(css, /box-sizing:/)
  assert.doesNotMatch(css, /\.bg-(?:secondary|info)\s*\{/)
})

// Convert palette colors to linear sRGB luminance, clipping out-of-gamut channels.
function luminance(color) {
  let rgb
  if (color.startsWith('#')) {
    const hex = color.slice(1)
    const expanded = hex.length === 3 ? [...hex].map((digit) => digit + digit).join('') : hex
    rgb = expanded.match(/../g).map((pair) => {
      const channel = parseInt(pair, 16) / 255
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
    })
  } else {
    const [, lightness, chroma, hue] = color.match(/^oklch\(([\d.]+)% ([\d.]+) ([\d.]+)\)$/)
    const L = Number(lightness) / 100
    const angle = Number(hue) * Math.PI / 180
    const a = Number(chroma) * Math.cos(angle)
    const b = Number(chroma) * Math.sin(angle)
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
    const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
    const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
    rgb = [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ]
  }
  return rgb.map((value) => Math.max(0, Math.min(1, value)))
    .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0)
}

function resolveTokens(css, accent, background, mode) {
  const tokens = {}
  const selectors = [':root', `[data-sirius-color='${accent}']`, `[data-sirius-background='${background}']`, `[data-theme='${mode}']`]
  for (const [, selector, block] of css.matchAll(/:where\(([^)]+)\)\s*\{([^}]+)\}/g)) {
    if (selector.split(', ').some((item) => selectors.includes(item))) {
      for (const [, key, value] of block.matchAll(/(--sirius-[\w-]+):\s*([^;]+);/g)) tokens[key] = value
    }
  }
  return (name) => {
    let value = tokens[`--sirius-${name}`]
    assert.ok(value, `Missing token: ${name}`)
    for (let depth = 0; value.includes('var(') && depth < 10; depth++) {
      value = value.replace(/var\((--sirius-[\w-]+)\)/g, (_, key) => {
        assert.ok(tokens[key], `Unresolved token: ${key}`)
        return tokens[key]
      })
    }
    return value
  }
}

test('role foreground token pairs retain contrast and fixed status colors in both modes', async () => {
  const css = await readFile(fileURLToPath(import.meta.resolve('@sirius-ui/theme')), 'utf8')
  const tailwind = await readFile(fileURLToPath(import.meta.resolve('tailwindcss/theme.css')), 'utf8')
  const expectedPalette = (color, shade) => tailwind.match(new RegExp(`--color-${color}-${shade}: ([^;]+);`))[1]
  const roles = ['primary', 'warning', 'success', 'danger']

  assert.doesNotMatch(css, /--sirius-(?:on-)?(?:secondary|info)(?:-|:)/)
  assert.doesNotMatch(css, /data-sirius-theme/)

  for (const mode of ['light', 'dark']) {
    const baseline = resolveTokens(css, 'teal', 'mist', mode)
    for (const accent of ['teal', 'emerald', 'cyan', 'indigo', 'pink', 'orange']) {
      for (const background of ['mist', 'slate', 'stone']) {
        const resolve = resolveTokens(css, accent, background, mode)
        const context = `${accent}/${background}/${mode}`
        assert.equal(resolve('control'), mode === 'light' ? '#fff' : `color-mix(in oklab, ${expectedPalette(background, 600)} 80%, transparent)`, `${context} input fill`)
        assert.equal(resolve('control-content'), mode === 'light' ? expectedPalette(background, 950) : '#fff', `${context} input text`)
        assert.equal(resolve('control-line'), expectedPalette(background, 300), `${context} input ring`)
        assert.equal(resolve('control-placeholder'), expectedPalette(background, 400), `${context} placeholder`)
        assert.equal(resolve('control-valid'), expectedPalette('green', 500), `${context} valid input ring`)
        assert.equal(resolve('control-invalid'), expectedPalette('red', 500), `${context} invalid input ring`)
        assert.equal(resolve('control-focus'), expectedPalette(accent, mode === 'light' ? 500 : 400), `${context} input focus`)
        assert.equal(resolve('on-solid'), '#fff', `${context} white solid-button foreground`)
        assert.equal(resolve('primary'), expectedPalette(accent, 400), `${context} primary shade`)
        assert.equal(resolve('canvas'), mode === 'light' ? '#fff' : expectedPalette(background, 700), `${context} background`)
        assert.equal(resolve('surface'), `color-mix(in oklab, ${expectedPalette(background, mode === 'light' ? 200 : 600)} ${mode === 'light' ? 10 : 80}%, transparent)`, `${context} translucent card`)
        assert.equal(resolve('line'), `color-mix(in oklab, ${expectedPalette(background, 400)} 15%, transparent)`, `${context} decorative ring`)
        for (const role of ['warning', 'success', 'danger']) {
          for (const suffix of ['', '-hover', '-active', '-soft', '-content']) {
            assert.equal(resolve(`${role}${suffix}`), baseline(`${role}${suffix}`), `${context} fixed ${role}${suffix}`)
          }
          assert.equal(resolve(`on-${role}`), baseline(`on-${role}`), `${context} fixed foreground`)
        }
        for (const role of roles) {
          for (const [fill, foreground] of [[role, `on-${role}`], [`${role}-hover`, `on-${role}`], [`${role}-active`, `on-${role}`], [`${role}-soft`, `${role}-content`]]) {
            const values = [luminance(resolve(fill)), luminance(resolve(foreground))].sort((a, b) => a - b)
            const ratio = (values[1] + 0.05) / (values[0] + 0.05)
            assert.ok(ratio >= 4.5, `${context} ${fill}/${foreground}: ${ratio.toFixed(2)}:1`)
          }
        }
      }
    }
  }
})
