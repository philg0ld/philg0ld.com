/**
 * rehype-callouts
 *
 * Transforms Obsidian / GFM-style blockquote callouts into styled blocks.
 *
 * Input markdown:
 *   > [!tip] Optional title
 *   > body content
 *
 * Becomes:
 *   <blockquote class="callout callout-tip">
 *     <div class="callout-title">Optional title</div>
 *     ...remaining children...
 *   </blockquote>
 *
 * Recognised types: note, tip, important, warning, caution, info.
 * Type matching is case-insensitive. If no title is supplied, the
 * capitalised type is used.
 */

const CALLOUT_RE = /^\[!(\w+)\](?:\s+(.+))?\s*$/;
const KNOWN_TYPES = new Set([
	'note',
	'tip',
	'important',
	'warning',
	'caution',
	'info',
]);

export default function rehypeCallouts() {
	return (tree) => {
		walk(tree, (node) => {
			if (node.type !== 'element' || node.tagName !== 'blockquote') return;
			const firstP = (node.children || []).find(
				(c) => c.type === 'element' && c.tagName === 'p',
			);
			if (!firstP) return;
			const firstText = (firstP.children || []).find(
				(c) => c.type === 'text',
			);
			if (!firstText) return;

			// The marker may be followed by a soft break + remainder of the
			// paragraph. Match against the first line only.
			const firstLine = firstText.value.split('\n', 1)[0];
			const match = firstLine.match(CALLOUT_RE);
			if (!match) return;
			const [, rawType, title] = match;
			const type = rawType.toLowerCase();
			if (!KNOWN_TYPES.has(type)) return;

			// Strip the marker line from the first text node.
			const rest = firstText.value.slice(firstLine.length).replace(/^\n/, '');
			if (rest) {
				firstText.value = rest;
			} else {
				// Remove the now-empty first text node. If the <p> becomes
				// empty (only had the marker line), drop the <p> entirely.
				firstP.children = firstP.children.filter((c) => c !== firstText);
				const stillHasContent = (firstP.children || []).some(
					(c) =>
						(c.type === 'text' && c.value.trim()) ||
						c.type === 'element',
				);
				if (!stillHasContent) {
					node.children = node.children.filter((c) => c !== firstP);
				}
			}

			// Mark the blockquote.
			node.properties = node.properties || {};
			const existing = node.properties.className;
			const classes = Array.isArray(existing)
				? existing
				: typeof existing === 'string'
					? existing.split(/\s+/).filter(Boolean)
					: [];
			classes.push('callout', `callout-${type}`);
			node.properties.className = classes;

			// Prepend the title element.
			const titleText = title || type.charAt(0).toUpperCase() + type.slice(1);
			node.children.unshift({
				type: 'element',
				tagName: 'div',
				properties: { className: ['callout-title'] },
				children: [{ type: 'text', value: titleText }],
			});
		});
	};
}

function walk(node, visitor) {
	visitor(node);
	if (!Array.isArray(node.children)) return;
	for (const child of node.children) walk(child, visitor);
}
