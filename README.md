# ShiftStats

## What is that ?

Register **for free** to share your stats **anonymously** with the courier community.  
This information will generate statistics that will help you and all the couriers choose the customer that will allow you, for example, to earn the most money, as fast as possible, and to ride as little as possible!  
Help us ! The more users there are, the more accurate the data will be.  

We are looking for volunteers to maintain the application and develop new features. If you have the skills to help us, do not hesitate to contact us!  

## Instruction manual

**Below, important information to read before using the application. It is essential to understand that the quality of the statistics displayed depends directly on the veracity of the data you will capture. Do not invent. Any profile that does not respect these principles will be deleted.**

### Saving a Shift

A day begins and finishes at 6:00 am, and a shift can not take place over more than one day. You can declare a shift from 23:00 to 05:00 for example, while a shift from 05:00 to 07:00 will not be valid. We advise you to declare shifts as short as possible. We will explain in the "statistics" section why. Avoid, therefore, to declare shifts continuous from 11:00 to 23:00 for example, but created in several, shorter.

You can declare a shift at any date as long as it is the current date or a past date.

**The number of deliveries** that you declare must be a whole number greater than or equal to 0. If you have performed a double race as can be the case with Deliveroo for example, accounts in good 2!

**The number of kilometers** you declare is a decimal number greater than or equal to 0.00. Be careful, this is the actual and total distance you have traveled from the beginning of your shift to the end of your shift. Do not use the information provided by your customer (often calculated as the crow flies and incomplete) but those of your odometer or an application such as Strava or Google Map. Do not fill this field at random! Soon we will allow you to automatically integrate the data of your account Strava with the application ShiftStats.

**The winnings** you declare are a decimal number greater than or equal to 0.00. These are the gains communicated by your customer related to the shift that you have realized. These gains correspond to your turnover (turnover) for a shift: that is to say the gross amounts that appear on your invoices. The winnings you declare in the application must include everything related to the shift and only to that one. For example: the various bonuses (weekend, rain, drop, badges, special days, ...) will have to be included.

On the other hand, they do not include earnings not directly related to your shift such as parental bonuses, marketing operations, recruitment, training, administration, etc.

Finally, they must report deductions made by certain customers such as Uber who levy a certain% of your turnover. However, they should not mention deductions such as bonds and other deductions due to degradation of order, forgetfulness, ... operated by certain customers. Also, they should not include customers' tips, whether paid by hand or via the website during order.

If you have any doubts while entering your shifts, do not hesitate to contact us!

### Review your winnings and modify or delete your shifts

You can get an assessment of your activity on the history page of your shifts. Soon we will provide you with export functions to facilitate the administrative management of your activity. On this screen, you can also edit the data of an existing shift at any time or delete it directly. The deletion is final.

### Statistics

For analysis purposes, a day is divided into 5 periods:

- In the morning from 06:00 to 11:00
- Lunch from 11:00 to 14:30
- The afternoon from 14:30 to 18:30
- In the evening from 18:30 to 23:30
- The night from 23:30 to 06:00

In the current application operation, the shift data is homogeneously distributed over these periods. So if you declare a shift:

- from 13h30 to 15h00
- 3 deliveries
- 15 kms
- 17.25 euros

The application considers that you have:

- Midday: worked 1 hour, made 2 deliveries for 10 km and you won 11.5 euros
- In the afternoon: worked 1/2 hour, carried out 1 delivery for 5 km and you won 5.75 euros.

So that the displayed statistics are as accurate as possible, we advise against declared long continuous shifts, but rather to declare short shifts, representative of the 5 periods of analysis.

The tool can analyze the following seven indicators:

- kms / race
- gains / km
- win / race
- earnings / hour
- races / hour
- kms / hour

You can choose to compare the different customers in your city ("Compare" button) or to observe the evolution of these indicators over time ("Evolution" button).

The data can be filtered by:

- City
- Period: All day, Morning, Midday, Afternoon, Evening, Night
- Historical level: for the moment, the only levels of available history are "Rolling Month", that is, from D-31 to D-1; and "Last week"

The load simulator allows you to choose whether the displayed amounts are gross or net of charges. You can adjust the value as a percentage of these loads by using the cursor.

In a future version of the application, the notion of "data quality" will be put in place and will enable you to know if enough couriers have participated to guarantee figures representing the reality of the terrain and the variety of situations (sample representative).

The analytical tools will allow the courier community to answer a range of questions such as:

- Who is the best customer for the race? on time ?
- Who is the customer who makes the most money by rolling the least?
- When a customer wants to change his tariff conditions, what will be the true impacts on the revenue of the couriers?

**These analytical tools will enable the courier community and the various unions to develop a realistic diagnosis of their activity and to build a solid argument against their customers and public opinion.**

Friends, it's up to you.
The ShiftStats team.

# Technical concerns

## Technologies used

- Meteor
- Blaze
- D3js
- Materialize
- Mongo
- Nginx
- Docker

## Run tests

`meteor npm run test`

## Run linter

`meteor npm run lint`

## Launch meteor app with settings

`meteor --settings settings-development.json`  
Settings can be accessed like this : `Meteor.settings.public.publicInfo`.  
If you want to have detailed information, execute `export METEOR_PROFILE=1` before running meteor.

## Drop database

`meteor reset`

## Services

### Manage mail gun account

go to https://app.mailgun.com/app/domains

### Facebook

go to https://developers.facebook.com/apps/191735237982113/dashboard/

## Materialize

If you experience troubles with Materialize, please run `npm install` to execute postinstall script.

## Deployment

### Setup a container

DEBUG=mup* mup setup --verbose

### Deploy a container

DEBUG=mup* mup deploy --verbose
(do not use debug is you want to deploy with production tasks such as minification)

### Remove a container

1. local : `mup stop`
2. server : `docker ps -a` then `docker stop XXX` then `docker rm XXX`

### SSH keys with passphrase

1. Start ssh agent with eval $(ssh-agent)
2. Add your ssh key with ssh-add <path-to-key>
3. You'll be asked to enter the passphrase to the key
4. After that, simply invoke mup commands and they'll just work
5. Once you've deployed your app, kill ssh agent with ssh-agent -k

## Production

To do on a regular basis in production environment:
- Renew SSL certificate
- Check and empty logs
- sudo apt-get update
- database backup (/etc/cron.d/mongodb-backup)
