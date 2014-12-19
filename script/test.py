# This Python file uses the following encoding: utf-8
#!/usr/local/bin/python
# coding: utf-8
# sudo apt-get install python-pip
# sudo pip install beautifulsoup4
# 

import re
import csv

#erreurForm

ifile = open('/home/quentin/intellij/dexterity/script/test.txt', 'r')

#ofile = codecs.open("./result.csv", 'wb', encoding='iso-8859-1')
ofile = open('./result.txt', 'wb')
writer = csv.writer(ofile)

lines = ifile.readlines()
for line in lines:
    match = re.search("""42(\["u.*)\n""", line)
    if match:
        command = match.groups()[0]
        print(command+',')
ofile.close()



