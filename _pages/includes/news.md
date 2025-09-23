# 💬 News

{% assign news_items = site.data.news %}
{% if page.news_limit %}
  {% assign news_items = news_items | slice: 0, page.news_limit %}
{% endif %}
{% assign enable_scroll = page.news_enable_scroll %}
{% if enable_scroll == nil %}
  {% assign enable_scroll = true %}
{% endif %}
{% assign visible_count = page.news_visible_count | default: 5 %}
{% assign aria_label = page.news_aria_label | default: 'Latest news' %}

<div class="news-window{% unless enable_scroll %} news-window--full{% endunless %}"{% if enable_scroll %} data-news-window data-visible-count="{{ visible_count }}" tabindex="0"{% endif %} aria-label="{{ aria_label }}">
  <ul class="news-list">
    {% for item in news_items %}
      {% capture item_content %}{{ item.content | markdownify }}{% endcapture %}
      {% assign item_content = item_content | replace: '<p>', '' | replace: '</p>', '' | strip %}
      <li><em>{{ item.date }}</em>&nbsp;{{ item_content }}</li>
    {% endfor %}
  </ul>
  {% if page.news_more_link %}
  <div class="news-more">
    <a class="btn" href="{{ page.news_more_link | relative_url }}">查看更多</a>
  </div>
  {% endif %}
</div>
