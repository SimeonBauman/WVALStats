from socket import EAI_BADFLAGS
import string
import pandas as pd
import sys


def getData():
    print("Paste your data (comma-separated), then press Enter followed by Ctrl+D (Linux/Mac) or Ctrl+Z + Enter (Windows):")
    try:
        raw_text = sys.stdin.read()  # Reads multiple lines of user input
       
        print(raw_text)
        return raw_text
  
    except Exception as e:
        print(f"Error processing input: {e}")
        return None

def formatData():
    name = []
    kills = []
    deaths = []
    assists = []
    firstKills = []
    firstDeaths = []
    data = getData()

    skipLines = 0
    step = 0

    def getName():
        temp = "";numOfNL = 0;counter = 1
        while numOfNL < 2:
            if data[i - counter] == '\n':
                numOfNL += 1
            else:
                temp = data[i - counter] + temp
            counter += 1
        print(temp)
        return temp

    temp = ""

    for i in range(len(data)):
        if skipLines > 0:

            if data[i] == "\n":
                skipLines -= 1
                
        elif data[i] == "#" and step == 0:
            name.append(getName())
            skipLines = 3
            step = 1
        
        elif step == 1:
            if data[i] == "\n":
                kills.append(temp)
                print(temp)
                temp = ""
                step = 2
            else:
                temp = temp + data[i]

        elif step == 2:
            if data[i] == "\n":
                deaths.append(temp)
                print(temp)
                temp = ""
                step = 3
            else:
                temp = temp + data[i]

        elif step == 3:
            if data[i] == "\n":
                assists.append(temp)
                print(temp)
                temp = ""
                step = 4
                skipLines = 6
            else:
                temp = temp + data[i]

        elif step == 4:
            if data[i] == "\n":
                firstKills.append(temp)
                print(temp)
                temp = ""
                step = 5
            else:
                temp = temp + data[i]

        elif step == 5:
            if data[i] == "\n":
                firstDeaths.append(temp)
                print(temp)
                temp = ""
                step = 0
            else:
                temp = temp + data[i]
    
    convertDataToSheet(name,kills,deaths,assists,firstKills,firstDeaths)
    formatData()


def convertDataToSheet(name,kills,deaths,assists,firstKills,firstDeaths):
    df = pd.read_excel("example.xlsx", engine="openpyxl")

    for i in range(len(name)):
       

        if name[i] in df["Name"].values:
            row_index = df.index[df["Name"] == name[i]].tolist()[0]
          
            print(row_index)
            killsNum = (int(df.at[row_index,"Kills"]) + int(kills[i]))
            deathsNum = (int(df.at[row_index,"Deaths"]) + int(deaths[i]))
            FKNum = (float(df.at[row_index,"FK"]) + float(firstKills[i]))
            FDNum = (float(df.at[row_index,"FD"]) + float(firstDeaths[i]))

            df.at[row_index, "Kills"] = killsNum
            df.at[row_index, "Deaths"] = deathsNum
            df.at[row_index, "Assists"] = (int(df.at[row_index,"Assists"]) + int(assists[i]))
            df.at[row_index, "KD"] = killsNum/deathsNum
            df.at[row_index, "FK"] = FKNum
            df.at[row_index, "FD"] = FDNum
            if FDNum > 0:
                df.at[row_index, "FK_Rate"] = FKNum/FDNum
            else:
                 df.at[row_index, "FK_Rate"] = FKNum

        else:
            FKRate = 0
            if int(firstDeaths[i]) > 0:
                FKRate = float(firstKills[i])/ float(firstDeaths[i]);
            else:
                 FKRate = firstKills[i]
            new_row = pd.DataFrame({"Name": [name[i]],"Kills": [kills[i]], "Deaths": [deaths[i]], "Assists": [assists[i]], "KD":[float(kills[i])/float(deaths[i])], "FK": [firstKills[i]], "FD": [firstDeaths[i]], "FK_Rate": [FKRate]})
            df = pd.concat([df, new_row], ignore_index=True)

    df.to_excel("example.xlsx", index=False, engine="openpyxl")




formatData()