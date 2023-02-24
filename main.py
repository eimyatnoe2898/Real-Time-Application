#generate dummy data and add it to sql
from faker import Faker
from collections import defaultdict
from sqlalchemy import create_engine
import mysql.connector
import schedule
import time
import random

def insert_sql(fakeData):
    #create connection object
    mydb = mysql.connector.connect(
    host = "localhost",
    user = "root",
    password = "Sql783knui1-1l;/klaa-9",
    database = "nodemysql"
    )

    mycursor = mydb.cursor()
    
    sql = "INSERT INTO `people` (`name`, `email`, `country`) VALUES (%s, %s, %s)"
    val = (fakeData["name"], fakeData["email"], fakeData["country"], )
    mycursor.execute(sql, val)

    mydb.commit()

def add_random_data():
    #create random number
    rand = random.randint(1, 9)
    print("Random Integer: ", rand)

    #initialize data
    fake_data = {}

    #create Faker instance
    fake = Faker()

    #create fake data
    for _ in range(rand):
        fake_data["name"] = fake.name()
        # fake_data["last_name"] = fake.last_name()
        fake_data["country"] = fake.country()
        fake_data["email"] = fake.email()
        print(fake_data)
        #add fake data to database
        insert_sql(fake_data)

#assign a random number to run the script at random second interval
randSec = random.randint(1, 5)
print("Random Seconds: ", randSec)

#run the add random data at random seconds
schedule.every(randSec).seconds.do(add_random_data)

#set timer
while True:
    schedule.run_pending()
    time.sleep(3)

