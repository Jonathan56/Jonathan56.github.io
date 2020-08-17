---
title: Organizing simulations in Python
excerpt_separator: <!--more-->
published: true
---

Organizing simulations in Python with Jupyter Notebooks, note to myself.

<!--more-->
First things first, I usually `git clone` a repository created on GitHub, Gitlab, etc. Then I store my data in `data/` and start to explore/clear data with a Jupyter Notebbok  `_1_format_data.ipynb`.

```python
import pandas
import numpy as np
import cufflinks as cf
from datetime import datetime
cf.set_config_file(theme='white')
cf.go_offline()

# Convenient function to display dataframe
def display_n(df,n):
    with pandas.option_context('display.max_rows', n*2):
        display(df)
```
Then comes the long process of creating a simulation prototype `my_template_v1.ipynb`. When developing a notebook I keep in mind to expose all input variables in the first cell (later on those inputs will be replaced with Papermill).

```python
dev = True
if dev:
    # Filenames (correct folder)
    print('Running template in dev mode')
    inputfile = 'data/15min.csv'
    outputfile = 'test.pickle'

    # Simulation period
    start= '2014-05-01 00:00:00'
    end= '2014-05-10 23:45:00'
```
Once I have a functioning simulation, I also try to package functions into an actual Python module (a) my simulation notebook is easier to read (b) when I re-use a function I double check it, which makes it more robust.

