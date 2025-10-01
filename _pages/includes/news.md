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

{% if limit > 0 %}
{% for item in news_items limit: limit %}
{% assign item_en = item.en | default: nil %}
{% assign item_zh = item.zh | default: nil %}
{% if item_en or item_zh %}
- {% if item_en %}<span data-lang="en">{{ item_en }}</span>{% endif %}{% if item_zh %}<span data-lang="zh"{% if item_en %} hidden{% endif %}>{{ item_zh }}</span>{% endif %}
{% else %}
- {{ item }}
{% endif %}
{% endfor %}
{: .news-list}
{% else %}
<p data-lang="en">No news items are available right now. Please check back later.</p>
<p data-lang="zh" hidden>暂无消息更新，欢迎稍后再来查看。</p>
{% endif %}

{% if include.show_button and limit < news_count %}
<!-- <p class="news-actions">
  <a class="btn" href="{{ '/news/' | relative_url }}">
    <span data-lang="en">-- Read More News --</span>
    <span data-lang="zh" hidden>-- 查看更多消息 --</span>
  </a>
</p> -->
{% endif %}
