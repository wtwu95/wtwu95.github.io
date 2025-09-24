---
awards:
  - id: award-young-elite-scientist
    text: '2025 &nbsp; **<span style="color:red">Inaugural Doctoral Special Program of Young Elite Scientist Sponsorship Program</span>**'
  - id: award-outstanding-shanghai-graduate
    text: '2025 &nbsp; Outstanding Graduate of Shanghai'
  - id: award-national-scholarships
    text: '2024 · 2023 · 2020 &nbsp; **<span style="color:red">National Scholarships for Graduate Students</span>**'
  - id: award-high-level-university-program
    text: '2023 &nbsp; State-Sponsored Postgraduate Program for National Construction of High-Level Universities'
  - id: award-ccsicc-best-student
    text: '2023 &nbsp; **<span style="color:red">Best Student Paper Nomination Award</span>** of the 7th CCSICC'
  - id: award-first-level-doctoral-scholarship
    text: '2023 &nbsp; First-Level Scholarship for Doctoral Students'
  - id: award-research-talents-scholarship
    text: '2023 &nbsp; Scientific Research Talents Graduate Student Scholarship'
  - id: award-aviation-innovation
    text: '2023 &nbsp; Third Award of the First Aviation Innovation Challenge of the PLA Air Force'
  - id: award-liaoning-master-dissertation
    text: '2022 &nbsp; **<span style="color:red">Excellent Master Dissertation Award</span>** of Liaoning Province'
  - id: award-high-impact-papers
    text: '2022 &nbsp; Top 10 High-Impact Papers of Chinese Journal of Ship Research — selected from articles published in 2019–2021'
  - id: award-hainan-innovation
    text: '2022 &nbsp; First Prize of Hainan Free Trade Port Innovation and Entrepreneurship Contest'
  - id: award-dmu-master-dissertation
    text: '2021 &nbsp; Excellent Master Dissertation Award of Dalian Maritime University'
  - id: award-outstanding-graduate-dalian
    text: '2020 &nbsp; Outstanding Graduate of Dalian'
  - id: award-liaoning-electronic-design
    text: '2020 &nbsp; First Prize of Liaoning Provincial Graduate Electronic Design Contest'
  - id: award-national-electronic-design
    text: '2019 · 2020 &nbsp; First Prizes of National Graduate Electronic Design Contest in Northeast Division'
home_awards:
  - award-young-elite-scientist
  - award-outstanding-shanghai-graduate
  - award-national-scholarships
  - award-high-level-university-program
  - award-ccsicc-best-student
---
{% assign all_awards = include.awards | default: awards %}
{% assign context = include.context | default: 'full' %}
{% assign heading_tag = include.heading_tag | default: 'h1' %}
{% assign anchor_id = include.anchor_id | default: '-awards' %}
{% assign button_label = include.button_label | default: 'Full List' %}
{% assign button_url = include.button_url | default: '/awards/' %}
{% assign limit = include.limit %}

{% assign awards_to_render = all_awards %}
{% if context == 'home' %}
  {% assign awards_to_render = '' | split: '' %}
  {% assign selected_ids = include.ids | default: home_awards %}
  {% if selected_ids and selected_ids != empty %}
    {% for award_id in selected_ids %}
      {% assign award = all_awards | where: 'id', award_id | first %}
      {% if award %}
        {% assign awards_to_render = awards_to_render | push: award %}
      {% endif %}
    {% endfor %}
  {% else %}
    {% assign highlighted_awards = all_awards | where: 'homepage', true %}
    {% if highlighted_awards and highlighted_awards != empty %}
      {% assign awards_to_render = highlighted_awards %}
    {% else %}
      {% assign awards_to_render = all_awards %}
    {% endif %}
  {% endif %}
{% endif %}

{% if limit %}
  {% assign awards_to_render = awards_to_render | slice: 0, limit %}
{% endif %}

{% assign awards_count = awards_to_render | size %}

<span class='anchor' id='{{ anchor_id }}'></span>
<{{ heading_tag }}>🎖 Awards</{{ heading_tag }}>

{% if awards_count > 0 %}
{% for award in awards_to_render %}
- {{ award.text }}
{% endfor %}
{: .awards-list}
{% else %}
<p>No awards are available at this time. Please check back later.</p>
{% endif %}

{% if include.show_button != false and context == 'home' and awards_count > 0 %}
<p class="news-actions">
  <a class="btn" href="{{ button_url | relative_url }}">{{ button_label }}</a>
</p>
{% endif %}
