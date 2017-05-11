import csv
import random

fp = open("FARS.csv","r")

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

stateMap = {"1": "AL", "2": "AK", "4": "AZ", "5": "AR", "6": "CA", "8": "CO", "9": "CT", "10": "DE",
			"11": "DC", "12": "FL", "13": "GA", "15": "HI", "16": "ID", "17": "IL", "18": "IN",
			"19": "IA", "20": "KS", "21": "KY", "22": "LA", "23": "ME", "24": "MD", "25": "MA",
			"26": "MI", "27": "MN", "28": "MS", "29": "MO", "30": "MT", "31": "NE", "32": "NV",
			"33": "NH", "34": "NJ", "35": "NM", "36": "NY", "37": "NC", "38": "ND", "39": "OH",
			"40": "OK", "41": "OR", "42": "PA", "44": "RI", "45": "SC", "46": "SD", "47": "TN",
			"48": "TX", "49": "UT", "50": "VT", "51": "VA", "53": "WA", "54": "WV", "55": "WI",
			"56": "WY" }

for d in data[1:]:
    d[2] = stateMap[d[2]]
    if(int(d[3]) < 200):
       d[3] = int(int(d[3]) / 5)
    else:
       d[3] = random.randint(0,20)
    if d[4] in ["99", "98"]:
        d[4] = -1
    if d[4] in ["31", "32"]:
        d[4] = "30"
    if d[4] in ["28", "29"]:
        d[4] = "20"
    if d[4] in ["3", "7", "8"]:
        d[4] = "9"
    if int(d[5]) > 4 :
        d[5] = random.randint(1,4)
    if d[6] in ["1", "2", "7", "8"]:
        d[6] = 3
    if int(d[6]) > 9:
        d[6] = 9
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
    X = [10, 11, 12, 14, 15, 16]
    for x in X:
        #print d[x], "yes"
        #break
        if (str(d[x]) == "\"no\""):
            d[x] = 0
        elif (str(d[x]) == "\"yes\""):
            d[x] = 1
        else:
            d[x] = 2



with open("FARS_clean.csv", "w") as fp2:
    writer = csv.writer(fp2)
    for d in data:
        writer.writerow(d)
