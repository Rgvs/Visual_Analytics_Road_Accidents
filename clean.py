import csv
import random

fp = open("FARS.csv","r")

data1 = fp.read().split()
data = []
for d in data1:
	data.append(d.split(","))
u = {i:{} for i in range(18)}
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
    if d[7] == "9":
        d[7] = random.choice(["1", "2"])
        ##	inimpact
    if (d[8] == "1" or d[8] == "2" or d[8] == "81" or d[8] == "82"):
            d[8] = "3"
    if (d[8] == "4" or d[8] == "5" or d[8] == "7" or d[8] == "8" or d[8] == "63" or d[8] == "83"):
            d[8] = "6"
    if (d[8] == "10" or d[8] == "11" or d[8] == "61" or d[8] == "62"):
            d[8] = "9"

with open("FARS2.csv", "w") as fp2:
    writer = csv.writer(fp2)
    writer.writerows(data)
