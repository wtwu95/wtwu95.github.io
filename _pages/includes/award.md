# 🎖 Awards

{% assign awards = site.data.awards | default: [] %}
{% assign awards_count = awards | size %}
{% assign limit = include.limit %}
{% if limit %}
  {% assign limit = limit | plus: 0 %}
  {% if limit > awards_count %}
    {% assign limit = awards_count %}
  {% elsif limit < 0 %}
    {% assign limit = 0 %}
  {% endif %}
{% else %}
  {% assign limit = awards_count %}
{% endif %}

{% if limit > 0 and awards_count > 0 %}
{% for award in awards limit: limit %}
- {{ award }}
{% endfor %}
{: .awards-list}
{% else %}
<p>No awards are available at this time. Please check back later.</p>
{% endif %}

{% if include.show_button and limit < awards_count %}
<p class="news-actions">
  <a class="btn" href="{{ '/awards/' | relative_url }}">More Awards</a>
</p>
{% endif %}
