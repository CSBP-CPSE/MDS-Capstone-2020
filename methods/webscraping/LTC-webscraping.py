#!/usr/bin/env python
# coding: utf-8

# ## LTC Web Scraping
# 
# [How Ontario is responding to Covid-19](https://www.ontario.ca/page/how-ontario-is-responding-covid-19)
# 
# **Authors:** KT and Shreeram
# 
# *Note:* must run selenium server in command prompt
# 
# `java -jar /usr/local/bin/selenium-server-standalone-3.141.59.jar`
# 
# ---

# In[1]:


import pandas as pd
from bs4 import BeautifulSoup
import requests
r = requests.get('https://www.ontario.ca/page/how-ontario-is-responding-covid-19#section-1')
s = BeautifulSoup(r.text,'html5lib')


# In[2]:


r.request.headers


# In[3]:


r.headers['Last-Modified']


# #### Method 5: Selenium Server

# In[8]:


from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

driver = webdriver.Remote(
   command_executor='http://127.0.0.1:4444/wd/hub',
   desired_capabilities=DesiredCapabilities.CHROME)


# In[9]:


my_url = 'https://www.ontario.ca/page/how-ontario-is-responding-covid-19#section-1'
driver.get(my_url)


# In[13]:


df = pd.read_html(driver.page_source)[3]
df2 = pd.read_html(driver.page_source)[4]


# In[140]:


df.to_csv('../../data/ltc-active.csv')
df2.to_csv('../../data/ltc-inactive.csv')


# In[15]:


df2['Status'] = 'Inactive'


# In[17]:


df['Status'] = 'Active'


# In[19]:


all_ltc = df.append(df2)


# In[23]:


all_ltc.to_csv('../../data/merged_ltc.csv')
