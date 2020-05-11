#!/usr/bin/env python
# coding: utf-8

# ## LTC Web Scraping
# 
# [How Ontario is responding to Covid-19](https://www.ontario.ca/page/how-ontario-is-responding-covid-19)
# 
# **Authors:** KT and Shreeram
# 
# *Note:* must run selenium server in command prompt (downloaded from https://www.selenium.dev/downloads/)
# 
# java -jar /usr/local/bin/selenium-server-standalone-3.141.59.jar
# 
# ---

# In[31]:


import pandas as pd
from bs4 import BeautifulSoup
import requests
r = requests.get('https://www.ontario.ca/page/how-ontario-is-responding-covid-19#section-1')
s = BeautifulSoup(r.text,'html5lib')


# In[33]:


r.request.headers


# In[35]:


r.headers['Last-Modified']


# #### Method 5: Selenium Server

# In[143]:


from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

driver = webdriver.Remote(
   command_executor='http://127.0.0.1:4444/wd/hub',
   desired_capabilities=DesiredCapabilities.CHROME)


# In[144]:


my_url = 'https://www.ontario.ca/page/how-ontario-is-responding-covid-19#section-1'
driver.get(my_url)


# In[142]:


# tables = driver.find_elements_by_tag_name('table')

# for t in tables:
#     content = driver.find_element_by_class_name('node-130423')
#     print(content.text)


# In[145]:


df = pd.read_html(driver.page_source)[3]


# In[140]:


df.to_csv('../data/ltc-active.csv')


# In[139]:


df2 = pd.read_html(driver.page_source)[4]
df2.to_csv('../data/ltc-inactive.csv')

