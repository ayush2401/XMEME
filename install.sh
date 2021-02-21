sudo apt -y update
<<<<<<< HEAD

curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -

sudo apt -y install nodejs

sudo apt -y install npm

wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list

sudo apt -y update

sudo apt install -y mongodb-org

sudo systemctl start mongod

sudo systemctl enable mongod

mongo node-app --eval "db.dropDatabase()"

npm init -y

=======

curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -

sudo apt -y install nodejs

wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list

sudo apt -y update

sudo apt install -y mongodb-org

sudo systemctl start mongod

sudo systemctl enable mongod
>>>>>>> 7a751a9c9056311ab9ec9ffda2428e4c8e3be6ed

mongo node-app --eval "db.dropDatabase()"

npm init -y

