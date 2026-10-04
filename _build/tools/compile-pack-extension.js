#!/usr/bin/env node
/* Keeper Playbook — _build/tools/compile-pack-extension.js
   Pack folder in, Pi Durable extension out. Contract: _build/COMPILE-SPEC.md (ADR 0005).

   Usage: node _build/tools/compile-pack-extension.js [--out node/generated]

   Reads packs/registry.js, loads every published pack (latest version per id), and writes
     node/generated/playbook-core.ts      shared document, appendEvent, journey section, keeperIdOf
     node/generated/pack-<id>.ts          one extension per pack: sections + tools
     node/generated/example-harness.ts    MemoryStorage + faux provider proof that the compile is real
   The generated files are never hand-edited. The pack folder is the only authored artifact. */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

/* ---------------- loading (same files the browser loads, without a browser) ---------------- */

function loadBrowserScript(file, win) {
  // Pack/registry/levels files are `window.KP = window.KP || {}` scripts. Give them a window.
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  new Function('window', src)(win);
}

function loadPacks() {
  const win = { KP: { packs: [] } };
  loadBrowserScript('packs/registry.js', win);
  loadBrowserScript('levels.js', win);
  const registry = win.KP.registry;
  if (!Array.isArray(registry) || !registry.length) throw new Error('packs/registry.js has no entries');
  for (const entry of registry) {
    if (!entry.id || !entry.version || !entry.path) throw new Error('registry entry missing id/version/path: ' + JSON.stringify(entry));
    const before = win.KP.packs.length;
    loadBrowserScript(entry.path, win);
    const pack = win.KP.packs[before];
    if (!pack || win.KP.packs.length !== before + 1) throw new Error(entry.path + ' did not push exactly one pack');
    if (pack.id !== entry.id || pack.version !== entry.version) {
      throw new Error(entry.path + ' declares ' + pack.id + '@' + pack.version + ' but registry says ' + entry.id + '@' + entry.version);
    }
  }
  const journey = require(path.join(ROOT, 'runtime', 'journey.js'));
  return { registry, levels: win.KP.levels, packs: win.KP.packs, latest: journey.latestPacks(win.KP.packs) };
}

/* ---------------- text helpers ---------------- */

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rarr: '→', larr: '←', mdash: '—', ndash: '–', hellip: '…', times: '×' };
function stripHtml(html) {
  return String(html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|h[1-6]|div|blockquote)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, code) => {
      if (code[0] === '#') return String.fromCodePoint(parseInt(code[1] === 'x' ? code.slice(2) : code.slice(1), code[1] === 'x' ? 16 : 10));
      return ENTITIES[code.toLowerCase()] !== undefined ? ENTITIES[code.toLowerCase()] : m;
    })
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
function s(v) { return JSON.stringify(String(v === undefined || v === null ? '' : v)); }
function ident(packId) { return packId.replace(/[^a-zA-Z0-9]+(.)?/g, (_, c) => (c ? c.toUpperCase() : '')); }
function pascal(packId) { const i = ident(packId); return i[0].toUpperCase() + i.slice(1); }
// Tool names must be stable and model-friendly: letters, digits, underscore, hyphen.
function toolName(prefix, packId) { return prefix + '_' + packId; }
// Pi Durable section keys must match /^[a-z][a-z0-9_-]*$/ (durable/src/harness/registry.ts), so the spec's
// `pack:<id>` / `playbook:journey` are emitted as `pack-<id>` / `playbook-journey`. Extension and tool names are free.
function sectionKey(...parts) { return parts.join('-').toLowerCase().replace(/[^a-z0-9_-]+/g, '-'); }
function tsString(text) { return JSON.stringify(text); }

/* ---------------- what a pack contributes ---------------- */

const CLIENT_ONLY = { quiz: 1, tree: 1, simulator: 1, pitch: 1, calls: 1, checklist: 1, ladder: 1 };
const PRESENTATIONAL = { prose: 1, loop: 1, cards: 1, tabs: 1, phases: 1, vocab: 1, quote: 1, callout: 1 };

