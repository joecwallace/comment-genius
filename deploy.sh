git checkout -b production
php artisan cg:build
php artisan cg:less
echo '' > public/.gitignore
echo '' > public/css/.gitignore
echo '' > public/js/.gitignore
git add .
git commit -m "Deploy"
git push pagoda production:master --force
git checkout master
git branch -D production