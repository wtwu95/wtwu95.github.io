---
sections:
  - id: journal-editorial-boards
    title: 'Journal Editorial Boards'
    items:
      - id: jaics-young-editorial
        text: '**Young Editorial Board Member**: [Journal of Artificial Intelligence & Control Systems](http://www.coscipress.com/journal/JAICS) (2025-present)'
  - id: conference-program-committee
    title: 'Conference Program Committee and Editorial'
    items:
      - id: acirs-special-session-organizer
        text: '**Organizer** for "Special Session 2. Distributed Optimization and Control for Robot Systems" at the 2025 10th Asia-Pacific Conference on Intelligent Robot Systems (ACIRS)'
  - id: teaching
    title: 'Teaching'
    items:
      - id: polyu-dynamical-systems-ta
        text: '**Teaching Assistant** for Dynamical Systems and Control at The Hong Kong Polytechnic University (09/2025 - present)'
  - id: journal-reviewer
    title: 'Journal Reviewer'
    items:
      - id: ieee-tac
        text: '[IEEE Transactions on Automatic Control](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=9)'
      - id: ieee-csl
        text: '[IEEE Control Systems Letters](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=7782673)'
      - id: ieee-tcyb
        text: '[IEEE Transactions on Cybernetics](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6221036)'
      - id: ieee-ticps
        text: '[IEEE Transactions on Industrial Cyber-Physical Systems](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8254253)'
      - id: ieee-tvt
        text: '[IEEE Transactions on Vehicular Technology](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=25)'
      - id: ieee-tte
        text: '[IEEE Transactions on Transportation Electrification](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6687312)'
      - id: ieee-o-jies
        text: '[IEEE Open Journal of the Industrial Electronics Society](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8782712)'
      - id: ieee-caa-jas
        text: '[IEEE/CAA Journal of Automatica Sinica](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6570650)'
      - id: ieee-tie
        text: '[IEEE Transactions on Industrial Electronics](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=41)'
      - id: ieee-tiv
        text: '[IEEE Transactions on Intelligent Vehicles](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=7274857)'
      - id: ieee-smcs
        text: '[IEEE Transactions on Systems, Man, and Cybernetics: Systems](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6221021)'
      - id: ieee-iotj
        text: '[IEEE Internet of Things Journal](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6488907)'
      - id: ocean-engineering
        text: '[Ocean Engineering](https://www.sciencedirect.com/journal/ocean-engineering)'
      - id: isa-transactions
        text: '[ISA Transactions](https://www.sciencedirect.com/journal/isa-transactions)'
      - id: cssp
        text: '[Circuits, Systems, and Signal Processing](https://link.springer.com/journal/34)'
      - id: ijrnc
        text: '[International Journal of Robust and Nonlinear Control](https://onlinelibrary.wiley.com/journal/10991239)'
      - id: nonlinear-dynamics
        text: '[Nonlinear Dynamics](https://link.springer.com/journal/11071)'
  - id: conference-reviewer
    title: 'Conference Reviewer'
    items:
      - id: ieee-cdc
        text: 'IEEE Conference on Decision and Control (CDC)'
      - id: acc
        text: 'American Control Conference (ACC)'
      - id: iecon
        text: 'Annual Conference of the IEEE Industrial Electronics Society (IECON)'
      - id: ccc
        text: 'Chinese Control Conference (CCC)'
      - id: ccdc
        text: 'Chinese Control and Decision Conference (CCDC)'
home_sections:
  - section: journal-editorial-boards
    items:
      - jaics-young-editorial
  - section: conference-program-committee
    items:
      - acirs-special-session-organizer
  - section: teaching
    items:
      - polyu-dynamical-systems-ta
  - section: journal-reviewer
    items:
      - ieee-tac
      - ieee-csl
      - ieee-tcyb
      - ieee-ticps
  - section: conference-reviewer
    items:
      - ieee-cdc
      - acc
---
{% assign all_sections = include.sections | default: sections %}
{% assign context = include.context | default: 'full' %}
{% assign heading_tag = include.heading_tag | default: 'h1' %}
{% assign anchor_id = include.anchor_id | default: '-professional-services' %}
{% assign button_label = include.button_label | default: 'Full List' %}
{% assign button_url = include.button_url | default: '/services/' %}
{% assign total_limit = include.limit %}

<span class='anchor' id='{{ anchor_id }}'></span>
<{{ heading_tag }}>🧩&nbsp; Professional Services</{{ heading_tag }}>

{% if context == 'home' %}
  {% assign selection = include.selection | default: home_sections %}
  {% assign displayed = 0 %}
  {% assign rendered_any = false %}
  {% for selection_entry in selection %}
    {% assign section = all_sections | where: 'id', selection_entry.section | first %}
    {% if section %}
      {% assign section_items = section.items | default: [] %}
      {% if selection_entry.items %}
        {% assign filtered_items = '' | split: '' %}
        {% for item_id in selection_entry.items %}
          {% assign item = section_items | where: 'id', item_id | first %}
          {% if item %}
            {% assign filtered_items = filtered_items | push: item %}
          {% endif %}
        {% endfor %}
        {% assign section_items = filtered_items %}
      {% endif %}
      {% assign section_count = section_items | size %}
      {% if section_count > 0 %}
        {% if total_limit %}
          {% assign remaining = total_limit | minus: displayed %}
          {% if remaining <= 0 %}
            {% break %}
          {% endif %}
        {% endif %}
        {% assign rendered_any = true %}

## {{ section.title }}

        {% assign items_rendered = 0 %}
        {% if total_limit %}
          {% assign remaining = total_limit | minus: displayed %}
        {% endif %}
        {% for item in section_items %}
          {% if total_limit %}
            {% assign remaining = total_limit | minus: displayed %}
            {% if remaining <= 0 %}
              {% break %}
            {% endif %}
          {% endif %}
- {{ item.text }}
          {% assign displayed = displayed | plus: 1 %}
          {% assign items_rendered = items_rendered | plus: 1 %}
        {% endfor %}
{: .services-list}
      {% endif %}
    {% endif %}
  {% endfor %}
  {% unless rendered_any %}
<p>No professional service activities are available at this time. Please check back later.</p>
  {% endunless %}
{% else %}
  {% assign rendered_any = false %}
  {% for section in all_sections %}
    {% assign section_items = section.items | default: [] %}
    {% assign section_count = section_items | size %}
    {% if section_count > 0 %}
      {% assign rendered_any = true %}

## {{ section.title }}

      {% assign displayed = 0 %}
      {% for item in section_items %}
        {% if total_limit %}
          {% assign remaining = total_limit | minus: displayed %}
          {% if remaining <= 0 %}
            {% break %}
          {% endif %}
        {% endif %}
- {{ item.text }}
        {% assign displayed = displayed | plus: 1 %}
      {% endfor %}
{: .services-list}
    {% endif %}
  {% endfor %}
  {% unless rendered_any %}
<p>No professional service activities are available at this time. Please check back later.</p>
  {% endunless %}
{% endif %}

{% if include.show_button != false and context == 'home' and rendered_any %}
<p class="news-actions">
  <a class="btn" href="{{ button_url | relative_url }}">{{ button_label }}</a>
</p>
{% endif %}