function blockText(block) {
  // Presentational blocks → plain teaching text. Keeps titles so the agent can quote the lesson.
  switch (block.type) {
    case 'prose': return stripHtml(block.html);
    case 'callout': return (block.title ? block.title + ': ' : '') + stripHtml(block.html);
    case 'quote': return '"' + stripHtml(block.text) + '"' + (block.attribution ? ' — ' + stripHtml(block.attribution) : '');
    case 'loop': return (block.title ? block.title + '\n' : '') + (block.steps || []).map((st, i) => (i + 1) + '. ' + (typeof st === 'string' ? stripHtml(st) : itemText(st))).join('\n');
    case 'cards': case 'phases': case 'vocab': case 'tabs':
      return (block.title ? block.title + '\n' : '') + (block.items || []).map((it) => '- ' + (typeof it === 'string' ? stripHtml(it) : itemText(it))).join('\n');
    default: return '';
  }
}
const HEAD_KEYS = ['title', 'name', 'word', 'term', 'label'];
// Any item object: head field, then every other string field as "key: text" (so phases' where/see/do and vocab's when survive).
function itemText(it) {
  const head = HEAD_KEYS.map((k) => it[k]).find((v) => typeof v === 'string');
  const parts = [];
  for (const k of Object.keys(it)) {
    if (HEAD_KEYS.includes(k) && it[k] === head) continue;
    const v = it[k];
    if (typeof v === 'string') parts.push((k === 'text' || k === 'html' || k === 'body' || k === 'meaning') ? stripHtml(v) : k + ': ' + stripHtml(v));
    else if (Array.isArray(v) && v.every((x) => typeof x === 'string')) parts.push(k + ': ' + v.map(stripHtml).join('; '));
  }
  return (head ? head + (parts.length ? ' — ' : '') : '') + parts.join(' · ');
}

function sectionAnchor(packId, sectionId, blockId) { return '#s/' + packId + '/' + sectionId + (blockId ? '/' + blockId : ''); }

function describeClientBlock(pack, section, block) {
  const link = sectionAnchor(pack.id, section.id, block.id);
  switch (block.type) {
    case 'quiz': return 'quiz "' + (block.title || block.id) + '" (' + (block.items || []).length + ' questions) → ' + link;
    case 'checklist': return 'checklist "' + (block.title || block.id) + '" (' + (block.items || []).length + ' items) → ' + link;
    case 'tree': return 'decision tree "' + (block.title || block.id) + '" → ' + link;
    case 'pitch': return 'pitch diagram "' + (block.title || block.id) + '" → ' + link;
    case 'calls': return 'call sheet "' + (block.title || block.id) + '" → ' + link;
    case 'ladder': return 'understanding ladder "' + (block.title || block.id) + '" → ' + link;
    case 'simulator': {
      const set = block.set;
      const scenarios = pack.sets && pack.sets[set] && pack.sets[set].scenarios ? pack.sets[set].scenarios.map((sc) => sc.id) : null;
      const ref = pack.sets && pack.sets[set] && pack.sets[set].ref;
      return 'simulator set "' + set + '"' + (ref ? ' (shared with ' + ref + ')' : '') + ' → ' + sectionAnchor(pack.id, section.id) +
        (scenarios && scenarios.length ? '; a single play: ' + sectionAnchor(pack.id, section.id) + '?scenario=<id> with ids ' + scenarios.join(', ') : '');
    }
    default: return block.type + ' → ' + link;
  }
}

function collect(pack) {
  const out = { teaching: [], client: [], fieldTasks: [], drills: [], reviews: [], fieldBlocks: [], drillBlocks: [], unknownBlocks: [] };
  for (const section of pack.sections || []) {
    const lines = [];
    for (const block of section.blocks || []) {
      if (PRESENTATIONAL[block.type]) { const t = blockText(block); if (t) lines.push(t); }
      else if (CLIENT_ONLY[block.type]) out.client.push(describeClientBlock(pack, section, block));
      else if (block.type === 'field') {
        out.fieldBlocks.push({ section: section.id, id: block.id, title: block.title, intro: block.intro });
        for (const t of block.tasks || []) out.fieldTasks.push({ section: section.id, block: block.id, ...t });
      } else if (block.type === 'drill') {
        out.drillBlocks.push({ section: section.id, id: block.id, title: block.title, intro: block.intro });
        for (const d of block.drills || []) out.drills.push({ section: section.id, block: block.id, ...d });
      } else if (block.type === 'review') out.reviews.push({ section: section.id, ...block });
      else out.unknownBlocks.push(section.id + ':' + block.type);
    }
    out.teaching.push({ id: section.id, title: section.title, kicker: section.kicker, lede: section.lede, text: lines.join('\n\n') });
  }
  return out;
}

