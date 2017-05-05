# ShiftStats

## What is that ?

Register **for free** to share your stats **anonymously** with the courier community.  
This information will generate statistics that will help you and all the couriers choose the customer that will allow you, for example, to earn the most money, as fast as possible, and to ride as little as possible!  
Help us ! The more users there are, the more accurate the data will be.  

We are looking for volunteers to maintain the application and develop new features. If you have the skills to help us, do not hesitate to contact us!  

## To keep in mind

// TODO : explain to users that shifts shouldn't last a whole day but represent
// more customer's planing and explain why
// "les stats permettront de projeter de nouvelles politique tarifaires: ex: vaut il mieux rouler au fixe ou au variable ?"
// Sur la page de création : Tu pourras modifier ton shift à tout moment
// Ta ville ne figure pas dans cette liste ? contacte nous.
// nb courses : une course double compte double, triple compte triple etc
// nb km : obligatoire, de l'heure de début de ton shift à la fin
// utilise strava (bientôt nous integrerons les données strava à l'appli)
// gains : obligatoire: inclus les gains liés au shift  (dont les bonus week-ends montées, badges, pluie, jour spécial) et uniquement au shift
// (pas d'opé spé marketing, recrutement, etc) compter les commissions type uber
// TODO : message about the shortest the shift is the better it is
// how kpis are ventilated in periods

## How to ?

// TODO (presentation content)

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

## Manage mail gun account

go to https://app.mailgun.com/app/domains

## Materialize

If you experience troubles with Materialize, please run `npm install` to execute postinstall script.
