---
title: Python Graph snippets
excerpt_separator: <!--more-->
---

Plotly Express snippets, for quick plots in Python.

<!--more-->
<!-- <head>
<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.10/require.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
</head> -->

The objective of this post is to provide quick notes and how to for common graphs. For more inspiration check out the actual Plotly Express [website](https://plotly.com/python/plotly-express/).

# For starters
```python
import pandas
import plotly.express as px
%load_ext autoreload
%autoreload 2

layout = {
    'showlegend': False,
    'margin': {'b':10, 'l':20, 'r':50, 't':50},
    'font': {'size': 19},
    'xaxis': {'zerolinewidth': 2, 'zerolinecolor':'black'},
    'yaxis': {'zerolinewidth': 2, 'zerolinecolor':'black'},
    'template': 'plotly_dark',
}
px.defaults.color_discrete_sequence = px.colors.qualitative.T10

# Convenient function to display dataframe
def display_n(df,n):
    with pandas.option_context('display.max_rows',n*2):
        display(df)
```

Here is a convinient list of Plotly's default colors :

    '#1f77b4', rgba(55, 128, 191, 1.0) // muted blue
    '#ff7f0e', rgba(255, 127, 14, 1.0) // safety orange
    '#2ca02c', rgba(44, 160, 44, 1.0) // cooked asparagus green
    '#d62728', rgba(214, 39, 40, 1.0) // brick red
    '#9467bd', rgba(148, 103, 189, 1.0) // muted purple
    '#8c564b', rgba(140, 86, 75, 1.0) // chestnut brown
    '#e377c2', rgba(227, 119, 194, 1.0) // raspberry yogurt pink
    '#7f7f7f', rgba(127, 127, 127, 1.0) // middle gray
    '#bcbd22', rgba(188, 189, 34, 1.0) // curry yellow-green
    '#17becf' rgba(23, 190, 207, 1.0)  // blue-teal

More on discrete color sequences [here](https://plotly.com/python/discrete-color/#color-sequences-in-plotly-express), or continuous ones [here](https://plotly.com/python/builtin-colorscales/)

# Time to graph
```python
fig = px.bar(plt, x='index', y='self_suff_%', color='algo',
             barmode='group', opacity=0.8)
fig.update_layout(
    layout,
    showlegend=True,
    xaxis={'title': 'Data Source'},
    yaxis={'title': 'Self Sufficiency [%]'})
fig.show()
```
```python
fig = px.line(plt)
fig = px.scatter(plt)
```

# Changing the look of traces
Update trace properties afterwards.
```python
fig.update_traces({'line': {'width' : 3}})
fig.data[0].update({'line': {'dash': 'dash'}})
```

# Adding notation and shapes
Creates an arrow with a rounded end, and display the text.
```python
fig.add_annotation(
  x=x_pos, y=y_pos,
  text=f'text',
  arrowhead=6, arrowsize=5, ax=0, ay=-40)
```

Adding a red dashed line.
```python
fig.add_shape(
  type='line',
  x0=x0, x1=x1, y0=y0, y1=y1,
  line={'dash': 'dash', 'width': 3,
        'color': 'rgba(214, 39, 40, 0.9)'})
```

# Vectorizing
```python
 fig.write_image("fig.pdf")
```
