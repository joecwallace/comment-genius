git checkout -b production

echo '' > public/.gitignore
echo '' > public/css/.gitignore
echo '' > public/js/.gitignore

cd public && bower install && cd ..

php artisan cg:build
php artisan cg:less

git add .
git commit -m "Deploy"
git push pagoda production:master --force

git checkout master
git branch -D production

cd public && bower install && cd ..