#!/usr/bin/env python
# coding: utf-8

# #### Merging scraped LTC statistics with ODHF
# 
# [How Ontario is responding to Covid-19](https://www.ontario.ca/page/how-ontario-is-responding-covid-19)
# 
# **Authors:** KT
# 
# ---

# In[1]:


import pandas as pd


# In[245]:


odhf = pd.read_csv('../data/ODHF/odhf_v1.csv', engine='python')

ngan=pd.read_csv("../data/df_ltc_final.csv")


# In[247]:


odhf['cleaned_name'] = odhf['facility_name'].apply(lambda val: unicodedata.normalize('NFKD', val).encode('ascii', 'ignore').decode())


# In[248]:


odhf = odhf.loc[odhf['province'] == 'on']


# ***To Do:***
# - remove closed homes
# - cross reference discrepancies between Ngan's LTC scrape and ODHF
# - change names to match ODHF for those found
# 

# In[249]:


closed_homes = outer2[outer2['additional_info'].fillna('none').str.lower().str.contains('closed')]
len(closed_homes)


# In[250]:


a = set(closed_homes['cleaned_name'])
b = set(ngan['cleaned_name'])
def removeClosedHomes(a, b):
    return [x for x in b if x not in a]
open_homes = removeClosedHomes(a, b)


# In[251]:


ngan2 = ngan[ngan['cleaned_name'].isin(open_homes)]


# #### Merge

# In[231]:


outer2 = pd.merge(odhf, ngan2, how = 'right', on = 'cleaned_name')


# In[232]:


outer2.to_csv('../data/FINAL_merge.csv')


# #### Rename LTC scraped homes with ODHF discrepancies

# In[262]:


# alternative entry names from scrape
ngan2['cleaned_name'].replace({'albright gardens homes, incorporated' : 'albright gardens',
                               'st. joseph\'s villa, dundas' : "st. joseph's villa (dundas)",
                               'bella senior care residences inc.' : "bella senior care residences",
                               'bon air long term care residence' : 'chartwell bon air long term care residence',
                                'caressant care - codben' : 'caressant care - cobden',
                               'caressant care harriston' : 'caressant care - harriston',
                               'champlain long term care residence' : 'chartwell champlain long term care residence',
                                'dawson court' : 'city of thunder bay  dawson court',
                               'heartwood (fka versa-care cornwall)' : 'heartwood',
                               'lancaster long term care residence' : 'chartwell lancaster long term care residence',
                               'niagara long term care residence' : 'chartwell niagara long term care residence',
                               'north renfrew long-term care services' : 'north renfrew long-term care services inc.',
                               'st. joseph\'s health centre, guelph': 'st. joseph\'s health centre - guelph', 
                                'the meadows' :'revera inc.  the meadows long term care centre',
            'william a. "bill" george extended care facility': 'william a. \'bill\' george extended care facility'}, inplace = True)


# 
# #### Rename names with french accents:
# 
# *Require changing both ltc scraped data and odhf*

# In[256]:


# elisabeth-bruyere residence
#ngan2.loc[ngan['address'] == '75 Bruyere Street']['cleaned_name'] = 'elisabeth-bruyere residence'
ngan2['cleaned_name'].replace({'élisabeth-bruyère residence' : 'elisabeth-bruyere residence',
                              'rÈsidence saint-louis': 'residence saint-louis',
                              'north shore health network – eldcap unit' : 'north shore health network - eldcap unit',
                              'north shore health network – ltc unit' : 'north shore health network - ltc unit'}, inplace = True)

odhf['cleaned_name'].replace({'lisabeth-bruyre residence': 'elisabeth-bruyere residence',
                             'rsidence saint-louis' : 'residence saint-louis',
                             'north shore health network - eldcap unit' : 'north shore health network - eldcap unit',
                             'north shore health network - ltc unit' : 'north shore health network - ltc unit'}, inplace = True)


# In[257]:


#ngan.loc[ngan.cleaned_name.fillna('none').str.lower().str.contains('north shore')]['cleaned_name']


# In[258]:


#odhf.loc[odhf.cleaned_name.fillna('none').str.lower().str.contains('the meadows long term care')]['cleaned_name']


# #### Merge again

# In[263]:


outer2 = pd.merge(odhf, ngan2, how = 'right', on = 'cleaned_name')

outer2.to_csv('../data/FINAL_merge.csv')




