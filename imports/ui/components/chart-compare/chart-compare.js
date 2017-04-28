import './chart-compare.html';

Template.chartCompare.onRendered(function chartCompareOnRendered() {
  const template = this;
  template.autorun(() => {
    console.log(this.data.chartFiltersRD.get('city'));
    console.log(this.data.chartFiltersRD.get('history'));
    console.log(this.data.chartFiltersRD.get('kpi'));
    console.log(this.data.chartFiltersRD.get('period'));
    console.log(this.data.chartFiltersRD.get('payroll-activated'));
    console.log(this.data.chartFiltersRD.get('payroll-percentage'));
    console.log('----------------------------------------------------');
  });
});

Template.chartCompare.helpers({

});

// # client
// obligatoire, sauvegardé
// #date de ton shift
// obligatoire, ne doit pas être dans le futur !
// #heure de début
// obligatoire, inf à heure de fin
// #heure de fin
// obligatoire, sup à heure de début
// si possible déclarer des shifts aussi courts que possible
// #nombre de livraisons
// obligatoire, une course double compte double, triple compte triple etc
// #nombre de kilomètres
// obligatoire, de l'heure de début de ton shift à la fin
// utilise strava (bientôt nous integrerons les données strava à l'appli)
// #gains totaux
// obligatoire: inclus les gains liés au shift  (dont les bonus week-ends montées, badges, pluie, jour spécial) et uniquement au shift (pas d'opé spé marketing, recrutement, etc)
// compter les commissions type uber
//
// indicateurs
//
// km / course
// € / km
// € / course
// € / he
// courses / he
// € / he
// km / he
//
// euros ?
//
// en brut ?
// en net ? ( -25%)
//
// période :
// journée
// matin
// midi
// après-midi
// soir
//
// historique ?
// toujours
// année
// mois
// semaine s-1
// semaine courante
//
// chaque histogramme: de combien de sources dispose t'on ?
//
//
// sinon, graphe évolution
