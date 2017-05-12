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

stateMap = {"1": "AL", "2": "AK", "4": "AZ", "5": "AR", "6": "CA", "8": "CO", "9": "CT", "10": "DE",
			"11": "DC", "12": "FL", "13": "GA", "15": "HI", "16": "ID", "17": "IL", "18": "IN",
			"19": "IA", "20": "KS", "21": "KY", "22": "LA", "23": "ME", "24": "MD", "25": "MA",
			"26": "MI", "27": "MN", "28": "MS", "29": "MO", "30": "MT", "31": "NE", "32": "NV",
			"33": "NH", "34": "NJ", "35": "NM", "36": "NY", "37": "NC", "38": "ND", "39": "OH",
			"40": "OK", "41": "OR", "42": "PA", "44": "RI", "45": "SC", "46": "SD", "47": "TN",
			"48": "TX", "49": "UT", "50": "VT", "51": "VA", "53": "WA", "54": "WV", "55": "WI",
			"56": "WY" }

airbag = {"30": "4.Not Available", "20": "5.Not Deployed", "9": "3.From Front and Side",
		"1": "1.From Front", "2": "2.From Side", -1: "6.Unknown"
}

restraint = {"3":"2.Shoulder And Lap Belt", "0": "1.Not Used", "4": "3.Child Belt", "9": "4.Unknown"}

impact = {"0": "1.No Impact", "3": "3.Right", "6": "5.Back", "9": "4.Left", "12": "2.Front", "13": "6.Top", "14": "7.Bottom" }

injury = {"0": "1.No Injury", "1": "2.Nominal", "2": "3.Minor", "3": "4.Major", "4": "5.Fatal"}

sex = {"1": "Male", "2": "Female"}

for d in data[1:]:
    d[2] = stateMap[d[2]]
    if(int(d[3]) < 200):
       d[3] = int(int(d[3]) / 5)*5
    else:
       d[3] = random.randint(0,18)*5
    if d[4] in ["99", "98", "0"]:
        d[4] = -1
    if d[4] in ["31", "32"]:
        d[4] = "30"
    if d[4] in ["28", "29"]:
        d[4] = "20"
    if d[4] in ["3", "7", "8"]:
        d[4] = "9"

    d[4] = airbag[d[4]]

    if int(d[5]) > 4 :
        d[5] = random.randint(1,4)
    d[5] = injury[str(d[5])]
    if d[6] in ["1", "2", "7", "8"]:
        d[6] = "3"
    if int(d[6]) > 9:
        d[6] = "9"
    d[6] = restraint[str(d[6])]
    if d[7] == "9":
        d[7] = random.choice(["1", "2"])
        ##	inimpact
    d[7] = sex[d[7]]

    if (d[8] == "1" or d[8] == "2" or d[8] == "81" or d[8] == "82"):
            d[8] = "3"
    if (d[8] == "4" or d[8] == "5" or d[8] == "7" or d[8] == "8" or d[8] == "63" or d[8] == "83"):
            d[8] = "6"
    if (d[8] == "10" or d[8] == "11" or d[8] == "61" or d[8] == "62"):
            d[8] = "9"
    if (int(d[8]) > 14):
        d[8] = random.choice([3, 6, 9, 12])
    d[8] = impact[str(d[8])]
    if (int (d[9]) == 9999):
        d[9] = random.randint(1984, 2010)
    if (int (d[9]) < 1965 ):
        d[9] = random.randint(1960, 1965)
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

new_data = []

for d in data:
	d1 = []
	for i in d:
		if(isinstance( i, int )):
			d1.append(i)
		else:
			d1.append(i.replace("\"", ""))
	new_data.append(d1)

with open("static/data/FARS_clean2.csv", "w") as fp2:
    writer = csv.writer(fp2, lineterminator='\n')
    for d in new_data:
        writer.writerow(d)
