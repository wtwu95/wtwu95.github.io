# 💬 News

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

{% assign visible_count = include.visible_count %}
{% if visible_count %}
  {% assign visible_count = visible_count | plus: 0 %}
{% else %}
  {% assign visible_count = limit %}
{% endif %}
{% if visible_count < 1 %}
  {% assign visible_count = 1 %}
{% endif %}

{% if limit > 0 %}
<div class="news-window" data-news-window data-visible-count="{{ visible_count }}" tabindex="0" aria-label="Latest news" markdown="1">
{% for item in news_items limit: limit %}
- {{ item }}
{% endfor %}
{: .news-list}
</div>
{% else %}
<p>No news items are available right now. Please check back later.</p>
{% endif %}

{% if include.show_button and limit < news_count %}
<div class="news-window__actions">
  <a class="btn" href="{{ '/news/' | relative_url }}">查看更多</a>
</div>
{% endif %}
