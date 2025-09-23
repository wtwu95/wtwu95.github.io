# 🧩  Professional Services

{% assign services = "" | split: "" %}
{% assign services = services | push: "Journal Editorial Boards||<strong>Young Editorial Board Member</strong>: <a href='http://www.coscipress.com/journal/JAICS'>Journal of Artificial Intelligence &amp; Control Systems</a> (2025–present)" %}
{% assign services = services | push: "Conference Program Committee and Editorial||<strong>Organizer</strong> for “Special Session 2. Distributed Optimization and Control for Robot Systems” at the 2025 10th Asia-Pacific Conference on Intelligent Robot Systems (ACIRS)" %}
{% assign services = services | push: "Teaching||<strong>Teaching Assistant</strong> for Dynamical Systems and Control at The Hong Kong Polytechnic University (09/2025–present)" %}
{% assign services = services | push: "Journal Reviewer||<a href='https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=9'>IEEE Transactions on Automatic Control</a>" %}
{% assign services = services | push: "Journal Reviewer||<a href='https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=7782673'>IEEE Control Systems Letters</a>" %}
{% assign services = services | push: "Journal Reviewer||<a href='https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6221036'>IEEE Transactions on Cybernetics</a>" %}
{% assign services = services | push: "Journal Reviewer||<a href='https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8254253'>IEEE Transactions on Industrial Cyber-Physical Systems</a>" %}
{% assign services = services | push: "Journal Reviewer||<a href='https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=25'>IEEE Transactions on Vehicular Technology</a>" %}
{% assign services = services | push: "Journal Reviewer||<a href='https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6687312'>IEEE Transactions on Transportation Electrification</a>" %}
{% assign services = services | push: "Journal Reviewer||<a href='https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8782712'>IEEE Open Journal of the Industrial Electronics Society</a>" %}
{% assign services = services | push: "Journal Reviewer||<a href='https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6570650'>IEEE/CAA Journal of Automatica Sinica</a>" %}
{% assign services = services | push: "Journal Reviewer||<a href='https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=41'>IEEE Transactions on Industrial Electronics</a>" %}
{% assign services = services | push: "Journal Reviewer||<a href='https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=7274857'>IEEE Transactions on Intelligent Vehicles</a>" %}
{% assign services = services | push: "Journal Reviewer||<a href='https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6221021'>IEEE Transactions on Systems, Man, and Cybernetics: Systems</a>" %}
{% assign services = services | push: "Journal Reviewer||<a href='https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6488907'>IEEE Internet of Things Journal</a>" %}
{% assign services = services | push: "Journal Reviewer||<a href='https://www.sciencedirect.com/journal/ocean-engineering'>Ocean Engineering</a>" %}
{% assign services = services | push: "Journal Reviewer||<a href='https://www.sciencedirect.com/journal/isa-transactions'>ISA Transactions</a>" %}
{% assign services = services | push: "Journal Reviewer||<a href='https://link.springer.com/journal/34'>Circuits, Systems, and Signal Processing</a>" %}
{% assign services = services | push: "Journal Reviewer||<a href='https://onlinelibrary.wiley.com/journal/10991239'>International Journal of Robust and Nonlinear Control</a>" %}
{% assign services = services | push: "Journal Reviewer||<a href='https://link.springer.com/journal/11071'>Nonlinear Dynamics</a>" %}
{% assign services = services | push: "Conference Reviewer||IEEE Conference on Decision and Control (CDC)" %}
{% assign services = services | push: "Conference Reviewer||American Control Conference (ACC)" %}
{% assign services = services | push: "Conference Reviewer||Annual Conference of the IEEE Industrial Electronics Society (IECON)" %}
{% assign services = services | push: "Conference Reviewer||Chinese Control Conference (CCC)" %}
{% assign services = services | push: "Conference Reviewer||Chinese Control and Decision Conference (CCDC)" %}

{% assign total_items = services | size %}
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
  {% assign current_title = '' %}
  {% for entry in services %}
    {% assign parts = entry | split: '||' %}
    {% assign title = parts[0] | strip %}
    {% assign item = parts[1] | strip %}
    {% if title != current_title %}
      {% if current_title != '' %}
</ul>

      {% endif %}
## {{ title }}
<ul class="services-list">
      {% assign current_title = title %}
    {% endif %}
    <li>{{ item }}</li>
    {% assign displayed = displayed | plus: 1 %}
    {% if displayed >= limit %}
      {% break %}
    {% endif %}
  {% endfor %}
  {% if current_title != '' %}
</ul>

  {% endif %}
{% endif %}

{% if include.show_button and limit < total_items %}
<p class="news-actions">
  <a class="btn" href="{{ '/services/' | relative_url }}">More Services</a>
</p>
{% endif %}
