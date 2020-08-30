"""
    author: Anurag Verma
    license: MIT
    This file generates a normalized dataset containing the coordinates of landmarks of hands in range 0 to 1
"""
import numpy as np
import pandas as pd
import os


def getList():
    files = ['paper.txt', 'rock.txt', 'scissor.txt']
    dataList = []
    for i in range(len(files)):
        f = open(os.path.join('Raw Data', files[i]))
        d = eval(f.readline())
        for data in d:
            temp = []
            for row in data:
                # Normalizing Data on fly
                temp.append([row[0]/300, row[1]/300])
            dataList.append([i, temp])
    return dataList


df = pd.DataFrame(getList(), columns=['Gesture', 'Coords'])
df.to_csv('python/processedDS.csv', index=False, sep='|')
