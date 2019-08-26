# Build (Publish to Github Pages)

Within the development directory of the repository:
```bash
ng build --prod --output-path docs --base-href "https://penguinmessenger.tech/"
```
1. Move all files within `docs` to **gh-pages branch.** 
1. Make a copy of index.html and rename it to 404.html
1. Ensure that a file exists 'CNAME', no extensions, with the content: 'penguinmessenger.tech'.
1. That is it, it is now ready for a commit and push on the **gh-pages branch** and will be served.
