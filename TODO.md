# To do

## Bugs

- Sometimes, bars in bar chart don't have right width (they fit 100 % of the day). Must investigate why
- There's a bug with number of couriers / city in admin page. Can get a -1 value.
- Can't send emails from production server (test with automatic "password change" mail)
- List customers in admin page : performances are really, really bad
- SSL doesn't work on DO droplet : try access https://207.154.202.102 on Chrome...
- `bcrypt` makes deploy step fail. Keep it under `devDependencies` until this problem is solved.
- In `chart-evol.js`, transition duration doesn't works. We should set it to 1000. However this behavior works if we use `d3js` by including it in head scripts. Investigate and maybe create an issue for `d3-line-chunked`.
- In chart components, no data message isn't displayed when counter equals 0.

## Tests

- Create unit tests & acceptance tests with `AVA` or `Mocha`
- Check translation texts in i18n json files

## Mobile app

- Deploy on android and iphones.
- What about WindowsPhones ? web version seems to be very buggy on these devices
- Take example on todo tutorial to use hammerjs to enable swap between pages
- Watch out `mup.js` & `serverOnly`, you'll have to adapt some settings

## Design & UX

- In shift page creation : divide customer field into three fields city / customer / contract
- Create a logo
- Create a favicon
- Create a splashscreen
- Create a 404 page
- Account UI after following redefine password email's link isn't materialize but bootstrap style ...
- Charts and controls should display currencies (€, $, ...) and distance units (km, ml, ...)
- In Compare chart, legends should support large number of customers (maybe display in 2 columns). We should test as well if chart stay clear and intelligible if there are many customers displayed.
- Use `Momentum` when transitioning to / from loading state to give a smooth effect
- Date picker : translate first letter of every day of the week ("L", "M" , "M", "J", "V", "S", "D" in french)
- Add global totals (distance / gain / duration / deliveries) in "my shifts" page
- support gains in multiple currencies and distances in multiple units in "my shits" page & "user administration" page
- Round values (gains, distance) when user creates a new shift

## New Features

### New charts

To be defined

### New historical ranges

To be defined (always, current year, current month, last week, last month, current week, ... ?)

### New shift administration page

We must have a page to visualize a list of shifts (`meteor-tabular` ?), allowing admin to filter by date / city / customer / courier or a combination of these fields. Admin should be able to delete some or all of displayed shifts

### New distance units

Shiftstats only supports km. It should also support miles. We should add a unit field related to customer.

### Data quality

Data quality is an interesting improvement. Here is a short specification :
- Computation of quality depends on number of shifts available in chart (thresholds for bad, medium, good quality)
- These shifts should last at least X minutes long
- These variables should be defined for each customer since they don't have the same number of couriers ...
- Shall it depends on day of the week as well ? week-end day vs week day
- How to compute data quality if chart aggregates over multiple days (for example, all mondays in last month) ? If one monday has a good quality and three others have bad quality ?

### Automatic calculation of shift's gains

To be defined. With this features, users wouldn't have to declare their gains.

### Import shifts data from Strava

To be defined. With this features, users wouldn't have to declare their distance.

### Distribution key for kpi

Today, distribution used to ventilate data in period is linear. maybe we should calculate distribution rule depending only on shifts that fit in only one period of the day.

### Accident report feature

A new form to declare accidents (place, circumstances, injury, damages, ...) and accident reports

### Accouting reports for couriers

To motivate couriers to use shiftstats, give them useful features such as accounting reports and invoice generation.

## Production environment

- Use `fast-render` package if performance issues.
- Be able to send mails from production env. (test with automatic "password change" mail)
- index on analytics fields if performance issues.

## Technical considerations

- Everywhere: should we `import { $ }` wherever it is used ?
- In charts pages : loaders until subscription ready !
- All collection's helpers : Should we do every task before and return false if error ?
- User's field : rename `months` & `customers` fields to something less generic, more verbose
- User's field : add favorite city & favorite language
- Once User collection has field "favorite language", we can i18n "password lost" mail
- Everywhere: Switch Materialize integration to https://github.com/mozfet/meteor-autoform-materialize when this package is mature. Autoform components created for Shiftstats project aren't generic and evolutive enough.
- `autoform-config.js`: move messages to i18n json files (you can take exemple on i18n & datepicker integration)
- d3js charts : move styles from js code to css
- `chart-controls.js`: we should manage default values in one single place (maybe in `settings.json` ?) (today it's defined both in `chart-controls.js` & hardcoded in `chart-controls.html`)
- `list-my-shifts.js`: sort find cursor in client side.
- `list-my-shifts.js`: loader should depend on both subscriptions.
- `list-my-shifts.js`: shouldn't be generated if no data available.
- `list-my-shifts.js`: when modifying date of a shift, navigate to last month only if there's no more data in current month being displayed.

---

# Done
