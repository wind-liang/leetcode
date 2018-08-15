git checkout master
gitbook build
git add .
git commit -m $1
git push 
git checkout pages
cp -r _book/* .
git add .
git commit -m $1
git push 
git checkout master