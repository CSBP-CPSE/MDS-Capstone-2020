#!/usr/bin/env python
# coding: utf-8

# ## LTC Web Scraping
# 
# [How Ontario is responding to Covid-19](https://www.ontario.ca/page/how-ontario-is-responding-covid-19)
# 
# **Authors:** KT and Shreeram
# 
# ---

# In[1]:


import pandas as pd
from bs4 import BeautifulSoup
import requests
r = requests.get('https://www.ontario.ca/page/how-ontario-is-responding-covid-19#section-1')
s = BeautifulSoup(r.text,'html5lib')


# In[2]:


r.headers['Last-Modified']


# In[3]:


r.request.headers


# In[5]:


from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager

driver = webdriver.Chrome(ChromeDriverManager().install())


my_url = 'https://www.ontario.ca/page/how-ontario-is-responding-covid-19#section-1'
driver.get(my_url)


# In[6]:


tables = driver.find_elements_by_tag_name('table')

for t in tables:
    content = driver.find_element_by_class_name('node-130423')
    print(content.text)


# In[7]:


df = pd.read_html(driver.page_source)[3]
df.to_csv('ltc-active.csv')


# In[8]:


df2 = pd.read_html(driver.page_source)[4]
df2.to_csv('ltc-inactive.csv')

