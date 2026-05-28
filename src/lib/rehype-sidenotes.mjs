/**
 * rehype-sidenotes
 *
 * Rewrites footnotes emitted by remark-gfm into inline right-margin side
 * notes. For each reference, an <aside class="side-note"> is inserted
 * immediately after the reference's enclosing block. The original
 * <section data-footnotes> is then removed from the tree.
 *
 * CSS in src/styles/global.css positions .side-note in the right gutter
 * and collapses it inline below 980px.
 */

const BLOCK_TAGS = new Set(['p', 'li', 'blockquote', 'figure']);

export default function rehypeSidenotes() {
	return (tree) => {
		const definitions = new Map();
		let footnotesParent = null;
		let footnotesNode = null;

		walk(tree, (node, parent) => {
			if (
				node.type === 'element' &&
				node.tagName === 'section' &&
				hasFootnotesAttr(node)
			) {
				footnotesParent = parent;
				footnotesNode = node;
				const ol = findChild(node, 'ol');
				if (!ol) return;
				for (const li of ol.children || []) {
					if (li.type !== 'element' || li.tagName !== 'li') continue;
					const id = prop(li, 'id');
					if (!id) continue;
					const num = id.replace(/^user-content-fn-/, '');
					definitions.set(num, stripBackrefs(li.children || []));
				}
			}
		});

		const rows = new Map();
		walk(tree, (node, _parent, _index, ancestors) => {
			if (node.type !== 'element' || node.tagName !== 'sup') return;
			const ref = (node.children || []).find(
				(c) =>
					c.type === 'element' &&
					c.tagName === 'a' &&
					prop(c, 'dataFootnoteRef') !== undefined,
			);
			if (!ref) return;
			const href = prop(ref, 'href');
			if (!href || !href.startsWith('#user-content-fn-')) return;
			const id = href.replace(/^#user-content-fn-/, '');
			const content = definitions.get(id);
			if (!content) return;
			// Visible label is the sequential number remark-gfm rendered in
			// the <sup><a>, not the raw footnote ID (which may be a name
			// like `kaush` for `[^kaush]` references).
			const num = textContent(ref) || id;

			let blockParent = null;
			let blockNode = null;
			for (let i = ancestors.length - 1; i >= 0; i--) {
				const a = ancestors[i];
				if (
					a.node.type === 'element' &&
					BLOCK_TAGS.has(a.node.tagName) &&
					a.parent
				) {
					blockParent = a.parent;
					blockNode = a.node;
					break;
				}
			}
			if (!blockParent || !blockNode) return;

			const aside = {
				type: 'element',
				tagName: 'aside',
				properties: { className: ['side-note'], 'data-num': num },
				children: [
					{
						type: 'element',
						tagName: 'span',
						properties: { className: ['num'] },
						children: [{ type: 'text', value: `${num}.` }],
					},
					{ type: 'text', value: ' ' },
					...content,
				],
			};

			let row = rows.get(blockNode);
			if (!row) {
				row = { parent: blockParent, blockNode, asides: [] };
				rows.set(blockNode, row);
			}
			row.asides.push(aside);
		});

		for (const row of rows.values()) {
			const children = row.parent.children;
			if (!Array.isArray(children)) continue;
			const idx = children.indexOf(row.blockNode);
			if (idx === -1) continue;
			const wrapper = {
				type: 'element',
				tagName: 'div',
				properties: { className: ['sidenote-row'] },
				children: [row.blockNode, ...row.asides],
			};
			children.splice(idx, 1, wrapper);
		}

		removeFootnotesSections(tree);
	};
}

function removeFootnotesSections(node) {
	if (!Array.isArray(node.children)) return;
	for (let i = node.children.length - 1; i >= 0; i--) {
		const c = node.children[i];
		if (
			c.type === 'element' &&
			c.tagName === 'section' &&
			hasFootnotesAttr(c)
		) {
			node.children.splice(i, 1);
		} else {
			removeFootnotesSections(c);
		}
	}
}

function walk(node, visitor, parent = null, index = -1, ancestors = []) {
	visitor(node, parent, index, ancestors);
	if (!Array.isArray(node.children)) return;
	const next = ancestors.concat([{ node, parent, index }]);
	for (let i = 0; i < node.children.length; i++) {
		walk(node.children[i], visitor, node, i, next);
	}
}

function hasFootnotesAttr(node) {
	const props = node.properties || {};
	if (props.dataFootnotes !== undefined) return true;
	const cls = props.className;
	if (Array.isArray(cls) && cls.includes('footnotes')) return true;
	if (typeof cls === 'string' && cls.split(/\s+/).includes('footnotes'))
		return true;
	return false;
}

function findChild(node, tagName) {
	return (node.children || []).find(
		(c) => c.type === 'element' && c.tagName === tagName,
	);
}

function prop(node, name) {
	return (node.properties || {})[name];
}

function textContent(node) {
	if (!node) return '';
	if (node.type === 'text') return node.value || '';
	if (!Array.isArray(node.children)) return '';
	return node.children.map(textContent).join('');
}

function isBackref(node) {
	if (node.type !== 'element' || node.tagName !== 'a') return false;
	const props = node.properties || {};
	if (props.dataFootnoteBackref !== undefined) return true;
	const cls = props.className;
	if (Array.isArray(cls) && cls.includes('data-footnote-backref')) return true;
	if (
		typeof cls === 'string' &&
		cls.split(/\s+/).includes('data-footnote-backref')
	)
		return true;
	return false;
}

function stripBackrefs(nodes) {
	const out = [];
	for (const n of nodes) {
		if (isBackref(n)) continue;
		if (n.type === 'element' && Array.isArray(n.children)) {
			out.push({ ...n, children: stripBackrefs(n.children) });
		} else {
			out.push(n);
		}
	}
	return out;
}
