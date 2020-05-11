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
# `java -jar /path/to/selenium`
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


# In[10]:


# tables = driver.find_elements_by_tag_name('table')

# for t in tables:
#     content = driver.find_element_by_class_name('node-130423')
#     print(content.text)


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


# ---
# # Other Attempts:
# 
# ---

# #### Methods 1: Firefox driver with options and binary

# In[109]:


import selenium 
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.firefox_binary import FirefoxBinary

options = Options()
options.binary_location = FirefoxBinary('/usr/local/bin')
selenium.webdriver.firefox.webdriver.WebDriver(firefox_options=options)


# #### Methods 2: Firefox driver with binary and desired capabilities

# In[110]:


from selenium.webdriver.firefox.firefox_binary import FirefoxBinary
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

cap = DesiredCapabilities().FIREFOX
cap["marionette"] = False
browser = webdriver.Firefox(capabilities=cap, executable_path="/usr/local/bin/geckodriver.exe")
browser.get(my_url)
browser.quit()


# #### Methods 3: Firefox driver

# In[106]:


with webdriver.Firefox() as driver:
    driver.get('my_url')
    tds = driver.get_element_by_tag_name('table')
    for i in range(0, len(table)):
        bs = bs4.BeautifulSoup(i, 'html.parser')
        print(bs)


# #### Methods 4: Faking a browser visit

# In[111]:


import requests

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}

response = requests.get(my_url, headers=headers)
print(response.content)


# In[115]:


profile = webdriver.FirefoxProfile('/usr/local/bin')
driver = webdriver.Firefox(profile)


# In[34]:


s

