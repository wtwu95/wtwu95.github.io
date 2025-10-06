# <span data-lang="en">💬 Recent News</span><span data-lang="zh" hidden>💬 最新动态</span>

{% assign news_items = site.data.news | default: [] %}
{% assign news_count = news_items | size %}
{% assign limit = include.limit %}
{% if limit %}
  {% assign limit = limit | plus: 0 %}
  {% if limit > news_count %}
    {% assign limit = news_count %}
  {% elsif limit < 0 %}
    {% assign limit = 0 %}
  {% endif %}
{% else %}
  {% assign limit = news_count %}
{% endif %}

{% assign has_items = news_count > 0 %}
{% assign is_limited = limit < news_count %}

{% if has_items %}
  {% capture years_raw %}{% for item in news_items %}{% if item.year %}{{ item.year }},{% endif %}{% endfor %}{% endcapture %}
  {% capture tags_raw %}{% for item in news_items %}{% if item.tags %}{% for tag in item.tags %}{{ tag }},{% endfor %}{% endif %}{% endfor %}{% endcapture %}
  {% assign year_list = years_raw | split: ',' | uniq | sort | reverse %}
  {% assign tag_list = tags_raw | split: ',' | uniq | sort %}
  {% assign show_tag_filter = false %}
  {% assign show_year_filter = false %}
  {% for tag in tag_list %}
    {% if tag != '' %}
      {% assign show_tag_filter = true %}
    {% endif %}
  {% endfor %}
  {% for year in year_list %}
    {% if year != '' %}
      {% assign show_year_filter = true %}
    {% endif %}
  {% endfor %}

  <div class="news-widget" data-news-widget data-initial-limit="{{ limit }}" data-total-count="{{ news_count }}">
    {% if show_tag_filter or show_year_filter %}
    <div class="news-filters">
      {% if show_tag_filter %}
      <div class="news-filter-group" data-filter-group="tag" role="group">
        <span class="news-filter-label">
          <span data-lang="en">Category</span>
          <span data-lang="zh" hidden>类别</span>
        </span>
        <div class="news-filter-options">
          <button type="button" class="news-filter-button is-active" data-filter-button data-filter-group="tag" data-filter-value="" aria-pressed="true">
            <span data-lang="en">All categories</span>
            <span data-lang="zh" hidden>全部类别</span>
          </button>
          {% for tag in tag_list %}
            {% if tag != '' %}
              {% assign tag_label_en = tag %}
              {% assign tag_label_zh = tag %}
              {% case tag %}
                {% when 'publication' %}
                  {% assign tag_label_en = 'Publications' %}
                  {% assign tag_label_zh = '论文成果' %}
                {% when 'honor' %}
                  {% assign tag_label_en = 'Honors & Awards' %}
                  {% assign tag_label_zh = '荣誉与奖项' %}
                {% when 'program' %}
                  {% assign tag_label_en = 'Programs & Funding' %}
                  {% assign tag_label_zh = '项目与资助' %}
              {% endcase %}
              <button type="button" class="news-filter-button" data-filter-button data-filter-group="tag" data-filter-value="{{ tag }}" aria-pressed="false">
                <span data-lang="en">{{ tag_label_en }}</span>
                <span data-lang="zh" hidden>{{ tag_label_zh }}</span>
              </button>
            {% endif %}
          {% endfor %}
        </div>
      </div>
      {% endif %}

      {% if show_year_filter %}
      <div class="news-filter-group" data-filter-group="year" role="group">
        <span class="news-filter-label">
          <span data-lang="en">Year</span>
          <span data-lang="zh" hidden>年份</span>
        </span>
        <div class="news-filter-options">
          <button type="button" class="news-filter-button is-active" data-filter-button data-filter-group="year" data-filter-value="" aria-pressed="true">
            <span data-lang="en">All years</span>
            <span data-lang="zh" hidden>全部年份</span>
          </button>
          {% for year in year_list %}
            {% if year != '' %}
            <button type="button" class="news-filter-button" data-filter-button data-filter-group="year" data-filter-value="{{ year }}" aria-pressed="false">
              {{ year }}
            </button>
            {% endif %}
          {% endfor %}
        </div>
      </div>
      {% endif %}
    </div>
    {% endif %}

    <ul class="news-list" data-news-list>
      {% for item in news_items %}
        {% assign item_en = item.en | default: nil %}
        {% assign item_zh = item.zh | default: nil %}
        {% assign tags = item.tags | default: nil %}
        {% assign tag_string = '' %}
        {% if tags %}
          {% assign tag_string = tags | join: ' ' %}
        {% endif %}
        <li class="news-item" data-news-item data-tags="{{ tag_string }}"{% if item.year %} data-year="{{ item.year }}"{% endif %}{% if is_limited and forloop.index > limit %} hidden{% endif %}>
          {% if item_en %}<span data-lang="en">{{ item_en }}</span>{% endif %}
          {% if item_zh %}<span data-lang="zh"{% if item_en %} hidden{% endif %}>{{ item_zh }}</span>{% endif %}
        </li>
      {% endfor %}
    </ul>

    <p class="news-empty-message" data-news-empty hidden>
      <span data-lang="en">No news items match the current filters.</span>
      <span data-lang="zh" hidden>没有符合当前筛选条件的消息。</span>
    </p>

    {% if is_limited %}
    <button type="button" class="news-expand-btn" data-action="expand-news" aria-expanded="false">
      <span data-lang="en">Show all news</span>
      <span data-lang="zh" hidden>展开全部</span>
    </button>
    {% endif %}
  </div>
{% else %}
  <p data-lang="en">No news items are available right now. Please check back later.</p>
  <p data-lang="zh" hidden>暂无消息更新，欢迎稍后再来查看。</p>
{% endif %}
