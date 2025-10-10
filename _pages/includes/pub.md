# <span data-lang="en">📚 Publications</span><span data-lang="zh" hidden>📚 论文列表</span>


<div class="publication-controls">
  <input
    type="search"
    id="publication-search"
    class="publication-search"
    placeholder="Search publications..."
    aria-label="Search publications"
    data-placeholder-en="Search publications..."
    data-placeholder-zh="搜索成果..."
    data-aria-label-en="Search publications"
    data-aria-label-zh="搜索成果"
  >
  <select id="publication-type-filter" data-label-en="Type" data-label-zh="类型">
    <option value="all">Type</option>
  </select>
  <select id="publication-year-filter" data-label-en="Date" data-label-zh="日期">
    <option value="all">Date</option>
  </select>
  <button
    type="button"
    id="publication-year-sort"
    class="publication-sort"
    aria-label="Sort by newest"
    data-aria-label-en="Sort by newest"
    data-aria-label-zh="按最新排序"
  >
    <svg
      class="publication-sort-icon"
      viewBox="0 0 1025 1024"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M754.012 538a59.832 59.832 0 0 1 40.055 15.402c24.663 22.223 26.722 60.323 4.6 85.097L557.154 908.976a60.125 60.125 0 0 1-4.6 4.621c-24.661 22.223-62.587 20.154-84.709-4.62L226.332 638.498A60.418 60.418 0 0 1 211 598.261C211 564.98 237.857 538 270.987 538h483.025zM557.155 117.024L798.668 387.5A60.418 60.418 0 0 1 814 427.739C814 461.02 787.143 488 754.013 488H270.988a59.832 59.832 0 0 1-40.055-15.402c-24.663-22.223-26.722-60.323-4.6-85.097l241.513-270.477a60.125 60.125 0 0 1 4.6-4.621c24.661-22.223 62.587-20.154 84.709 4.62z"
        fill="currentColor"
      />
    </svg>
  </button>
</div>

<ol id="publication-list" class="publication-list"></ol>

{% assign publications = site.data.publications %}
<ul id="publication-source" class="publication-source" hidden>
  {% for pub in publications %}
  <li
    data-type="{{ pub.type }}"
    data-year="{{ pub.year }}"
    {% if pub.date %}data-date="{{ pub.date }}"{% endif %}
    {% if pub.citation_plain %}data-citation-plain="{{ pub.citation_plain | escape_once }}"{% endif %}
    {% if pub.citation_bibtex %}data-citation-bibtex="{{ pub.citation_bibtex | replace: '\n', '&#10;' | escape_once }}"{% endif %}
  >
    {{ pub.body_html | strip }}
    {% if pub.scholar_id %}
    <strong><span class="show_paper_citations" data="{{ pub.scholar_id }}"></span></strong>
    {% endif %}
  </li>
  {% endfor %}
</ul>






{% include citation-modal.html %}