/* ---------------- emitters ---------------- */

const HEADER = (what) => `// GENERATED by _build/tools/compile-pack-extension.js — do not edit.
// ${what}
// Contract: _build/COMPILE-SPEC.md. Authoring lives in packs/<id>/<version>/pack.js.
`;

function emitCore(data) {
  const packImports = data.latest.map((p) => `\t{ id: ${s(p.id)}, version: ${s(p.version)}, path: ${s(data.registry.find((r) => r.id === p.id && r.version === p.version).path)} },`).join('\n');
  return HEADER('Shared core: the keeper progress document, appendEvent, the journey section.') + `
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Context, JsonValue } from "@earendil-works/chord";
import type { JsonObject, PromptInput, Tx } from "@earendil-works/pi-durable";
import { defineDocFamily, section } from "@earendil-works/pi-durable";

/* ---------- the event log (same schema as the browser, ADR 0001) ---------- */

export type Event = {
	v: 1;
	t: string;
	type: string;
	pack: string | null;
	packVersion: string | null;
	[key: string]: JsonValue;
};
export type Progress = { v: 1; events: Event[] };

/** One document per keeper, keyed by the keeper's identity id. */
export const KeeperProgress = defineDocFamily<Progress, string>({
	kind: "gc.keeper.progress",
	version: 1,
	scope: "session",
	family: true,
	initial: () => ({ v: 1, events: [] }),
});

const SCHEMA = 1;
const RESERVED = new Set(["v", "t", "type", "pack", "packVersion"]);
let lastStamp = "";

/**
 * Stamp an event exactly like runtime/progress.js stamp() does in the browser, with one node-side
 * guard: \`t\` is strictly increasing within this process. runtime/journey.js keys live field/drill
 * entries by \`t\`, so two events appended in the same commit (same millisecond) would otherwise
 * collapse into one. The browser never produces two events in one tick; a tool or seed can.
 */
export function stamp(type: string, payload: JsonObject, ctx: { pack: string | null; packVersion: string | null }): Event {
	let t = new Date().toISOString();
	if (t <= lastStamp) t = new Date(Date.parse(lastStamp) + 1).toISOString();
	lastStamp = t;
	const event: Event = {
		v: SCHEMA,
		t,
		type: String(type),
		pack: ctx.pack ? String(ctx.pack) : null,
		packVersion: ctx.packVersion ? String(ctx.packVersion) : null,
	};
	for (const key of Object.keys(payload)) if (!RESERVED.has(key)) event[key] = payload[key];
	return event;
}

/** Append one stamped event to a keeper's document inside a commit. */
export async function appendEvent(
	tx: Tx,
	keeperId: string,
	type: string,
	payload: JsonObject,
	ctx: { pack: string | null; packVersion: string | null },
): Promise<Event> {
	const event = stamp(type, payload, ctx);
	const doc = await tx.doc(KeeperProgress, keeperId, keeperId);
	doc.events.push(event);
	return event;
}

/* ---------- keeper identity ---------- */

/**
 * Which keeper this conversation is about. ADR 0005 leaves authentication open, so this reads
 * the conversation's own agent instructions for a line of the form \`keeperId: <id>\` and otherwise
 * falls back to the conversation id. TODO(node): replace with the node's identity model once it exists.
 */
export function keeperIdOf(input: { readonly conversationId: number; readonly agent: { readonly instructions?: string } }): string {
	const match = /(?:^|\\n)\\s*keeperId:\\s*(\\S+)/.exec(input.agent.instructions ?? "");
	return match ? match[1] : \`conversation:\${input.conversationId}\`;
}

/* ---------- the pack catalogue and journey (same code as the browser) ---------- */

type Pack = { id: string; version: string; level: string; title: string; promise?: string; sections: { id: string; title: string }[]; gates: unknown[] };
type Level = { id: string; n: number; name: string; question: string };
type Gate = { type: string; label: string; pass: boolean; have: number; need: number; group: "pitch" | "playbook" };
type JourneyPack = {
	id: string; version: string; levelId: string; levelName: string; title: string; promise: string;
	gates: Gate[]; gatesPassed: number; gateCount: number; state: "complete" | "open" | "locked";
	nextStep: { section: string; block: string | null; why: "field" | "section" } | null;
};
type Journey = { levels: { id: string; name: string; question: string; unlocked: boolean; complete: boolean; packs: JourneyPack[] }[]; current: JourneyPack | null; progress: { completed: number; published: number; pct: number } };

const require = createRequire(import.meta.url);
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const journeyModule = require(resolve(REPO_ROOT, "runtime/journey.js")) as { computeJourney(events: Event[], levels: Level[], packs: Pack[]): Journey };

type BrowserScriptWindow = { KP: { packs: Pack[]; levels?: Level[]; registry?: unknown } };
function loadBrowserScript(file: string, win: BrowserScriptWindow): void {
	const source = readFileSync(resolve(REPO_ROOT, file), "utf8");
	new Function("window", source)(win);
}

/** Published packs at compile time (registry order). The node loads the same files the browser does. */
export const PUBLISHED: readonly { id: string; version: string; path: string }[] = [
${packImports}
];

const catalogue: BrowserScriptWindow = { KP: { packs: [] } };
loadBrowserScript("levels.js", catalogue);
for (const entry of PUBLISHED) loadBrowserScript(entry.path, catalogue);
export const levels: Level[] = catalogue.KP.levels ?? [];
export const packs: Pack[] = catalogue.KP.packs;
export function packById(id: string): Pack | undefined {
	return packs.find((p) => p.id === id);
}

export function computeJourney(events: Event[]): Journey {
	return journeyModule.computeJourney(events, levels, packs);
}

/** Events for one keeper, or an empty log when the document does not exist yet. */
export async function eventsOf(read: PromptInput["read"], keeperId: string, context: Context): Promise<Event[]> {
	const doc = await read.snapshot(KeeperProgress, keeperId, context);
	return doc === undefined ? [] : [...doc.events];
}

/* ---------- the journey section: this is why the agent is pack-guided ---------- */

function gateLine(gate: Gate): string {
	return \`  [\${gate.pass ? "met" : "unmet"}] \${gate.label} (\${gate.have}/\${gate.need}, \${gate.group})\`;
}

export function renderJourney(events: Event[]): string {
	const journey = computeJourney(events);
	const lines: string[] = [];
	const current = journey.current;
	lines.push(\`progress: \${journey.progress.completed}/\${journey.progress.published} packs complete\`);
	for (const level of journey.levels) {
		if (level.packs.length === 0) continue;
		lines.push(\`level \${level.id} \${level.name} — "\${level.question}" — \${level.complete ? "complete" : level.unlocked ? "unlocked" : "locked"}\`);
		for (const pack of level.packs) {
			lines.push(\`  pack \${pack.id}@\${pack.version} "\${pack.title}" — \${pack.state} (\${pack.gatesPassed}/\${pack.gateCount} gates)\`);
		}
	}
	if (current) {
		lines.push("");
		lines.push(\`current pack: \${current.id} "\${current.title}" — \${current.promise}\`);
		lines.push("gates:");
		for (const gate of current.gates) lines.push(gateLine(gate));
		if (current.nextStep) {
			const where = \`#s/\${current.id}/\${current.nextStep.section}\${current.nextStep.block ? \`/\${current.nextStep.block}\` : ""}\`;
			lines.push(\`next step: \${current.nextStep.why === "field" ? "field work (real-world evidence comes first)" : "reading"} → \${where}\`);
		}
	}
	return lines.join("\\n");
}

export const journeySection = section(${s(sectionKey('playbook', 'journey'))}, async (input, context) => {
	const keeperId = keeperIdOf(input);
	return renderJourney(await eventsOf(input.read, keeperId, context));
});

/** Is \`packId\` the keeper's current pack, or explicitly selected via \`playbook.packs: a,b\` in the instructions? */
export function packIsActive(input: PromptInput, events: Event[], packId: string): boolean {
	const selected = /(?:^|\\n)\\s*playbook\\.packs:\\s*([^\\n]+)/.exec(input.agent.instructions ?? "");
	if (selected) return selected[1].split(/[,\\s]+/).includes(packId);
	const journey = computeJourney(events);
	return journey.current?.id === packId;
}
`;
}

