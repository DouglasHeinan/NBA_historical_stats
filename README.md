# NBA Statistical Reference
## A stat tracking and comparison tool for NBA players past and present.

[comment]: <> (This project is a demo outdoor enthusiast guide. The notion is that this would be a family-friendly resource for hikers )

[comment]: <> (and backpackers looking for community feedback and other information about the trails of western Montana and the gear )

[comment]: <> (necessary to hike them. Users are able to contribute trail photos, reviews, comments, find good prices on gear, get directions to local )

[comment]: <> (trailheads and more.)

[comment]: <> (This website can be accessed at [douglasheinan.com/tamarack-treks]&#40;http://douglasheinan.com/tamarack-treks&#41;.)

[comment]: <> (![Screen shot of web page]&#40;README_IMG/scrn_shot.png&#41;)
This project is a stat graphing and comparison tool to evaluate NBA players from all eras.

## Key Features

[comment]: <> (**Languages/technologies:** HTML, CSS, Javascript, Python, Flask, Jinja, SQLite, Bootstrap)

[comment]: <> (This project was written mostly in Python. I wanted to create a fairly straightforward web app that utilized a number)

[comment]: <> (of my skills. To that end: )

[comment]: <> (* I utilized Flask's Application Factory pattern to create a multi-page web application)

[comment]: <> (* I used the flask-login library to create standard user and admin functionality such as logins, profiles, and admin oversight)

[comment]: <> (* I created an effective Python full-text search engine with ranked results from scratch)

[comment]: <> (* I used SQLite to create a database to store all gear and trail related information on my site)

[comment]: <> (* Using the Beautiful Soup library, I created a constantly running web scraper to automate database updates)

[comment]: <> (* I designed each web page using original CSS code and some Bootstrap)
**Languages/technologies:** HTML, CSS, Javascript, Python Django, SQLite
This project is mostly written in python and javascript. I wanted to create a single-page web app that showcased my 
understanding of javascript and python and how they interacted.

## Takeaways

[comment]: <> (This is the first completely original, fully functional application I've ever made and, as such, there were *a lot* of)

[comment]: <> (hard lessons learned. )

[comment]: <> (* Password reset tokens were necessary, but I had never worked with them before. Figuring out how to implement them on )

[comment]: <> (the fly was a challenge.)

[comment]: <> (* I'm extremely proud of the search engine I've built from the ground up. I haven't built a search engine before, so my )

[comment]: <> (solution was to create a module that takes a user-input string, turns that string into a list, cleans each word )

[comment]: <> (in the list, and iterates through every entry in the database, )

[comment]: <> (looking for matches. The module ranks the matches with a point system and arranges the list of returned results )

[comment]: <> (from high to low.)

[comment]: <> (* I also created a program that automated the deletion of old/unnecessary image files and updated the prices of gear )

[comment]: <> (items featured on the site. This was very time consuming because I tried a number of different approaches before )

[comment]: <> (finding a solution. The solution I landed on was to create a whole new process that ran concurrently with the )

[comment]: <> (main app.)

[comment]: <> (* I used this project as an opportunity to improve my CSS comprehension. Instead of relying heavily on Bootstrap like )

[comment]: <> (I have in the past, I implemented original CSS solutions to personalize my site. )

[comment]: <> (* I found Flask's Application Factory formula a little hard to wrap my head around at first. Having used it )

[comment]: <> (extensively in this project, many of its weird idiosyncrasies are now second nature to me.)

## Future Features

[comment]: <> (* Add user-ratings to gear and trail pages)

[comment]: <> (* Allow users to DM or otherwise connect with each other outside of comment fields)

[comment]: <> (* Add campsite listings and user reviews)

[comment]: <> (* Add component that takes in user filters to recommend campsite or hiking trail locations)

[comment]: <> (* Replace admin created reviews with user reviews)

## Contact
Creator: Douglas Heinan

Email: dougheinan@gmail.com
