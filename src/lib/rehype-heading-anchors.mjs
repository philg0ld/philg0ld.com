/**
 * rehype-heading-anchors
 *
 * For each <h2> inside the document, slugify the heading text, set the
 * <h2 id="<slug>">, and prepend an <a class="heading-anchor" href="#<slug>">
 * containing a "##" marker plus a hidden check-mark SVG. CSS toggles the
 * marker → check swap when a click handler adds the `.copied` class.
 *
 * Idempotent: skipped if the H2 already starts with a .heading-anchor.
 */

export default function rehypeHeadingAnchors() {
	return (tree) => {
		walk(tree, (node) => {
			if (node.type !== 'element' || node.tagName !== 'h2') return;
			if (firstChildIsAnchor(node)) return;

			const text = extractText(node).trim();
			if (!text) return;
			const slug = slugify(text);

			node.properties = { ...(node.properties || {}), id: slug };

			const anchor = {
				type: 'element',
				tagName: 'a',
				properties: {
					className: ['heading-anchor'],
					href: `#${slug}`,
					'aria-label': `Copy link to "${text}"`,
				},
				children: [
					{
						type: 'element',
						tagName: 'span',
						properties: { className: ['marker'] },
						children: [{ type: 'text', value: '##' }],
					},
					{
						type: 'element',
						tagName: 'span',
						properties: {
							className: ['check'],
							'aria-hidden': 'true',
						},
						children: [
							{
								type: 'element',
								tagName: 'svg',
								properties: {
									viewBox: '0 0 24 24',
									width: '1em',
									height: '1em',
									fill: 'none',
									stroke: 'currentColor',
									'stroke-width': '2.5',
									'stroke-linecap': 'round',
									'stroke-linejoin': 'round',
								},
								children: [
									{
										type: 'element',
										tagName: 'rect',
										properties: {
											x: '3',
											y: '3',
											width: '18',
											height: '18',
											rx: '2',
											stroke: 'currentColor',
											'stroke-width': '2',
											fill: 'none',
										},
										children: [],
									},
									{
										type: 'element',
										tagName: 'path',
										properties: {
											d: 'M7 12 l3.5 3.5 L17 8',
										},
										children: [],
									},
								],
							},
						],
					},
				],
			};

			node.children = [anchor, ...(node.children || [])];
		});
	};
}

function walk(node, visitor) {
	visitor(node);
	if (Array.isArray(node.children)) {
		for (const c of node.children) walk(c, visitor);
	}
}

function firstChildIsAnchor(h2) {
	const first = (h2.children || [])[0];
	if (!first || first.type !== 'element' || first.tagName !== 'a') return false;
	const cls = (first.properties || {}).className;
	if (Array.isArray(cls) && cls.includes('heading-anchor')) return true;
	if (typeof cls === 'string' && cls.split(/\s+/).includes('heading-anchor'))
		return true;
	return false;
}

function extractText(node) {
	let out = '';
	walk(node, (n) => {
		if (n.type === 'text' && typeof n.value === 'string') out += n.value;
	});
	return out;
}

function slugify(s) {
	return s
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.replace(/-{2,}/g, '-');
}
