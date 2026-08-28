/* ==========================================================================
   The archive's filing system, and the one true way to spell it in a URL.

   Two pages mint links into the same query string — the index writes them as
   the reader filters, the reading view writes them from a post's own
   frontmatter. A second slug implementation is a second chance to disagree,
   and the disagreement would be silent: the link still resolves, it just
   quietly matches nothing. So the rule lives here and nowhere else.
   ========================================================================== */

/* The closed set. Every post carries exactly one of these, so the index can
   treat anything else in the URL as a typo and widen rather than empty out.
   Declaration order is canonical, not display order — the chips sort
   themselves by how much of the archive each category actually holds. */
export const CATEGORY_ORDER = [
  "Web & APIs",
  "XAML & Desktop",
  "Cloud & Infrastructure",
  "Front-end & JavaScript",
  "Java & JVM",
  "Mobile",
  ".NET & C#",
  "Tooling & Craft",
  "Data & Persistence",
  "Workflow (WF)",
  "AI & Agents",
  "Radio & Signals",
]

/* Lowercase, then every run of non-alphanumerics becomes a single hyphen and
   the ends are trimmed. The ampersands, dots, hashes and brackets in these
   labels are exactly the characters that need escaping in a query string, so
   the slug is the label with all of that boiled off:
   "Web & APIs" -> web-apis, ".NET & C#" -> net-c, "Workflow (WF)" -> workflow-wf. */
export const slugifyCategory = label =>
  String(label || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

/* Eras rather than a year picker. Two thirds of the archive predates 2013 and
   describes a world of Silverlight and WCF; a reader looking for current work
   needs one click to leave it behind, not a scrollbar of years. The upper
   bound of the last era is open so it never needs editing again. */
export const ERAS = [
  { id: "2009-2012", label: "2009–2012", from: 2009, to: 2012 },
  { id: "2013-2019", label: "2013–2019", from: 2013, to: 2019 },
  { id: "2020-now", label: "2020–now", from: 2020, to: Infinity },
]
