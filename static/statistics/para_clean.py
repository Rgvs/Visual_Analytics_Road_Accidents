import csv
import random

fp = open("./static/data/FARS.csv","r")

data1 = fp.read().split()
data = []
for d in data1:
	data.append(d.split(","))
#u = {i:{} for i in range(18)}
##for d in data[1:]:
##	for i,x in enumerate(d):
##		try:
##			u[i][x] += 1
##		except:
##			u[i][x] = 1
##i = 0

##print "attr\tnumber of different values"
##for k,v in u.items():
##	print data[0][k] + "\t"+ str(len(v)) + "\n"
##	if len(v) <60:
##		for l,x in v.items():
##			print l,x
##	print "\n****************\n"
##	"","caseid","state","age","airbag","injury","restraint","sex","inimpact","modelyr","airbagAvail","airbagDeploy","Restraint","D_injury","D_airbagAvail","D_airbagDeploy","D_Restraint","year"

for d in data[1:]:
    
    if(int(d[3]) < 200):
       d[3] = int(int(d[3]) / 5)*5
    else:
       d[3] = random.randint(0,18)*5
    if int(d[5]) > 4 :
        d[5] = random.randint(1,4)
    if d[7] == "9":
        d[7] = random.choice(["1", "2"])
        ##	inimpact
    if (d[8] == "1" or d[8] == "2" or d[8] == "81" or d[8] == "82"):
            d[8] = "3"
    if (d[8] == "4" or d[8] == "5" or d[8] == "7" or d[8] == "8" or d[8] == "63" or d[8] == "83"):
            d[8] = "6"
    if (d[8] == "10" or d[8] == "11" or d[8] == "61" or d[8] == "62"):
            d[8] = "9"
    if (int(d[8]) > 14):
        d[8] = random.choice([3, 6, 9, 12])
    if (int (d[9]) == 9999):
        d[9] = random.randint(1984, 2010)
    if (int (d[9]) < 1965 ):
        d[9] = random.randint(1960, 1965)
    X = [10, 11, 12]
    for x in X:
        #print d[x], "yes"
        #break
        if (str(d[x]) == "\"no\""):
            d[x] = 0
        elif (str(d[x]) == "\"yes\""):
            d[x] = 1
        else:
            d[x] = 2

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
