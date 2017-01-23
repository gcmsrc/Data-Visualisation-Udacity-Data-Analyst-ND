## Summary
This visualisation covers the topic of **International Visitors to the city of London**.
Data has been retrieved from [here](https://data.london.gov.uk/).

This project should help the reader visualise **three main pieces of information**:
* the growing number of international visitors to London;
* the purpose of their visits;
* their country of origin (i.e. where they are travelling from, but not necessarily where they are from).

Please notice that the data on country of origin is not available for all countries.
In the original dataset, in fact, there are entries such as "Other Africa" and "Other Middle East" which cannot be used for country-specific visualisations. In the last visualisation, countries such as the ones above do not carry any data.

I have parsed and formatted the data in a separate script (see folder *source* for more details). I have not structured the css and js files into their respective folders directories since they would have not been supported in gists and, consequently, in bl.ocks.org.


## Design
My intention was to visualise a story about international visitors to London using a **Martini Glass structure**.
I followed the same structure of the Facebook IPO chart by the New York Times ([here](https://goo.gl/fy3K0B)).

In particular, I am guiding the reader through my main points by building three different visualisations, on which I have added some degree of interactivity.

| Visualisation | Message                                     | Chart       | Interactivity       |
|---------------|---------------------------------------------|-------------|---------------------|
|       1       | Growing number of international visitors    | Column      | Tooltip             |
|       2       | A holiday destination                       | Line        | Mouse over          |
|       3       | Fewer from USA, more from Europe            | Map and Line| Mouse move and click|

Both the first and second visualisations aim at representing changes over time. As per the table provided in the course ([here](https://apandre.files.wordpress.com/2011/02/chartchooserincolor.jpg)), I have used a column chart and a line chart to represent this idea. In particular, the position of the bar (i.e. height) and the line, relative to their chart areas, is the most important visual encoding in delivering my message. In the line chart, I also use color encoding to distinguish among the five different purposes of the international visits to London. Plese notice that I had originally chosen a column representation for the second visualisation as weel, but the feedback I have received from my Mom made me change my mind!

The third visualisation is a choropleth, i.e. a representation of a dataset through retinal variables displayed over a geographical projection. Following suggestions in the course, I have colored the different countries using a sequential Blue scale. I did not choose a diverging scale since I simply wanted to represent a continuous (low-to-high) series of values. I chose this chart because I believe that representing the country of origin of the international visitors is way more powerful if done over a geographical map; in this way, users can see the country of origin in a familiar spatial representation. 

Becaus of the complexity of the project, I quickly realised that my code was becoming very long and very difficult to manage.
Therefore, I have decided to create a series of smaller JavaScript modules with some of the most repetitive functions. I have used a naming convetion such as that a function is always named as *mod_DoSomething*, where *mod* is the name of the corresponding JavaScript file (which in this case would be *mod.js*).

## Feedback

I have tested the multiple versions of the visualisation with three different people. Please note that the version number of each visualisation refers to an actual commit in my GitHub repository.

Here is a profile of the people I received feedback from.

| Person    | Description                                                                                                                                                                                                                                                                                                                           |
|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Mom       | My mom is a retired Electronic Engineer, who has actually been working a lot in interior design. She can be quite demanding when it comes to choosing color and finding the right proportions and positions of objects in a space. I chose her to test the overall design and look of my visualisation.                               |
| Friend    | My friends works as a Business Analyst in the IT department of a global financial services company. As part of his job, he needs to make sure that information is passed accurately between his business clients and the IT developers. I chose him to test the clarity of the messages I was trying to deliver.                      |
| Colleague | My colleague works with me in the Investments function of a global financial services company. Over the last year, we have trying to adopt a *less-is-more* philosophy in all the documents we make (i.e. scripts, Excel files, presentations, etc.). I chose him to test the simplicity of my visualisation (i.e. avoid chart junk). |

And here is a tabular representation of the feedbacks I have collected and the actions I have taken.

| Version | Person    | Feedback                                                                                                                                                                                                                                                                                                                                                                        | Action                                                                                                                                                                                                                                                         | Reflected in |
|---------|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| 0       | Mom       | "The second visualisation is unclear. I cannot see the proportions clearly. For example, I know that the value for 'Visiting Family' is around 20% because it is between 60% and 40%, but I cannot see any trend over time since the values of the other categories also change. I get what you want to say, but it takes too much time and effort to reach to any conclusion." | I have changed the stacked bar chart to a line chart. In this way, trends are easier to follow, and comparison between categories (e.g. visitors travelling for holidays are > 50%) are much clearer.                                                          | Version 1    |
| 0       | Friend    | "You are telling me that international visitors to London have been growing. It would be interesting to know where they are coming from. Do you have this data?"                                                                                                                                                                                                                | I have decided to represent visitors's origin on a choropleth.                                                                                                                                                                                                 | Version 2    |
| 1       | Mom       | "In the second chart I like the fact that you can go over a line and it highlights it against the others. I don't want to be pedantic, but have you noticed that when I go with the mouse over the red line, it is below the one representing 'Visiting friends and relatives'?"                                                                                                | I though that this feedback was pretty useless, but he was right. After that I couldn't see anything that this annoying overlap. I fixed it - see [here](http://bl.ocks.org/eesur/4e0a69d57d3bfc8a82c2)                                                        | Version 2    |
| 2       | Colleague | "I like the map, but it doesn't tell me anything. I get the fact that darker columns means more visitors travelling from there, but it is really difficult to read differences. I also noticed that I can scroll through the years, but that was accidental since you did not give me any instructions about that."                                                             | I have made countries clickable. Clicking on a country will display details about the number of visitors in the selected year and the overall trend using a mini-line chart                                                                                    | Version 3    |
| 3       | Colleague | "Once I found out I could click on the maps, it became much more interesting! You should have told me."                                                                                                                                                                                                                                                                         | I have realised that the map visualisation without the details section on the left was not very powerful. Therefore, I have decided to keep the details section on permanently. The visualisation is initialised with details on the United States of America. | Version 4    |

Version 5 is the final editing the projects. I have added meaningful titles and comments, resized the scales and created folders for JavaScript, CSS and data files. I have also changed the tooltip in my visualisations (e.g. the box that appear when mousing over the first bar chart) from HTML elements to SVG objects so that they can properly render in bl.ocks.org (see final visualisation [here](https://bl.ocks.org/gcmsrc/4814d656b061e04b0e04c268f2b8cc75)).

All the visualisations are visibile as gists (see below). Please notice that tooltips are positionted correctly only in Version 5, i.e. when I converted tooltip from HTML elements to SVG objects.

| Version | Gist                                                                                                                                        |
|---------|---------------------------------------------------------------------------------------------------------------------------------------------|
| 0       | [Link](https://bl.ocks.org/gcmsrc/3b15bede032da2a522a73bba30adc245)                                                                         |
| 1       | Click on the text elements on the top right corner to view the panels - [link](https://bl.ocks.org/gcmsrc/3db79ffec5b9a4bc0dd3f7fcfd96717a) |
| 2       | [Link](https://bl.ocks.org/gcmsrc/66da6b7aa4c5e88d4d71bf24f6f8682f)                                                                         |
| 3       | [Link](https://bl.ocks.org/gcmsrc/30b1678eb8ce2e44e7ee7e1a828171b3)                                                                         |
| 4       | [Link](https://bl.ocks.org/gcmsrc/4953a44b6da0198b8d89b536482cd9b7)                                                                         |
| 5       | [Link](https://bl.ocks.org/gcmsrc/0e3f3f804a4e53f498ed23d58562b0ae)                                                                         |


## Resources

Here is a list of the resources and links I have used:
* *Interactive Data Visualization for the Web*, Scott Murray (I read the entire book);
* Move SVG element to front, [link](https://bl.ocks.org/gcmsrc/06b7f966bee6d8d18a3c0416dd72ae66);
* Natural Earth Data for downloading the map, [link](http://www.naturalearthdata.com/);
* mapshaper.org for reducing the map size, [link](http://mapshaper.org/);
* ogr2ogr for converting the shapefile to GeoJSON (I have followed Scott Murray's guide);
* Nesting data, [link](https://github.com/d3/d3-collection#nests);
* Create continuous color legend, [link](http://bl.ocks.org/lucguillemot/37cc6eccbdd365556feb);
* Using *attr* insated of *style* to avoid CSS taking over JS, [link](http://stackoverflow.com/questions/15709304/d3-color-change-on-mouseover-using-classedactive-true);

