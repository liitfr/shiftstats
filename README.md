# ShiftStats

## What is that ?

Register **for free** to share your stats **anonymously** with the courier community.  
This information will generate statistics that will help you and all the couriers choose the customer that will allow you, for example, to earn the most money, as fast as possible, and to ride as little as possible!  
Help us ! The more users there are, the more accurate the data will be.

## To keep in mind

// TODO : explain to users that shifts shouldn't last a whole day but represent
// more customer's planing
ajouter "les stats permettront de projeter de nouvelles politique tarifaires: ex: vaut il mieux rouler au fixe ou au variable ?"
# client
obligatoire, sauvegardé
#date de ton shift
obligatoire, ne doit pas être dans le futur !
#heure de début
obligatoire, inf à heure de fin
#heure de fin
obligatoire, sup à heure de début
si possible déclarer des shifts aussi courts que possible
#nombre de livraisons
obligatoire, une course double compte double, triple compte triple etc
#nombre de kilomètres
obligatoire, de l'heure de début de ton shift à la fin
utilise strava (bientôt nous integrerons les données strava à l'appli)
#gains totaux
obligatoire: inclus les gains liés au shift  (dont les bonus week-ends montées, badges, pluie, jour spécial) et uniquement au shift (pas d'opé spé marketing, recrutement, etc)
compter les commissions type uber

indicateurs

km / course
€ / km
€ / course
€ / he
courses / he
€ / he
km / he

euros ?

en brut ?
en net ? ( -25%)

période :
journée
matin
midi
après-midi
soir

historique ?
toujours
année
mois
semaine s-1
semaine courante

chaque histogramme: de combien de sources dispose t'on ?


sinon, graphe évolution

## How to ?

### Run tests

`meteor npm run test`

### Launch meteor app with settings

`meteor --settings settings-development.json`  
Settings can be accessed like this : `Meteor.settings.public.publicInfo`.  
If you want to have detailed information, execute `export METEOR_PROFILE=1` before running meteor.

### Drop database

`meteor reset`

### Manage mail gun account

go to https://app.mailgun.com/app/domains
