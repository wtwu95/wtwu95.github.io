# 🎖 Awards

{% assign awards = include.items %}
{% if awards == nil %}
  {% if page.awards %}
    {% assign awards = page.awards %}
  {% else %}
    {% assign awards_page = site.pages | where: 'permalink', '/awards/' | first %}
    {% if awards_page %}
      {% assign awards = awards_page.awards | default: [] %}
    {% else %}
      {% assign awards = [] %}
    {% endif %}
  {% endif %}
{% endif %}

{% if include.featured_only %}
  {% assign awards = awards | where: 'featured', true %}
{% endif %}

{% if include.ids %}
  {% assign filtered_awards = [] %}
  {% for award in awards %}
    {% assign award_id = award.id | default: award.text | default: award %}
    {% if include.ids contains award_id %}
      {% assign filtered_awards = filtered_awards | push: award %}
    {% endif %}
  {% endfor %}
  {% assign awards = filtered_awards %}
{% endif %}

{% assign awards = awards | default: [] %}
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
- {{ award.text | default: award }}
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
