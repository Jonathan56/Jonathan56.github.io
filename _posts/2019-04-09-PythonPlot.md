---
title: Python Graph snippets
excerpt_separator: <!--more-->
---

Plotly / Cufflinks snippets, for quick plots in Python.

<!--more-->
<!-- <head>
<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.10/require.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
</head> -->


I am organizing snippets by categories, you can find:
* [Bar graph](#bar-graph)
* [Line graph](#line-graph)

The objective of this post is to provide quick notes and how to for common graphs. Snippets must be short, and customisable if needed. Plotly offer dynamic plots easily exportable and completely parametrised from a "simple" key:value format (which is quite nice compared to matplotlib cryptic functions). Cufflinks and Express are convenient to reduce the lengthy key:value format. One of the cons with offline cufflinks/plotly is the size of your Notebooks instantly bumping to about 3.3MB.

```python
# Import Cufflinks offline
import cufflinks as cf
cf.set_config_file(theme='white')
cf.go_offline()

# Convenient function to display dataframe
import pandas
def display_n(df,n):
    with pandas.option_context('display.max_rows',n*2):
        display(df)
```

Before getting started, here is a convinient list of Plotly's default colors :

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

Cufflinks also comes with a few utility functions for colors ([tutorial](https://github.com/santosjorge/cufflinks/blob/master/Cufflinks%20Tutorial%20-%20Colors.ipynb)).
```python
cf.colors.cnames
cf.colors.scales()
cf.colors.color_range('orange',10)
```

# Bar graph
This first example includes selecting data and normalising it, to prevent scale issues. Note that the Dataframe is sorted before plotting to increase readability.

```python
# Select data
index = df.index.tolist()
index.remove('perfect')
df = df.loc[index, ['Autoprod_%', 'Autoconso_%', 'MAE_kW', 'MAPE_%']]
display_n(df.T, 2)

# Normalize and bar graph
normalized_df = (df - df.min()) / (df.max() - df.min())
normalized_df.sort_values('Autoprod_%').iplot(
    kind='bar', dimensions=(1100, 500), yTitle='Normalized [unitless]',
    margin=(70, 20, 50, 20), layout_update={'font': {'size': 16}})
```
![Screenshot 2020-05-04 at 17.08.20](/assets/image/Screenshot%202020-05-04%20at%2017.08.20.png)

Sometimes it might be more useful to look at the actual data (without normalising it). In this case subplots make sense.

```python
(combinations.sort_values('Autoprod_%')
 .loc[:, ['Autoprod_%', 'Autoconso_%', 'MAPE_%', 'MAE_kW']]
 .iplot(kind='bar', subplots=True, subplot_titles=True,
        dimensions=(1100, 600), margin=(50, 20, 70, 70),
        layout_update={'font': {'size': 16}}))
```
![Screenshot 2020-05-04 at 17.18.24](/assets/image/Screenshot%202020-05-04%20at%2017.18.24.png)

# Line graph
Simple graph to look at various times series.
```python
start = '2014-05-01 00:00:00'
end = '2014-05-31 23:45:00'
df.loc[start:end, :].iplot(
  kind='scatter', width=3,
  yTitle='Agg. power demand [kW]',
  dimensions=(1100, 600),
  rangeslider=True, margin=(70, 20, 20, 20),
  layout_update={'font': {'size': 16}})
```
![Screenshot 2020-05-04 at 17.41.12](/assets/image/Screenshot%202020-05-04%20at%2017.41.12.png)

Similar but sampling a random column, and resampling to avoid large graphs.
```python
import random
start = '2007-01-01 00:00:00'
end = '2007-12-31 23:45:00'
cols = random.sample(list(df.columns), 5)
(df.loc[start:end, cols].resample('60T').sum() * 15/60).iplot(
  kind='scatter', width=2,
  yTitle='Agg. power demand [kW]',
  dimensions=(1100, 600), showlegend=True,
  rangeslider=True, margin=(70, 20, 20, 20),
  layout_update={'font': {'size': 16}})
```
