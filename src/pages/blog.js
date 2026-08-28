import * as React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { CATEGORY_ORDER, ERAS, slugifyCategory } from "../utils/taxonomy"
import "../styles/blog.css"

const EMPTY = { q: "", category: "", tag: "", era: "" }

const CATEGORY_SLUGS = new Set(CATEGORY_ORDER.map(slugifyCategory))

const eraFor = year => ERAS.find(e => year >= e.from && year <= e.to)?.id || ""

/* The query string is the whole of this page's state, which means it is also
   an input we do not control — links get shared, edited and rot. Anything we
   do not recognise is dropped rather than trusted, so a bad parameter widens
   the view instead of emptying it. */
const readFilters = search => {
  const params = new URLSearchParams(search || "")
  const category = params.get("category") || ""
  const era = params.get("era") || ""
  return {
    q: params.get("q") || "",
    category: CATEGORY_SLUGS.has(category) ? category : "",
    tag: (params.get("tag") || "").trim().toLowerCase(),
    era: ERAS.some(e => e.id === era) ? era : "",
  }
}

/* Only the live facets go back into the URL, so a plain /blog/ stays plain
   and every filtered view has exactly one spelling — worth caring about when
   the point of putting state here is that Google can index it. */
const writeFilters = (pathname, filters) => {
  const params = new URLSearchParams()
  if (filters.category) params.set("category", filters.category)
  if (filters.tag) params.set("tag", filters.tag)
  if (filters.q.trim()) params.set("q", filters.q.trim())
  if (filters.era) params.set("era", filters.era)
  const query = params.toString()
  return query ? `${pathname}?${query}` : pathname
}

