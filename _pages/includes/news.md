# <span data-lang="en">💬 News</span><span data-lang="zh" hidden>💬 最新动态</span>

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
<p data-lang="en">No news items are available right now. Please check back later.</p>
<p data-lang="zh" hidden>暂无新闻更新，欢迎稍后再来查看。</p>
{% endif %}

{% if include.show_button and limit < news_count %}
<p class="news-actions">
  <a class="btn" href="{{ '/news/' | relative_url }}">
    <span data-lang="en">Read More News</span>
    <span data-lang="zh" hidden>查看更多新闻</span>
  </a>
</p>
{% endif %}
