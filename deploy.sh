git checkout -b production
echo '' > public/.gitignore
git add .
git commit -m "Deploy"
git push pagoda production:master --force
git checkout master
git branch -D production