
# ITRW322-Semester_Project

This is the Angular Web Application for our messaging system:
Published at [https://coenraadhuman.github.io/ITRW322-Semester_Project](https://coenraadhuman.github.io/ITRW322-Semester_Project/).
  
See [Trello]([https://trello.com/en](https://trello.com/en)) board for progress on the project!  

## Technologies used

- Node 8.11.1

- Angular CLI 7.0.7

- Angular 7.0.7

- Firebase

- RxJS 6.3.3

- Typescript 3.1.6


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
Download and install:
```
https://nodejs.org/dist/v10.16.0/node-v10.16.0-x86.msi
```

3. Install Angular CLI by running `npm install -g @angular/cli@7.0.7`

4. Run `npm install` within the repository to install all the required dependencies

5. Run `ng serve --open` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

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

## References

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

To get more help on the Firebase go check out the [Firebase Documentation]([https://firebase.google.com/docs/reference](https://firebase.google.com/docs/reference)).