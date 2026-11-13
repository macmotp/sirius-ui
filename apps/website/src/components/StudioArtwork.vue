<script setup lang="ts">
import type { StudioProject } from '../data'
defineProps<{ project: StudioProject }>()
</script>

<template>
  <div role="img" :aria-label="project.artLabel" class="studio-art" :class="`studio-art-${project.id}`">
    <div v-if="project.id === 'fieldwork'" aria-hidden="true" class="fieldwork-scene">
      <span class="art-edition">EVERYDAY, NATURALLY.</span>
      <span class="fieldwork-wordmark">fieldwork.</span>
      <div class="fieldwork-disc"></div>
      <div class="bottle bottle-one"><div class="bottle-cap"></div><span>fieldwork.</span><small>DAILY CARE<br />ROOTED IN NATURE</small></div>
      <div class="bottle bottle-two"><div class="bottle-cap"></div><span>fieldwork.</span><small>THE EVERYDAY<br />MOISTURISER</small></div>
      <div class="bottle bottle-three"><div class="bottle-cap"></div><span>fieldwork.</span><small>KEEP IT SIMPLE.</small></div>
      <span class="art-caption">A SMALL RITUAL. A GOOD DAY.</span>
    </div>
    <div v-else-if="project.id === 'orbit'" aria-hidden="true" class="orbit-scene">
      <span class="art-edition">SPACE FOR YOUR BEST WORK.</span>
      <div class="orbit-window">
        <div class="orbit-rail"><strong>◉</strong><span>⌂</span><span>☷</span><span>◷</span><span>⊕</span></div>
        <div class="orbit-content"><div class="orbit-top"><b>Good morning, Alex.</b><span>↗</span></div><p>LET’S MAKE TODAY A GOOD ONE.</p><div class="orbit-metrics"><div><small>In progress</small><strong>12</strong></div><div><small>Completed</small><strong>38</strong></div><div><small>Team members</small><strong>8</strong></div></div><div class="orbit-chart"><div><b>A little progress, every day</b><span>This week</span></div><svg viewBox="0 0 300 90" fill="none"><path d="M0 75H300M0 45H300M0 15H300" stroke="#e9e9f2" /><path d="M0 72C25 72 30 40 55 43S85 60 110 35S140 42 170 23S200 35 230 17S270 28 300 5" stroke="#7466ba" stroke-width="3" stroke-linecap="round" /></svg></div><div class="orbit-task"><span></span>Website exploration <small>In progress</small></div><div class="orbit-task"><span></span>Identity presentation <small>Tomorrow</small></div></div>
      </div>
      <span class="art-caption">ORBIT / PRODUCT DESIGN</span>
    </div>
    <div v-else-if="project.id === 'forma'" aria-hidden="true" class="forma-scene">
      <span class="art-edition">ISSUE 04 / A JOURNAL OF NEW PERSPECTIVES</span>
      <div class="forma-cover"><span class="forma-name">forma</span><span class="forma-kicker">ART. CULTURE. EVERYDAY LIFE.</span><div class="forma-circle"></div><span class="forma-story">The shape<br />of things<br /><i>to come.</i></span><span class="forma-issue">VOL. 04<br />2025</span></div>
      <span class="art-caption">A DIFFERENT WAY OF SEEING.</span>
    </div>
    <div v-else aria-hidden="true" class="northline-scene">
      <span class="art-edition">ARCHITECTURE WITH A SENSE OF PLACE</span>
      <div class="northline-poster"><div class="northline-symbol"><i></i><i></i><i></i></div><strong>NORTHLINE</strong><span>SPACES FOR LIVING.</span></div>
      <span class="art-caption">NORTHLINE / IDENTITY STUDY</span>
    </div>
  </div>
</template>

