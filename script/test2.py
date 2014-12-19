# This Python file uses the following encoding: utf-8
#!/usr/local/bin/python
# coding: utf-8
# sudo apt-get install python-pip
# sudo pip install beautifulsoup4
# 

import re
import csv

#erreurForm

ifile = open('/home/quentin/intellij/dexterity/party1.js', 'r')

lines = ifile.readlines()
for line in lines:
    match = re.search("""\],(\[[0-9\.]*,[0-9\.]*,[0-9\.]*,[0-9\.]*,[0-9\.]*)\]\]""", line)
    if match:
        command = match.groups()[0]
        print(command+',')
ofile.close()



