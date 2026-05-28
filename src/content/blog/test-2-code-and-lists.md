---
title: 'Code blocks and lists — visual test'
description: 'Temporary post for testing fenced code blocks (multiple languages), inline code, and ordered/unordered list rendering.'
pubDate: 'Sep 22 2025'
tags: ['testing', 'code']
---

A short post to look at how code blocks and lists render under the theme. Lists are deceptively load-bearing in technical writing[^lists]  — they're often where readers actually find the answer.

## Unordered list

- First item, short.
- Second item, with `inline code` to make sure it sits well on the line.
- Third item, with a longer description that wraps onto a second line so we can see indent behavior and line-height inside list items.

## Ordered list

1. First step
2. Second step, with `inline_function()`
3. Third step, with **bold** and *italic* to check inheritance

## Python

```python
def transform(df: DataFrame) -> DataFrame:
    """Project the columns we actually need, then drop anything obviously broken."""
    return (
        df
        .select("user_id", "event_ts", "amount")
        .filter(col("amount") > 0)
        .withColumn("amount_cents", (col("amount") * 100).cast("long"))
    )
```

## TypeScript

```ts
import { z } from "astro/zod";

export const Post = z.object({
  title: z.string(),
  pubDate: z.coerce.date(),
  tags: z.array(z.string()).default([]),
});

export type Post = z.infer<typeof Post>;
```

## Shell

```bash
# build and locally preview, then index for search
npm run build
npm run preview
```

A trailing paragraph after the code blocks, to confirm spacing between fenced blocks and surrounding prose.

[^lists]: There's a reason every well-loved README opens with a bullet list of features — they're scannable. Prose hides; lists declare.
