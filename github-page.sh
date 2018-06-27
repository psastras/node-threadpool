#!/bin/bash
set -x -e
git clone git@github.com:$CIRCLE_PROJECT_USERNAME/node-threadpool.git -b gh-pages gh-pages
rm -rf gh-pages/*
cp -rf dist/docs/* gh-pages/
cd gh-pages
git config --global user.email "psastras@gmail.com"
git config --global user.name $CIRCLE_PROJECT_USERNAME
git add .
git commit -m "build: $CIRCLE_BUILD_NUM" --allow-empty
git push --force origin gh-pages