<style scoped>
.studio-art { position: relative; width: 100%; height: 100%; overflow: hidden; container-type: inline-size; }
.studio-art-fieldwork { background: #d7e1cd; color: #294c3d; }
.studio-art-orbit { background: #e4e0f1; color: #403a60; }
.studio-art-forma { background: #edddd0; color: #542f24; }
.studio-art-northline { background: #e8e3d9; color: #263b4c; }
.fieldwork-scene, .orbit-scene, .forma-scene, .northline-scene { position: absolute; inset: 0; }
.art-edition, .art-caption { position: absolute; inset-inline: 8%; font-size: 1.45cqw; font-weight: 500; letter-spacing: .12em; }
.art-edition { top: 7%; }
.art-caption { bottom: 7%; }
.fieldwork-wordmark { position: absolute; top: 13%; left: 8%; z-index: 2; font-size: 9cqw; font-weight: 600; letter-spacing: -.075em; }
.fieldwork-disc { position: absolute; width: 57%; aspect-ratio: 1; border-radius: 50%; background: #b8caaa; right: 5%; top: 18%; }
.bottle { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 23%; height: 41%; border-radius: 9% 9% 12% 12%; background: #f5f1e6; box-shadow: 1.5cqw 2cqw 3cqw #294c3d20; }
.bottle-cap { position: absolute; inset: -8% 0 auto; height: 11%; border-radius: 20% 20% 0 0; background: #e5dfd0; }
.bottle span { font-size: 3.1cqw; font-weight: 600; letter-spacing: -.07em; }
.bottle small { margin-top: 10%; font-size: 1cqw; line-height: 1.7; letter-spacing: .09em; text-align: center; }
.bottle-one { left: 15%; top: 43%; transform: rotate(-11deg); }
.bottle-two { left: 43%; top: 34%; transform: rotate(5deg); }
.bottle-three { left: 68%; top: 49%; width: 20%; height: 30%; transform: rotate(13deg); }
.orbit-window { position: absolute; inset: 19% 7% 16%; display: grid; grid-template-columns: 10% 1fr; overflow: hidden; border-radius: 1.8cqw; background: #fcfcff; box-shadow: 0 2cqw 4cqw #403a6025; transform: rotate(-3deg); }
.orbit-rail { display: flex; flex-direction: column; align-items: center; gap: 3cqw; padding-top: 3cqw; border-right: 1px solid #ededf5; color: #8c83ad; font-size: 2.2cqw; }
.orbit-rail strong { font-size: 3.2cqw; color: #7466ba; }
.orbit-content { padding: 3.5cqw; }
.orbit-top { display: flex; justify-content: space-between; font-size: 3cqw; letter-spacing: -.04em; }
.orbit-content > p { margin: 1cqw 0 3cqw; font-size: .95cqw; letter-spacing: .06em; color: #77728b; }
.orbit-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2cqw; }
.orbit-metrics div { padding: 1.8cqw; border: 1px solid #e9e7f2; border-radius: 1.2cqw; }
.orbit-metrics small { display: block; font-size: 1.3cqw; color: #77728b; }
.orbit-metrics strong { display: block; margin-top: .5cqw; font-size: 4cqw; letter-spacing: -.05em; }
.orbit-chart { margin-top: 2.5cqw; padding: 2cqw; border: 1px solid #e9e7f2; border-radius: 1.2cqw; }
.orbit-chart div { display: flex; justify-content: space-between; font-size: 1.3cqw; }
.orbit-chart div span { color: #77728b; }
.orbit-chart svg { display: block; width: 100%; height: 13cqw; margin-top: 2cqw; }
.orbit-task { display: flex; align-items: center; gap: 1cqw; padding-top: 2cqw; font-size: 1.3cqw; }
.orbit-task > span { width: 1.2cqw; height: 1.2cqw; border: 1px solid #c5bfd9; border-radius: 50%; }
.orbit-task small { margin-left: auto; color: #77728b; font-size: 1.1cqw; }
.forma-cover { position: absolute; inset: 16% 22% 11%; overflow: hidden; background: #f6e7d6; box-shadow: 1.5cqw 2cqw 4cqw #542f2425; transform: rotate(6deg); }
.forma-name { position: absolute; top: -5%; left: 7%; font: 19cqw/.95 Georgia, serif; letter-spacing: -.08em; }
.forma-kicker { position: absolute; top: 24%; left: 9%; font-size: 1.1cqw; letter-spacing: .1em; }
.forma-circle { position: absolute; width: 92%; aspect-ratio: 1; top: 37%; left: 35%; border-radius: 50%; background: #b65338; }
.forma-story { position: absolute; top: 39%; left: 9%; font: 6cqw/.95 Georgia, serif; color: #542f24; letter-spacing: -.04em; }
.forma-issue { position: absolute; bottom: 7%; left: 9%; font-size: 1.1cqw; line-height: 1.6; letter-spacing: .1em; }
.northline-poster { position: absolute; inset: 17% 19% 15%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f5f1e7; box-shadow: 1.5cqw 2cqw 4cqw #263b4c20; transform: rotate(-5deg); }
.northline-symbol { display: flex; gap: 2cqw; align-items: center; margin-bottom: 6cqw; }
.northline-symbol i { display: block; width: 5cqw; height: 22cqw; background: #263b4c; }
.northline-symbol i:nth-child(2) { transform: skew(24deg); height: 22cqw; }
.northline-poster strong { font-size: 4cqw; font-weight: 500; letter-spacing: .18em; }
.northline-poster > span { margin-top: 2cqw; font-size: 1.2cqw; letter-spacing: .16em; }
</style>