const BlogPage = ({ data, location }) => {
  const posts = data.allMarkdownRemark.nodes
  const [filters, setFilters] = React.useState(EMPTY)
  const [urlRead, setUrlRead] = React.useState(false)
  const [showAllTags, setShowAllTags] = React.useState(false)

  const update = patch => setFilters(prev => ({ ...prev, ...patch }))
  const clearAll = () => setFilters(EMPTY)

  /* Gatsby's own location prop rather than window, so the read below is one
     plain string the effect can depend on and the server has something
     harmless to render from. */
  const search = location?.search

  /* The build renders the unfiltered archive, so incoming parameters can only
     be applied after mount — reading them during render would hand React
     markup that disagrees with the HTML it is hydrating. One effect in, one
     effect out, and the flag between them stops the write from erasing the
     read on the very first frame. */
  React.useEffect(() => {
    setFilters(readFilters(search))
    setUrlRead(true)
  }, [search])

  React.useEffect(() => {
    if (!urlRead || typeof window === "undefined") return
    /* replaceState, not push: nobody wants twelve history entries because
       they tried four categories before finding the post they wanted. The
       effect above is what keeps a shared link working regardless. */
    window.history.replaceState(
      null,
      "",
      writeFilters(window.location.pathname, filters)
    )
  }, [filters, urlRead])

  /* One pass over the posts builds everything the filters need, including the
     lowercased haystack. Substring search across 280 rows is far cheaper than
     the debounce it would take to avoid it, so the field filters on keystroke. */
  const entries = React.useMemo(
    () =>
      posts.map(post => {
        const fm = post.frontmatter
        const tags = (fm.tags || []).map(tag => tag.trim()).filter(Boolean)
        const summary = fm.description || post.excerpt || ""
        const category = fm.category || ""
        return {
          post,
          tags,
          summary,
          category,
          categorySlug: slugifyCategory(category),
          era: eraFor(Number(fm.year)),
          haystack: [fm.title, category, summary, tags.join(" ")]
            .join(" ")
            .toLowerCase(),
        }
      }),
    [posts]
  )

  const needle = filters.q.trim().toLowerCase()

  /* The order of the category row is fixed by how big each category is across
     the whole archive, and never moves. Only the numbers on the chips answer
     to the other filters. Keeping those two things apart is what lets the
     counts stay true without the row reshuffling under the cursor. */
  const categoryOrder = React.useMemo(() => {
    const totals = new Map(CATEGORY_ORDER.map(label => [label, 0]))
    entries.forEach(entry => {
      if (totals.has(entry.category))
        totals.set(entry.category, totals.get(entry.category) + 1)
    })
    return CATEGORY_ORDER.map(label => ({
      label,
      slug: slugifyCategory(label),
      total: totals.get(label),
    }))
      .filter(category => category.total > 0)
      .sort((a, b) => b.total - a.total || a.label.localeCompare(b.label))
  }, [entries])

  const bySearch = entry => !needle || entry.haystack.includes(needle)
  const byCategory = entry =>
    !filters.category || entry.categorySlug === filters.category
  const byEra = entry => !filters.era || entry.era === filters.era
  const byTag = entry =>
    !filters.tag || entry.tags.some(tag => tag.toLowerCase() === filters.tag)

  /* Every facet counts against all the filters except the one it belongs to.
     A chip is a promise about what you get by clicking it, so it has to be
     counted over the state that click actually produces — count a category
     against the category already picked and every chip but one reads zero.

     Category skips the tag facet too, because picking a category clears the
     tag with it (see the chip's own handler); counting with a tag still
     applied would promise a number the click never lands on. Search applies
     everywhere: it is the one filter no chip clears. */
  const categoryBase = React.useMemo(
    () => entries.filter(entry => bySearch(entry) && byEra(entry)),
    [entries, needle, filters.era]
  )

  const eraBase = React.useMemo(
    () =>
      entries.filter(
        entry => bySearch(entry) && byCategory(entry) && byTag(entry)
      ),
    [entries, needle, filters.category, filters.tag]
  )

  /* Everything except the tag facet. The refinement row is built from this so
     that picking a tag does not collapse the row to the one tag you picked —
     the alternatives have to stay on screen to be alternatives. */
  const narrowed = React.useMemo(
    () =>
      entries.filter(
        entry => bySearch(entry) && byCategory(entry) && byEra(entry)
      ),
    [entries, filters.category, filters.era, needle]
  )

  const visible = React.useMemo(
    () => (filters.tag ? narrowed.filter(byTag) : narrowed),
    [narrowed, filters.tag]
  )

  const categories = React.useMemo(() => {
    const counts = new Map()
    categoryBase.forEach(entry =>
      counts.set(entry.categorySlug, (counts.get(entry.categorySlug) || 0) + 1)
    )
    return categoryOrder.map(category => ({
      ...category,
      count: counts.get(category.slug) || 0,
    }))
  }, [categoryOrder, categoryBase])

  const eraCounts = React.useMemo(() => {
    const counts = new Map(ERAS.map(era => [era.id, 0]))
    eraBase.forEach(entry => {
      if (counts.has(entry.era)) counts.set(entry.era, counts.get(entry.era) + 1)
    })
    return counts
  }, [eraBase])

  /* Only tags that are actually present in what is on screen, commonest
     first. The old index offered all 268 of them at once, which is a wall,
     not a filter. */
  const refineTags = React.useMemo(() => {
    const counts = new Map()
    narrowed.forEach(entry =>
      entry.tags.forEach(tag => {
        const key = tag.toLowerCase()
        const seen = counts.get(key) || { label: tag, count: 0 }
        seen.count += 1
        counts.set(key, seen)
      })
    )
    return [...counts.entries()]
      .map(([key, seen]) => ({ key, ...seen }))
      .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key))
  }, [narrowed])

  /* Even one category's worth of tags runs to the high thirties, so the row
     opens at a readable length and admits how much it is holding back. */
  const TAG_ROW = 12
  const shownTags = showAllTags ? refineTags : refineTags.slice(0, TAG_ROW)
  const hiddenTagCount = refineTags.length - shownTags.length

  React.useEffect(() => {
    setShowAllTags(false)
  }, [filters.category, filters.era, needle])

  const categoryLabel = categories.find(c => c.slug === filters.category)?.label
  const eraLabel = ERAS.find(era => era.id === filters.era)?.label

  const activeBits = []
  if (categoryLabel) activeBits.push(categoryLabel)
  if (filters.tag) activeBits.push(filters.tag)
  if (eraLabel) activeBits.push(eraLabel)
  if (needle) activeBits.push(`“${filters.q.trim()}”`)

  const headline =
    categoryLabel || (needle ? "Search results" : eraLabel || "All posts")

  /* The tag refinement row is secondary by definition: it only means anything
     once something else has already cut the archive down. A tag arriving in
     the URL on its own still opens it, or there would be no way to let go. */
  const showRefine = Boolean(filters.category || needle || filters.tag)

  return (
    <Layout>
      <div className="page">
        <div className="page__inner">
          <header className="masthead">
            <img
              className="masthead__plate"
              src="/images/writing-hero.jpg"
              alt=""
              loading="eager"
              decoding="async"
            />
            <p className="eyebrow">Writing / Archive</p>
            <h1 className="masthead__title">Notes from close to the system.</h1>
            <p className="masthead__intro">
              Seventeen years of working notes on architecture, distributed
              systems, and now AI — written while building, not after.
            </p>
          </header>

          <section className="filters" aria-label="Filter the archive">
            <div className="search">
              <label className="search__label" htmlFor="archive-search">
                Search
              </label>
              <input
                id="archive-search"
                className="search__input"
                type="search"
                autoComplete="off"
                placeholder="Title, tag, category or summary"
                value={filters.q}
                onChange={event => update({ q: event.target.value })}
              />
              {filters.q && (
                <button
                  type="button"
                  className="search__clear"
                  onClick={() => update({ q: "" })}
                >
                  Clear
                  <span className="visually-hidden"> the search</span>
                </button>
              )}
            </div>

            <div className="tags" role="group" aria-label="Category">
              <button
                type="button"
                className={`tag${!filters.category ? " is-active" : ""}`}
                onClick={() => update({ category: "", tag: "" })}
                aria-pressed={!filters.category}
              >
                All
                <span className="tag__count">{categoryBase.length}</span>
              </button>
              {categories.map(category => (
                <button
                  type="button"
                  key={category.slug}
                  /* A chip counting zero is a dead end — the search has
                     already emptied it. Say so and refuse the click rather
                     than letting someone land on a blank list and wonder
                     which of the two filters broke. */
                  disabled={
                    category.count === 0 && filters.category !== category.slug
                  }
                  className={`tag${
                    filters.category === category.slug ? " is-active" : ""
                  }${category.count === 0 ? " is-empty" : ""}`}
                  /* Switching category drops the tag with it: a tag borrowed
                     from the category you just left almost always lands on
                     nothing, and an empty result reads as a broken filter. */
                  onClick={() =>
                    update({
                      category:
                        filters.category === category.slug ? "" : category.slug,
                      tag: "",
                    })
                  }
                  aria-pressed={filters.category === category.slug}
                >
                  {category.label}
                  <span className="tag__count">{category.count}</span>
                </button>
              ))}
            </div>

            <div className="chips" role="group" aria-label="Era">
              <span className="chips__label" aria-hidden="true">
                Era
              </span>
              {ERAS.map(era => (
                <button
                  type="button"
                  key={era.id}
                  disabled={
                    eraCounts.get(era.id) === 0 && filters.era !== era.id
                  }
                  className={`chip${filters.era === era.id ? " is-active" : ""}${
                    eraCounts.get(era.id) === 0 ? " is-empty" : ""
                  }`}
                  onClick={() =>
                    update({ era: filters.era === era.id ? "" : era.id })
                  }
                  aria-pressed={filters.era === era.id}
                >
                  {era.label}
                  <span className="chip__count">{eraCounts.get(era.id)}</span>
                </button>
              ))}
            </div>

            {showRefine && refineTags.length > 0 && (
              <div className="chips" role="group" aria-label="Tag">
                <span className="chips__label" aria-hidden="true">
                  Tags here
                </span>
                {shownTags.map(tag => (
                  <button
                    type="button"
                    key={tag.key}
                    className={`chip${
                      filters.tag === tag.key ? " is-active" : ""
                    }`}
                    onClick={() =>
                      update({ tag: filters.tag === tag.key ? "" : tag.key })
                    }
                    aria-pressed={filters.tag === tag.key}
                  >
                    {tag.label}
                    <span className="chip__count">{tag.count}</span>
                  </button>
                ))}
                {hiddenTagCount > 0 && (
                  <button
                    type="button"
                    className="chip chip--more"
                    onClick={() => setShowAllTags(true)}
                  >
                    {hiddenTagCount} more
                  </button>
                )}
                {showAllTags && refineTags.length > TAG_ROW && (
                  <button
                    type="button"
                    className="chip chip--more"
                    onClick={() => setShowAllTags(false)}
                  >
                    Fewer
                  </button>
                )}
              </div>
            )}
          </section>

          <div className="section-head">
            <h2 className="section-head__title">{headline}</h2>
            <span className="section-head__count">
              {visible.length} {visible.length === 1 ? "post" : "posts"}
            </span>
            {activeBits.length > 0 && (
              <p className="filters__summary">
                <span>Filtered by {activeBits.join(" · ")}</span>
                <button
                  type="button"
                  className="filters__reset"
                  onClick={clearAll}
                >
                  Clear all
                </button>
              </p>
            )}
          </div>

          <ol className="posts">
            {visible.map(entry => (
              <li key={entry.post.id} className="posts__item">
                {/* The row's link stops at the excerpt so the tags below it
                    can be real buttons. An anchor stretched over the whole
                    row would swallow them, and nesting them inside it would
                    be invalid — so the two live side by side and the row
                    itself carries the hover. */}
                <div className="post-row">
                  <Link
                    className="post-row__lead"
                    to={entry.post.fields?.slug || "#"}
                  >
                    <time className="post-row__date">
                      {entry.post.frontmatter.date}
                    </time>
                    <div className="post-row__body">
                      <h3 className="post-row__title">
                        {entry.post.frontmatter.title}
                      </h3>
                      <p className="post-row__excerpt">{entry.summary}</p>
                    </div>
                    <span className="post-row__cue" aria-hidden="true">
                      →
                    </span>
                  </Link>
                  {entry.tags.length > 0 && (
                    <ul className="post-row__tags">
                      {entry.tags.map(tag => (
                        <li key={tag}>
                          <button
                            type="button"
                            className={`post-row__tag${
                              filters.tag === tag.toLowerCase()
                                ? " is-active"
                                : ""
                            }`}
                            onClick={() =>
                              update({
                                tag:
                                  filters.tag === tag.toLowerCase()
                                    ? ""
                                    : tag.toLowerCase(),
                              })
                            }
                            aria-pressed={filters.tag === tag.toLowerCase()}
                          >
                            {tag}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {visible.length === 0 && (
            <p className="posts__empty">
              Nothing in the archive matches{" "}
              {activeBits.length > 0 ? activeBits.join(" · ") : "that"}.{" "}
              <button
                type="button"
                className="posts__empty-reset"
                onClick={clearAll}
              >
                Clear the filters
              </button>{" "}
              to see all {entries.length} posts.
            </p>
          )}
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        id
        excerpt(pruneLength: 220)
        fields {
          slug
        }
        frontmatter {
          date(formatString: "DD MMM YYYY")
          year: date(formatString: "YYYY")
          title
          description
          category
          tags
        }
      }
    }
  }
`

export const Head = () => (
  <Seo
    title="Writing"
    description="Notes on software architecture, distributed systems and AI systems delivery, by Brian Keating."
  />
)

export default BlogPage
