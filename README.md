# Collab-Plat
Final Semester CAPSTONE Project

• Inside app/, install the node modules by "npm install" command
• use "grunt" command to run the server and project will hosted on your localhost

**Repo Directory**
- app
        ----- models/
        ---------- nerd.js <!-- the nerd model to handle CRUD -->
    ----- routes.js
    - config
        ----- db.js 
    - node_modules <!-- created by npm install -->
    - public <!-- all frontend and angular stuff -->
    ----- css
    ----- js
    ---------- controllers <!-- angular controllers -->
    ---------- services <!-- angular services -->
    ---------- app.js <!-- angular application -->
    ---------- appRoutes.js <!-- angular routes -->
    ----- img
    ----- libs <!-- created by bower install -->
    ----- views 
    ---------- home.html
    ---------- nerd.html
    ---------- geek.html
    ----- index.html
    - .bowerrc <!-- tells bower where to put files (public/libs) -->
    - bower.json <!-- tells bower which files we need -->
    - package.json <!-- tells npm which packages we need -->
    - server.js <!-- set up our node application -->