# Preparing an alpha release

The prepared release uses `0.1.0-alpha.1` for all five libraries, including Auth, with the `alpha` dist-tag. Each package has public access and the npm registry configured in `publishConfig`. The root and all demo apps remain private. The existing `v0.1.0-alpha.0` tag retains its original commit.

## Validate the release

From the repository root, use the supported Node/npm versions and install with Yarn Classic.

1. Run `yarn install --frozen-lockfile`.
2. Run `npm run check`.
3. Run `npm run check:packages`. This builds and packs the libraries, installs their archives in a fresh temporary consumer through Yarn, checks Vue types and a production Vite build, renders public components on the server, and checks local documentation links. The test consumer uses Yarn resolutions to map unpublished internal versions to the packed archives. With a complete Yarn cache, use `npm run check:packages -- --offline`.
4. Inspect the archive paths printed by the check. Each archive includes compiled output, TypeScript declarations where applicable, the license, a README, and the agent documentation bundle. Charts also includes its bar and donut reference files.

Each library's `prepack` runs its build, including documentation generation. Standalone packing is supported from a checkout whose dependencies and library dependencies have already been built. `npm run check:packages` builds packages in dependency order and packs with lifecycle scripts skipped to reuse that output.

The documentation bundle mirrors the catalog, patterns, icon configuration, and package guides from this checkout. Guide links stay local to the bundle. Source and example links use `v<version>` in GitHub, so the corresponding tag must exist when users receive the release.

## Publish the prepared release

Confirm the logged-in npm account can publish under `@sirius-ui`. Scope ownership is an account prerequisite. Record the verified release in a commit and push a `v0.1.0-alpha.1` Git tag for that commit before publishing.

After reviewing the pending changes on main, commit them and create the new annotated tag.

```sh
git add .
git diff --cached
git commit -m "Add auth templates and prepare 0.1.0-alpha.1"
git push origin main
git tag -a v0.1.0-alpha.1 -m "SiriusUI 0.1.0-alpha.1"
git push origin v0.1.0-alpha.1
```

Publish each verified archive from the temporary directory printed by the package check, in dependency order. Replace the example directory below with the actual output directory.

```sh
cd /tmp/sirius-packages-EXAMPLE
npm publish ./sirius-ui-theme-0.1.0-alpha.1.tgz --access public --tag alpha
npm publish ./sirius-ui-vue-0.1.0-alpha.1.tgz --access public --tag alpha
npm publish ./sirius-ui-charts-0.1.0-alpha.1.tgz --access public --tag alpha
npm publish ./sirius-ui-dashboard-0.1.0-alpha.1.tgz --access public --tag alpha
npm publish ./sirius-ui-auth-0.1.0-alpha.1.tgz --access public --tag alpha
```

Publishing archives releases the bytes checked by the consumer test. Complete npm authentication as prompted. Verify each published version and its alpha tag, then install the alpha packages in the independent dashboard trial.

For subsequent releases, update all five library versions and their exact internal dependency versions together. Update the demo dependency versions through Yarn, regenerate the lockfile, refresh release instructions and versioned README links, then repeat verification with a matching Git tag.

[npm package metadata](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/) and [npm pack](https://docs.npmjs.com/cli/v11/commands/npm-pack/) describe the manifest and archive controls used here.
