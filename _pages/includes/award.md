# 🎖 Awards

{% assign awards = "" | split: "" %}
{% assign awards = awards | push: "2025&nbsp; <strong><span style='color:red'>Inaugural Doctoral Special Program of Young Elite Scientist Sponsorship Program</span></strong>" %}
{% assign awards = awards | push: "2025&nbsp; Outstanding Graduate of Shanghai" %}
{% assign awards = awards | push: "2024 · 2023 · 2020&nbsp; <strong><span style='color:red'>National Scholarships for Graduate Students</span></strong>" %}
{% assign awards = awards | push: "2023&nbsp; State-Sponsored Postgraduate Program for National Construction of High-Level Universities" %}
{% assign awards = awards | push: "2023&nbsp; <strong><span style='color:red'>Best Student Paper Nomination Award</span></strong> of the 7th CCSICC" %}
{% assign awards = awards | push: "2023&nbsp; First-Level Scholarship for Doctoral Students" %}
{% assign awards = awards | push: "2023&nbsp; Scientific Research Talents Graduate Student Scholarship" %}
{% assign awards = awards | push: "2023&nbsp; Third Award of the First Aviation Innovation Challenge of the PLA Air Force" %}
{% assign awards = awards | push: "2022&nbsp; <strong><span style='color:red'>Excellent Master Dissertation Award</span></strong> of Liaoning Province" %}
{% assign awards = awards | push: "2022&nbsp; Top 10 High-Impact Papers of <em>Chinese Journal of Ship Research</em> — selected from articles published in 2019–2021" %}
{% assign awards = awards | push: "2022&nbsp; First Prize of Hainan Free Trade Port Innovation and Entrepreneurship Contest" %}
{% assign awards = awards | push: "2021&nbsp; Excellent Master Dissertation Award of Dalian Maritime University" %}
{% assign awards = awards | push: "2020&nbsp; Outstanding Graduate of Dalian" %}
{% assign awards = awards | push: "2020&nbsp; First Prize of Liaoning Provincial Graduate Electronic Design Contest" %}
{% assign awards = awards | push: "2019 · 2020&nbsp; First Prizes of National Graduate Electronic Design Contest in Northeast Division" %}

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
<ul class="awards-list">
  {% for award in awards limit: limit %}
  <li>{{ award }}</li>
  {% endfor %}
</ul>
{% else %}
<p>No awards are available at this time. Please check back later.</p>
{% endif %}

{% if include.show_button and limit < awards_count %}
{% assign awards_full_list_url = '/awards/#-awards' | relative_url %}
<p class="news-actions">
  <a class="btn" href="{{ awards_full_list_url }}">Full List</a>
</p>
{% endif %}
