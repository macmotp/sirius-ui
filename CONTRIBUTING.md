# Contributing to SiriusUI

SiriusUI is an early-stage design system built around reusable CSS tokens and Vue components. Small changes grounded in a real interface are welcome.

## Local setup

Use Node.js 22.12 or newer in the Node 22 line, or Node.js 24 or newer, with npm 10+ and Yarn Classic 1.x. The repository currently tracks `yarn.lock`.

From the repository root:

```sh
yarn install --frozen-lockfile
npm run dev
```

Open the URL printed by Vite, normally `http://127.0.0.1:5173`. Package source changes update the playground live. npm runs the existing workspace scripts; dependency installation and lockfile updates use Yarn.

## Where changes belong

| Location | Responsibility |
| --- | --- |
| `packages/theme/src/index.css` | Plain CSS palettes, runtime tokens, and light/dark values |
| `packages/theme/src/tailwind.css` | Tailwind utility mappings and the document dark variant |
| `packages/vue/src` | Shared Vue components and composables |
| `apps/playground/src` | Interactive demonstrations and app-specific overrides |
| `docs/architecture.md` | Package boundaries and architectural decisions |

Read [AGENTS.md](AGENTS.md) for implementation conventions and [the theme guide](packages/theme/readme.md) for the token API.

## Making a change

1. Describe the concrete interface or behavior the change supports. Discuss broad API or architecture changes in an issue before investing in a large implementation.
2. Implement the smallest reusable API that supports the use case. Keep application business logic outside the packages.
3. Update the playground to demonstrate visible behavior, variants, and relevant states.
4. Update the relevant package documentation and add focused tests where they protect behavior or integration.
5. Run `npm run check` and review the diff for generated or unrelated files.

For dependency changes, use Yarn from the root and include the resulting `yarn.lock` update. Keep a single root lockfile. Do not edit it manually.

## Verification

```sh
npm run check
```

This runs type checks, builds both packages and the playground, and tests CSS exports, Tailwind integration, and built-component behavior. More targeted commands are listed in [the README](readme.md#getting-started).

For visible changes, also check the playground at narrow and wide widths, in light and dark modes, and with the accent and background palette options. Verify that status colors remain fixed while changing accents and backgrounds. Use the keyboard to reach and operate interactive controls. Check long content, disabled states, labels, focus indicators, and relevant status announcements.

There is no automated browser test suite yet. Report the actual validation performed and any limitations. Documentation-only changes can be verified by checking links, paths, commands, and formatting.

## Pull requests

Explain the problem and the resulting behavior. Include relevant validation and screenshots for visible changes. Call out public API changes and migration needs. Avoid including generated builds, local preferences, credentials, or unrelated cleanup.

## Project status

SiriusUI uses the [MIT License](LICENSE). Contributions are provided under the same license. Preserve the copyright and license notices; keep package license files consistent with the root license.

Packages are currently marked private to prevent accidental publication. There is no release process yet. Do not publish packages as part of an unrelated change.
