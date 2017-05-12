import csv
import random

fp = open("./static/data/FARS_clean.csv","r")

data1 = fp.read().split()
data = []
for d in data1:
	data.append(d.split(","))

new_data = []

for d in data:
	d1 = []
	for i in d:
		if(isinstance( i, int )):
			d1.append(i)
		else:
			d1.append(i.replace("\"", ""))
	new_data.append(d1)

with open("static/data/FARS4_pclean.csv", "w") as fp2:
    writer = csv.writer(fp2, lineterminator='\n')
    for d in new_data:
        x = []
        for a in [3, 5, 7, 8, 9, 10, 11, 12, 17]:
            x.append(d[a])
        writer.writerow(x)
