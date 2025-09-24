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

{% if limit > 0 %}
{% for item in news_items limit: limit %}
- {{ item }}
{% endfor %}
{: .news-list}
{% else %}
<p>No news items are available right now. Please check back later.</p>
{% endif %}

{% if include.show_button and limit < news_count %}
<p class="news-actions">
  <a class="btn" href="{{ '/news/' | relative_url }}">更多新闻 →</a>
</p>
{% endif %}
