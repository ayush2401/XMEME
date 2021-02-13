sudo apt -y update

sudo apt -y install nodejs

sudo apt -y install npm

wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list

sudo apt -y update

sudo apt install -y mongodb-org

sudo systemctl start mongod

sudo systemctl enable mongod

npm init -y

cd src

npm i ejs

npm i express 

npm i mongoose

npm i hbs

npm i request

npm i method-override

npm i system-sleep

cd ../models

npm i mongoose

cd ..



