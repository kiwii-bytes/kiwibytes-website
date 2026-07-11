---
title: 'Taking RAG from demo to production'
description: 'A RAG demo takes an afternoon. A RAG system that survives real users takes evaluation, retrieval that actually fits your documents, guardrails, and a cost ceiling. Here is the gap.'
publishDate: 2026-07-08
tags: ['AI', 'RAG', 'LLM', 'LangChain']
draft: false
---

Retrieval-augmented generation (RAG) is the technique of letting a language model answer
using *your* documents instead of only what it memorised during training. You retrieve
the relevant chunks of your content, put them in the prompt, and ask the model to answer
from them.

The demo takes an afternoon: load some PDFs, embed them, stuff the top 5 matches into a
prompt. It will look magical. It will also fall over the moment real users touch it.

Here's what actually separates the two.

## The demo-to-production gap

A RAG demo is judged on "did it answer my one question correctly?" A production RAG system
is judged on:

- Does it answer correctly across the *distribution* of questions users actually ask?
- Does it say "I don't know" instead of inventing an answer when retrieval fails?
- Does it stay within a cost budget at real volume?
- Can you tell whether last week's change made it better or worse?

That last question is the one that kills most projects. Without evaluation you are not
engineering, you are vibing.

## Build the evaluation set before you build the pipeline

Write 50–100 real questions with known-correct answers *first*. Get them from your support
inbox, your sales calls, your internal Slack. Not invented ones — real ones, including the
awkwardly phrased ones.

Then measure two things separately:

1. **Retrieval quality** — was the correct chunk in the retrieved set at all? If it wasn't,
   the model never had a chance, and no amount of prompt engineering will fix it.
2. **Answer quality** — given the correct chunk *was* retrieved, was the answer right?

Conflating these is the most common debugging mistake we see. You'll spend a week tuning
prompts when your retriever simply never surfaced the right document.

## Chunking is not a solved problem

The default advice — "split into 1000 characters with 200 overlap" — is a starting point,
not an answer. It depends entirely on your documents:

- **Structured docs** (policies, manuals, FAQs) — chunk on semantic boundaries: sections,
  headings, individual Q&A pairs. A chunk should be a complete thought.
- **Tables and spec sheets** — naive character splitting destroys them. The header row ends
  up in a different chunk from the data. Extract these separately.
- **Conversational data** (tickets, chat logs) — keep a full exchange together; half a
  conversation is often worse than useless.

Always store enough metadata alongside the chunk (source, section, date) that you can both
filter *and* cite. Answers without citations are unverifiable, and unverifiable answers are
how you lose user trust permanently.

## Hybrid retrieval beats pure vector search

Pure semantic (vector) search is excellent at "questions phrased differently from the
document" and surprisingly bad at exact identifiers — SKUs, error codes, product names,
part numbers. Ask it about `ERR_5031` and it will happily return semantically adjacent
nonsense.

Combine vector search with keyword search (BM25) and fuse the results. Then, if quality
still matters more than latency, re-rank the top ~50 candidates with a cross-encoder and
keep the best few. Retrieval quality is where the biggest wins are, and it's where most
teams under-invest.

## Make "I don't know" a first-class answer

A model that confidently invents an answer is worse than a model that refuses, because it
is more expensive to catch. Set a relevance threshold: if the best retrieved chunk scores
below it, don't call the model at all — return "I don't have information on that" and,
ideally, escalate to a human.

Instruct the model explicitly to answer *only* from the provided context and to say so when
the context is insufficient. Then verify it actually does — with a test.

## Multi-agent, only when the problem is genuinely multi-step

Frameworks like LangGraph make it easy to build agent graphs, and easy to over-build them.
A single well-retrieved prompt beats a six-agent pipeline for most question-answering.

Agents earn their complexity when the task genuinely requires multiple steps with
branching — for example: classify the request, query a database, call an external API,
then compose an answer. We've built conversational database agents and text-to-SQL layers
where that structure was necessary. It was necessary because the task had real steps, not
because agents are fashionable.

## Cost is a design constraint, not an afterthought

At real volume, token cost compounds fast. What actually moves the needle:

- **Cache aggressively.** Identical and near-identical questions are far more common than
  you expect.
- **Right-size the model.** Route simple queries to a small, cheap model; escalate only the
  hard ones. A classifier in front of the pipeline pays for itself immediately.
- **Trim the context.** Sending 10 chunks when 3 would do is a 3x bill for no gain.
- **Set a hard ceiling** with alerting. A retry loop against a paid API can quietly burn
  a month's budget over a weekend.

## The short version

RAG is not a model problem. It is a retrieval, evaluation and systems problem, with a model
attached at the end. Teams that treat it as "add an LLM" ship demos. Teams that treat it as
"build a search system that a model can read" ship products.

---

*Considering RAG over your own data? [Tell us what you're trying to answer](/contact) —
we'll tell you honestly whether RAG is even the right tool for it.*
