# Vue development guidelines

Adapted from the user-supplied `vue-best-practices` workflow (vuejs-ai, version 19.1.0, MIT). Apply these guidelines to the Vue library and playground alongside the root AGENTS.md.

## Architecture and ownership

- Use Vue 3 Composition API, TypeScript and `<script setup lang="ts">` unless the project explicitly requires another approach.
- Before non-trivial features or structural refactors, identify responsibilities, state owners, DOM lifecycles and the typed contracts connecting them. Local fixes should preserve existing boundaries unless they obstruct the change.
- Root and route components compose features and coordinate page behavior. Review responsibility boundaries within child components and composables as well.
- Extract substantial separable UI or stateful workflows when doing so hides meaningful complexity. Single-use components and composables are valid. File length and section count are review signals, not extraction thresholds.
- Keep small cohesive implementations together. Avoid catch-all controllers, unrelated handler groups and boundaries that only forward internals. Keep local state and DOM behavior with their UI owner.

## Reactivity and data flow

- Keep one source of truth and minimal source state using ref/reactive. Derive values with computed; use watchers for side effects.
- Avoid expensive repeated calculations in templates. Keep templates declarative and branching or derivation in script when it improves clarity.
- Prefer props down and events up. Use v-model for genuine two-way component contracts.
- Keep props, events, slots and shared context explicit and typed. Use typed, scoped provide/inject when intermediate components merely relay shared descendant dependencies; review boundaries first.
- Give state an explicit owner and lifetime. Shared consumers must use the intended instance; independent components must remain independent.

## Components and composables

- Order SFC sections as script, template, style.
- Use safe template practices: stable unique list keys, no untrusted v-html, and deliberate conditional mounting versus hiding.
- Keep simple component-local behavior local and pure calculations in plain functions.
- Extract substantial stateful behavior into focused composables. A coordinator connects capabilities rather than implementing all of them or exposing every internal detail.
- Return consumer-facing state and actions. Encapsulate reactive bookkeeping and invalidation.
- Keep DOM interaction, listeners, timers and cleanup with their owning UI/component/composable.
- Preserve required coordination, such as committing pending drafts before saving.

## Optional features and performance

- Introduce slots, attribute forwarding, KeepAlive, Teleport, Suspense, transitions, directives, async components, render functions, plugins or shared stores only when the requirement calls for them.
- Choose the simplest animation mechanism matching the required behavior.
- Optimize performance after behavior is correct and verified. Use virtualization, memoization, lazy loading or other optimization in response to an actual need.

## Review before finishing

- Verify behavior, minimal predictable reactivity, explicit typed contracts and appropriate SFC structure.
- Review both sides of component boundaries: avoid concentrating unrelated responsibilities and avoid extractions that merely forward dependencies.
- Trace a representative change: it should stay with its UI/workflow and legitimate coordination.
- Verify state lifetime, independent instances and cleanup of side effects.
- Preserve pending work and cross-feature behavior during refactors. Smaller APIs or files alone do not demonstrate correctness.
- Run the repository's applicable checks; document public APIs and material limitations.

## Installed workflow and references

The complete [vue-best-practices workflow](../.agents/skills/vue-best-practices/SKILL.md) is installed in the repository. Read it before Vue implementation along with its required core references:

- [Reactivity](../.agents/skills/vue-best-practices/references/reactivity.md)
- [SFC structure](../.agents/skills/vue-best-practices/references/sfc.md)
- [Component data flow](../.agents/skills/vue-best-practices/references/component-data-flow.md)
- [Composables](../.agents/skills/vue-best-practices/references/composables.md)

Optional references linked by the workflow are also installed; read them when their topics apply. This document is a summary, not a substitute for those references. Keep the repository's theme/package/CSS export conventions when applying general Vue guidance.
