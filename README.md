
# ITRW322-Semester_Project

This is the Angular Web Application for our messaging system:
Published at [https://coenraadhuman.github.io/ITRW322-Semester_Project](https://coenraadhuman.github.io/ITRW322-Semester_Project/).
  
See [Trello](https://trello.com/en) board for progress and what needs to be done on the project!  

## Technologies used

### Overview
So we have finalised on the following for the project:
* Firebase will be used as a back-end.
* Angular CLI will be used for the front-end.
* When development is finished, the Angular CLI project will be ported to both desktop and mobile.

#### Porting to desktop and mobile
Suggestions will be helpful for this part.
* Mobile, currently Ionic is consider for the Angular to mobile port.
* Desktop, currently Electron is consider for the Angular to desktop port.

### Angular CLI/ Node.js/ NPM Versions
```
PS D:\Desktop\ITRW322-Semester_Project> ng --version

     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/


Angular CLI: 8.1.2
Node: 10.16.0
OS: win32 x64
Angular:
...

Package                      Version
------------------------------------------------------
@angular-devkit/architect    0.801.2
@angular-devkit/core         8.1.2
@angular-devkit/schematics   8.1.2
@schematics/angular          8.1.2
@schematics/update           0.801.2
rxjs                         6.4.0

PS D:\Desktop\ITRW322-Semester_Project> node --version
v10.16.0
PS D:\Desktop\ITRW322-Semester_Project> npm --version
6.10.1
PS D:\Desktop\ITRW322-Semester_Project>
```

## Installation Process

1. Install nodejs (10.16) and npm:

**For Linux**
```bash
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt install nodejs
```
Verify installation:
```bash
node --version  
npm --version
```
**For Windows**
Download and install: [https://nodejs.org/dist/v10.16.0/node-v10.16.0-x64.msi](https://nodejs.org/dist/v10.16.0/node-v10.16.0-x64.msi)

3. Install Angular CLI by running `npm install -g @angular/cli@7.0.7` in bash or powershell.

4. Run `npm install` within the repository to install all the required dependencies in bash or powershell.

5. Run `ng serve --open` for a **development server** `(http://localhost:4200)` in bash or powershell. Please note: the application will automatically reload if you change any of the source files.

## Creating New Components

Run `ng generate component component-name` to generate a new component. 

## Build (Publish to Github Pages)
I, `Coenraad`, will normally do this, but here are the steps:

Within the development directory of the repository:
```bash
ng build --prod --output-path docs --base-href "https://coenraadhuman.github.io/ITRW322-Semester_Project"
```
1. Move all files within `docs` to **gh-pages branch.** 
1. Make a copy of index.html and rename it to 404.html
1. It is now ready for a commit and push on the **gh-pages branch**.

## Branching Naming Convention - Quick Legend

<table>
  <thead>
    <tr>
      <th>Instance</th>
      <th>Branch</th>
      <th>Description, Instructions, Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Stable</td>
      <td>master</td>
      <td>Accepts merges from Working and Hotfixes</td>
    </tr>
    <tr>
      <td>Working</td>
      <td>develop</td>
      <td>Accepts merges from Features and Hotfixes/Issues</td>
    </tr>
    <tr>
      <td>Features</td>
      <td>feature-<b>your_name</b>-<b>feature_name</b></td>
      <td>Always branch off HEAD of Working (create from develop)</td>
    </tr>
    <tr>
      <td>Hotfix/Issues</td>
      <td>hotfix-<b>your_name</b>-<b>fix_name</b></td>
      <td>Always branch off Stable (create from master)</td>
    </tr>
  </tbody>
</table>

## References

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

To get more help on the Firebase go check out the [Firebase Documentation]([https://firebase.google.com/docs/reference](https://firebase.google.com/docs/reference)).

## Links that help with the design

Sign in/up source code, [site](https://startbootstrap.com/snippets/login/).

