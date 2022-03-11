---
title: Python Graph snippets
excerpt_separator: <!--more-->
---

Plotly Express snippets, for quick plots in Python.

<!--more-->

The objective of this post is to provide quick notes and how to for common graphs. For more inspiration check out the actual Plotly Express [website](https://plotly.com/python/plotly-express/).

# For starters
```python
import pandas as pd
import plotly.express as px

layout = {
    'showlegend': False,
    'margin': {'b':10, 'l':20, 'r':50, 't':50},
    'font': {'size': 19},
    'xaxis': {'zerolinewidth': 2, 'zerolinecolor':'black'},
    'yaxis': {'zerolinewidth': 2, 'zerolinecolor':'black'},
    'template': 'plotly_white',
}
px.defaults.color_discrete_sequence = px.colors.qualitative.T10

# Convenient function to display dataframe
def display_n(df,n):
    with pd.option_context('display.max_rows',n*2):
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

# Bar graph
```python
fig = px.bar(graph)
fig = px.bar(graph, x='index', y='self_suff_%', color='algo',
             barmode='group', opacity=0.8)

# Change bar color, and surrounding line
fig.data[0].update(
   {'marker': {'color': 'rgba(55, 128, 191, 0.7)',
               'line': {'width': 1.5,
               'color': 'rgba(55, 128, 191, 1.0)'}}})
# Red dashed line
fig.add_shape(
 type='line',
 x0="x0", x1="x1", y0=threshold, y1=threshold,
 line={'dash': 'dash', 'width': 5,
       'color': 'rgba(214, 39, 40, 0.7)'})

fig.update_layout(
   layout,
   showlegend=False,
   xaxis_title="",
   yaxis_title="My Title [Unit]")
fig.show()
fig.write_image("fig.svg")
```

# Line graph
```python
fig = px.line(graph)

# One line is filled
fig.update_traces(line_width=3)
fig.data[1].update(fill="tozeroy", line_width=3,
                   fillcolor="rgba(255, 127, 14, 0.1)")

fig.update_layout(
    layout,
    height=400,
    width=800,
    showlegend=False,
    xaxis_title="",
    yaxis_title="Power [kW]",
    yaxis_showline=True, yaxis_linewidth=2, yaxis_linecolor='black',
    xaxis_showline=False, xaxis_linewidth=2, xaxis_linecolor='black',
    rangeslider_visible=False)
fig.show()
fig.write_image("fig.svg")
```
