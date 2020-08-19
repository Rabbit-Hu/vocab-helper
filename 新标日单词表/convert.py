# To add a new cell, type '# %%'
# To add a new markdown cell, type '# %% [markdown]'
# %%
import pandas as pd


# %%
df = pd.read_csv('新标日初级、中级单词表.csv')
df = df.drop(columns=["Unnamed: 4"])


# %%
cols = ['中文', '假名', '日文', '类型']
df = df.loc[:, cols]


# %%
lesson = 1
str = ""
for index, row in df.iterrows():
    if index == 0 or row.isna().any(0):
        if str != "":
            with open('../dict/Lesson{}.txt'.format(lesson), 'w') as f:
                f.write(str)
            lesson += 1
            str = ""
    else:
        str += '|'.join(row.to_list()) + '\n'


# %%



# %%