# Executing multiple notebooks
At this stage I will archive all the versions of my simulation notebooks (`my_template_vX.ipynb`), to keep the last one. Similarly to the Netflix blog post ["scheduling notebooks"](https://netflixtechblog.com/scheduling-notebooks-348e6c14cfd6) (which I have just discovered) I use Papermill to launch `my_template_vX.ipynb` with different inputs stored in `simulation_matrix.csv`.

![jupyter_workflow](/assets/image/jupyter_workflow.png)

To do that my folder structure looks like this:
```
.
+-- data/
|   +-- my_data.csv
|   +-- simulation_matrix.csv
+-- executed/
+-- _1_format_data.ipynb
+-- _2_simulation_matrix.ipynb
+-- _execute_ch1.ipynb
+-- _my_template.ipynb
+-- README.md
```

## Simulation matrix
`_2_simulation_matrix.ipynb` generate a CSV file with all the simulations I want to run. I add `_simulated`, and `_study` columns to quickly filter through simulations (whether they have been simulated, and for what purpose).

```python
# Imports
import json
import pandas
import numpy as np
from dict_hash import sha256


# Constant inputs
combinations = []
const_dict = {'_simulated': False,
              'start': '2019-01-15 00:00:00',
              'end': '2019-12-31 23:45:00',
              'f_horizon': 2,
              'c_method': 'opti'}

# Variable inputs
pvs = list(np.arange(0.25, 2, 0.25))
for pv in pvs:
    combinations.append(
        {**const_dict,
         **{'_study': 'pv size',
            'nb_houses': 20,
            'f_method': 'perfect',
            'f_kwargs': json.dumps({}),
            'inputfile': '../../data/20_0.pickle',
            'pv_capacity': pv * 20}})
    name = sha256(combinations[-1])[0:10]
    combinations[-1]['ID'] = name
    combinations[-1]['outputfile'] = name + '.pickle'

# DataFrame
combinations = pandas.DataFrame(combinations)
assert combinations['ID'].is_unique, 'Duplicate ID'
combinations.set_index('ID', inplace=True)
print(f'Number of combinations is {len(combinations)}')
display(combinations.head(3).T)
```

![simulation_matrix](/assets/image/simulation_matrice.png)

Furthermore, `_2_simulation_matrix.ipynb` can be run at any time to update the matrix based on the files in `executed/`. This allows to update `_simulated` to ease filtering, as well as removing old simulation results.

```python
# Imports
import glob
import pandas
from tqdm.notebook import tqdm
import nbformat

# Load existing matrix (or re-create it)
combinations = pandas.read_csv(
  'simulation_matrice.csv', index_col=[0])

# Get all the notebooks in folders
folders = ['./executed/v1/']
notebooks = []
for folder in folders:
    # Only select available result
    notebooks.extend(glob.glob(folder + '*.pickle'))  
notebooks = [a.split('pickl')[0] + 'ipynb' for a in notebooks]

# Load results
updated = 0
purged = 0
for notebook in tqdm(notebooks, desc='Progress:', miniters=10):
    nb = nbformat.read(notebook, as_version=nbformat.NO_CONVERT)
    # Notebook didn't solve
    if nb['cells'][1]['source'].split('\n')[0] != '# Parameters':
        continue

    # Parse inputs
    inputs = {}
    for line in nb['cells'][1]['source'].split('\n'):
        if '=' in line:
            name, var = line.split(' = ')
            var = var.replace('"', '')
            inputs[name] = var
            if name in 'outputfile':
                break

    # Hash
    ID = inputs['outputfile'].split('.')[0]

    # If ID not in combination then remove pickle and notebook

    # If same key in combination --> simulated = True
    if not combinations.loc[ID, '_simulated']:
        combinations.loc[ID, '_simulated'] = True
        updated += 1
print(f'Updated lines in the simulation matrice {updated}')
print(f'Simulation purged {purged}')

# Save simulation matrice
combinations.to_csv('simulation_matrice.csv')
```

## Executing notebooks with Papermill
`_execute_ch1.ipynb` launch notebooks after notebooks for all the simulations selected within `simulation_matrix.csv`. Sometimes I duplicate this notebook to accelerate the simulation process with multiple threads (`_execute_ch2.ipynb`).

```python
# Imports
from datetime import datetime
import papermill as pm
import pandas

# Read and select combinations
combinations = pandas.read_csv(
  'simulation_matrice.csv', index_col=[0])
combinations = combinations[
  (combinations._simulated == False) &
  (combinations._study == 'community size') &
  (combinations.f_method == 'Prophet') &
  (combinations.batch.isin([0, 1, 2, 3]))]

# Create folder
folder = 'v1'
!mkdir executed/{folder}
start_timer = datetime.now()

# Execute all the notebooks
sim_index = 0
total_error = 0
for index, row in combinations.iterrows():
    start_timer2 = datetime.now()
    notebook_error = 0
    while notebook_error < 3:
        try:
            _ = pm.execute_notebook(
               '../pylec/pylec/pipeline_v1.ipynb',
               'executed/' + folder + '/' + str(index) + '.ipynb',
                parameters=row.to_dict(),
                cwd='executed/' + folder + '/',
                progress_bar=False,
            )
            notebook_error = 99  # Error check pass
        except Exception as e:
            print(e)
            print('-----')
            notebook_error += 1
            total_error += 1
    time_elapsed = datetime.now() - start_timer2
    print('Simulation', sim_index,
          'time elapsed (hh:mm:ss.ms) {}'.format(time_elapsed))
    print(row.to_dict())
    print('')
    sim_index += 1

    # Too many errors something is fischy
    if total_error > 10:
        break

time_elapsed = datetime.now() - start_timer
print('\n Time elapsed (hh:mm:ss.ms) {}'.format(time_elapsed))
```

# Result / visualization
Once the simulations are run we create `_result.ipynb` to explore results.
```python
# Imports
from datetime import datetime
from tqdm.notebook import tqdm
import pickle
import pandas
import numpy as np
import cufflinks as cf
cf.set_config_file(theme='white')
cf.go_offline()

# Select simulation matrix
combinations = pandas.read_csv(
  'simulation_matrice.csv', index_col=[0])
combinations = combinations[
  (combinations._study == 'community size') &
  (combinations['_simulated'] == True)]

# Open results process / save timeseries
result = pandas.DataFrame()
full_result_index = combinations[
    combinations['nb_houses'] == 20].index.tolist()
full_result = {}

for index, row in tqdm(
combinations.iterrows(), desc='Progress:'):
    # Open full result file
    with open(folder + row['outputfile'], 'rb') as r_file:
        df = pickle.load(r_file)

    # Process full result
    result.loc[index, 'MAPE_%'] = metric.mape(
      df, 'vo_houses_kW', 'f_houses_kW', threshold=0.1)

    # Save some full results
    if index in full_result_index:
        full_result[index] = df.copy()    
```
