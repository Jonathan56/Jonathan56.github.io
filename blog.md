---
title: Blog
permalink: /blog/
---
<hr>

<div class="content list">
{% if site.posts.size == 0 %}
  <h3>No post found</h3>
{% else %}
{% for post in site.posts %}
  <div class="list-item" style="margin-bottom: 40px;">
    <h3 class="list-post-title">
      <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a>
    </h3>
    <div class="list-post-date" style="margin-bottom: 5px;">
      <time>{{ post.date | date_to_string }}</time>
    </div>
    {{ post.excerpt | strip_html }}
  </div>
{% endfor %}
{% endif %}
</div>
