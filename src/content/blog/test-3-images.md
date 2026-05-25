---
title: 'Hero and inline images — visual test'
description: 'Temporary post for testing hero image rendering and multiple inline images at the prose column width.'
pubDate: 'Nov 08 2024'
heroImage: '../../assets/blog/test-3-images/hero.svg'
tags: ['testing', 'images']
---

This post has a hero image at the top of the layout, then two inline images mid-body, then a closing paragraph.

The first inline figure sits below this paragraph. Inline images on this theme inherit `max-width: 100%` from the global stylesheet, so they should not break out of the 700px prose column.

![Inline figure one — flat warm-neutral rectangle](../../assets/blog/test-3-images/inline-1.svg)

A second inline figure follows, in the accent color, so we can see whether two contrasting placeholders side-by-side feel intentional or chaotic in the reading flow.

![Inline figure two — flat accent-color rectangle](../../assets/blog/test-3-images/inline-2.svg)

A closing paragraph. If the bottom margin between the last image and the post tags looks wrong, that's where to tune `.prose img` or the `.tags` top padding.
