# 🧩  Professional Services

{% assign sections = include.sections %}
{% if sections == nil %}
  {% if page.service_sections %}
    {% assign sections = page.service_sections %}
  {% else %}
    {% assign services_page = site.pages | where: 'permalink', '/services/' | first %}
    {% if services_page %}
      {% assign sections = services_page.service_sections | default: [] %}
    {% else %}
      {% assign sections = [] %}
    {% endif %}
  {% endif %}
{% endif %}
{% assign sections = sections | default: [] %}

{% assign total_items = 0 %}
{% for section in sections %}
  {% assign section_items = section.items | default: [] %}
  {% if include.featured_only %}
    {% assign section_items = section_items | where: 'featured', true %}
  {% endif %}
  {% assign section_count = section_items | size %}
  {% assign total_items = total_items | plus: section_count %}
{% endfor %}

{% assign limit = include.limit %}
{% if limit %}
  {% assign limit = limit | plus: 0 %}
  {% if limit > total_items %}
    {% assign limit = total_items %}
  {% elsif limit < 0 %}
    {% assign limit = 0 %}
  {% endif %}
{% else %}
  {% assign limit = total_items %}
{% endif %}

{% if total_items == 0 or limit == 0 %}
<p>No professional service activities are available at this time. Please check back later.</p>
{% else %}
  {% assign displayed = 0 %}
  {% assign limited = false %}
  {% if limit < total_items %}
    {% assign limited = true %}
  {% endif %}
  {% for section in sections %}
    {% assign section_items = section.items | default: [] %}
    {% if include.featured_only %}
      {% assign section_items = section_items | where: 'featured', true %}
    {% endif %}
    {% assign section_count = section_items | size %}
    {% if section_count == 0 %}
      {% continue %}
    {% endif %}
    {% assign remaining = limit | minus: displayed %}
    {% if remaining <= 0 %}
      {% break %}
    {% endif %}
    {% assign items_to_show = section_count %}
    {% if limited and remaining < items_to_show %}
      {% assign items_to_show = remaining %}
    {% endif %}

## {{ section.title }}

{% for item in section_items limit: items_to_show %}
- {{ item.text | default: item }}
{% endfor %}
{: .services-list}

    {% assign displayed = displayed | plus: items_to_show %}
    {% if displayed >= limit %}
      {% break %}
    {% endif %}
  {% endfor %}
{% endif %}

{% if include.show_button and limit < total_items %}
<p class="news-actions">
  <a class="btn" href="{{ '/services/' | relative_url }}">More Services</a>
</p>
{% endif %}