function fieldTaskLines(tasks) {
  return tasks.map((t) => `- ${t.id} (${t.kind}, ${t.when}): ${stripHtml(t.text)}\n  why: ${stripHtml(t.why)}\n  ask: ${stripHtml(t.prompt)}`).join('\n');
}
function drillLines(drills) {
  return drills.map((d) => `- ${d.id} "${d.name}" (${d.mode}${d.minutes ? ', ' + d.minutes + ' min' : ''})\n  setup: ${stripHtml(d.setup)}\n  steps: ${(d.steps || []).map(stripHtml).join(' / ')}\n  focus: ${stripHtml(d.focus)}\n  game link: ${stripHtml(d.gameLink)}`).join('\n');
}

function emitPack(pack, data) {
  const c = collect(pack);
  const P = pascal(pack.id);
  const requires = JSON.stringify(pack.requires || {});
  const teaching = [
    `${pack.title} (${pack.tag || pack.id}, level ${pack.level}, version ${pack.version})`,
    pack.promise ? `Promise: ${stripHtml(pack.promise)}` : '',
    '',
    ...c.teaching.map((sec) => `## ${sec.title}${sec.kicker ? ' — ' + sec.kicker : ''}\n${sec.lede ? stripHtml(sec.lede) + '\n' : ''}${sec.text ? '\n' + sec.text : ''}`),
  ].filter((x, i) => i < 2 ? x !== '' : true).join('\n');
  const client = c.client.length
    ? `Visuals on the site (client-only; decisions made there arrive as events in the shared document, not through a tool):\n${c.client.map((l) => '- ' + l).join('\n')}`
    : '';
  const field = [
    c.fieldTasks.length ? `Field tasks (${c.fieldBlocks.map((b) => sectionAnchor(pack.id, b.section, b.id)).join(', ')}). Check-ins are honest self-reports; no proof, no policing.\n${fieldTaskLines(c.fieldTasks)}` : '',
    c.drills.length ? `Drills (${c.drillBlocks.map((b) => sectionAnchor(pack.id, b.section, b.id)).join(', ')}):\n${drillLines(c.drills)}` : '',
    ...c.reviews.map((r) => `Review "${r.title}" (${r.id}) → ${sectionAnchor(pack.id, r.section, r.id)}. Prompts:\n${(r.prompts || []).map((p, i) => `  ${i + 1}. ${stripHtml(p)}`).join('\n')}`),
  ].filter(Boolean).join('\n\n');

  const taskIds = c.fieldTasks.map((t) => t.id);
  const drillIds = c.drills.map((d) => d.id);
  const reviewIds = c.reviews.map((r) => r.id);
  const tools = [];

  if (taskIds.length) tools.push(`
export const checkinTool = defineTool({
	name: ${s(toolName('checkin', pack.id))},
	description: ${s(`Record a field check-in for the ${pack.title} pack after a session or match. One check-in per task per date. Tasks: ${taskIds.join(', ')}.`)},
	parameters: Type.Object({
		task: Type.Union([${taskIds.map((id) => `Type.Literal(${s(id)})`).join(', ')}]),
		date: Type.String({ description: "ISO date (YYYY-MM-DD) of the session or match" }),
		done: Type.Union([Type.Literal("yes"), Type.Literal("partly"), Type.Literal("no")]),
		notes: Type.Optional(Type.String()),
	}),
	execute: async (args, api, context) => {
		const keeperId = keeperIdOf({ conversationId: api.conversationId, agent: await api.agent(context) });
		const event = await api.commit((tx) => appendEvent(tx, keeperId, "field.checkin", { task: args.task, date: args.date, done: args.done, notes: args.notes ?? "" }, CTX), context);
		return { content: [{ type: "text", text: \`recorded field.checkin \${args.task} \${args.date} \${args.done} (t=\${event.t})\` }] };
	},
});`);

  if (drillIds.length) tools.push(`
export const logDrillTool = defineTool({
	name: ${s(toolName('log_drill', pack.id))},
	description: ${s(`Log a drill session for the ${pack.title} pack. Drills: ${drillIds.join(', ')}. Rating 1-5 is the keeper's own feel.`)},
	parameters: Type.Object({
		drill: Type.Union([${drillIds.map((id) => `Type.Literal(${s(id)})`).join(', ')}]),
		date: Type.String({ description: "ISO date (YYYY-MM-DD)" }),
		rating: Type.Integer({ minimum: 1, maximum: 5 }),
		notes: Type.Optional(Type.String()),
	}),
	execute: async (args, api, context) => {
		const keeperId = keeperIdOf({ conversationId: api.conversationId, agent: await api.agent(context) });
		const event = await api.commit((tx) => appendEvent(tx, keeperId, "drill.logged", { drill: args.drill, date: args.date, rating: args.rating, notes: args.notes ?? "" }, CTX), context);
		return { content: [{ type: "text", text: \`recorded drill.logged \${args.drill} \${args.date} rating \${args.rating} (t=\${event.t})\` }] };
	},
});`);

  if (reviewIds.length) tools.push(`
export const saveReviewTool = defineTool({
	name: ${s(toolName('save_review', pack.id))},
	description: ${s(`Save a post-match self-review for the ${pack.title} pack. Reviews: ${reviewIds.join(', ')}. One answer per prompt, in prompt order.`)},
	parameters: Type.Object({
		review: Type.Union([${reviewIds.map((id) => `Type.Literal(${s(id)})`).join(', ')}]),
		date: Type.String({ description: "ISO date (YYYY-MM-DD) of the match" }),
		answers: Type.Array(Type.String()),
	}),
	execute: async (args, api, context) => {
		const keeperId = keeperIdOf({ conversationId: api.conversationId, agent: await api.agent(context) });
		const id = \`r\${Date.now().toString(36)}\${Math.random().toString(36).slice(2, 7)}\`;
		const event = await api.commit((tx) => appendEvent(tx, keeperId, "review.saved", { review: args.review, entry: { id, date: args.date, answers: args.answers } }, CTX), context);
		return { content: [{ type: "text", text: \`recorded review.saved \${args.review} \${args.date} id \${id} (t=\${event.t})\` }] };
	},
});`);

  const toolNames = [taskIds.length && 'checkinTool', drillIds.length && 'logDrillTool', reviewIds.length && 'saveReviewTool'].filter(Boolean);
  const typeImport = toolNames.length ? 'import { Type } from "@earendil-works/pi-ai";\n' : '';
  const defineToolImport = toolNames.length ? ', defineTool' : '';

  return HEADER(`Pack extension: ${pack.id}@${pack.version} (level ${pack.level}).`) + `// requires (capability majors, checked at install by installPlaybook): ${requires}
${typeImport}import { defineExtension${defineToolImport}, section } from "@earendil-works/pi-durable";
import { appendEvent, eventsOf, keeperIdOf, packIsActive } from "./playbook-core.ts";

export const PACK_ID = ${s(pack.id)};
export const PACK_VERSION = ${s(pack.version)};
export const REQUIRES: Readonly<Record<string, string>> = ${requires};
const CTX = { pack: PACK_ID, packVersion: PACK_VERSION };

const TEACHING = ${tsString(teaching)};
const CLIENT = ${tsString(client)};
const FIELD = ${tsString(field)};
${tools.join('\n')}

// TODO(node): attention tasks. Each field task with when:'session'|'match' is a candidate durable
// task ("at your next session, notice…"); scheduling policy belongs to the node, so the compiler
// only names the hook. Shape when it exists:
//   defineTask({ name: "playbook:${pack.id}:attention", ... })  — input { keeperId, task, when }, timer → ask via the conversation.

/** The pack's teaching, rendered when this is the keeper's current pack or it is selected. */
export const teachingSection = section(${s(sectionKey('pack', pack.id))}, async (input, context) => {
	const events = await eventsOf(input.read, keeperIdOf(input), context);
	if (!packIsActive(input, events, PACK_ID)) return undefined;
	return CLIENT ? \`\${TEACHING}\\n\\n\${CLIENT}\` : TEACHING;
});

/** Open field work for this pack: what the agent can ask about after a session or match. */
export const fieldSection = section(${s(sectionKey('pack', pack.id, 'field'))}, async (input, context) => {
	const events = await eventsOf(input.read, keeperIdOf(input), context);
	if (!FIELD || !packIsActive(input, events, PACK_ID)) return undefined;
	return FIELD;
});

export const ${P} = defineExtension({
	name: ${s('playbook:' + pack.id)},
	sections: [teachingSection, fieldSection],
	tools: [${toolNames.join(', ')}],
});
export default ${P};
`;
}

function emitInstall(data) {
  // Lives in playbook-core.ts? No — the core must not import packs. A tiny index does the install + requires check.
  const imports = data.latest.map((p) => `import ${pascal(p.id)}, { REQUIRES as ${ident(p.id)}Requires } from "./pack-${p.id}.ts";`).join('\n');
  const list = data.latest.map((p) => `\t{ extension: ${pascal(p.id)}, requires: ${ident(p.id)}Requires },`).join('\n');
  return HEADER('Index: installs the core and every pack extension after checking `requires`.') + `
import type { Extension, Registry } from "@earendil-works/pi-durable";
import { defineExtension } from "@earendil-works/pi-durable";
import { journeySection } from "./playbook-core.ts";
${imports}

/** Capability versions this node provides. The browser ships the same majors (capabilities/<name>.js). */
export const CAPABILITIES: Readonly<Record<string, string>> = ${JSON.stringify(data.capabilities)};

export const PlaybookCore = defineExtension({ name: "playbook:core", sections: [journeySection] });

export const PACKS: readonly { extension: Extension; requires: Readonly<Record<string, string>> }[] = [
${list}
];

const semver = ${JSON.stringify(data.semverSource)};
const satisfies = new Function("version", "range", semver) as (version: string, range: string) => boolean;

/** Install the core then every pack whose \`requires\` the node's capabilities satisfy. Returns what was skipped. */
export function installPlaybook(registry: Registry, capabilities: Readonly<Record<string, string>> = CAPABILITIES): { installed: string[]; skipped: { name: string; unmet: string[] }[] } {
	registry.install(PlaybookCore);
	const installed = [PlaybookCore.name];
	const skipped: { name: string; unmet: string[] }[] = [];
	for (const pack of PACKS) {
		const unmet = Object.entries(pack.requires).filter(([cap, range]) => !capabilities[cap] || !satisfies(capabilities[cap], range)).map(([cap, range]) => \`\${cap}@\${range}\`);
		if (unmet.length) { skipped.push({ name: pack.extension.name, unmet }); continue; }
		registry.install(pack.extension);
		installed.push(pack.extension.name);
	}
	return { installed, skipped };
}
`;
}

function emitHarness(data) {
  return HEADER('Example harness: proves the compile is real. Not a chat surface, not a node bootstrap.') + `// Run from the repo root with the pi checkout's workspace on the module path, e.g.
//   cd node && node --conditions=source --experimental-strip-types generated/example-harness.ts
// (see node/README.md for the scratch tsconfig + node_modules link).
import { BACKGROUND_CONTEXT } from "@earendil-works/chord/context";
import { createModels } from "@earendil-works/pi-ai/models";
import { fauxAssistantMessage, fauxProvider, fauxToolCall } from "@earendil-works/pi-ai/providers/faux";
import { createRegistry, Harness, MemoryStorage } from "@earendil-works/pi-durable";
import { installPlaybook } from "./index.ts";
import { KeeperProgress, appendEvent, eventsOf, renderJourney } from "./playbook-core.ts";

const context = BACKGROUND_CONTEXT;
const keeperId = "keeper:example";

const faux = fauxProvider();
const models = createModels();
models.setProvider(faux.provider);
const registry = createRegistry();
const install = installPlaybook(registry);
console.log("installed:", install.installed.join(", "));
if (install.skipped.length) console.log("skipped:", JSON.stringify(install.skipped));

const harness = await Harness.open(new MemoryStorage(), { models, registry }, context);
const root = await harness.root(context, {
	agent: { model: { provider: "faux", modelId: "faux-1" }, instructions: \`keeperId: \${keeperId}\` },
});

// A synthetic keeper: three field check-ins on distinct dates in read-the-game.
const ctx = { pack: "read-the-game", packVersion: "1.1.0" };
await root.commit(async (tx) => {
	await appendEvent(tx, keeperId, "field.checkin", { task: "scan-count", date: "2026-09-21", done: "yes", notes: "" }, ctx);
	await appendEvent(tx, keeperId, "field.checkin", { task: "hips-head", date: "2026-09-24", done: "partly", notes: "" }, ctx);
	await appendEvent(tx, keeperId, "field.checkin", { task: "far-side", date: "2026-09-28", done: "yes", notes: "" }, ctx);
}, context);

console.log("\\n=== journey before ===");
const before = renderJourney(await eventsOf(harness, keeperId, context));
console.log(before);

// The model (faux) calls checkin_read-the-game; the tool appends an event through the shared document.
faux.setResponses([
	fauxAssistantMessage(fauxToolCall("checkin_read-the-game", { task: "starting-position", date: "2026-10-01", done: "yes", notes: "set before every shot in the small-sided game" }), { stopReason: "toolUse" }),
	fauxAssistantMessage("Logged. That is four sessions now."),
	fauxAssistantMessage("Keep going."),
]);
await (await root.submit({ type: "input", content: "Training tonight: I got set before every shot." }, context)).wait(context);

const doc = await harness.snapshot(KeeperProgress, keeperId, context);
console.log("\\nevents in document:", doc?.events.length, "last:", JSON.stringify(doc?.events.at(-1)));

console.log("\\n=== journey after ===");
const after = renderJourney(await eventsOf(harness, keeperId, context));
console.log(after);

// What the model actually saw: the second request carries the sections rendered from the document.
await (await root.submit({ type: "input", content: "What next?" }, context)).wait(context);
const { messages } = await root.context(context);
const sectionKeys = messages.flatMap((m) => (m.role === "system" && m.sections ? Object.keys(m.sections) : []));
console.log("\\nsystem prompt sections seen by the model:", sectionKeys.join(", "));

if (!/Field tasks[^\\n]*\\(3\\/3, pitch\\)/.test(before)) throw new Error("expected field gate 3/3 met before");
if (!/\\[unmet\\] Positioning check/.test(before)) throw new Error("expected quiz gate unmet");
if (before === after) throw new Error("expected the tool call to change the journey");
if (!/Field tasks[^\\n]*\\(4\\/4, pitch\\)|Field tasks[^\\n]*\\(4\\/3, pitch\\)/.test(after)) throw new Error("expected 4 distinct dates after the tool call");
console.log("\\nOK: compile is real.");
await harness.close(context);
`;
}

/* ---------------- main ---------------- */

function capabilityVersions() {
  const dir = path.join(ROOT, 'capabilities');
  const out = {};
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.js')) continue;
    const m = /version:\s*['"]([^'"]+)['"]/.exec(fs.readFileSync(path.join(dir, f), 'utf8'));
    if (m) out[f.replace(/\.js$/, '')] = m[1];
  }
  return out;
}

function semverSource() {
  // Lift `satisfies` (and its helpers) out of runtime/journey.js so the node and browser agree on ranges.
  const src = fs.readFileSync(path.join(ROOT, 'runtime', 'journey.js'), 'utf8');
  const start = src.indexOf('function parseVer(');
  const end = src.indexOf('/* ---------------- pack catalogue');
  if (start < 0 || end < 0) throw new Error('could not find semver helpers in runtime/journey.js');
  return "'use strict';\nfunction text(s){return s===undefined||s===null?'':String(s);}\n" + src.slice(start, end) + '\nreturn satisfies(version, range);';
}

function main(argv) {
  let out = 'node/generated';
  for (let i = 0; i < argv.length; i++) if (argv[i] === '--out') out = argv[++i];
  const outDir = path.resolve(ROOT, out);
  const data = loadPacks();
  data.capabilities = capabilityVersions();
  data.semverSource = semverSource();

  fs.mkdirSync(outDir, { recursive: true });
  const written = [];
  const write = (name, text) => { fs.writeFileSync(path.join(outDir, name), text); written.push(path.relative(ROOT, path.join(outDir, name))); };
  write('playbook-core.ts', emitCore(data));
  for (const pack of data.latest) {
    const c = collect(pack);
    if (c.unknownBlocks.length) console.warn(`warn: ${pack.id} has block types the compiler does not map: ${c.unknownBlocks.join(', ')}`);
    write(`pack-${pack.id}.ts`, emitPack(pack, data));
  }
  write('index.ts', emitInstall(data));
  write('example-harness.ts', emitHarness(data));
  for (const w of written) console.log('wrote', w);
  console.log(`${data.latest.length} packs: ${data.latest.map((p) => p.id + '@' + p.version).join(', ')}`);
}

if (require.main === module) {
  try { main(process.argv.slice(2)); } catch (e) { console.error('compile-pack-extension: ' + (e && e.stack || e)); process.exit(1); }
}
module.exports = { loadPacks, collect, stripHtml };
