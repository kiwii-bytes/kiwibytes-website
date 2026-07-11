---
title: 'How to automate 80+ hours of manual work a day with n8n'
description: 'A practical architecture for replacing repetitive operations work with n8n workflows and Python RPA — including the failure modes nobody warns you about.'
publishDate: 2026-07-10
tags: ['Automation', 'n8n', 'RPA', 'Operations']
draft: false
---

Most operations teams are running on a pile of repetitive, rule-based tasks: pulling
orders from a marketplace, updating listings, reconciling statements, chasing logistics
statuses, processing refunds. None of it is hard. All of it is expensive, because it
consumes people who could be doing something that isn't mechanical.

Our engineers have removed 80+ hours of manual work per day this way. Here's the
architecture that actually holds up, and the mistakes that cost us time.

## First: automate the right thing

The temptation is to automate the loudest complaint. That's usually wrong. Score each
candidate task on three axes:

- **Volume** — how many times a day does it run?
- **Determinism** — given the same input, is the correct output always the same?
- **Blast radius** — if it silently does the wrong thing, how bad is it?

High volume + high determinism + low blast radius is where you start. Reconciliation,
listing updates, status syncs and report generation usually score well. Anything
requiring genuine judgement — pricing exceptions, customer escalations — should stay
human, or at most become a human-in-the-loop step.

A task that runs twice a month is not worth automating, no matter how much the person
doing it hates it.

## The architecture

We tend to land on the same shape:

1. **Trigger** — a webhook, a cron schedule, or a queue message. Prefer webhooks over
   polling wherever the upstream system supports them; polling is a tax you pay forever.
2. **Fetch + normalise** — pull the raw data and immediately convert it into one internal
   shape. Every downstream node should speak your schema, not the vendor's.
3. **Business logic** — the actual decision. Keep this as pure as you can.
4. **Write** — push the result to wherever it belongs.
5. **Verify** — read back and confirm the write actually landed.

That last step is the one everyone skips. An automation that writes without verifying
is an automation that will one day fail silently for three weeks.

## n8n for orchestration, code for logic

n8n is excellent glue: it handles retries, scheduling, credential management, and gives
non-engineers a readable picture of what runs when. It is a poor place to put complex
business logic. Twenty chained nodes implementing a pricing rule is unreadable and
untestable.

Our rule: **if the logic needs a test, it belongs in code.** We expose it as a small
Python or JavaScript service and call it from a single n8n node. The workflow stays
legible; the logic stays testable.

## Idempotency is the whole game

Your workflow *will* run twice. A webhook will fire twice, a retry will double-fire, a
human will click the button again. If running twice does damage, you have a bug — you
just haven't hit it yet.

Make every write idempotent. In practice:

- Derive a deterministic key from the input (`order-{id}-refund`) and check for it before
  writing.
- Prefer upserts over inserts.
- Store an idempotency key against the operation so a replay is a no-op.

We once double-refunded a small batch of orders because a retry fired against a
non-idempotent endpoint. It was recoverable, it was embarrassing, and it was entirely
preventable.

## Fail loudly

The worst automation failure is not a crash. A crash is fine — you'll see it. The worst
failure is the one that quietly writes wrong data for a month.

- **Alert on silence.** If a workflow that should run 200 times a day runs zero times,
  that must page someone. Success-only monitoring will never catch this.
- **Assert your assumptions.** If you expect 50–500 orders, and you get 0 or 50,000, stop
  and alert rather than proceeding.
- **Route failures to a dead-letter queue** with the full input payload, so you can replay
  after a fix instead of reconstructing what was lost.

## Where RPA still earns its place

Some systems have no API. Legacy portals, vendor dashboards, internal tools nobody
maintains. For these, browser automation (Playwright, Selenium, or a purpose-built
extension) is the only option.

Treat it as a last resort, and treat it as fragile — a UI change will break it, and it
will break at the worst time. Keep RPA scripts thin, isolated, and heavily monitored, and
migrate to an API the moment one exists.

This frustration is exactly why we built [WebTarsus](https://github.com/Aqib-Ansari) — an
open-source browser automation agent that turns plain-English instructions into repeatable
browser workflows. It's public; you can read the code.

## The honest payoff

Automating 80+ hours/day of work doesn't mean eliminating 10 people. In practice it means
the same team stops doing mechanical work and starts doing work that needed a human all
along — catching the exceptions the automation escalates, improving the process,
handling the customers.

The efficiency gain is real. The claim that it replaces your team usually isn't.

---

*Working through a manual process that shouldn't be manual? [Tell us what it is](/contact)
— if it isn't worth automating, we'll say so.*
