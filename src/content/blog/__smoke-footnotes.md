---
title: 'Smoke test — footnotes as side notes'
description: 'Build-time regression test for the rehype-sidenotes plugin. Hidden from listings via draft: true.'
pubDate: 'Jan 01 2026'
tags: []
draft: true
---

This is a regression test post for the side-notes plugin. The plugin should rewrite the footnote below into an `<aside class="side-note">` placed immediately after this paragraph[^1], and remove the trailing `<section data-footnotes>` block.

Second paragraph with a separate footnote[^2] reference.

## Section heading

A heading should pick up the decorative `##` marker.

A horizontal rule below should render as `* * *`:

---

Closing paragraph (build-cache-bust v3).

[^1]: See my post on AI paradigms.
[^2]: Another note: this one tests that two distinct definitions each end up beside their reference's paragraph.
